const axios = require('axios');
const Message = require('../models/Message');
const { getAccessToken } = require('../config/orangeAuth');

const senderAddress = process.env.SENDER_ADDRESS;

// ENVOI DE SMS
exports.sendSMS = async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `https://api.orange.com/smsmessaging/v1/outbound/${encodeURIComponent(senderAddress)}/requests`,
      {
        outboundSMSMessageRequest: {
          address: `tel:${phoneNumber}`,
          senderAddress,
          senderName: "ESMT", // Ajout ici
          outboundSMSTextMessage: {
            message
          },
          notifyURL: process.env.NOTIFY_URL
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    await Message.create({
      phoneNumber,
      message,
      type: 'envoye'
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Erreur d'envoi:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Échec de l'envoi" });
  }
};

// RÉCEPTION DE SMS
exports.receiveSMS = async (req, res) => {
  try {
    const receivedData = req.body.inboundSMSMessageList.inboundSMSMessage;

    for (const msg of receivedData) {
      await Message.create({
        phoneNumber: msg.senderAddress.replace('tel:', ''),
        message: msg.message,
        type: 'recu'
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur réception:", error.message);
    res.status(500).json({ success: false, message: "Erreur lors de la réception" });
  }
};

// LISTER LES MESSAGES
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération" });
  }
};
