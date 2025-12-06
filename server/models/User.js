
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: false // Changed to false for OAuth users
  },
  role: {
    type: String,
    enum: ['CLIENT', 'ADMIN', 'DELIVERY'],
    default: 'CLIENT'
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
