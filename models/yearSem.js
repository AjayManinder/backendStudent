// YearSem.js
const mongoose = require('mongoose');

const yearSemSchema = mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  sem: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
});

const YearSem = mongoose.model('YearSem', yearSemSchema);

module.exports = YearSem;
