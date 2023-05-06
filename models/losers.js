// losers.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loserSchema = new Schema({
  symbol: String,
  close: Number,
  change: Number,
  changePercent: Number,
  companyName: String
});

module.exports = mongoose.model('Loser', loserSchema);
