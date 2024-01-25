const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  user_id: {
    type: Number,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Use a regular expression to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  // roleIds: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Role',
  //   },
  // ]
   role_id: {
    type: Number, // Assuming user_id is a string in your User model
    ref: 'Role',
    required: true,
    unique: true, // Ensure uniqueness for user_id in Student table
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
