const express = require('express');
const Admin = require('../models/adminModal'); // Adjust the path based on your project structure

const router = express.Router();


// Create a new admin
router.post('/admins', async (req, res) => {
  try {
    const { admin_id, adminName, user_id } = req.body;

    // Ensure required properties are provided
    if (!admin_id || !adminName || !user_id) {
      return res.status(400).json({ message: 'Please provide admin_id, adminName, and user_id' });
    }

    const newAdmin = await Admin.create({
      admin_id,
      adminName,
      user_id,
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all roles
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find({}).populate({
      path: 'user_id',
      populate: {
        path: 'role_id',
        model: 'Role',
      },
    });;
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a role by ID
router.get('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id) .populate({
      path: 'user_id',
      populate: {
        path: 'role_id',
        model: 'Role',
      },
    });;;

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Admin by ID
router.put('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdmin = await Admin.findOneAndUpdate( id , req.body, { new: true }) .populate({
      path: 'user_id',
      populate: {
        path: 'role_id',
        model: 'Role',
      },
    });
    
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a role by ID
router.delete('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findOneAndDelete( id );
    
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
