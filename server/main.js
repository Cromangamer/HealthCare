

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
const patientRoutes = require("./routes/patient");
const caregiverRoutes = require("./routes/caregiver");
const serviceRoutes = require("./routes/service");
const bookingRoutes = require("./routes/booking");
const chatroomRoutes = require("./routes/chatroom");
const reviewRoutes =require("./routes/review");


//function to connect to the database
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Script to connect to the database
connectToDatabase();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/caregivers", caregiverRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/chatrooms", chatroomRoutes);
app.use("/reviews", reviewRoutes);





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});