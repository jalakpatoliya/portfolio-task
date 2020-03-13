const mongoose = require('mongoose');

// Stock schema and model
var stockSchema = new mongoose.Schema({
    name: String,
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade"
        },
    ]
});

var Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
