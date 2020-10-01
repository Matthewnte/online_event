const express = require('express');

// Import modules and routes
const errorHandler = require('./middleware/errorHandler');
const eventRoute = require('./routes/eventRoutes');
const userRoute = require('./routes/userRoutes');

// initialize express server
const app = express();

// parses incomming request to json object
app.use(express.json());

// route entry
app.use('/api/v1/events', eventRoute);
app.use('/api/v1/users', userRoute);

// handle all errors
app.use(errorHandler);

module.exports = app;
