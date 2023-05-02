const mongoose = require('mongoose');
const loserSchema = new mongoose.Schema({
    symbol: String,
    change: Number,
    changePercent: Number,
    companyName: String
});

module.exports = mongoose.model('Loser', loserSchema);