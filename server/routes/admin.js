const express = require("express");
const { authenticate, requireRole } = require("../middleware/authenticate");
const Service = require("../models/service");
const Booking = require("../models/booking");
const service = require("../controllers/serviceController");
const booking = require("../controllers/bookingController");
const router = express.Router();

router.use(authenticate, requireRole("admin"));
router.get("/services", service.list);
router.patch("/services/:id", service.update);
router.delete("/services/:id", service.remove);
router.get("/bookings", booking.list);
router.get("/bookings/:id", booking.getOne);
router.patch("/bookings/:id", booking.update);
router.patch("/bookings/:id/status", booking.changeStatus);
router.delete("/bookings/:id", booking.remove);
router.get("/analytics", async (req, res, next) => { try { const [services, bookings, pending, completed] = await Promise.all([Service.countDocuments(), Booking.countDocuments(), Booking.countDocuments({ status: "pending" }), Booking.countDocuments({ status: "completed" })]); res.json({ services, bookings, pendingBookings: pending, completedBookings: completed }); } catch (error) { next(error); } });
module.exports = router;
