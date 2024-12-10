const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const connectDB = require('./config/database');
const { setupAvalancheNetwork } = require('./config/avalanche');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Enable full request logging
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('files', (req) => req.files ? JSON.stringify(req.files) : 'no files');
app.use(morgan(':method :url :status :body :files - :response-time ms'));

// Basic middleware
app.use(cors());
app.use(helmet());
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
});

module.exports = app;