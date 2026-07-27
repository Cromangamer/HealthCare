require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthcare';
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const patientRoutes = require('./routes/patient');
const caregiverRoutes = require('./routes/caregiver');
const serviceRoutes = require('./routes/service');
const bookingRoutes = require('./routes/booking');
const chatroomRoutes = require('./routes/chatroom');
const reviewRoutes = require('./routes/review');

// function to connect to the database
async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.log('No MongoDB URI provided. Using default local MongoDB URI.');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.warn('Server will continue running, but database-backed routes will fail until MongoDB is available.');
  }
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/caregivers", caregiverRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/chatrooms", chatroomRoutes);
app.use("/reviews", reviewRoutes);





async function startServer() {
    await connectToDatabase();

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer();