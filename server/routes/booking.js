const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const booking = require("../controllers/bookingController");
const router = express.Router();

router.use(authenticate);
router.get("/history", booking.history);
router.get("/", booking.list);
router.post("/", booking.create);
router.get("/:id", booking.getOne);
router.patch("/:id", booking.update);
router.delete("/:id", booking.remove);
router.patch("/:id/status", booking.changeStatus);
module.exports = router;
