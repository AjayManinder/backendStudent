const express = require('express');
const { performance } = require('perf_hooks');
const Student = require('../models/studentModel'); // Adjust the path based on your project structure
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API endpoints for managing Students
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         rollNo:
 *           type: number
 *         name:
 *           type: string
 *         percentage:
 *           type: number
 *         branch:
 *           type: string
 *         subjectIds:
 *           type: array
 *           items:
 *             type: string
 *         yearSemIds:
 *           type: array
 *           items:
 *             type: string
 *         user_id:
 *           type: string
 *       required:
 *         - rollNo
 *         - name
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new Student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

// Create a new student
router.post('/students', async (req, res) => {
  try {
     // Start measuring time
     const startTime = performance.now();
    const { subjectIds, yearSemIds, user_id, ...studentData } = req.body;
     // Log user information
     console.log(`User ID: ${user_id}, Request received at: ${new Date().toISOString()}`);

    const newStudent = await Student.create({
      ...studentData,
      subjectIds: subjectIds.map(subjectId => new mongoose.Types.ObjectId(subjectId)),
      yearSemIds: yearSemIds.map(yearSemId => new mongoose.Types.ObjectId(yearSemId)),
      user_id,
    });

       // Stop measuring time
       const stopTime = performance.now();

       // Calculate the time taken
       const timeTaken = stopTime - startTime;
   
       // Log time taken
       console.log(`Time taken: ${timeTaken} milliseconds`);
   
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all Students
 *     tags: [Students]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */


// Get all students with population
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({})
      .populate('subjectIds')
      .populate('yearSemIds')
      .populate({
        path: 'user_id',
        populate: {
          path: 'role_id',
          model: 'Role',
        },
      })
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get('/students', async (req, res) => {
//   try {
//     const students = await Student.find({})
//       .populate('subjectIds')
//       .populate('yearSemIds')
//       .populate({
//         path: 'user_id',
//         select: 'name email', // specify the fields you want to populate
//         populate: {
//           path: 'role_id',
//           model: 'Role',
//         },
//       });
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// Get a student by rollNo with population
router.get('/students/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await Student.findOne({ rollNo })
      .populate('subjectIds')
      .populate('yearSemIds')
      .populate({
        path: 'user_id',
        populate: {
          path: 'role_id',
          model: 'Role',
        },
      })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update a student by rollNo with population
router.put('/students/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const updatedStudent = await Student.findOneAndUpdate({ rollNo }, req.body, { new: true })
      .populate('subjectIds')
      .populate('yearSemIds')
      .populate({
        path: 'user_id',
        populate: {
          path: 'role_id',
          model: 'Role',
        },
      })

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete a student by Roll No
router.delete('/students/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ rollNo });
    
    if (!deletedStudent) {
      return res.status(404).json({ message: `Cannot find any student with rollNo ${rollNo}` });
    }

    res.status(200).json(deletedStudent); // <-- Corrected line
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;