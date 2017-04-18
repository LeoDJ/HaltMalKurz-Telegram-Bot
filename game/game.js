const db = require('../db/db');
const deck = require('./deckManagement');

deck.newDeck();

function newGame(msg) {
}

module.exports = {
    newGame
}