// server/middleware/auth.js
const Book = require('../models/Book');

// Middleware to verify PIN for protected routes
exports.verifyPin = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pin = req.headers['x-book-pin'] || req.body.pin;

    if (!pin) {
      return res.status(401).json({
        error: 'PIN is required. Please provide it in the X-Book-PIN header or request body.',
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

    // Attach book to request for use in controllers
    req.book = book;
    next();
  } catch (error) {
    next(error);
  }
};

