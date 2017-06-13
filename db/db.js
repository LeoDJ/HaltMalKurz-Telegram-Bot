const mongoose = require('mongoose');
const config = require('../config');
const Game = require('../db/schemas/gameSchema').Game;
const telegramSchema = require('../db/schemas/telegramSchemas');
const User = telegramSchema.User,
    Chat = telegramSchema.Chat,
    Message = telegramSchema.Message;

mongoose.Promise = global.Promise;

function connect() {
    mongoose.connect(config.db.url);
}
connect();

const db = mongoose.connection;

db.on('error', err => {
    console.log('mongoDB connection error', err);
    setTimeout(connect, config.db.reconnectTimeout); //retry when connection fails on first attempt
});

db.once('open', () => {
    console.log('mongoDB connected');
});

function start() {

}

function saveUser(user) {
    User.find({id: user.id}, (err, users) => {
        if (err) throw err;
        if (users.length === 0) {
            var u = new User(user);
            u.save();
        }
        else if (users.length === 1) {
            var u = users[0];
            Object.assign(u, user); //update user in database
            u.save();
        }
    });
}

async function getUser(userId) {
    return new Promise((resolve) => {
        User.find({id: userId}, (err, users) => {
            if (err) throw err;
            resolve(users[0]);
        });
    });
}

async function initializeGame(chatId) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, async function (err, games) {
            if (err) throw err;
            var game;
            if (games.length === 1) {
                game = games[0];
                game.game.state = 'lobbyOpen';
                game.game.data = {participants: []}
            }
            else if (games.length === 0) {
                game = new Game({
                    chat_id: chatId,
                    game: {state: 'lobbyOpen', data: {participants: []}}
                });
            }
            else {
                reject('Multiple games with same ID');
            }
            await game.save();
            resolve(chatId);
        });
    });
}

async function addUserToLobby(chatId, userId) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, async function (err, games) {
            if (err) throw err;
            let game;
            if (games.length === 1) {
                game = games[0];
                if (game.game.data.participants.indexOf(userId) < 0) { //if user is not yet in array
                    game.game.data.participants.push(userId);
                    game.markModified('game.data.participants');
                    await game.save();
                    resolve(true);
                }
                else {
                    resolve(false);
                }

            }
            else {
                reject('Multiple games with same ID');
            }
        });
    });
}

async function getUsersInLobby(chatId) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, function (err, games) {
            if (err) throw err;
            if (games.length === 1) {
                game = games[0];
                resolve(game.game.data.participants);
            }
            else {
                reject('Multiple games with same ID');
            }
        });
    });
}

async function getChatIdForUser(userId) {
    return new Promise((resolve, reject) => {
        Game.find({'game.data.participants': userId}, function (err, games) {
            if (err) throw err;
            if (games.length > 0) {
                game = games[0];
                resolve(game.chat_id);
            }
            else {
                reject('No game with ID');
            }
        });
    });
}

function setKey(data, key, value) {
    let keys;
    if (typeof key === 'string')
        keys = key.split('.');
    else
        keys = key;
    if (keys.length === 1) {
        data[keys[0]] = value;
        return;
    }
    setKey(data[keys[0]], keys.slice(1), value);
}

function getKey(data, key) {
    let keys;
    if (typeof key === 'string')
        keys = key.split('.');
    else
        keys = key;
    if (keys.length === 1) {
        return data[keys[0]];
    }
    return getKey(data[keys[0]], keys.slice(1));
}

async function setGameData(chatId, key, value) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, async function (err, games) {
            if (err) throw err;
            if (games.length === 1) {
                game = games[0];
                setKey(game, key, value);
                //game.game.data[key] = value;
                game.markModified(key);
                await game.save();
                resolve(true);
            }
            else if (games.length === 0) {
                reject('No game with ID');
            }
            else
                reject('Multiple games with same ID');
        });
    });
}


async function getGameData(chatId, key) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, async function (err, games) {
            if (err) throw err;
            if (games.length === 1) {
                game = games[0];
                //let data = game.game.data[key];
                resolve(getKey(game, key));
            }
            else if (games.length === 0) {
                reject('No game with ID');
            }
            else
                reject('Multiple games with same ID');
        });
    });
}

async function setData(chatId, key, value) {
    return setGameData(chatId, 'game.data.' + key, value);
}

async function getData(chatId, key) {
    return getGameData(chatId, 'game.data.' + key);
}
async function getCards(chatId) {
    return getGameData(chatId, 'game.cards');
}
/*async function getCards(chatId) {
 return new Promise((resolve, reject) => {
 Game.find({chat_id: chatId}, function (err, games) {
 if (err) throw err;
 if (games.length === 1) {
 game = games[0];
 resolve(game.game.cards);
 }
 else {
 reject('Multiple games with same ID / No game with ID');
 }
 });
 });
 }*/

async function setCards(chatId, cards) {
    return setGameData(chatId, 'game.cards', cards);
}
/*async function setCards(chatId, cards) {
 return new Promise((resolve, reject) => {
 Game.find({chat_id: chatId}, async function (err, games) {
 if (err) throw err;
 if (games.length === 1) {
 game = games[0];
 game.game.cards = cards;
 //game.markModified('game.cards');
 //console.log(game.game.cards.drawPile.length);
 await game.save();
 resolve(true);
 }
 else {
 reject('Multiple games with same ID / No game with ID');
 }
 });
 });
 }*/

/*async function getGameState(chatId) {
    return getGameData(chatId, 'game.state');
}*/

async function getGameState(chatId) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, function (err, games) {
            if (err) throw err;
            if (games.length === 1) {
                game = games[0];
                resolve(game.game.state);
            }
            else if (games.length === 0) {
                resolve("noGameRunning");
            }
            else {
                reject('Multiple games with same ID');
            }
        });
    });
}


async function setGameState(chatId, state) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, async function (err, games) {
            if (err) throw err;
            if (games.length === 1) {
                game = games[0];
                game.game.state = state;
                await game.save();
                resolve(true);
            }
            else {
                reject('Multiple games with same ID / No game with ID');
            }
        });
    });
}

module.exports = {
    start,
    saveUser,
    getUser,
    initializeGame,
    addUserToLobby,
    getUsersInLobby,
    getGameState,
    setGameState,
    setCards,
    getCards,
    getChatIdForUser,
    setData,
    getData
};