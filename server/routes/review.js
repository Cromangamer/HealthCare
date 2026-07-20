const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Caregiver = require("../models/caregiver");
const Booking = require("../models/booking");


router.post("/feedback/:bookingId", async(req, res) =>{
    try{
        const { bookingId } = req.params;
        const { rating, review } = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({ massage: "Invalid Booking feedback."})
        }


        const isPatient = booking.patientId.equals(req.user.patientId);
        if(!isPatient){
            return req.status(404).json({ massage: "Books the service First..."})
        }

        let newReview = null;
        newReview = await Review.findOneAndUpdate(
            { bookingId },
            { rating, review },
            {
                new: true,
                runValidators: true,
            }
        );


        if (!review) {
            newReview = await Review.create({
                bookingId: bookingId,
                patientId: req.user.patientId,
                caregiverId: booking.caregiverId,
                serviceId: booking.serviceId,
                rating: rating,
                review: review,
            })
        }
        

        await updateFeedback(booking.serviceId, booking.caregiverId);
        return res.status(201).json({ massage: "FeedBack Submit Successfully!"})

    } catch (error){
        res.status(500).json({massage: "Internal Server Error"});
    }
}); // send FeedBack



module.exports = router;
