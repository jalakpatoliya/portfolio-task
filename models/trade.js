const mongoose = require('mongoose');

// Trade schema and model
var tradeSchema = new mongoose.Schema({
    date: Date,
    type: String,
    price: Number,
    quantity: Number
});

var Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
