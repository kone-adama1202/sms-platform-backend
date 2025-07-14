const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },  
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['envoye', 'recu'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Message', messageSchema);
