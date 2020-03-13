const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const trade = require('../models/trade');
const stock = require('../models/stock');
const portfolio = require('../models/portfolio');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Get all portfolio
 */
router.get("/portfolio",
    async function (req, res) {
        try {
            let data = await portfolio.find().populate({
                path: 'stocks',
                populate: {
                    path: 'trades',
                    model: 'Trade'
                }
            });

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
 * Create a new portfolio
 */
router.post('/portfolio',
    async (req, res) => {
        try {
            const { name } = req.body;

            let portfolioData = new portfolio({ name });

            const data = await portfolioData.save();
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

/**
 * Add stock to portfolio
 */
router.post('/portfolio/addStock',
    async (req, res) => {
        try {
            const { stockId, portfolioId } = req.body;

            /**
             * Push stock into portfolio
             */
            const stockData = await portfolio.findOneAndUpdate({ _id: portfolioId }, { $push: { stocks: stockId } });


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
// * Delete a portfolio
// */
router.post('/portfolio/delete',
    async function (req, res) {
        try {
            const { portfolioId } = req.body;
            const data = await portfolio.findOneAndRemove({ _id: portfolioId });
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
 * Update a portfolio
 */
router.post('/portfolio/update',
    async function (req, res) {
        try {

            const { portfolioId, name } = req.body;
            const data = await portfolio.update({ _id: portfolioId, name });

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
 * get stocks with holdings
 */
router.get("/holdings",
    async function (req, res) {
        try {
            let data = await portfolio.find().populate({
                path: 'stocks',
                populate: {
                    path: 'trades',
                    model: 'Trade'
                }
            });

            /**
             * Calculating holdings for all portfolios
             */
            let portfolios = [];

            data.map(portfolio => {
                // creating portfolio holding data for each portfolio
                const portfolioData = {
                    ownerName: portfolio.name,
                    holdings: []
                }

                // calculating holdings based on each trade
                portfolio.stocks.map((stock, i) => {
                    const obj = {
                        stockName: stock.name,
                        quantity: 0,
                        averageOfAllBuys: 0
                    }

                    let divisor = 0;

                    stock.trades.map((trade, j) => {
                        if (trade.type == 'sell') {
                            obj.quantity -= trade.quantity;

                        } else {
                            obj.quantity += trade.quantity;
                            obj.averageOfAllBuys += trade.price;
                            divisor++;
                        }
                    })

                    obj.averageOfAllBuys = obj.averageOfAllBuys / divisor;
                    portfolioData.holdings.push(obj);
                    portfolios.push(portfolioData);
                })
            })

            res.status(200).json({ status: 'success', data: portfolios })
        } catch (e) {
            const errObj = {
                message: e.message,
                stack: e.stackTrace
            }
            res.status(400).json({ status: 'fail', error: errObj })
        }
    });







module.exports = router;
