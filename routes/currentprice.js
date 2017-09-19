var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var eachOfSeries = require('async/eachOfSeries');
var request = require('request');
var cheerio = require('cheerio');

const livePriceRepo = require('../dbutils/live-price-repo');
const utils = require('../utils');
var HashMap = require('hashmap');

var urlMap = new HashMap();
/* GET users listing. */
router.get('/suggest', function (req, res, next) {
//   res.send('respond with a resource -'+req.query.name);
    getSuggestionsFromMntCntrl(req.query.name, res);
});
router.get('/stock', function (req, res, next) {
    // res.send("param "+req.params.name);
    getCurrentPrice(req.query.name, (price) => {
        res.send(price);
    });
});

function getSuggestionsFromMntCntrl(querystr, res) {
    //http://www.moneycontrol.com/mccode/common/autosuggesion.php?query=veda&type=1&format=json&callback=suggest1
    let url = 'http://www.moneycontrol.com/mccode/common/autosuggesion.php?query=' + querystr;
    url += '&type=1&format=json&callback=suggest1';
    console.log("query url = ", url);
    requestify.get(url).then(function (response) {
        // Get the response body

        let resp = response.getBody();
        resp = resp.replace('suggest1(', '');
        if (resp.charAt(resp.length - 1) == ')') {
            resp = resp.substr(0, resp.length - 1);
        }
        console.log('resp -', resp);
        let queryResultList = JSON.parse(resp);
        let priceList = [];
        queryResultList.forEach(function (element) {
            console.log("element = ", element);
        }, this);
        let dupelist = queryResultList.slice();
        queryResultList.forEach(function (queryResult) {
            getPriceFromSpecificUrl(queryResult, dupelist, priceList, function () {
                console.log("done ");
                // console.log(JSON.stringify(priceList,null,4));
                res.send(getHtmlResponse(JSON.stringify(priceList, null, 4)));
            });
        }, this);
        //for some reason aysnc eachseries hangs and no console logs.
        // aysnc.eachSeries(queryResultList, function(queryResult, done) {
        //     console.log('async call');
        //     done();
        //     // call your async function
        //     // getPriceFromSpecificUrl(queryResult,priceList,done);    
        // }, function(err) {

        //     // errors generated in the loop above will be accessible here
        //     if (err) throw err;

        //     // we're all done!
        //     console.log("all done!");
        // });
        // console.log("priceList - ",priceList);    
        // res.send(priceList);
    })
        .fail(function (response) {
            console.log(response.getCode()); // Some error code such as, for example, 404
            res.send(response.getBody());
        });
}
function getPriceFromSpecificUrl(stockSource, dupelist, priceList, done) {
    let resultUrl = stockSource.link_src;
    console.log('req url = ', resultUrl);
    let price = {};
    price.stock_name = stockSource.stock_name;
    price.sc_sector_id = stockSource.sc_sector_id;
    price.sc_sector = stockSource.sc_sector;
    price.date = utils.localDate(new Date());
    price.dateTime = new Date();

    urlMap.set(price.stock_name,stockSource);
    request(resultUrl, function (error, response, html) {
        console.log("resp from ", resultUrl);
        // First we'll check to make sure no errors occurred when making the request

        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            // console.log($( "#Nse_Prc_tick" ));
            var priceTick = $("#Nse_Prc_tick");
            if (priceTick["0"]) {
                if (priceTick["0"].children[0]) {
                    if (priceTick["0"].children[0].children[0]) {
                        price.nsePrice = priceTick["0"].children[0].children[0].data;
                    }
                }
            }

            priceTick = $("#Bse_Prc_tick");
            // console.log(priceTick["0"].children[0].children[0].data);
            if (priceTick["0"]) {
                if (priceTick["0"].children[0]) {
                    if (priceTick["0"].children[0].children[0]) {
                        price.bsePrice = priceTick["0"].children[0].children[0].data;
                    }
                }
            }

            // price.bsePrice = priceTick["0"].children[0].children[0].data;
            priceList.push(price);
            livePriceRepo.save(price, function done(pricedoc) {
                console.log("price saved into db ", pricedoc);
            })
            dupelist.splice(dupelist.indexOf(stockSource), 1); //remove this url from list
            if (!dupelist.length) done();

            // res.send([{"bse":data2,"nse":data}]);
            // res.send(CircularJSON.stringify(price));
        }
        else {
            console.error(error);
            done();
            // res.send('Check your console! -'+error);
        }
    });
}
function getHtmlResponse(bodyString) {
    return "<html><body><p>" + bodyString + "</p></body></html>";
}

let getCurrentPrice = function (stockName, callback) {
    let stockSource = getStockSource(stockName);
    let resultUrl = stockSource.link_src;
    console.log('req url = ', resultUrl);
    let price = {};
    price.stock_name = stockSource.stock_name;
    price.sc_sector_id = stockSource.sc_sector_id;
    price.sc_sector = stockSource.sc_sector;
    price.date = utils.localDate(new Date());
    price.dateTime = new Date();
    request(resultUrl, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            // console.log($( "#Nse_Prc_tick" ));
            var priceTick = $("#Nse_Prc_tick");
            if (priceTick["0"]) {
                if (priceTick["0"].children[0]) {
                    if (priceTick["0"].children[0].children[0]) {
                        price.nsePrice = priceTick["0"].children[0].children[0].data;
                    }
                }
            }

            priceTick = $("#Bse_Prc_tick");
            if (priceTick["0"]) {
                if (priceTick["0"].children[0]) {
                    if (priceTick["0"].children[0].children[0]) {
                        price.bsePrice = priceTick["0"].children[0].children[0].data;
                    }
                }
            }
            livePriceRepo.save(price, function done(pricedoc) {
                console.log("price saved into db ", pricedoc);
            });
            callback(price);
        }
        else {
            console.error(error);
            callback(null);
        }
    });
}

let getStockSource = function (stockName) {
    return urlMap.get(stockName);
}
module.exports = {router,getCurrentPrice};
