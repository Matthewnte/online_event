const app = require('./src/app');
const config = require('./src/config');

// connect mongoDB
require('./src/db/mongoose');

// listen for request on port
app.listen(config.port, () => console.log(`Server listening on port: ${config.port}`));
