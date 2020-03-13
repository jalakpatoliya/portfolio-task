const mongoose = require('mongoose');

// Trade schema and model
var tradeSchema = new mongoose.Schema({
    date: Date,
    type: String,
    price: Number,
    stock: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock"
        },
        name: String
    },
});

var Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
