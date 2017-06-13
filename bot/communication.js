const {Extra, Markup} = require('telegraf');

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
    Markup.callbackButton('✌️', 'schnick_scissors'),
    Markup.callbackButton('✊️', 'schnick_rock'),
    Markup.callbackButton('✋️', 'schnick_paper'),
    Markup.callbackButton('⛲️', 'schnick_well')
]);

const inlineKeyboardSchnickWithoutWell = Markup.inlineKeyboard([
    Markup.callbackButton('✌️', 'schnick_scissors'),
    Markup.callbackButton('✊️', 'schnick_rock'),
    Markup.callbackButton('✋️', 'schnick_paper')
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