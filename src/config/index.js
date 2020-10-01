const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️ Couldn't find .env file  ⚠️");
}

module.exports = {
  // your port
  port: parseInt(process.env.PORT, 10),

  // export your database credentials
  databaseURL: process.env.MONGODB_URI,
  db_password: process.env.DB_PASSWORD,

  jwt_secretKey: process.env.JWT_SECRET,
  jwt_expiresIn: process.env.JWT_EXPIRES_IN,
};
