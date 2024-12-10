const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const { setupAvalancheNetwork } = require('./config/avalanche');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile.routes');

const app = express();

// Enable full request logging
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('files', (req) => req.files ? JSON.stringify(req.files) : 'no files');
app.use(morgan(':method :url :status :body :files - :response-time ms'));

// Basic middleware
app.use(cors());

// Configure Helmet with necessary adjustments for React
app.use(helmet({
  contentSecurityPolicy: false,  // Disable CSP for development
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Avalanche network connection
setupAvalancheNetwork();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', routes);

// Verify build directory exists
const buildPath = path.join(__dirname, 'client/build');
if (!fs.existsSync(buildPath)) {
  console.error('Build directory not found:', buildPath);
  console.error('Please run: cd src/client && npm run build');
  process.exit(1);
}

// Serve static files from the React app
app.use(express.static(buildPath));

// Remove public directory serving as it's not needed
// app.use(express.static(path.join(__dirname, 'client/public')));

// The "catch-all" handler: for any request that doesn't
// match one of the above, send back React's index.html file.
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found:', indexPath);
    return res.status(500).send('Application build not found');
  }
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    details: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3334;

// Kill any existing process on the port
const killExistingProcess = () => {
  try {
    const execSync = require('child_process').execSync;
    execSync(`lsof -ti :${PORT} | xargs kill -9`);
  } catch (e) {
    // No process was running on the port
  }
};

// Start the server
killExistingProcess();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Build directory: ${buildPath}`);
  console.log('Make sure to rebuild client with: cd src/client && npm run build');
});

module.exports = app;