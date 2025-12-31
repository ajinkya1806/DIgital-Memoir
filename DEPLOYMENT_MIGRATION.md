# 🚀 Deployment Guide for Multi-Book Migration

This guide covers the steps needed to deploy the new multi-book version when you already have the previous single-book version deployed on AWS and Vercel.

## ⚠️ Critical: Database Migration Required

The new version requires a `bookId` field on all Slam entries. Existing entries won't have this field, which will cause issues. **You MUST run the migration script after deployment.**

## 📋 Pre-Deployment Checklist

### 1. Environment Variables (No Changes Needed)

Your existing environment variables should work as-is:

**Backend (AWS):**
- `MONGO_URI` - Same as before
- `PORT` - Same as before
- `CLOUDINARY_CLOUD_NAME` - Same as before
- `CLOUDINARY_API_KEY` - Same as before
- `CLOUDINARY_API_SECRET` - Same as before
- `CLIENT_ORIGIN` - Should be your Vercel frontend URL

**Frontend (Vercel):**
- `VITE_API_URL` - Should be your AWS backend URL

**✅ No new environment variables needed!**

### 2. Code Changes Summary

The following files have been added/modified:
- ✅ New: `server/models/Book.js` - Book model
- ✅ New: `server/controllers/bookController.js` - Book controller
- ✅ New: `server/routes/bookRoutes.js` - Book routes
- ✅ New: `server/middleware/auth.js` - PIN authentication
- ✅ Modified: `server/models/Slam.js` - Added bookId field
- ✅ Modified: `server/controllers/slamController.js` - Added book-specific functions
- ✅ Modified: `server/index.js` - Added book routes
- ✅ New: `client/src/pages/Landing.jsx` - Landing page
- ✅ New: `client/src/pages/CreateBook.jsx` - Create book page
- ✅ Modified: `client/src/pages/FillSlam.jsx` - Uses slug from URL
- ✅ Modified: `client/src/pages/ViewBook.jsx` - Uses slug and PIN auth
- ✅ Modified: `client/src/App.jsx` - New routes
- ✅ Modified: `client/src/components/EntryCounter.jsx` - Uses slug

## 🔄 Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Refactor to support multiple Slambooks"
git push origin main
```

### Step 2: Deploy Backend (AWS)

Your AWS deployment should automatically pick up the changes if it's connected to GitHub. If not:

1. **If using AWS Elastic Beanstalk:**
   - Go to your Elastic Beanstalk console
   - Click "Upload and Deploy"
   - Or wait for automatic deployment if connected to GitHub

2. **If using AWS EC2/other:**
   - SSH into your server
   - Pull the latest code: `git pull origin main`
   - Install dependencies: `cd server && npm install`
   - Restart your server (PM2, systemd, etc.)

3. **Verify backend is running:**
   ```bash
   curl https://your-backend-url/api/health
   ```

### Step 3: Deploy Frontend (Vercel)

Vercel should automatically deploy when you push to GitHub. If not:

1. Go to your Vercel dashboard
2. Find your project
3. Click "Redeploy" or wait for automatic deployment

### Step 4: Run Database Migration ⚠️ CRITICAL

**This is the most important step!** You must migrate existing entries to work with the new system.

#### Option A: Run Migration Script Locally (Recommended)

1. **Clone the repo locally** (if you don't have it):
   ```bash
   git clone <your-repo-url>
   cd SlamBook
   ```

2. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Create/update `.env` file** with your production MongoDB URI:
   ```env
   MONGO_URI=your-production-mongodb-uri
   ```

4. **Run the migration script:**
   ```bash
   node scripts/migrate-to-multi-book.js
   ```

5. **Verify migration:**
   - The script will create a default book with slug `default-book`
   - All existing entries will be assigned to this book
   - Default PIN is `1234` (users should change this)

#### Option B: Run Migration via AWS (If you have SSH access)

1. SSH into your AWS instance
2. Navigate to your server directory
3. Run: `node scripts/migrate-to-multi-book.js`

#### Option C: Run Migration via MongoDB Shell/Compass

If you prefer to run it manually:

1. Connect to your MongoDB database
2. Create a default book:
   ```javascript
   db.books.insertOne({
     title: "My Memories",
     slug: "default-book",
     pin: "1234",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

3. Get the book ID and update all entries:
   ```javascript
   const book = db.books.findOne({ slug: "default-book" })
   db.slamentries.updateMany(
     { bookId: { $exists: false } },
     { $set: { bookId: book._id } }
   )
   ```

### Step 5: Test the Deployment

1. **Test Landing Page:**
   - Visit your Vercel URL
   - Should show the new landing page with "Create a Slambook" and "Enter a Link" options

2. **Test Creating a Book:**
   - Click "Create a Slambook"
   - Enter a title and PIN
   - Verify you get a shareable link

3. **Test Viewing Default Book (with migrated entries):**
   - Visit: `https://your-vercel-url/view/default-book`
   - Enter PIN: `1234`
   - Should show all your existing entries

4. **Test Adding Entry:**
   - Visit: `https://your-vercel-url/fill/default-book`
   - Fill out the form and submit
   - Verify it works

## 🔧 Post-Deployment Configuration

### Update Default Book PIN (Important!)

The migration script creates a default book with PIN `1234`. For security:

1. **Option 1:** Create a new book and manually migrate entries
2. **Option 2:** Update the default book PIN via MongoDB:
   ```javascript
   db.books.updateOne(
     { slug: "default-book" },
     { $set: { pin: "your-secure-pin" } }
   )
   ```

### Inform Existing Users

If you have existing users, you should:

1. **Create a migration guide** for them
2. **Share the default book link:**
   - View: `https://your-vercel-url/view/default-book` (PIN: 1234)
   - Fill: `https://your-vercel-url/fill/default-book`
3. **Encourage them to create new books** for better organization

## 🐛 Troubleshooting

### Issue: "Book not found" errors

**Solution:** Run the migration script. Existing entries need a bookId.

### Issue: Old entries not showing

**Solution:** 
1. Verify migration ran successfully
2. Check that entries have `bookId` field in MongoDB
3. Use the default book link: `/view/default-book` with PIN `1234`

### Issue: Can't create new entries

**Solution:**
1. Verify the book exists in database
2. Check that the slug in URL matches the book slug
3. Verify API endpoint: `POST /api/books/:slug/entries`

### Issue: PIN authentication not working

**Solution:**
1. Verify PIN is correct (case-sensitive)
2. Check that `X-Book-PIN` header is being sent
3. Verify the book exists in database

## 📝 Rollback Plan (If Needed)

If something goes wrong and you need to rollback:

1. **Revert code:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Restore database** (if you made changes):
   - The migration script only adds `bookId` fields
   - You can remove them if needed: `db.slamentries.updateMany({}, { $unset: { bookId: "" } })`

3. **Redeploy** both frontend and backend

## ✅ Verification Checklist

After deployment, verify:

- [ ] Landing page loads correctly
- [ ] Can create a new book
- [ ] Can view default book with migrated entries (PIN: 1234)
- [ ] Can add new entries to a book
- [ ] PIN authentication works
- [ ] Old entries are accessible via default book
- [ ] No console errors in browser
- [ ] API endpoints respond correctly

## 🎉 Success!

Once all steps are complete, your app now supports:
- ✅ Multiple independent Slambooks
- ✅ Unique URLs per book
- ✅ PIN-protected viewing
- ✅ Public entry submission
- ✅ Backward compatibility with existing entries

