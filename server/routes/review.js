const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Caregiver = require("../models/caregiver");
const Booking = require("../models/booking");
const {updateFeedback , } = require("../helper/feedbackSystem")

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

        let review = null;
        review = await Review.findOneAndUpdate(
            { bookingId },
            { rating, review },
            {
                new: true,
                runValidators: true,
            }
        );


        if (!review) {
            review = await Review.create({
                bookingId: bookingId,
                patientId: req.user.patientId,
                caregiverId: booking.caregiverId,
                serviceId: booking.serviceId,
                rating: rating,
                review: review,
            })
        }
        

        await updateFeedback(booking.serviceId, booking.caregiverId);


    } catch (error){
        res.status(500).json({massage: "Internal Server Error"});
    }
}); // send FeedBack

router.get("/services/:serviceId/reviews", async (req, res) => {
    try {
        const { serviceId } = req.params;

        const pageNumber = Math.max(Number(req.query.page) || 1, 1);
        const limit = 10;

        const { reviews, totalReviews } = await getServiceFeedback(
            serviceId,
            pageNumber
        );

        const totalPages = Math.ceil(totalReviews / limit);

        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        return res.status(200).json({
            currentPage: pageNumber,
            totalPages,
            totalReviews,
            hasNextPage,
            hasPreviousPage,
            reviews,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}); // GET /services/123/reviews?page=1

module.exports = router;
