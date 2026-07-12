const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
    },

    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    message: {
        type: String,
        trim: true,
        default: "",
    },

    attachments: [{
        url: String,
        fileName: String,
        fileType: String,
    }],

    isSeen: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;