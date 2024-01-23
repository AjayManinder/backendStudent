const express = require('express');
const YearSem = require('./models/yearSem'); // Update the path accordingly

const router = express.Router();

// Create a new YearSem record
router.post('/yearsem', async (req, res) => {
  try {
    const newYearSem = await YearSem.create(req.body);
    res.status(201).json(newYearSem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all YearSem records
router.get('/yearsem', async (req, res) => {
  try {
    const yearSemData = await YearSem.find({});
    res.status(200).json(yearSemData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a YearSem record by ID
router.get('/yearsem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const yearSem = await YearSem.findById(id);

    if (!yearSem) {
      return res.status(404).json({ message: 'YearSem not found' });
    }

    res.status(200).json(yearSem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a YearSem record by ID
router.put('/yearsem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedYearSem = await YearSem.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedYearSem) {
      return res.status(404).json({ message: 'YearSem not found' });
    }

    res.status(200).json(updatedYearSem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a YearSem record by ID
router.delete('/yearsem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedYearSem = await YearSem.findByIdAndDelete(id);

    if (!deletedYearSem) {
      return res.status(404).json({ message: 'YearSem not found' });
    }

    res.status(200).json(deletedYearSem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
