// server.js


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); // Move bodyParser here
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Student = require('./models/studentModel');
const Teacher = require('./models/teacherModel');
const subjectRoutes = require('./routes/subjectRoute');
// route imports
const YearSem = require('./routes/YearSem');
const teacherRoutes = require('./routes/teacherRoute');
const studentRoutes = require('./routes/studentRoute');
const adminRoutes = require('./routes/adminRoute');
const roleRoutes = require('./routes/roleRoute');
const swagger = require('./swagger');
const { performance } = require('perf_hooks');

const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs));

const port = 5000;
const protocol = process.env.DB_PROTOCOL;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;




 app.use(subjectRoutes);
app.use(YearSem);
app.use(teacherRoutes);
app.use(studentRoutes);
app.use(roleRoutes);
app.use(adminRoutes);

const secretKey = process.env.JWT_SECRET_KEY

const authenticateUser = (req, res, next) => {
  // Check authentication logic here, e.g., verify JWT
  // For simplicity, let's assume there's a token in headers
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Verify the token using the generated secret key
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing Users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: number
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role_id:
 *           type: string
 *       required:
 *         - user_id
 *         - email
 *         - password
 */


// Login endpoint
app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Start measuring time
    const startTime = performance.now();
    
    // Find user in the database
    const user = await User.findOne({ email });

    // Validate password
    if (user && bcrypt.compareSync(password, user.password)) {
      // Generate token including user_id in the payload
      const token = jwt.sign({ user_id: user.user_id, email }, secretKey);

      // Stop measuring time
      const stopTime = performance.now();
      
      // Calculate the time taken
      const timeTaken = stopTime - startTime;
      
      // Log time taken
      console.log(`Time taken /login: ${timeTaken} milliseconds`);

      return res.json({ token });
    }

    // Incorrect password or user not found
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

  // Call next to pass control to the next middleware
  next();
});


// User registration endpoint
app.post('/register', async (req, res) => {
  const { user_id, email, password, role_id } = req.body;

  try {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = await User.create({
      user_id,
      email,
      password: hashedPassword,
      role_id,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all Users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// GET all users with population
app.get('/users', async (req, res) => {
  try {
    // Find all users and populate the 'role_id' field
    const users = await User.find({})
      .populate('role_id', '-_id role_id roleName'); // Exclude _id and include role_id, roleName

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

User.updateMany({}, { $set: { role_id: null } }, { multi: true }, (err, result) => {
  if (err) {
    console.error('Error updating documents:', err.message);
  } else {
    console.log('Documents updated successfully:', result);
  }
});
// GET a user by user_id with population
app.get('/users/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Find the user by user_id and populate the 'role_id' field
    const user = await User.findOne({ user_id })
      .populate('role_id'); // Assuming 'role_id' is a reference to another model

    if (!user) {
      return res.status(404).json({ message: `Cannot find any user with user_id ${user_id}` });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update a user by user_id
app.put('/users/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const updatedUser = await User.findOneAndUpdate({ user_id }, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: `Cannot find any user with user_id ${user_id}` });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user by user_id
app.delete('/users/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const deletedUser = await User.findOneAndDelete({ user_id });

    if (!deletedUser) {
      return res.status(404).json({ message: `Cannot find any user with user_id ${user_id}` });
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// app.get('/students-subjects', async (req, res) => {
//   try {
//     const students = await Student.find({}).populate('subjectIds'); 
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



module.exports = app;



mongoose.connect(`${protocol}//${username}:${password}@${cluster}/${dbName}`)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after connecting to MongoDB
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
