var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db.url);

var db = mongoose.connection;

db.on('error', err => {
    console.log('mongoDB connection error', err);
});

db.once('open', () => {
    console.log('mongoDB connected');
});