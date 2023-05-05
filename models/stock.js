// stock.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gainerSchema = require('./gainers');
const loserSchema = require('./losers');

const StockDataSchema = new Schema({
  symbol: { type: String, required: true },
  close: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  open: { type: Number, required: true },
  priceDate: { type: Date, required: true },
  volume: { type: Number, required: true },
  gainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gainer',
  },
  loser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loser',
  },
});

module.exports = mongoose.model('StockData', StockDataSchema);