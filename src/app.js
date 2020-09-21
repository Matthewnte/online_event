const express = require('express');

// Import routes
const eventRoute = require('./routes/event');

// initialize express server
const app = express();

// parses incomming request to json object
app.use(express.json());

// entry to event route
app.use('/api/v1/events', eventRoute);

module.exports = app;
