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

  // jwt
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  access_secret_expiresIn: process.env.ACCESS_SECRET_EXPIRES_IN,
  refresh_secret_expiresIn: process.env.REFRESH_SECRET_EXPIRES_IN,
  refresh_cookie_expiresIn: process.env.REFRESH_COOKIE_EXPIRES_IN,

  // nodeMailer
  email_userName: process.env.EMAIL_USERNAME,
  email_password: process.env.EMAIL_PASSWORD,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
};
