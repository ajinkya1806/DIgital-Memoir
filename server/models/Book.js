// server/models/Book.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/, // Only lowercase letters, numbers, and hyphens
    },
    pin: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
BookSchema.index({ slug: 1 });
BookSchema.index({ createdAt: -1 });

// Helper method to generate a unique slug from title
BookSchema.statics.generateSlug = function (title) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50); // Limit length

  // If slug is empty after processing, use a random one
  if (!baseSlug) {
    return crypto.randomBytes(8).toString('hex');
  }

  return baseSlug;
};

// Helper method to ensure unique slug
BookSchema.statics.createUniqueSlug = async function (title) {
  let slug = this.generateSlug(title);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await this.findOne({ slug });
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${this.generateSlug(title)}-${counter}`;
      counter++;
    }
  }

  return slug;
};

module.exports = mongoose.model('Book', BookSchema);

