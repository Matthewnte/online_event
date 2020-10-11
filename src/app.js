const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Import modules and routes
const errorHandler = require('./middleware/errorHandler');
const eventRoute = require('./routes/eventRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const categoryRoute = require('./routes/categoryRoutes');

// initialize express server
const app = express();

// GLOBAL MIDDLE WARES
// Enable cors
app.use(cors());

// set secure http headers
app.use(helmet());

// parses incomming request to json object
app.use(express.json());

// Data sanitization against NoSql infection
app.use(mongoSanitize());

// Data sanitization against XSS attack
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'maxNumberOfAttendees',
    ],
  }),
);

// Limit amount of login tries
const limiter = rateLimit({
  max: 7,
  windowMs: 60 * 60 * 1000,
  message: {
    status: 'error',
    message: 'Too many failed attempts, please try again in 30 mins!',
  },
});
app.use('/api/v1/users/login', limiter);

// route entry
app.use('/api/v1/events', eventRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/categories', categoryRoute);

// handle all errors
app.use(errorHandler);

module.exports = app;
