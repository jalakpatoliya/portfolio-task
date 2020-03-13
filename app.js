const express = require("express");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/auth_demo",{
//   useMongoClient:true
// })

mongoose.connect(`${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds137863.mlab.com:37863/portfolio`, (err, data) => {
  if (err) { console.log('connection error', err); } else {
    console.log('DB connected sucessfully');
  }
});


mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/**
 * Importing models
 */
const stock = require("./models/stock");
const stockRoute = require('./routes/stockRoute');
const tradeRoute = require('./routes/tradeRoute');



/**
 * Importing routes
 */
app.use(stockRoute);
app.use(tradeRoute);


/**
 * listening to port
 */
app.listen(PORT, function () {
  console.log(`server connected at port:${PORT}`);
})
