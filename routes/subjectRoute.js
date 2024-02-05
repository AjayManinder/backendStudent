const express = require('express');
const Subject = require('../models/subjectModel');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: API endpoints for managing Subjects
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       properties:
 *         subID:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         topics:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - subID
 *         - name
 */

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new Subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 */


// Create a new subject
router.post('/subjects', async (req, res) => {
  try {
    const newSubject = await Subject.create(req.body);
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all Subjects
 *     tags: [Subjects]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 */


// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a subject by ID
router.get('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a subject by ID
router.put('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a subject by ID
router.delete('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(deletedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
