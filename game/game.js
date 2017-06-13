const db = require('../db/db');
const deck = require('./deckManagement');

//deck.newDeck();

async function newGame(chatId) {
    console.log("New game in chat", chatId);
    return await db.initializeGame(chatId);
}

function joinLobby(chatId, userId) {
    console.log("User", userId, "joined game", chatId);
    return db.addUserToLobby(chatId, userId);
}

async function start(chatId) {
    db.setGameState(chatId, "gameStarted");
    await deck.newDeck(chatId);
    deck.deal(chatId);
}

async function getJoinedUsers(chatId) {
    return new Promise((resolve, reject) => {
        db.getUsersInLobby(chatId).then(userIds => {
            let promises = [];
            userIds.forEach((id) => {
                promises.push(db.getUser(id));
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

function getGameState(chatId) {
    return db.getGameState(chatId);
}

module.exports = {
    newGame,
    joinLobby,
    getJoinedUsers,
    getGameState,
    start
};