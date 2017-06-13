/**
 * Created by Leandro on 13.06.2017.
 */
const db = require('../db/db');

async function start(ctx) {
    let chatId = ctx.chat.id;
    await db.setGameState(chatId, "schnickStarted");
    await db.setData(chatId, 'schnick', {
        timeStarted: Date.now()/1000,
        brunnen: true,
        message: null
    });
}

async function ohneBrunnen(ctx) {
    let chatId = ctx.chat.id;
    let data = await db.getData(chatId, 'schnick');
    if(data) {
        let prevState = data.brunnen;
        data.brunnen = false;
        await db.setData(chatId, 'schnick', data);
        return prevState;
    }
    return null;
}

async function setSchnickMessage(msg) {
    let chatId = await msg.chat.id;
    let data = await db.getData(chatId, 'schnick');
    if(data) {
        data.message = msg;
        await db.setData(chatId, 'schnick', data);
        return true;
    }
    return null;
}

async function getSchnickMessage(ctx) {
    let chatId = await ctx.chat.id;
    let data = await db.getData(chatId, 'schnick');
    if(data) {
        return data.message;
    }
    return null;
}

async function play(user, hand) {

}

module.exports = {
    start,
    ohneBrunnen,
    setSchnickMessage,
    getSchnickMessage
};