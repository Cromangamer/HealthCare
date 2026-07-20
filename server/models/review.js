const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true, // One review per booking
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

    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    review: {
        type: String,
        trim: true,
        maxlength: 1000,
    },

    isVisible: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
});

reviewSchema.index({ serviceId: 1 });

reviewSchema.index({ caregiverId: 1 });

reviewSchema.index({ patientId: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;