const express = require("express");
const router = express.Router();
const Caregiver = require("../models/caregiver");
const User = require("../models/user");

router.post("/caregivers", async (req, res) => {

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

    res.status(201).json({savedCaregiver, message: "Caregiver registered successfully"});

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });

  }
}); // register a new caregiver

router.get("/caregivers/:id", async (req, res) => {

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

router.patch("/caregivers/:id", async (req, res) => {

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

    res.status(200).json({ updatedCaregiver, message: "Caregiver updated successfully" }); // return data

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });

  }

}); // update caregiver details by id

router.delete("/caregivers/:id", async (req, res) => {

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

module.exports = router;
