/**
 * Created by Leandro on 13.06.2017.
 */
const db = require('../db/db');
const config = require('../config');

const emoji = {
    rock: '✊️',
    paper: '✋️',
    scissors: '✌️',
    well: '⛲️'
};

const beats = {
    rock: ['scissors'],
    paper: ['rock', 'well'],
    scissors: ['paper'],
    well: ['rock', 'scissors']
};



async function start(ctx) {
    let chatId = ctx.chat.id;
    await db.setGameState(chatId, "schnickStarted");
    await db.setSchnickData(chatId, 'timeStarted', Date.now()/1000);
    await db.setSchnickData(chatId, 'brunnen', true);
    await db.setSchnickData(chatId, 'selections', {});
    await db.setSchnickData(chatId, 'telegram', ctx.telegram);
    setTimeout(()=>{endSchnick(chatId)}, config.game.schnickSchnackSchnuckTimeout);
    /*await db.setData(chatId, 'schnick', {
        timeStarted: ,
        brunnen: true,
        message: null
    });*/
}

async function ohneBrunnen(ctx) {
    let chatId = ctx.chat.id;
    let prevState = await db.getSchnickData(chatId, 'brunnen');
    await db.setSchnickData(chatId, 'brunnen', false);
    //TODO let users that chose "well" know, that they have to chose again
    return prevState;
    /*let data = await db.getData(chatId, 'schnick');
    if(data) {
        let prevState = data.brunnen;
        data.brunnen = false;
        await db.setData(chatId, 'schnick', data);
        return prevState;
    }
    return null;*/
}

async function setSchnickMessage(msg) {
    let chatId = msg.chat.id;
    return await db.setSchnickData(chatId, 'message', msg);
    /*let data = await db.getData(chatId, 'schnick');
    if(data) {
        data.message = msg;
        await db.setData(chatId, 'schnick', data);
        return true;
    }
    return null;*/
}

async function getSchnickMessage(ctx) {
    let chatId = ctx.chat.id;
    return await db.getSchnickData(chatId, 'message');
    /*let data = await db.getData(chatId, 'schnick');
    if(data) {
        return data.message;
    }
    return null;*/
}

async function select(ctx, symbol) {
    let chatId = ctx.chat.id;
    let selections = await db.getSchnickData(chatId, 'selections');
    selections[ctx.from.id] = {symbol: symbol, callbackQueryFunction: ctx.answerCallbackQuery};
    await db.setSchnickData(chatId, 'selections', selections);
    //TODO check if all players voted (only if game is running, else timeout(?))
}

async function endSchnick(chatId) {
    let selections = await db.getSchnickData(chatId, 'selections');
    msg = "[Debug] folgende Auswahlen wurden registriert:";
    Object.keys(selections).forEach(async (userId) => {
        msg += "\n";
        msg += await db.getUser(userId).first_name;
        msg += ": " + selections[userId].symbol;
    });
    await db.getSchnickData(chatId, 'telegram').sendMessage(chatId, msg); //might not work and might have to revert to a local variable
}

module.exports = {
    start,
    ohneBrunnen,
    setSchnickMessage,
    getSchnickMessage,
    select,
    emoji
};