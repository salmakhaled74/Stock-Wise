const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
    symbol: String,
    change: Number,
    changePercent: Number,
    companyName: String
});

module.exports = mongoose.model('Stock', stockSchema);