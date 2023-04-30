const mongoose = require('mongoos');
const stockSchema = new mongoose.Schema({
    Symbol:{
        type: String,
        required: true,
    }, 
    Percentage:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Stock', stockSchema);