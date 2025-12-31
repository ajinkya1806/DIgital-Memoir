const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const bookController = require('../controllers/bookController');
const { verifyPin } = require('../middleware/auth');
const slamController = require('../controllers/slamController');

// Configure Multer storage for this router
const upload = multer({ storage });

const router = express.Router();

// POST: Create a new book
router.post('/', bookController.createBook);

// POST: Verify PIN for a book
router.post('/:slug/login', bookController.loginBook);

// GET: Get book info (public, no PIN required)
router.get('/:slug', bookController.getBook);

// GET: Get entry count for a book (public, no PIN required)
router.get('/:slug/count', bookController.getBookEntryCount);

// GET: Fetch entries for a specific book (protected by PIN)
router.get('/:slug/entries', verifyPin, slamController.getBookEntries);

// POST: Add a new entry to a specific book (public, no PIN required)
router.post(
  '/:slug/entries',
  upload.fields([{ name: 'audio' }, { name: 'doodle' }]),
  slamController.createBookEntry
);

module.exports = router;

