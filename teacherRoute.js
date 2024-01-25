const express = require('express');
const Teacher = require('./models/teacherModel');

const router = express.Router();

// Create a new teacher
router.post('/teachers', async (req, res) => {
  try {
    const { teacherID, teacherName, subjectIds, role_id } = req.body;

    // Ensure required properties are provided
    if (!teacherID || !teacherName || !subjectIds || !role_id) {
      return res.status(400).json({ message: 'Please provide teacherID, teacherName, subjectIds, and role_id' });
    }

    const newTeacher = await Teacher.create({
      teacherID,
      teacherName,
      subjectIds,
      role_id,
    });

    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a teacher by ID
router.get('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a teacher by ID
router.put('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a teacher by ID
router.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
