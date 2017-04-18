

var startMsg = `Willkommen beim Halt Mal Kurz Bot. 
Benutze /new um ein neues Spiel zu starten.`;
var newMsg = `Die Lobby ist nun geöffnet. Zum Beitreten, einfach den Knopf dürcken.`;
const aboutMsg = "Dieser Bot wurde programmiert von @LeoDJ\nDen Source Code und Kontaktmöglichkeiten findet man unter https://github.com/LeoDJ/HaltMalKurz-Telegram-Bot";

function start(msg) {
    msg.reply(startMsg);
}

function about(msg) {
    msg.reply(aboutMsg);
}

module.exports = {
    start,
    about
};