require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://car-management-l65a.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true, 
  })
);



app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Error connecting to MongoDB', err));
