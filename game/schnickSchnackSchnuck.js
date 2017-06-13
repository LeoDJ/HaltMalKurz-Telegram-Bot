/**
 * Created by Leandro on 13.06.2017.
 */
const db = require('../db/db');

async function start(ctx) {
    let chatId = ctx.chat.id;
    await db.setGameState(chatId, "schnickStarted");
    await db.setSchnickData(chatId, 'timeStarted', Date.now()/1000);
    await db.setSchnickData(chatId, 'brunnen', true);
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

async function play(user, hand) {

}

module.exports = {
    start,
    ohneBrunnen,
    setSchnickMessage,
    getSchnickMessage
};