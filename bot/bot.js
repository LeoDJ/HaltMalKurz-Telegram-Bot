const Telegraf = require('telegraf');

const config = require('../config');

const comm = require('./communication');
const game = require('../game/game');

var bot = new Telegraf(config.bot.token);

//get username for group command handling
bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
    console.log("Initialized", botInfo.username);
});

bot.on('sticker', msg => {
    console.log(msg.message.sticker.file_id);
    //bot.telegram.sendSticker(msg.chat.id, 'BQADAgAD4QADuNXvD7DVvOPPLJ9FAg');
});


bot.command('start', comm.start);
bot.command('new', game.newGame);
bot.command('about', comm.about);

bot.startPolling();