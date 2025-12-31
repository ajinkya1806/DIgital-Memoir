// server/config/cloudinary.js
const cloudinaryLib = require('cloudinary');
const cloudinary = cloudinaryLib.v2;
const cloudinaryStorage = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer-storage-cloudinary expects the full cloudinary object (with v2 property)
// Pass the full cloudinaryLib, not just cloudinary.v2
const storage = cloudinaryStorage({
  cloudinary: cloudinaryLib, // Pass the full object, not just v2
  params: {
    folder: 'memoir-slam-book',
    resource_type: 'auto', // Allows audio and images
  },
});

module.exports = { cloudinary, storage };