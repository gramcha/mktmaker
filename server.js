/**
 * Created by gramachandran on 08/09/17.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var CircularJSON = require('circular-json');

app.get('/', function(req, res){

    console.log('hello');
    //All the web scraping magic will happen here
    // The URL we will scrape from - in our example Anchorman 2.

    url = 'http://www.moneycontrol.com/india/stockpricequote/mining-minerals/vedanta/SG';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            // console.log($( "#Nse_Prc_tick" ));
            var price = $( "#Nse_Prc_tick" );
            var data = price["0"].children[0].children[0].data;
            price = $( "#Bse_Prc_tick" );
            console.log(price["0"].children[0].children[0].data);
            var data2 = price["0"].children[0].children[0].data;
            res.send([{"bse":data2,"nse":data}]);
            // res.send(CircularJSON.stringify(price));
        }
        else
        {
            res.send('Check your console! -'+error);
        }
    });




});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
