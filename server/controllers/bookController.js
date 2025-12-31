// server/controllers/bookController.js
const Book = require('../models/Book');

// Helper to clean text
const cleanText = (value = '') => {
  const trimmed = String(value).trim();
  return trimmed.replace(/<\/?[^>]+(>|$)/g, '');
};

// Create a new book
exports.createBook = async (req, res, next) => {
  try {
    const rawTitle = req.body.title;
    const rawPin = req.body.pin;

    const title = cleanText(rawTitle);
    const pin = String(rawPin || '').trim();

    if (!title || !pin) {
      return res.status(400).json({
        error: 'Both title and PIN are required.',
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        error: 'Title is too long. Keep it under 100 characters.',
      });
    }

    if (pin.length < 4 || pin.length > 20) {
      return res.status(400).json({
        error: 'PIN must be between 4 and 20 characters.',
      });
    }

    // Generate unique slug
    const slug = await Book.createUniqueSlug(title);

    const newBook = new Book({
      title,
      slug,
      pin, // In production, this should be hashed with bcrypt
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      _id: savedBook._id,
      title: savedBook.title,
      slug: savedBook.slug,
      createdAt: savedBook.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (slug)
      return res.status(409).json({
        error: 'A book with this title already exists. Please try a different title.',
      });
    }
    next(error);
  }
};

// Verify PIN for a book
exports.loginBook = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        error: 'PIN is required.',
      });
    }

    const book = await Book.findOne({ slug });

    if (!book) {
      return res.status(404).json({
        error: 'Book not found.',
      });
    }

    // Simple PIN comparison (in production, use bcrypt.compare)
    if (book.pin !== pin.trim()) {
      return res.status(401).json({
        error: 'Invalid PIN.',
      });
    }

    res.status(200).json({
      success: true,
      book: {
        _id: book._id,
        title: book.title,
        slug: book.slug,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get book by slug (for verification)
exports.getBook = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const book = await Book.findOne({ slug }).select('-pin'); // Don't return PIN

    if (!book) {
      return res.status(404).json({
        error: 'Book not found.',
      });
    }

    res.status(200).json({
      _id: book._id,
      title: book.title,
      slug: book.slug,
      createdAt: book.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// Get entry count for a book (public, no PIN required)
exports.getBookEntryCount = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const SlamEntry = require('../models/Slam.js');

    const book = await Book.findOne({ slug });
    if (!book) {
      return res.status(404).json({
        error: 'Book not found.',
      });
    }

    const count = await SlamEntry.countDocuments({ bookId: book._id });

    res.status(200).json({
      count,
      slug: book.slug,
    });
  } catch (error) {
    next(error);
  }
};

