// Handle Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./src/app');
const config = require('./src/config');

// connect mongoDB
require('./src/db/mongoose');

// listen for request on port
const server = app.listen(config.port, () => console.log(`Server listening on port: ${config.port}`));

// Handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
