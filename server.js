const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

// Import API routes from routes/api/index.js
const apiRoutes = require('./routes/api');

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the API routes under '/api'
app.use('/api', apiRoutes);

// Handling unmatched routes
app.use((req, res) => {
    res.status(404).send('Route not found!');
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/flexisocialDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log error information for debugging
  if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
  }
  if (err.status === 404) {
      return res.status(404).json({ error: err.message });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});
