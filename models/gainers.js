const mongoose = require('mongoose');
const gainerSchema = new mongoose.Schema({
    symbol: String,
    change: Number,
    changePercent: Number,
    companyName: String
});

module.exports = mongoose.model('Gainer', gainerSchema);