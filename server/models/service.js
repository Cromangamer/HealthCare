const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const serviceSchema = new Schema({
    caregiverId: {
        type: Schema.Types.ObjectId,
        ref: "Caregiver",
        required: true,
    },

    serviceType: {
        type: String,
        enum: [
            "Elderly Care",
            "Home Nursing",
            "Physiotherapy",
            "Post Surgery Care",
            "Doctor Consultation",
            "Medical Attendant",
            "Companion Care",
            "ICU Care",
            "Palliative Care",
            "Other"
        ],
        required: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    priceType: {
        type: String,
        enum: ["hourly", "per_visit", "flat_rate"],
        default: "hourly",
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    duration: {
        type: Number, // Duration in minutes
    },

    serviceMode: {
        type: String,
        enum: ["in_home", "clinic", "hospital", "virtual"],
        default: "in_home",
    },

    serviceArea: [{
        city: String,
        state: String,
        pincode: String,
    }],

    availability: {
        monday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
        tuesday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
        wednesday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
        thursday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
        friday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
        saturday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
        sunday: {
            available: { type: Boolean, default: false },
            start: String,
            end: String,
        },
    },

    serviceExperience: {
        type: Number, // Years
        default: 0,
        min: 0,
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    totalReviews: {
        type: Number,
        default: 0,
        min: 0,
    },

    isActive: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
});


const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;

/*
    service :
        serviceID
        caregiverID
        serviceType : [list of service types]
        description
        priceType : [hourly, flat rate, per visit]
        price 
        duration
        sevriceLocation : [in-home, in-office, virtual]
        requiredQualifications 
        isActive : [true, false]
        availability : [weekly schedule]
        serviceRating 
        serviceExperience  


*/