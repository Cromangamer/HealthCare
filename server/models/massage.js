const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
    },

    sender: {
        role: String,
        enum: [
            "caregiver",
            "patient"
        ]
    },

    receiver: {
        role: String,
        enum: [
            "caregiver",
            "patient"
        ]
    },

    message: {
        type: String,
        trim: true,
        default: "",
    },

    attachments: [{
        url: String,
    }],

    isSeen: {
        type: Boolean,
        default: false,
    },

    seenAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true,
});

messageSchema.index({
    chatRoomId: 1,
    createdAt: -1
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;