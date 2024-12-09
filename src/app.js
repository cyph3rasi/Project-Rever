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
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Initialize Avalanche network connection
setupAvalancheNetwork();

// API Routes
app.use('/api', routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catch-all" handler: for any request that doesn't
// match an API route, send back the React app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

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