// gainers.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gainerSchema = new Schema({
  symbol: String,
  change: Number,
  changePercent: Number,
  companyName: String
});

module.exports = mongoose.model('Gainer', gainerSchema);