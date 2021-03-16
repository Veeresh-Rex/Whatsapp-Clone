const mongoose = require('mongoose');
const whatsappSchema = new mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  recieved: Boolean,
});

module.exports = mongoose.model('messages', whatsappSchema);
