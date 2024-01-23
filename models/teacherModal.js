const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
  teacherID:{
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
});

const Subject = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
