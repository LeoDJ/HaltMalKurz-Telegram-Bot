const Telegraf = require('telegraf');
const {Extra, Markup} = require('telegraf');

const config = require('../config');

const comm = require('./communication');
const game = require('../game/game');
const db = require('../db/db');

const bot = new Telegraf(config.bot.token);

const inlineKeyboardJoin = Extra.HTML().markup(m =>
    m.inlineKeyboard([
        m.callbackButton('Beitreten', 'join')
    ]));

//get username for group command handling
bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
    console.log("Initialized", botInfo.username);
});

bot.on('sticker', ctx => {
    console.log(ctx.message.sticker.file_id);
    //bot.telegram.sendSticker(ctx.chat.id, 'BQADAgAD4QADuNXvD7DVvOPPLJ9FAg');
});

bot.command('new', async(ctx) => {
    db.saveUser(ctx.from);
    await game.newGame(ctx.chat.id);
    await game.joinLobby(ctx.chat.id, ctx.from.id);
    let names = await game.getJoinedUsers(ctx.chat.id);
    ctx.reply(comm.newMsg + names.join(', '), inlineKeyboardJoin);

});
bot.action('join', async(ctx, next) => {
    db.saveUser(ctx.from);
    let success = await game.joinLobby(ctx.chat.id, ctx.from.id);
    let names = await game.getJoinedUsers(ctx.chat.id);
    if (success) //only edit message, when user not added already
        editMessage(ctx, comm.newMsg + names.join(', '), inlineKeyboardJoin);
    ctx.answerCallbackQuery();
    next();
});

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    console.log(inlineQuery);
    const offset = parseInt(inlineQuery.offset) || 0
    /*const tracks = await spotifySearch(inlineQuery.query, offset, 30)
    const results = tracks.map((track) => ({
        type: 'audio',
        id: track.id,
        title: track.name,
        audio_url: track.preview_url
    }))
    return answerInlineQuery(results, {next_offset: offset + 30})*/
})

bot.command('start', async (ctx)=>{
    let state = await game.getGameState(ctx.chat.id);
    if(state == 'noGameRunning')
        comm.start(ctx);
    else if (state == 'lobbyOpen')
        game.start(ctx.chat.id);
});

bot.command('about', comm.about);

bot.command('debug', async (ctx)=> {
    ctx.reply(await db.getGameState(ctx.chat.id) + "\n" + JSON.stringify(await game.getJoinedUsers(ctx.chat.id)));
});

bot.startPolling();

function editMessage(ctx, text, extra) {
    let msg = ctx.update.callback_query.message;
    ctx.telegram.editMessageText(msg.chat.id, msg.message_id, null, text, extra);
}
