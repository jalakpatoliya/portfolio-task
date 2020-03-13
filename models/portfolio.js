const mongoose = require('mongoose');

// Portfolio schema and model
var portfolioSchema = new mongoose.Schema({
    stocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock"
    },
    ]
});

var Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
