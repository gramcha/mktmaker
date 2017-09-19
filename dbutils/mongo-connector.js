/**
 * Created by gramcha on 19/09/17.
 */
//provides mongodb connector
const mongojs = require('mongojs');

const dbConnector = {openDBConnetion, /*getDBHotNameBasedEnvVariable,*/ closeDBConnection, getInstance};

global.db = null;

function openDBConnetion(dbHostName) {
    if (!dbHostName) {
        dbHostName = "mongodb://127.0.0.1:27017/mktmaker_dev"
    }
    global.db = mongojs(dbHostName, ['liveprice']);
    if(global.db.liveprice)
        console.log("live price created");
    else
        console.log("live price not created");
}
//"mongodb://127.0.0.1:27017/pulse_trigger_dev"
// function getDBHotNameBasedEnvVariable(){
//     let dbHost = null;
//     if (process.env.NODE_ENV === 'development') {
//         dbHost = JSON.parse(config.dev.env.DB_HOST);
//         console.log(`dev env db host = ${dbHost}`);
//     } else if(process.env.NODE_ENV === 'test') {
//         dbHost = JSON.parse(config.test.env.DB_HOST);
//         console.log(`test env db host = ${dbHost}`);
//     } else {
//         dbHost = JSON.parse(config.build.env.DB_HOST);
//         console.log(`prod env db host = ${dbHost}`);
//     }
//     return dbHost;
// }
function closeDBConnection() {
    if (global.db) {
        global.db.close();
        global.db = null;
    }
}
function getInstance() {
    return global.db;
}
module.exports = dbConnector;
