const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: { type: String, required: 'First name is required' },
  lastName: { type: String, required: 'Last name is required' },
  email: { type: String, required: 'Email name is required', unique: true },
  password: { type: String, required: 'Password name is required' },
});

module.exports = mongoose.model('User', userSchema);
