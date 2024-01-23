// server.js


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/userModel');
const Student = require('./models/studentModel');
const subjectRoutes = require('./subjectRoute');
const YearSem = require('./YearSem');
const teacherRoutes = require('./teacherRoute');



const app = express();
app.use(bodyParser.json());
app.use(cors());
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
// Define CRUD endpoints for students (similar to the Employee model)

// app.get('/students', async (req, res) => {
//   try {
//     const students = await Student.find({}); //.populate('subjectIds')
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
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
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/students-subjects', async (req, res) => {
  try {
    const students = await Student.find({}).populate('subjectIds'); 
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({})
    .populate('subjectIds')
    .populate('yearSemIds'); 
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a student by Roll No
app.put('/students/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const updatedStudent = await Student.findOneAndUpdate({ rollNo }, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: `Cannot find any student with rollNo ${rollNo}` });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a student by Roll No
app.delete('/students/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ rollNo });
    if (!deletedStudent) {
      return res.status(404).json({ message: `Cannot find any student with rollNo ${rollNo}` });
    }
    res.status(200).json(deletedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Search students by rollNo, name, or percentage
app.get('/students/search', async (req, res) => {
  try {
    const { searchField, searchTerm } = req.query;
    let query = {};

    if (searchField === 'rollNo') {
      query = { rollNo: searchTerm };
    } else if (searchField === 'name') {
      query = { name: { $regex: searchTerm, $options: 'i' } }; // Case-insensitive search by name
    } else if (searchField === 'percentage') {
      query = { percentage: searchTerm };
    } else {
      return res.status(400).json({ message: 'Invalid search field' });
    }

    const students = await Student.find(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
// Example POST endpoint to add a student
app.post('/students', async (req, res) => {
  try {
    const { subjectIds, yearSemIds, ...studentData } = req.body;

    const newStudent = await Student.create({
      ...studentData,
      subjectIds: subjectIds.map(subjectId => new mongoose.Types.ObjectId(subjectId)),
      yearSemIds: yearSemIds.map(yearSemId => new mongoose.Types.ObjectId(yearSemId)),
    });

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

