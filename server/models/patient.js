const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    dateOfBirth: {
        type: Date,
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },

    bloodGroup: {
        type: String,
        enum: [
            "A+","A-",
            "B+","B-",
            "AB+","AB-",
            "O+","O-"
        ],
        default: null,
    },

    height: Number, // cm

    weight: Number, // kg

    medicalConditions: [{
        type: String,
    }],

    allergies: [{
        type: String,
    }],

    medications: [{
        type: String,
    }],

    emergencyContacts: [{
        name: String,
        relation: String,
        phone: String,
    }],

    insurance: {
        isinsured: {
            type: Boolean,
            default: false,
        },
        provider: String,
        policyNumber: String,
    },

    address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },

    medicalDocuments: [{
        type: String, // Cloudinary URL
        
    }],

    profileCompleted: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;