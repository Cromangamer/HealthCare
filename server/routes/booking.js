const express = require("express");
const router = express.Router();
const Booking = require("../models/booking")

router.post("/", async (req, res) => {
    try{
        const {
            patientId,
            serviceId,
            caregiverId,
        } = req.body;

        if(!patientId || !serviceId || !caregiverId){
            return res.status(400).json({
                message: "patientId, serviceId and caregiverId are required"
            });
        }

        const booking = new Booking({
            patientId,
            serviceId,
            caregiverId
        })

        await booking.save();

        res.status(201).json({
            message: "Successfully Service Book! "
        })
    }
    catch ( error ) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}); // create booking

router.delete("/:bookingId", async (req, res) =>{
    try{
        const { bookingId } = req.params;
        const booking = await Booking.findByIdAndDelete(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.json({
            message: "Booking deleted successfully"
        });
        
    }
    catch (error){
        res.status(500).json({ message: "Internal Server Error" });
    }

}) // delete booking

module.exports = router;