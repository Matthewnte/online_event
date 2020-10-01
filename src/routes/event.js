const express = require('express');

const router = express.Router();

const eventController = require('../controllers/event');

router.route('/').post(eventController.createEvent);

module.exports = router;
