const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cardSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['witzig', 'nichtWitzig', 'razupaltuff'],
        required: true
    },
    name: {
        type: String,
        enum: [
            'achMeinDein',
            'schnickSchnackSchnuck',
            'gruppenSchnickSchnackSchnuck',
            'haltMalKurz',
            'notToDoListe',
            'vollVersammlung',
            'kommunismus',
            'kapitalismus',
            'nazi',
            'polizei'
        ]
    },
    color: {
        type: String,
        enum: ['kaenguru', 'kleinkuenstler', 'pinguin', 'multi', 'none']
    },
    sticker_id: String
});

const stackSchema = new Schema({
    drawPile: [cardSchema],
    discardPile: [cardSchema],
    playerHands: [
        [cardSchema]
    ]
});

const Card = mongoose.model('Card', cardSchema);
const Stack = mongoose.model('Stack', stackSchema);

module.exports = {
    Card,
    Stack
};