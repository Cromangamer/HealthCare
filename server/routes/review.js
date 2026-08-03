const express = require("express");
const Review = require("../models/review");
const Booking = require("../models/booking");
const Caregiver = require("../models/caregiver");
const { authenticate } = require("../middleware/authenticate");
const { updateFeedback } = require("../helper/feedbackSystem");
const router = express.Router();

router.post("/", authenticate, async (req, res, next) => {
  try {
    if (!req.patient) return res.status(403).json({ message: "Only patients can submit reviews" });

    const { bookingId, caregiverId, rating, comment } = req.body;
    const normalizedComment = typeof comment === "string" ? comment.trim() : "";
    const normalizedRating = Number(rating);

    if (!bookingId) return res.status(400).json({ message: "bookingId is required" });
    if (!caregiverId) return res.status(400).json({ message: "caregiverId is required" });
    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) return res.status(400).json({ message: "rating must be between 1 and 5" });
    if (normalizedComment.length > 1000) return res.status(400).json({ message: "comment must be 1000 characters or less" });

    const [booking, existingReview] = await Promise.all([
      Booking.findById(bookingId),
      Review.findOne({ bookingId }),
    ]);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (!booking.patientId.equals(req.patient._id)) return res.status(403).json({ message: "You can only review your own booking" });
    if (booking.status !== "completed") return res.status(409).json({ message: "Only completed bookings can be reviewed" });
    if (existingReview) return res.status(409).json({ message: "A review for this booking already exists" });

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });

    const savedReview = await Review.create({
      bookingId: booking._id,
      patientId: req.patient._id,
      caregiverId: booking.caregiverId,
      serviceId: booking.serviceId,
      rating: normalizedRating,
      review: normalizedComment,
      isVisible: true,
    });

    await updateFeedback(booking.serviceId, booking.caregiverId);
    res.status(201).json({ message: "Review submitted successfully", review: savedReview });
  } catch (error) { next(error); }
});

router.get("/:caregiverId", async (req, res, next) => {
  try {
    const reviews = await Review.find({ caregiverId: req.params.caregiverId, isVisible: true }).populate({ path: "patientId", populate: { path: "userId", select: "firstName lastName profileImage" } }).sort({ createdAt: -1 }).lean();
    const stats = await Review.aggregate([
      { $match: { caregiverId: require("mongoose").Types.ObjectId.createFromHexString(req.params.caregiverId), isVisible: true } },
      { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    ]);

    const averageRating = stats[0]?.averageRating ? Number(stats[0].averageRating.toFixed(1)) : 0;
    const totalReviews = stats[0]?.totalReviews || 0;
    res.json({ reviews, averageRating, totalReviews });
  } catch (error) { next(error); }
});

module.exports = router;
