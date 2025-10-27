require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./database/db');
const authRoutes = require('./routes/auth-route');
const homeRoutes = require('./routes/home-route');
const adminRoutes = require('./routes/admin-route');
const uploadImageRoutes = require('./routes/image-route');
const { image } = require('./config/cloudinary');
// Middleware to parse JSON requests
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
connectDB();


const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
