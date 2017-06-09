/**
 * Created by Leandro on 18.04.2017.
 */
const db = require('../db/db');
const cardIds = require('../db/cards');

var deckContent = [
    {category: 'witzig', name: 'haltMalKurz', colors: 'all', quantity: 6},
    {category: 'witzig', name: 'vollVersammlung', colors: 'all', quantity: 6},
    {category: 'witzig', name: 'schnickSchnackSchnuck', colors: 'all', quantity: 6},
    {category: 'witzig', name: 'gruppenSchnickSchnackSchnuck', colors: 'all', quantity: 3},
    {category: 'witzig', name: 'achMeinDein', colors: 'all', quantity: 3},
    {category: 'witzig', name: 'kommunismus', colors: 'multi', quantity: 1},
    {category: 'witzig', name: 'notToDoListe', colors: 'all', quantity: 6},
    {category: 'nichtWitzig', name: 'nazi', colors: 'all', quantity: 15},
    {category: 'nichtWitzig', name: 'polizei', colors: 'all', quantity: 9},
    {category: 'nichtWitzig', name: 'kapitalismus', colors: 'all', quantity: 3},
    {category: 'none', name: 'razupaltuff', colors: 'none', quantity: 2},
];
var cardColors = ['kaenguru', 'kleinkuenstler', 'pinguin'];


//output of the generateNewDeck() function TODO: implement testing in the future
var generatedDeckJSON = '[{"id":0,"category":"witzig","name":"haltMalKurz","color":"kaenguru"},{"id":0,"category":"witzig","name":"haltMalKurz","color":"kaenguru"},{"id":1,"category":"witzig","name":"haltMalKurz","color":"kleinkuenstler"},{"id":1,"category":"witzig","name":"haltMalKurz","color":"kleinkuenstler"},{"id":2,"category":"witzig","name":"haltMalKurz","color":"pinguin"},{"id":2,"category":"witzig","name":"haltMalKurz","color":"pinguin"},{"id":3,"category":"witzig","name":"vollVersammlung","color":"kaenguru"},{"id":3,"category":"witzig","name":"vollVersammlung","color":"kaenguru"},{"id":4,"category":"witzig","name":"vollVersammlung","color":"kleinkuenstler"},{"id":4,"category":"witzig","name":"vollVersammlung","color":"kleinkuenstler"},{"id":5,"category":"witzig","name":"vollVersammlung","color":"pinguin"},{"id":5,"category":"witzig","name":"vollVersammlung","color":"pinguin"},{"id":6,"category":"witzig","name":"schnickSchnackSchnuck","color":"kaenguru"},{"id":6,"category":"witzig","name":"schnickSchnackSchnuck","color":"kaenguru"},{"id":7,"category":"witzig","name":"schnickSchnackSchnuck","color":"kleinkuenstler"},{"id":7,"category":"witzig","name":"schnickSchnackSchnuck","color":"kleinkuenstler"},{"id":8,"category":"witzig","name":"schnickSchnackSchnuck","color":"pinguin"},{"id":8,"category":"witzig","name":"schnickSchnackSchnuck","color":"pinguin"},{"id":9,"category":"witzig","name":"gruppenSchnickSchnackSchnuck","color":"kaenguru"},{"id":10,"category":"witzig","name":"gruppenSchnickSchnackSchnuck","color":"kleinkuenstler"},{"id":11,"category":"witzig","name":"gruppenSchnickSchnackSchnuck","color":"pinguin"},{"id":12,"category":"witzig","name":"achMeinDein","color":"kaenguru"},{"id":13,"category":"witzig","name":"achMeinDein","color":"kleinkuenstler"},{"id":14,"category":"witzig","name":"achMeinDein","color":"pinguin"},{"id":15,"category":"witzig","name":"kommunismus"},{"id":16,"category":"witzig","name":"notToDoListe","color":"kaenguru"},{"id":16,"category":"witzig","name":"notToDoListe","color":"kaenguru"},{"id":17,"category":"witzig","name":"notToDoListe","color":"kleinkuenstler"},{"id":17,"category":"witzig","name":"notToDoListe","color":"kleinkuenstler"},{"id":18,"category":"witzig","name":"notToDoListe","color":"pinguin"},{"id":18,"category":"witzig","name":"notToDoListe","color":"pinguin"},{"id":19,"category":"nichtWitzig","name":"nazi","color":"kaenguru"},{"id":19,"category":"nichtWitzig","name":"nazi","color":"kaenguru"},{"id":19,"category":"nichtWitzig","name":"nazi","color":"kaenguru"},{"id":19,"category":"nichtWitzig","name":"nazi","color":"kaenguru"},{"id":19,"category":"nichtWitzig","name":"nazi","color":"kaenguru"},{"id":20,"category":"nichtWitzig","name":"nazi","color":"kleinkuenstler"},{"id":20,"category":"nichtWitzig","name":"nazi","color":"kleinkuenstler"},{"id":20,"category":"nichtWitzig","name":"nazi","color":"kleinkuenstler"},{"id":20,"category":"nichtWitzig","name":"nazi","color":"kleinkuenstler"},{"id":20,"category":"nichtWitzig","name":"nazi","color":"kleinkuenstler"},{"id":21,"category":"nichtWitzig","name":"nazi","color":"pinguin"},{"id":21,"category":"nichtWitzig","name":"nazi","color":"pinguin"},{"id":21,"category":"nichtWitzig","name":"nazi","color":"pinguin"},{"id":21,"category":"nichtWitzig","name":"nazi","color":"pinguin"},{"id":21,"category":"nichtWitzig","name":"nazi","color":"pinguin"},{"id":22,"category":"nichtWitzig","name":"polizei","color":"kaenguru"},{"id":22,"category":"nichtWitzig","name":"polizei","color":"kaenguru"},{"id":22,"category":"nichtWitzig","name":"polizei","color":"kaenguru"},{"id":23,"category":"nichtWitzig","name":"polizei","color":"kleinkuenstler"},{"id":23,"category":"nichtWitzig","name":"polizei","color":"kleinkuenstler"},{"id":23,"category":"nichtWitzig","name":"polizei","color":"kleinkuenstler"},{"id":24,"category":"nichtWitzig","name":"polizei","color":"pinguin"},{"id":24,"category":"nichtWitzig","name":"polizei","color":"pinguin"},{"id":24,"category":"nichtWitzig","name":"polizei","color":"pinguin"},{"id":25,"category":"nichtWitzig","name":"kapitalismus","color":"kaenguru"},{"id":26,"category":"nichtWitzig","name":"kapitalismus","color":"kleinkuenstler"},{"id":27,"category":"nichtWitzig","name":"kapitalismus","color":"pinguin"},{"id":28,"category":"none","name":"razupaltuff"},{"id":28,"category":"none","name":"razupaltuff"}]';

function getStickerIdForCard(card) {
    let id = cardIds[card.category][card.name][card.color];
    if(Array.isArray(id))
        id = id[0]; //temporary implementation until multiple cards for Polizei/Nazi implemented
    return id;
}

function generateNewDeck() {
    var deck = [];
    var id = 0;
    deckContent.forEach(elem => {
        if (elem.colors == 'all') {
            cardColors.forEach(color => {
                for (var i = 0; i < (elem.quantity / 3); i++) {
                    let card = {id: id, category: elem.category, name: elem.name, color: color};
                    card.sticker_id = getStickerIdForCard(card);
                    deck.push(card);
                }
                id++;
            });
        }
        else {
            for (var i = 0; i < elem.quantity; i++) {
                let card = {id: id, category: elem.category, name: elem.name, color: elem.colors};
                card.sticker_id = getStickerIdForCard(card);
                deck.push(card);
            }
            id++;
        }
    });
    return deck;
}

function shuffle(array) { //implement Fisher–Yates Shuffle
    var t, i, m = array.length;
    //while there are remaining elements to shuffle
    while(m) {
        //pick a remaining element
        i = Math.floor(Math.random() * m--);
        //and swap it
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

async function newDeck(chatId) {
    var d = generateNewDeck();
    shuffle(d);
    await db.setCards(chatId, {drawPile: d});
    console.log("new deck generated and saved");
    //console.log(await db.getCards(chatId));
}

module.exports = {
    newDeck,
    shuffle
};