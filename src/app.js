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

// Enable full request logging
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('files', (req) => req.files ? JSON.stringify(req.files) : 'no files');
app.use(morgan(':method :url :status :body :files - :response-time ms'));

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for test uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Initialize Avalanche network connection
setupAvalancheNetwork();

// Test upload endpoint (no auth required)
app.post('/test-upload', upload.single('file'), async (req, res) => {
  console.log('Received upload request:', {
    body: req.body,
    file: req.file,
    headers: req.headers
  });

  try {
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ 
        success: false,
        error: 'No file provided' 
      });
    }

    console.log('Processing file:', req.file.originalname);
    const result = await uploadToIPFS(req.file);
    console.log('IPFS upload result:', result);

    res.json({
      success: true,
      cid: result.cid,
      url: result.url
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
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

// Serve static files
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

// The "catch-all" handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test upload page available at: http://localhost:${PORT}/test-upload`);
});

module.exports = app;