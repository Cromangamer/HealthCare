const express = require("express");
const router = express.Router();
const Caregiver = require("../models/caregiver");
const User = require("../models/user");
const Booking = require("../models/booking");
const ChatRoom = require("../models/chatroom");
const { authenticate } = require("../middleware/authenticate");
const uploadImage = require("../middleware/uploadImage");
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.post("/", authenticate, uploadImage, async (req, res) => {
  try {
    // varaibles to store the caregiver details from the request body
    const {
      qualification,
      specialization,
      languages,
      aadhaarNumber,
      licenseNumber,
      bio,
      location,
    } = req.body;

    const userId = req.user._id;
    const user = req.user;
    // condition to check if the user exists in the database

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const certificates = (req.files || []).map((file) => ({
      name: file.originalname,
      url: file.path,
      uploadedAt: new Date(),
    }));

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

router.get("/", async (req, res) => {
  try {
    const { search, specialization, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (specialization) filter.specialization = new RegExp(escapeRegex(specialization), "i");
    if (search) {
      const safeSearch = new RegExp(escapeRegex(search), "i");
      const users = await User.find({ $or: [{ firstName: safeSearch }, { lastName: safeSearch }] }).select("_id");
      filter.userId = { $in: users.map((user) => user._id) };
    }
    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const [caregivers, total] = await Promise.all([
      Caregiver.find(filter).populate("userId", "firstName lastName profileImage").sort({ isVerified: -1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
      Caregiver.countDocuments(filter),
    ]);
    res.json({ caregivers, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const caregiverId = req.params.id;

    const caregiver = await Caregiver.findById(caregiverId).populate(
      "userId",
      "firstName lastName email phone profileImage",
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

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const caregiverId = req.params.id;

    const fields = ["qualification", "specialization", "languages", "aadhaarNumber", "licenseNumber", "bio", "location", "totalexperience", "isAvailable"];
    const updateData = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));

    const currentCaregiver = await Caregiver.findById(caregiverId);
    if (!currentCaregiver) return res.status(404).json({ message: "Caregiver not found" });
    if (req.user.role !== "admin" && !currentCaregiver.userId.equals(req.user._id)) return res.status(403).json({ message: "You can only edit your own caregiver profile" });

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

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const caregiverId = req.params.id;

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });
    if (req.user.role !== "admin" && !caregiver.userId.equals(req.user._id)) return res.status(403).json({ message: "You can only delete your own caregiver profile" });

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

module.exports = router;
