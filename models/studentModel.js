// Student.js
const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  rollNo: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  percentage: Number,
  branch: String,
  subjectIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
  yearSemIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YearSem',
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Assuming user_id is a string in your User model
    ref: 'User',
    // Ensure uniqueness for user_id in Student table
  },
}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
