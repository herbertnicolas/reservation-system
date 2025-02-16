const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  id: String,
  proprietario: String,
  sala: String,
  data: Date,
  hora: String,
});

module.exports = mongoose.model('History', historySchema);
