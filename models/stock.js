const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a new schema for the stock data
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
    ref: 'gainers',
  },
  loser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'losers',
  },
});

// Create a new model for the stock data
module.exports = mongoose.model('StockData', StockDataSchema);