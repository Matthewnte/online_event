const express = require('express');

// Import modules and routes
// const AppError = require('./utils/appError');
const errorHandler = require('./middleware/errorHandler');
const eventRoute = require('./routes/event');

// initialize express server
const app = express();

// parses incomming request to json object
app.use(express.json());

// entry to event route
app.use('/api/v1/events', eventRoute);

// handle all errors
app.use(errorHandler);

module.exports = app;
