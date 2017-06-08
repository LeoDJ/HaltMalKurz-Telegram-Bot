

const startMsg = `Willkommen beim Halt Mal Kurz Bot. 
Benutze /new um ein neues Spiel zu starten.`;
const newMsg = `Die Lobby ist nun geöffnet. Zum Beitreten, einfach den Knopf drücken.
Aktuell befinden sich folgende Spieler in der Lobby: `;
const aboutMsg = "Dieser Bot wurde programmiert von @LeoDJ\nDen Source Code und Kontaktmöglichkeiten findet man unter https://github.com/LeoDJ/HaltMalKurz-Telegram-Bot";

function start(ctx) {
    return ctx.reply(startMsg);
}

function about(ctx) {
    return ctx.reply(aboutMsg);
}

module.exports = {
    start,
    about,
    newMsg
};