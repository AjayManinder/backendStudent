const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
  role_id: {
    type: Number,
    required: true,
   unique: true,
  },
  roleName: {
    type: String,
    required: true,
  }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
