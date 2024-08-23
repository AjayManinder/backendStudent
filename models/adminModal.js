const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  admin_id: {
    type: Number,
    required: true,
   unique: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;