const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
  subID:{
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subjectCredits:{
    type: Number,
    default: 3,
    required: false,
  },
  description: String,
  topics: [String],
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
