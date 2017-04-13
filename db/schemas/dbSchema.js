var gameSchema = new mongoose.Schema({
    chat_id: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true,
        required: true
    },
    gameState: {
        type: String
        //enum: //TODO require enum from game logic
    }
});