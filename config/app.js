const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const cors = require('cors');
const testRoutes = require('./routes/test');

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(morgan('dev')); // Request logging
app.use(cors()); // Enable CORS
app.use('/api/test', testRoutes);

// DB Config
const db = config.get('mongoURI');

// Connect to MongoDB with options and reconnection logic
const connectWithRetry = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      console.log('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Mongoose connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close mongoose connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Blog API Running');
});

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
