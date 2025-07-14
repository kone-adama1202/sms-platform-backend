const express = require('express');
const router = express.Router();

const {
  sendSMS,
  receiveSMS,
  getAllMessages
} = require('../controllers/smsController');

// 🔸 Envoi de SMS
router.post('/send', sendSMS);

// 🔸 Webhook de réception (appelé par Orange)
router.post('/webhook', receiveSMS);

// 🔸 Liste des messages
router.get('/messages', getAllMessages);

module.exports = router;


//  npx ngrok http 5000
