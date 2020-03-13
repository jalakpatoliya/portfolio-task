const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const trade = require('../models/trade');
const stock = require('../models/stock');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Get all trade
 */
router.get("/trade",
    async function (req, res) {
        try {
            let data = await trade.find();

            res.status(200).json({ status: 'success', data })
        } catch (e) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }
    });

/**
 * Create a new trade
 */
router.post('/trade',
    async (req, res) => {
        try {
            const { date, type, price, stockId } = req.body;

            console.log(`${date},${type},${price},${stockId}`);

            let tradeData = new trade({ date, type, price });

            console.log(`tradeData:${tradeData}`);

            const tradeData1 = await tradeData.save();

            /**
             * Push trade into stock
             */
            const stockData = await stock.findOneAndUpdate({ _id: stockId }, { $push: { trades: tradeData } });


            res.status(200).json({ status: 'success', data: stockData })
        } catch (e) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }
    })

// /**
// * Delete a trade
// */
router.post('/trade/delete',
    async function (req, res) {
        try {
            const { tradeId } = req.body;
            const data = await trade.findOneAndRemove({ _id: tradeId });
            res.status(200).json({ status: 'success', data })
        } catch (e) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }


    }
);

/**
 * Update a trade
 */
router.post('/trade/update',
    async function (req, res) {

        try {

            const { tradeId, date, type, price } = req.body;
            const data = await trade.update({ _id: tradeId }, { date, type, price });

            res.status(200).json({ status: 'success', data })
        } catch (e) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }
    }
);

module.exports = router;
