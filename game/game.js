const db = require('../db/db');
const deck = require('./deckManagement');

//deck.newDeck();

function newGame(chatId) {
    return db.initializeGame(chatId);
}

function joinLobby(chatId, userId) {
    return db.addUserToLobby(chatId, userId);
}

function getJoinedUsers(chatId) {
    return new Promise((resolve, reject) => {
        db.getUsersInLobby(chatId).then(userIds => {
            let promises = [];
            userIds.forEach((id) => {
                promises.push(db.getUser(id));
                //names.push(db.getUser(id).first_name);
            });
            let names = [];
            Promise.all(promises).then(results => {
                results.forEach(result => {
                    names.push(result.first_name);
                });
                resolve(names);
            });

        });
    });

}

module.exports = {
    newGame,
    joinLobby,
    getJoinedUsers
}