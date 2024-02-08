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
   role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Reference to the 'Role' model
    unique: false,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
