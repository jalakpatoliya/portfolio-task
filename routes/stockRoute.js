const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const stock = require('../models/stock');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Get all stock
 */
router.get("/stock",
    async function (req, res) {
        try {
            let data = await stock.find().populate('trades');

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
 * Create a new stock
 */
router.post('/stock',
    async (req, res) => {
        try {
            const { name } = req.body;

            let stockData = new stock({ name });

            const data = await stockData.save();
            console.log(data);


            res.status(200).json({ status: 'success', data })
        } catch (e) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }
    })

// /**
// * Delete a stock
// */
router.post('/stock/delete',
    async function (req, res) {
        try {
            const { stockId } = req.body;
            const data = await stock.findOneAndRemove({ _id: stockId });
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
 * Update a stock
 */
router.post('/stock/update',
    async function (req, res) {

        try {

            const { stockId, name } = req.body;
            const data = await stock.update({ _id: stockId }, { name });

            res.status(200).json({ status: 'success', data })
        } catch (error) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }
    }
);

module.exports = router;
