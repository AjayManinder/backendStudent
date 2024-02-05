const express = require('express');
const Role = require('../models/rolesModal'); // Adjust the path based on your project structure

const router = express.Router();

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         role_id:
 *           type: number
 *         roleName:
 *           type: string
 *       required:
 *         - role_id
 *         - roleName
 */

// Create a new role
router.post('/roles', async (req, res) => {
  try {
    const { role_id, roleName } = req.body;

    // Ensure required properties are provided
    if (!role_id || !roleName) {
      return res.status(400).json({ message: 'Please provide role_id and roleName' });
    }

    const newRole = await Role.create({
      role_id,
      roleName,
    });

    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags:
 *       - Roles
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a role by ID
router.get('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({ role_id: id });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a role by ID
router.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRole = await Role.findOneAndUpdate({ role_id: id }, req.body, { new: true });
    
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a role by ID
router.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findOneAndDelete({ role_id: id });
    
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
