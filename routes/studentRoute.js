const express = require('express');
// const { performance } = require('perf_hooks');
const Student = require('../models/studentModel'); // Adjust the path based on your project structure
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
// const mongoose = require('mongoose');
require('dotenv').config();


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
    // Extract student details from the request body
    const { rollNo, name, percentage, branch, subjectIds, yearSemIds, userId } = req.body;

    // Create the student record
    const newStudent = await Student.create({
      rollNo,
      name,
      percentage,
      branch,
      subjectIds,
      yearSemIds,
      user_id: userId, // Assign the user's ID to the student record
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add subjects to a student's record
router.post('/students/:rollNo/subjects', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { subjectId } = req.body;

    // Find the student by rollNo
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add the subjectId to the student's subjectIds array
    student.subjectIds.push(subjectId);

    // Save the updated student record
    await student.save();

    res.status(200).json({ message: 'Subject added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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
})
// Upload student profile image

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: AWS_REGION // Specify the AWS region where your S3 bucket is located
});

const s3 = new AWS.S3();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Route for uploading student profile image
router.put('/students/upload-image/:rollNo', upload.single('image'), async (req, res) => {
  try {
    console.log("call started");
    const { rollNo } = req.params;
    const student = await Student.findOne({ rollNo });
    console.log(rollNo);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if file data is provided
    if (!req.file) {
      console.log("file not found");
      return res.status(400).json({ error: 'File data not provided' });
    }
   
    const file = req.file; // Access the uploaded file

    // Configure parameters for uploading image to S3
    const params = {
      Bucket: 'collegeportal',
      Key: `${rollNo}-${Date.now()}-image.jpg`,
      Body: file.buffer, // Access the file buffer
      ACL: 'public-read'
    };

    // Upload image to S3
    const data = await s3.upload(params).promise();

    // Update the student's imageUrl with the S3 object URL
    student.imageUrl = data.Location;

    // Save the updated student record
    await student.save();

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add subjects to a student's record
router.post('/students/:rollNo/subjects', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { subjectId } = req.body;

    // Find the student by rollNo
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add the subjectId to the student's subjectIds array
    student.subjectIds.push(subjectId);

    // Save the updated student record
    await student.save();

    res.status(200).json({ message: 'Subject added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Delete student profile image
router.delete('/students/delete-image/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await Student.findOne({ rollNo });


//     if (!student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     if (student.imageUrl) {
//       // Delete image file
//       fs.unlinkSync(student.imageUrl);

//       // Reset imageUrl to default
//       student.imageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
//       await student.save();
//     }

//     res.status(200).json({ message: 'Image deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = router;