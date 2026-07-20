const express = require("express");
const router = express.Router();
const Caregiver = require("../models/caregiver");
const User = require("../models/user");
const Booking = require("../models/booking");
const ChatRoom = require("../models/chatroom");

router.post("/", async (req, res) => {
  try {
    // varaibles to store the caregiver details from the request body
    const {
      userId,
      qualification,
      specialization,
      languages,
      certificates,
      aadhaarNumber,
      licenseNumber,
      bio,
      location,
    } = req.body;

    const user = await User.findById(userId);

    // condition to check if the user exists in the database

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // condition to check if the user is already registered as a caregiver

    const existingCaregiver = await Caregiver.findOne({ userId });
    if (existingCaregiver) {
      return res
        .status(400)
        .json({ message: "User is already registered as a caregiver" });
    }

    const newCaregiver = new Caregiver({
      userId,
      qualification,
      specialization,
      languages,
      certificates,
      aadhaarNumber,
      licenseNumber,
      bio,
      location,
    });

    const savedCaregiver = await newCaregiver.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "caregiver" },
      { new: true },
    );

    res
      .status(201)
      .json({ savedCaregiver, message: "Caregiver registered successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}); // register a new caregiver

router.get("/:id", async (req, res) => {
  try {
    const caregiverId = req.params.id;

    const caregiver = await Caregiver.findById(caregiverId).populate(
      "userId",
      "-password",
    ); // populate user details in the caregiver output

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    res.status(200).json(caregiver);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}); // get caregiver details by id

router.patch("/:id", async (req, res) => {
  try {
    const caregiverId = req.params.id;

    const updateData = req.body;

    // update caregiver details by id

    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      caregiverId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCaregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    res
      .status(200)
      .json({ updatedCaregiver, message: "Caregiver updated successfully" }); // return data
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}); // update caregiver details by id

router.delete("/:id", async (req, res) => {
  try {
    const caregiverId = req.params.id;

    const deletedCaregiver = await Caregiver.findByIdAndDelete(caregiverId);

    if (!deletedCaregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      deletedCaregiver.userId,
      { role: "user" },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user role" });
    }

    res.status(200).json({ message: "Caregiver deleted successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}); // delete caregiver by id

router.get("/appointments/:caregiverId", async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const booking = await Booking.find({ caregiverId })
      .sort({ createdAt: -1 }) // newest
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "firstName lastName",
        },
      })
      .populate({
        path: "serviceId",
        select: "serviceType serviceMode serviceArea",
      });

    if (booking.length === 0) {
      return res.status(404).json({
        message: "No bookings found",
      });
    }

    res.status(200).json({ message: "Here Your Booking all...", booking });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
}); // get all booking for caregiver

router.get("/appointments/details/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "patientId",
        select: " -profileCompleted -createdAt -updatedAt ",
        populate: {
          path: "userId",
          select: "_id firstName lastName email phone profileImage",
        },
      })
      .populate({
        path: "serviceId",
        select: "serviceType serviceMode serviceArea",
      })
      .lean();

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    let chatRoom = null;
    if (["accepted", "started", "completed"].includes(booking.status)) {
      chatRoom = await ChatRoom.findOne({
        bookingId: booking._id,
      });
    }

    return res.status(200).json({
      message: "Booking details fetched successfully.",
      booking,
      chatRoom,
    });
    // PENDING: msg , all other info
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
}); // get booking details for caregiver

router.post("/appointments/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId).orFail();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    if (booking.caregiverId.toString() !== req.user.caregiverId.toString()) {
      return res.status(403).json({
          message: "You are not authorized."
      });
    }

    if (
      !["accepted", "rejected", "started", "completed", "cancelled"].includes(
        status,
      )
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const allowedTransitions = {
      pending: ["accepted", "rejected", "cancelled"],
      accepted: ["started", "cancelled"],
      started: ["completed"],
      completed: [],
      rejected: [],
      cancelled: [],
    };
    if (!allowedTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        message: "Invalid status transition.",
      });
    }
    if (booking.status === status) {
      return res.status(400).json({ message: `Booking is already ${status}` });
    }

    // If status is pending to accepted then create a chatroom for the booking
    if (booking.status === "pending" && status === "accepted") {
      const exists = await ChatRoom.findOne({ bookingId: booking._id });
      if (!exists) {
        await ChatRoom.create({
          bookingId: booking._id,
          patientId: booking.patientId,
          caregiverId: booking.caregiverId,
        });
      }
    } else if (booking.status === "accepted" && status === "rejected") {
      const exists = await ChatRoom.findOne({ bookingId: booking._id });
      if (exists) {
        await ChatRoom.findOneAndDelete({
          bookingId: booking._id,
        });
      }
    }
    booking.status = status;
    await booking.save();
    return res.status(200).json({
      message: `Booking ${status} successfully.`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
}); // any status change route

module.exports = router;
