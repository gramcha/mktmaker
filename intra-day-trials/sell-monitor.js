/**
 * Created by gramcha on 20/09/17.
 */
const currentPrice = require('../routes/currentprice');
const sell = require('./sell');

//monitor selling price points for both gain and loss. Sell it when it reaches sell points.

function start(purchaseOrder,gainSellPoints,lossSellPoints) {

    // if (currentPrice.getCurrentPrice() >= purchaseprice + gainSellPoints)
    //     sell it
    // else (currentPrice.getCurrentPrice() <= purchaseprice - lossSellPoints)
    //     sell it
}