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
  }]
  
}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
