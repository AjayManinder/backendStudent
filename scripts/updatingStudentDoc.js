const mongoose = require('mongoose');
const Student = require('../models/studentModel');
require('dotenv').config();

const protocol = process.env.DB_PROTOCOL;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;

async function updateExistingStudents() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ajay:ajay@cluster0.n2tvqbm.mongodb.net/studentsDB", {
      
    });
    console.log('Connected to MongoDB');

   
    // Find all existing students
    const students = await Student.find({});

    // Iterate over each student document
    for (const student of students) {
      // Check if studentBioDetails field is missing
      if (!student.studentBioDetails) {
        // Add studentBioDetails with default values
        student.studentBioDetails = {
          level: 'Graduate',
          class: 'Not Provided',
          status: 'Active',
          studentType: 'Masters - Graduate',
          residency: 'International',
          campus: 'Not Provided',
          firstTermAttended: 'Fall 2021',
          matriculatedTerm: 'Not Provided',
          lastTermAttended: 'Fall 2022',
          leaveOfAbsence: 'Not Provided',
        };
      }

      // Check if curriculumPrimary field is missing
      if (!student.curriculumPrimary) {
        // Add curriculumPrimary with default values
        student.curriculumPrimary = {
          degree: 'Master of Science',
          studyPath: 'Not Provided',
          level: 'Graduate',
          program: 'MS Computer Science',
          college: 'Health, Science and Technology',
          major: 'Computer Science',
          department: 'Computer Science',
          concentration: 'Not Provided',
          minor: 'Not Provided',
          admitType: 'Standard',
          admitTerm: 'Fall 2021',
          catalogTerm: 'Fall 2021',
        };
      }

      // Save the updated student document
      await student.save();
    }

    console.log('Migration completed successfully.');

    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error during migration:', error.message);
  }
}

// Run the migration function
updateExistingStudents();
