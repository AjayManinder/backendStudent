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
   user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
