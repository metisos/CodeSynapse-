#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const cwd = process.cwd();

// Get the package root directory
const packageRoot = path.join(__dirname, '..');
const serverPath = path.join(packageRoot, 'server', 'dist', 'index.js');

// Check if server dist exists
if (!fs.existsSync(serverPath)) {
  console.error('Error: CodeSynapse server not built. Please run: npm install -g codesynapse');
  process.exit(1);
}

// Parse command line arguments
const port = args.includes('--port') ? args[args.indexOf('--port') + 1] : '3000';
const openBrowser = !args.includes('--no-open');

console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║           CodeSynapse v1.0.0             ║
║   Real-time Codebase Visualization       ║
║                                          ║
╚══════════════════════════════════════════╝

Starting server...
Project: ${cwd}
Port: ${port}
URL: http://localhost:${port}
`);

// Set environment variables
const env = {
  ...process.env,
  PORT: port,
  NODE_ENV: 'production'
};

// Start the server
const server = spawn('node', [serverPath], {
  cwd: packageRoot,
  env,
  stdio: 'inherit'
});

// Open browser after a short delay
if (openBrowser) {
  setTimeout(() => {
    const open = require('open');
    open(`http://localhost:${port}`).catch(() => {
      console.log('\nOpen your browser and navigate to:', `http://localhost:${port}`);
    });
  }, 2000);
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\nShutting down CodeSynapse...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Server exited with code ${code}`);
    process.exit(code);
  }
});
