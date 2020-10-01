const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: 'First name is required' },
  lastName: { type: String, required: 'Last name is required' },
  email: {
    type: String,
    required: 'Email is required',
    unique: true,
    lowercase: true,
    validate: [validate.isEmail, 'Please enter a valid email'],
  },
  role: { type: String, enum: ['user', 'admin', 'host'], default: 'user' },
  photo: String,
  password: {
    type: String,
    required: 'Password name is required',
    minlength: [8, 'Password must be atleast 8 characters'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: 'Please confirm your password',
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();

  // hash pass with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete confirmPassword field
  this.confirmPassword = undefined;
  return next();
});

userSchema.methods.checkPassword = async function (password, userPassword) {
  const isCorrectPassword = await bcrypt.compare(password, userPassword);
  return isCorrectPassword;
};

userSchema.methods.hasChangePassword = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
