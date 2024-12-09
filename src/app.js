const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { setupAvalancheNetwork } = require('./config/avalanche');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3005', 'http://localhost:3334'],  // Allow both ports
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Initialize Avalanche network connection
setupAvalancheNetwork();

// API Routes
app.use('/api', routes);

// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3334;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;