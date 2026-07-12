const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    firebaseUid: {
        type: String,
        unique: true,
        sparse: true, // Not required yet since Firebase isn't integrated
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
    },

    phone: {
        type: String,
        unique: true,
        sparse: true,
    },

    providers: [{
        type: String,
        enum: ["google", "phone"],
    }],

    role: {
        type: String,
        enum: ["user", "caregiver", "admin"],
        default: "user",
    },

    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/dxjv7gq3f/image/upload/v1690911870/default-profile-image_ow1z8k.png",
    },
 
    profileCompleted: {
        type: Boolean,
        default: false,
    }
}, 
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;