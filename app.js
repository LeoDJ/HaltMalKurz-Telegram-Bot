/**
 * Created by Leandro on 13.04.2017.
 */
process.on('unhandledRejection', err => {
    console.log(err);
})
const db = require('./db/db');
const bot = require('./bot/bot');