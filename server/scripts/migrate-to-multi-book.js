// Migration script to convert existing single-book setup to multi-book
// Run this ONCE after deploying the new code to migrate existing data

const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('../models/Book');
const SlamEntry = require('../models/Slam');

async function migrate() {
  try {
    console.log('🔄 Starting migration to multi-book system...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Check if there are any entries without bookId
    const entriesWithoutBook = await SlamEntry.countDocuments({
      $or: [{ bookId: { $exists: false } }, { bookId: null }],
    });

    if (entriesWithoutBook === 0) {
      console.log('✅ No migration needed - all entries already have bookId');
      await mongoose.connection.close();
      return;
    }

    console.log(`📊 Found ${entriesWithoutBook} entries without bookId\n`);

    // Check if default book already exists
    let defaultBook = await Book.findOne({ slug: 'default-book' });

    if (!defaultBook) {
      console.log('📝 Creating default book for existing entries...');
      defaultBook = new Book({
        title: 'My Memories',
        slug: 'default-book',
        pin: '1234', // Default PIN - users should change this
      });
      await defaultBook.save();
      console.log('✅ Default book created\n');
      console.log('⚠️  IMPORTANT: Default book PIN is "1234"');
      console.log('   Users should create a new book and migrate their entries.\n');
    } else {
      console.log('✅ Default book already exists\n');
    }

    // Update all entries without bookId to use the default book
    console.log('🔄 Updating entries...');
    const result = await SlamEntry.updateMany(
      {
        $or: [{ bookId: { $exists: false } }, { bookId: null }],
      },
      {
        $set: { bookId: defaultBook._id },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} entries\n`);

    // Verify migration
    const remaining = await SlamEntry.countDocuments({
      $or: [{ bookId: { $exists: false } }, { bookId: null }],
    });

    if (remaining === 0) {
      console.log('✅ Migration completed successfully!');
      console.log('\n📋 Summary:');
      console.log(`   - Default book created: ${defaultBook.slug}`);
      console.log(`   - Entries migrated: ${result.modifiedCount}`);
      console.log('\n🔗 Access your default book at:');
      console.log(`   View: /view/${defaultBook.slug} (PIN: 1234)`);
      console.log(`   Fill: /fill/${defaultBook.slug}`);
    } else {
      console.log(`⚠️  Warning: ${remaining} entries still without bookId`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Migration script completed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrate();

