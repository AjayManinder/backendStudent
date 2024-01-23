const express = require('express');
const Teacher = require('./models/teacherModel');

const router = express.Router();

// Create a new subject
router.post('/teachers', async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all subjects
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a subject by ID
router.get('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});