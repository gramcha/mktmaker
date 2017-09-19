/**
 * Created by gramachandran on 19/09/17.
 */
//save and retrieve liveprice documents from mongodb
const mongoDbConnector = require('./mongo-connector');

function save(priceInstance,resultCallback) {
    db.liveprice.insert(priceInstance, function (err, doc) {
        console.log(`db operation error status: ${err}`);
        resultCallback(doc);
    });
}

function findByShareName(stock_name,resultCallback) {
    db.liveprice.find({stock_name:stock_name}).sort({request_date: -1}, function (err, livePriceList) {
        console.log(`db operation error status: ${err}`);
        resultCallback(livePriceList);
    });
}

const livePriceRepo={save,findByShareName};

module.exports = livePriceRepo;