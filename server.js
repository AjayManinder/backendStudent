// server.js


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); // Move bodyParser here
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Student = require('./models/studentModel');
const Teacher = require('./models/teacherModel');
const subjectRoutes = require('./subjectRoute');
const YearSem = require('./YearSem');
const teacherRoutes = require('./teacherRoute');
const studentRoutes = require('./studentRoute');

const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

const port = 5000;
const protocol = process.env.DB_PROTOCOL;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;


mongoose.connect(`${protocol}//${username}:${password}@${cluster}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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



 app.use(subjectRoutes);
app.use(YearSem);
app.use(teacherRoutes);
app.use(studentRoutes);

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

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user in the database
  const user = await User.findOne({ email });

  // Validate password
  if (user && bcrypt.compareSync(password, user.password)) {
    // Generate token using the random secret key
    const token = jwt.sign({ email }, secretKey);
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
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


