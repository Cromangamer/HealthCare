const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const User = require("../models/user");

function CheckPatientID (patient){
    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });  
    }
}


router.post("/patients", async (req, res) => {
  try {
    const {
      userId,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      emergencyContacts,
      address,
    } = req.body;

    const existingPatient = await Patient.findOne({ userId });

    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient profile already exists for this user" });
    }

    const newPatient = new Patient({
      userId,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      emergencyContacts,
      address
    });
    await newPatient.save();

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/patients/:userId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.userId });

    CheckPatientID(patient);

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/patients/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      req.body,
      { new: true, runValidators: true },
    );

    CheckPatientID(patient);

    res.json(patient);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/patients/:patientId/medical-documents", async (req, res) => {
  try {
    const { documentUrls } = req.body;
    const patient = await Patient.findById(req.params.patientId);

    CheckPatientID(patient);

    patient.medicalDocuments.push(...documentUrls);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/patients/:patientId/insurance", async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.patientId);

        CheckPatientID(patient);

        patient.insurance.isinsured = true;

    } catch (error){

    }
})



module.exports = router;
