const express = require('express');
const bodyParser = require('body-parser');
const erdRoutes = require('./routes/erdRoutes');

const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use ERD routes
app.use('/api', erdRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
