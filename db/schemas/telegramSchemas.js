var Schema = mongoose.Schema;
var userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    username: String
});

var chatSchema = new Schema({
    id: Number,
    type: {
        type: String,
        enum: ["private", "group", "supergroup", "channel"],
        required: true
    },
    title: String, //group title
    username: String,   //only in private chat
    first_name: String, //only in private chat
    last_name: String,  //only in private chat
    all_members_are_administrators: Boolean

});

var photoSizeSchema = new Schema ({
    file_id: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    file_size: Number
});

var stickerSchema = new Schema({
    file_id: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    thumb: photoSizeSchema,
    emoji: String, //Emoji associated with the sticker
    file_size: Number
});

var messageSchema = new Schema({
    message_id: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true

    },
    chat: {
        type: chatSchema,
        required: true
    },
    text: String, //the actual text (max 4096 chars, UTF-8)
    from: userSchema, //optional, can be empty for messages to channel
    forward_from: userSchema,
    forward_from_chat: chatSchema,
    forward_from_message_id: Number, //For forwareded channel posts (identifier of original message)
    forward_date: Date,
    reply_to_message: messageSchema, //maximum nesting depth of 1
    edit_date: Date,
    entities: Schema.Types.Mixed,
    audio: Schema.Types.Mixed,
    document: Schema.Types.Mixed,
    game: Schema.Types.Mixed,
    photo: Schema.Types.Mixed,
    sticker: stickerSchema,
    video: Schema.Types.Mixed,
    voice: Schema.Types.Mixed,
    caption: String, //caption for document/photo/video (max. 200 chars)
    contact: Schema.Types.Mixed,
    location: Schema.Types.Mixed,
    venue: Schema.Types.Mixed,
    new_chat_member: userSchema,  //member, that was added to the group (may be bot itself)
    left_chat_member: userSchema, //member, that was removed from the group (may be bot itself)
    new_chat_title: String, //chat title was changed
    new_chat_photo: Schema.Types.Mixed,
    delete_chat_photo: Boolean,
    group_chat_created: Boolean,
    supergroup_chat_created: Boolean,
    channel_chat_created: Boolean,
    migrate_to_chat_id: Number,
    migrate_from_chat_id: Number,
    pinned_message: messageSchema
});


module.exports = {
    userSchema,
    chatSchema,
    messageSchema,
    stickerSchema,
    photoSizeSchema};