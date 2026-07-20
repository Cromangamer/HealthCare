const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true,
    },

    patientId: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },

    caregiverId: {
        type: Schema.Types.ObjectId,
        ref: "Caregiver",
        required: true,
    },

    deletedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],

    lastMessageId: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    }
}, {
    timestamps: true,
});

chatRoomSchema.index({
    patientId: 1,
    caregiverId: 1
});

chatRoomSchema.index({
    bookingId: 1
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
module.exports = ChatRoom;