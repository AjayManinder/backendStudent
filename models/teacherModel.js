const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
  teacherID: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  subjectIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
  // roleIds: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //   },],

  role_id: {
    type: Number, // Assuming user_id is a string in your User model
    ref: 'Role',
    required: true,
    unique: true, // Ensure uniqueness for user_id in Student table
  },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
