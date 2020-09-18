const mongoose = require('mongoose');

const config = require('../config');

// replace password with placeholder with database password
const DB = config.databaseURL.replace('<PASSWORD>', config.db_password);

// Connect mongo database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));
