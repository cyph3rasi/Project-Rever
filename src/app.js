const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const { setupAvalancheNetwork } = require('./config/avalanche');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const { uploadToIPFS } = require('./config/ipfs');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

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

// Configure multer for test uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Test upload endpoint (no auth required)
app.post('/test-upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Test upload received:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadToIPFS(req.file);
    console.log('IPFS upload result:', result);

    res.json({
      success: true,
      cid: result.cid,
      url: result.url
    });
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file to IPFS',
      details: error.message 
    });
  }
});

// Serve test upload page
app.get('/test-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/test-upload.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

// The "catch-all" handler: for any request that doesn't
// match one of the above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = require('http').createServer();
    
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Start server with port fallback
const startServer = async () => {
  try {
    const startPort = process.env.PORT || 3334;
    const port = await findAvailablePort(startPort);
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Test upload page available at: http://localhost:${port}/test-upload`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;