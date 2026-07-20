const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
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

    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected",
            "started",
            "completed",
            "cancelled"
        ],
        default: "pending",
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "refunded",
            "failed"
        ],
        default: "pending",
    },

    notes: {
        type: String,
        trim: true,
        maxlength: 1000,
    },

    paymentMethod: {
        type: String,
        enum: ["cash"],
        default: "cash",
    },

}, {
    timestamps: true,
});

bookingSchema.index({ patientId: 1 });

bookingSchema.index({ caregiverId: 1 });

bookingSchema.index({ status: 1 });


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

/*
    booking :
    bookingId
    patientID
    caregiverID
    serviceID
    DateTime
    status: [pending, accepted, rejected, started, completed, cancelled]
    paymentStatus: [pending, paid, refunded, failed]
    notes
*/