const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { setupAvalancheNetwork } = require('./config/avalanche');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // React dev server
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Initialize Avalanche network connection
setupAvalancheNetwork();

// Routes
app.use('/api', routes);

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