const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    chat_id: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true,
        required: true
    },
    game: {
        state: {
            type: String
            //enum: //TODO require enum from game logic
        },
        data: mongoose.Schema.Types.Mixed
    }
});

const Game = mongoose.model('Game', gameSchema);
module.exports = {
    Game
};