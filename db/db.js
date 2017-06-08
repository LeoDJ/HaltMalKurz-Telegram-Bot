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
        Game.find({chat_id: chatId}, function (err, games) {
            if (err) throw err;
            var game;
            if (games.length === 1) {
                game = games[0];
                game.game.state = 'lobbyOpen';
                game.game.data = {joined: []}
            }
            else if (games.length === 0) {
                game = new Game({
                    chat_id: chatId,
                    game: {state: 'lobbyOpen', data: {joined: []}}
                });
            }
            else {
                reject('Multiple games with same ID');
            }
            game.save();
            resolve(chatId);
            // object of all the users
        });
    });
}

async function addUserToLobby(chatId, userId) {
    return new Promise((resolve, reject) => {
        Game.find({chat_id: chatId}, function (err, games) {
            if (err) throw err;
            let game;
            if (games.length === 1) {
                game = games[0];
                if (game.game.data.joined.indexOf(userId) < 0) { //if user is not yet in array
                    game.game.data.joined.push(userId);
                    game.markModified('game.data.joined');
                    game.save();
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
                resolve(game.game.data.joined);
            }
            else {
                reject('Multiple games with same ID');
            }
        });
    });
}

function getGameState(chatId) {

}

module.exports = {
    start,
    saveUser,
    getUser,
    initializeGame,
    addUserToLobby,
    getUsersInLobby
};