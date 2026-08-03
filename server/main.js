require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/healthcare';
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const patientRoutes = require('./routes/patient');
const caregiverRoutes = require('./routes/caregiver');
const serviceRoutes = require('./routes/service');
const bookingRoutes = require('./routes/booking');
const chatroomRoutes = require('./routes/chatroom');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// function to connect to the database
async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI && !process.env.MONGO_URI && !process.env.MONGO_URL) {
      console.log('No MongoDB URI provided. Using default local MongoDB URI.');
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());
app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error("Origin not allowed")), credentials: true }));
app.use(apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/caregivers", caregiverRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/chatrooms", chatroomRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);





async function startServer() {
    await connectToDatabase();

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
