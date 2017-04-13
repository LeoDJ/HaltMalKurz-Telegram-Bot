var Schema = mongoose.Schema;
var cardSchema = new Schema({
    type: {
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
        enum: ['kaenguru', 'kleinkuenstler', 'pinguin', 'all']
    },
    sticker_id: String
});

var stackSchema = new Schema({
    drawPile: [cardSchema],
    discardPile: [cardSchema],
    playerHands: [
        [cardSchema]
    ]
})