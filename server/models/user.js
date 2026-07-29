console.log("Loading User model...");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true,
    },

    authProvider: {
        type: String,
        enum: ["google", "phone"],
    },

    isActive: {
        type: Boolean,
        default: true,
    },

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

    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
    },

    emailVerified: {
        type: Boolean,
        default: false,
    },

    phone: {
        type: String,
        unique: true,
        sparse: true,
    },

    providers: {
        type: [{
            type: String,
            enum: ["google", "phone"],
        }],
        default: [],
    },

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
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);