# Digital Slam Book Setup Script
# Run this script to set up the project

Write-Host "🚀 Setting up Digital Slam Book..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location server
if (Test-Path "node_modules") {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Create backend .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    @"
MONGO_URI=mongodb://localhost:27017/memoir-app
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created server/.env file" -ForegroundColor Green
    Write-Host "⚠️  Please update server/.env with your Cloudinary credentials and MongoDB URI" -ForegroundColor Yellow
} else {
    Write-Host "✅ Backend .env file already exists" -ForegroundColor Green
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../client
if (Test-Path "node_modules") {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Create frontend .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created client/.env file" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env file already exists" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update server/.env with your Cloudinary credentials and MongoDB URI" -ForegroundColor White
Write-Host "2. Start backend: cd server && npm start" -ForegroundColor White
Write-Host "3. Start frontend: cd client && npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""

