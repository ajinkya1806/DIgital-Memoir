// Helper script to start server with better error handling
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Digital Slam Book Server...\n');

const server = spawn('node', ['index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Server exited with code ${code}`);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check MongoDB connection');
    console.log('2. Verify Cloudinary credentials in .env');
    console.log('3. Check if port 5000 is available');
    process.exit(code);
  }
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

