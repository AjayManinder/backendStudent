const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const protocol = process.env.DB_PROTOCOL;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;
require('dotenv').config();
describe('API endpoints', () => {
  beforeAll(async () => {
    // Connect to the in-memory database (or your test database)
    await mongoose.connect(`${protocol}//${username}:${password}@${cluster}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the database after all tests are done
    await mongoose.disconnect();
  });

  it('should get all students with subjects', async () => {
    const response = await request(app).get('/students-subjects');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(13); // Add assertions based on your data
  });

  it('should get all students', async () => {
    const response = await request(app).get('/students');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(13); // Add assertions based on your data
  });

  it('should create a new student', async () => {
    const newStudentData = {
      rollNo: 23,
      name: 'Pawan',
      percentage: '95.5',
      branch: 'Mech',
      subjectIds: [], // Add subject IDs if required
      yearSemIds: [], // Add yearSem IDs if required
    };
  
    const response = await request(app)
      .post('/students')
      .send(newStudentData);
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('rollNo', newStudentData.rollNo);
    // Add more assertions based on your data and response structure
  });
  
  
});
