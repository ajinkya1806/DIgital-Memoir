# 📖 Digital Slam Book

A nostalgic, emotionally engaging digital slam book where friends can create, share, and fill memory entries with text, doodles, and voice notes.

## ✨ Features

- **Rich Entry Forms**: Multiple thoughtful prompts (first memory, favorite thing, wishes, etc.)
- **Entry Counter**: Shows "You're the Xth person to sign!" for excitement
- **Mood Selector**: Choose entry mood (Nostalgic, Funny, Heartfelt, Adventurous, Classic)
- **Preview Before Submit**: Beautiful preview modal with envelope seal effect
- **Page Flip Sounds**: Subtle nostalgic sounds when flipping pages
- **Entry Reactions**: React to entries with emojis (❤️, 😂, 😢, 🔥, ✨)
- **Voice Notes**: Record audio messages
- **Doodles**: Draw signatures and doodles
- **Flipbook View**: Beautiful flipbook interface to view all entries

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **File Storage**: Cloudinary

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier works)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd memoir-app
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/memoir-app
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:5173
```

**Get Cloudinary Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. Go to Dashboard → Settings → Account Details
3. Copy your Cloud Name, API Key, and API Secret

**MongoDB Setup:**
- **Option 1 (Local)**: Install MongoDB locally and run it
- **Option 2 (Atlas)**: Use MongoDB Atlas (free tier) and use the connection string

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_URL=http://localhost:5000
```

If you don't create this file, it defaults to `http://localhost:5000`.

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

### 5. Open in Browser

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
memoir-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utilities (API, sounds)
│   └── package.json
├── server/                  # Express backend
│   ├── config/              # Configuration (Cloudinary)
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utilities (logger)
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend (`server/`)

- `npm start` - Start the server
- `npm test` - Run tests (placeholder)

### Frontend (`client/`)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `GET /api/slam` - Get all slam entries
- `POST /api/slam` - Create a new slam entry
  - Body: `friendName`, `message`, `mood` (optional)
  - Files: `doodle` (image), `audio` (audio file)

## 🎨 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 5000) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `CLIENT_ORIGIN` | Frontend URL (default: *) | No |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000) | No |

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod` or MongoDB Atlas is accessible
- Check connection string format
- Verify network/firewall settings

### Cloudinary Upload Issues

- Verify API credentials in `.env`
- Check file size limits (Cloudinary free tier: 10MB)
- Ensure correct folder permissions

### Port Already in Use

- Change `PORT` in server `.env`
- Update `VITE_API_URL` in client `.env` if changed

### CORS Errors

- Ensure `CLIENT_ORIGIN` in server `.env` matches frontend URL
- Check browser console for specific CORS errors

## 📝 Development Notes

- Backend runs on port 5000 by default
- Frontend runs on port 5173 (Vite default)
- Hot reload enabled for both frontend and backend (with nodemon)
- MongoDB indexes are automatically created on first run

## 🚀 Deployment

### Quick Deploy (Recommended)

**Full step-by-step guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)  
**Quick reference**: See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### Recommended Setup

- **Frontend**: Deploy to [Vercel](https://vercel.com) (Free tier, instant deployments)
- **Backend**: Deploy to [Render](https://render.com) (Free tier, auto-scaling)

### Quick Steps

1. **Backend (Render)**:
   - Connect GitHub repo
   - Root Directory: `server`
   - Set environment variables (see [DEPLOYMENT.md](./DEPLOYMENT.md))
   - Deploy!

2. **Frontend (Vercel)**:
   - Connect GitHub repo
   - Root Directory: `client`
   - Set `VITE_API_URL` environment variable
   - Deploy!

3. **Update CORS**: Set `CLIENT_ORIGIN` in Render to your Vercel URL

### Configuration Files

- `client/vercel.json` - Vercel deployment config (already included)
- `server/render.yaml` - Render deployment config (already included)

### Environment Variables

See `.env.example` files in `client/` and `server/` directories for reference.

📖 **For detailed instructions, troubleshooting, and tips, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📄 License

ISC

## 🙏 Acknowledgments

Built with ❤️ for preserving memories and friendships.

