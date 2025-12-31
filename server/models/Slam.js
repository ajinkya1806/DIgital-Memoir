// server/models/Slam.js
const mongoose = require('mongoose');

const SlamSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: false, // Optional for backward compatibility during migration
      index: true,
    },
    friendName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: 80,
      default: null,
    },
    // Personal & Emotional
    firstMemory: { type: String, trim: true, maxlength: 500, default: null },
    favouriteThing: { type: String, trim: true, maxlength: 500, default: null },
    oneWord: { type: String, trim: true, maxlength: 100, default: null },
    wish: { type: String, trim: true, maxlength: 300, default: null },
    bestMemory: { type: String, trim: true, maxlength: 500, default: null },
    whatMakesMeLaugh: { type: String, trim: true, maxlength: 500, default: null },
    // Favorites
    favoriteHero: { type: String, trim: true, maxlength: 100, default: null },
    favoriteSong: { type: String, trim: true, maxlength: 200, default: null },
    favoriteSinger: { type: String, trim: true, maxlength: 200, default: null },
    favoriteMovie: { type: String, trim: true, maxlength: 200, default: null },
    favoriteFood: { type: String, trim: true, maxlength: 100, default: null },
    favoriteColor: { type: String, trim: true, maxlength: 50, default: null },
    // Dreams & Future
    dreamDestination: { type: String, trim: true, maxlength: 200, default: null },
    futurePrediction: { type: String, trim: true, maxlength: 300, default: null },
    // Final message
    message: {
      type: String, // A note from my heart
      required: true,
      trim: true,
      maxlength: 1000,
    },
    audioUrl: {
      type: String, // Voice note URL from Cloudinary
      default: null,
    },
    doodleUrl: {
      type: String, // Signature/Drawing URL
      default: null,
    },
    profilePic: {
      type: String, // Optional future enhancement
      default: null,
    },
    layoutStyle: {
      type: String,
      default: 'classic', // To style pages differently later
    },
    mood: {
      type: String,
      enum: ['nostalgic', 'funny', 'heartfelt', 'adventurous', 'classic'],
      default: 'classic',
      required: false, // Make it optional for backward compatibility
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster sorting and potential future querying
SlamSchema.index({ bookId: 1, createdAt: -1 });
SlamSchema.index({ createdAt: -1 });
SlamSchema.index({ friendName: 1 });

module.exports = mongoose.model('SlamEntry', SlamSchema);