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
  description: String,
  topics: [String],
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
