const nodemailer = require('nodemailer');
const config = require('../config');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.email_host,
    port: config.email_port,
    auth: {
      user: config.email_userName,
      pass: config.email_password,
    },
  });

  // Define email options
  const mailOptions = {
    from: 'Online event <test@eventonline.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
