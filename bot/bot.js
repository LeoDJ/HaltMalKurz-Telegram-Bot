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
    //bot.telegram.sendSticker(ctx.chat.id, ctx.message.sticker.file_id);
});

bot.command('new', async(ctx) => {
    console.log("/new in", ctx.chat.id);
    db.saveUser(ctx.from);
    await game.newGame(ctx.chat.id);
    await game.joinLobby(ctx.chat.id, ctx.from.id);
    let names = await game.getJoinedUsers(ctx.chat.id);
    ctx.reply(comm.newMsg + names.join(', '), inlineKeyboardJoin);

});
bot.action('join', async(ctx, next) => {
    console.log("join action in", ctx.chat.id);
    db.saveUser(ctx.from);
    let success = await game.joinLobby(ctx.chat.id, ctx.from.id);
    let names = await game.getJoinedUsers(ctx.chat.id);
    console.log(success, names);
    if (success) //only edit message, when user not added already
        editMessage(ctx, comm.newMsg + names.join(', '), inlineKeyboardJoin);
    ctx.answerCallbackQuery();
    next();
});


bot.on('inline_query', async({inlineQuery, answerInlineQuery}) => {
    let chatId = undefined;
    try {
        chatId = await db.getChatIdForUser(inlineQuery.from.id);
    }
    catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
    console.log("inline query from", inlineQuery.from.id, "  in chat", chatId);
    const offset = parseInt(inlineQuery.offset) || 0;
    const cards = await db.getCards(chatId);
    let results = cards.drawPile.slice(0, 10).map((card) => ({
        type: 'sticker',
        id: card._id.toString(),
        sticker_file_id: card.sticker_id,
        //reply_markup: {inline_keyboard: [[{text: 'Draufhauen', callback_data: 'hit'}]]}
        reply_markup: Markup.inlineKeyboard([Markup.callbackButton('Draufhauen', 'hit')])

    }));
    //let results = [];
    results.push({
        type: 'article',
        id: "1",
        title: 'TestText',
        description: 'asdfasdf',
        thumb_width: 1,
        thumb_height: 1,
        input_message_content: {message_text: 'asdfasdf'}
    });
    results.push({
        type: 'article',
        id: "2",
        title: 'Test2',
        reply_markup: inlineKeyboardJoin,
        input_message_content: {message_text: 'keyboard?'}
    });
    answerInlineQuery(results, {cache_time: 0}).catch((err) => {
        console.log(err);
    });

/*const tracks = await spotifySearch(inlineQuery.query, offset, 30)
 const results = tracks.map((track) => ({
 type: 'audio',
 id: track.id,
 title: track.name,
 audio_url: track.preview_url
 }))
 return answerInlineQuery(results, {next_offset: offset + 30})*/
});

bot.command('start', async(ctx) => {
    let state = await game.getGameState(ctx.chat.id);
    if (state == 'noGameRunning')
        comm.start(ctx);
    else if (state == 'lobbyOpen')
        game.start(ctx.chat.id);
});

bot.command('about', comm.about);

bot.command('debug', async(ctx) => {
    ctx.reply(await db.getGameState(ctx.chat.id) + "\n" + JSON.stringify(await game.getJoinedUsers(ctx.chat.id)));
});

bot.command('id', async(ctx) => {
    ctx.reply("from: " + ctx.from.id + "   storedChat: " + await db.getChatIdForUser(ctx.from.id));
})

bot.startPolling();

function editMessage(ctx, text, extra) {
    let msg = ctx.update.callback_query.message;
    ctx.telegram.editMessageText(msg.chat.id, msg.message_id, null, text, extra);
}
