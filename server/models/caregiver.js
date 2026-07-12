const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caregiverSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    qualification: [{
        type: String,
    }],

    specialization: [{
        type: String,
    }],

    totalexperience: {
        type: Number, // Years
        default: 0,
    },

    languages: [{
        type: String,
    }],


    certificates: [{
        name: String,
        url: String,
        uploadedAt: Date,
    }],

    aadhaarNumber: {
        type: String,
        select: false,
    },

    licenseNumber: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    totalrating: {
        type: Number,
        default: 0,
    },

    bio: {
        type: String,
        maxlength: 1000,
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },

    isAvailable: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
});

const Caregiver = mongoose.model('Caregiver', caregiverSchema);

module.exports = Caregiver;