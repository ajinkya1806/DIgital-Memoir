# ⚡ Quick Deployment Checklist

## Before Pushing to GitHub

- [x] All code changes committed
- [x] Migration script created (`server/scripts/migrate-to-multi-book.js`)
- [x] `bookId` field made optional for backward compatibility

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add multi-book support"
git push origin main
```

### 2. Wait for Auto-Deploy
- **Vercel**: Will auto-deploy frontend (usually 1-2 minutes)
- **AWS**: Will auto-deploy backend if connected to GitHub (or deploy manually)

### 3. Run Migration Script ⚠️ CRITICAL

**Option A: Local Machine (Recommended)**
```bash
cd server
# Make sure .env has your production MONGO_URI
npm run migrate
```

**Option B: AWS Server (if you have SSH)**
```bash
ssh your-aws-server
cd /path/to/server
npm run migrate
```

**Option C: MongoDB Compass/Shell**
See `DEPLOYMENT_MIGRATION.md` for manual steps

### 4. Test

1. Visit your Vercel URL → Should see new landing page
2. Test default book: `/view/default-book` (PIN: `1234`)
3. Create a new book and test it

## ⚠️ Important Notes

1. **Migration is REQUIRED** - Existing entries won't work without it
2. **Default book PIN is `1234`** - Change it after migration
3. **Old entries** are accessible at `/view/default-book`
4. **No new env variables** needed - same as before

## If Something Breaks

1. Check migration ran successfully
2. Verify entries have `bookId` in MongoDB
3. Check server logs for errors
4. See `DEPLOYMENT_MIGRATION.md` for detailed troubleshooting

## Success Indicators

✅ Landing page loads  
✅ Can create new books  
✅ Default book shows old entries  
✅ Can add new entries  
✅ PIN authentication works  

