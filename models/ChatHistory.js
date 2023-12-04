const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chatbox = new Schema(
  {
    text: { type: String, maxLengthen: 200 },
  },
);

module.exports = mongoose.model('chatHistory', Chatbox);
