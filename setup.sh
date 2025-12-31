#!/bin/bash

# Digital Slam Book Setup Script
# Run this script to set up the project

echo "🚀 Setting up Digital Slam Book..."
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version) found"
else
    echo "❌ Node.js not found. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd server
if [ -d "node_modules" ]; then
    echo "✅ Backend dependencies already installed"
else
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
fi

# Create backend .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating backend .env file..."
    cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/memoir-app
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:5173
EOF
    echo "✅ Created server/.env file"
    echo "⚠️  Please update server/.env with your Cloudinary credentials and MongoDB URI"
else
    echo "✅ Backend .env file already exists"
fi

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd ../client
if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies already installed"
else
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed"
    else
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
fi

# Create frontend .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000" > .env
    echo "✅ Created client/.env file"
else
    echo "✅ Frontend .env file already exists"
fi

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your Cloudinary credentials and MongoDB URI"
echo "2. Start backend: cd server && npm start"
echo "3. Start frontend: cd client && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""

