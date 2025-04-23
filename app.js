const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const cors = require('cors');
const testRoutes = require('../routes/test');

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(morgan('dev')); // Request logging
app.use(cors()); // Enable CORS
app.use('/api/test', testRoutes);

// DB Config
const db = config.get('mongoURI');

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

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