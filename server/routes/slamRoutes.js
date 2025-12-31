const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const slamController = require('../controllers/slamController');

// Configure Multer storage for this router
const upload = multer({ storage });

const router = express.Router();

// POST: Create a slam entry (audio + doodle are optional file inputs)
router.post(
  '/',
  upload.fields([{ name: 'audio' }, { name: 'doodle' }]),
  slamController.createEntry
);

// GET: Fetch all slam entries
router.get('/', slamController.getEntries);

module.exports = router;


