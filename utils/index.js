/**
 * Created by gramcha on 19/09/17.
 */
const moment = require('moment-timezone');

let localDate = function(d,timezone) {
    if(!timezone){
        timezone = 'Asia/Kolkata';
    }
    if (d == undefined) { d = new Date(); } // current date/time
    return Number( moment(d).tz(timezone).format("YYYYMMDD") );
}

module.exports = {
    localDate
};