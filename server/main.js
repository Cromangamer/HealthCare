const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//function to connect to the database
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/healthcare', {
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







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});