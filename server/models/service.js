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
            "Companion Care",
            "Doctor Consultation",
            "Elderly Care",
            "Home Nursing",
            "ICU Care",
            "Medical Attendant",
            "Other",
            "Physiotherapy",
            "Post Surgery Care",
            "Palliative Care"
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

    startedOfferingOn: {
        type: Date,
        required: true,
    },

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

serviceSchema.virtual("serviceExperience").get(function () {
    const today = new Date();
    const start = new Date(this.startedOfferingOn);

    let years = today.getFullYear() - start.getFullYear();

    const monthDiff = today.getMonth() - start.getMonth();
    const dayDiff = today.getDate() - start.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        years--;
    }

    return Math.max(0, years);
});

serviceSchema.set("toJSON", { virtuals: true });
serviceSchema.set("toObject", { virtuals: true });

serviceSchema.index({ caregiverId: 1 });

serviceSchema.index({ serviceType: 1 });

serviceSchema.index({ isActive: 1 });

serviceSchema.index({
    "serviceArea.city": 1
});

serviceSchema.index({
    "serviceArea.state": 1
});

serviceSchema.index({
    "serviceArea.pincode": 1
});

/*
{
    "startedOfferingOn": "2022-06-15",
    "serviceExperience": 4
}
*/


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