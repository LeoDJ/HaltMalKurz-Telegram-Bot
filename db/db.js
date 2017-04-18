var mongoose = require('mongoose');
var config = require('../config');

function connect() {
    mongoose.connect(config.db.url);
}
connect();

var db = mongoose.connection;

db.on('error', err => {
    console.log('mongoDB connection error', err);
    setTimeout(connect, config.db.reconnectTimeout); //retry when connection fails on first attempt
});

db.once('open', () => {
    console.log('mongoDB connected');
});