/**
 * Created by gramcha on 20/09/17.
 */
const buy = require('./buy');
const sellMonitor = require('./sell-monitor');

let startIntraDay;
startIntraDay = function (stock_name, cashAvailable, currentprice,gainSellPoints,lossSellPoints) {
    let stockCount = getMIS(stock_name, cashAvailable, currentprice);
    let purchaseOrder = buy.execute(stock_name,currentprice,stockCount);
    sellMonitor.start(purchaseOrder,gainSellPoints,lossSellPoints);
};

//returns number shares can be boghut in mis
let getMIS = function (stock_name, cashAvailable, currentprice) {

}
