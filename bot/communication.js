const {Extra, Markup} = require('telegraf');
const schnick = require('../game/schnickSchnackSchnuck');

const startMsg = `Willkommen beim Halt Mal Kurz Bot. 
Benutze /new um ein neues Spiel zu starten.`;
const newMsg = `Die Lobby ist nun geöffnet. Zum Beitreten, einfach den Knopf drücken.
Aktuell befinden sich folgende Spieler in der Lobby: `;
const aboutMsg = "Dieser Bot wurde programmiert von @LeoDJ\nDen Source Code und Kontaktmöglichkeiten findet man unter https://github.com/LeoDJ/HaltMalKurz-Telegram-Bot";

const inlineKeyboardJoin = Extra.HTML().markup(m =>
    m.inlineKeyboard([
        m.callbackButton('Beitreten', 'join')
    ]));

const inlineKeyboardSchnick = Markup.inlineKeyboard([
    Markup.callbackButton(schnick.emoji.scissors, 'schnick_scissors'),
    Markup.callbackButton(schnick.emoji.rock, 'schnick_rock'),
    Markup.callbackButton(schnick.emoji.paper, 'schnick_paper'),
    Markup.callbackButton(schnick.emoji.well, 'schnick_well')
]);

const inlineKeyboardSchnickWithoutWell = Markup.inlineKeyboard([
    Markup.callbackButton(schnick.emoji.scissors, 'schnick_scissors'),
    Markup.callbackButton(schnick.emoji.rock, 'schnick_rock'),
    Markup.callbackButton(schnick.emoji.paper, 'schnick_paper')
]);

function start(ctx) {
    return ctx.reply(startMsg);
}

function about(ctx) {
    return ctx.reply(aboutMsg);
}

module.exports = {
    start,
    about,
    newMsg,
    inlineKeyboardJoin,
    inlineKeyboardSchnick,
    inlineKeyboardSchnickWithoutWell
};