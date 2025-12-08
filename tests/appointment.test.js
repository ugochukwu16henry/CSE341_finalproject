// tests/appointment.test.js

const request = require('supertest');
const app = require('../src/app');
const Appointment = require('../src/models/Appointment');
const User = require('../src/models/User');
const Therapist = require('../src/models/Therapist');

describe('Appointment API', () => {
  let userId, therapistId;

  beforeAll(async () => {
    const user = await User.create({ name: 'Test User', email: 'test@example.com', googleId: '123' });
    const therapist = await Therapist.create({ name: 'Dr. Test', specialization: 'Stress', country: 'NG', rating: 5, bio: 'Test bio', availability: {} });
    userId = user._id;
    therapistId = therapist._id;
  });

  afterEach(async () => await Appointment.deleteMany({}));

  it('GET /appointments returns empty array', async () => {
    const res = await request(app).get('/appointments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /appointments/user/:userId returns user appointments', async () => {
    await Appointment.create({ userId, therapistId, date: new Date(), status: 'scheduled' });

    const res = await request(app).get(`/appointments/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /appointments/:id returns single appointment', async () => {
    const appt = await Appointment.create({ userId, therapistId, date: new Date(), status: 'scheduled' });

    const res = await request(app).get(`/appointments/${appt._id}`);
    expect(res.statusCode).toBe(200);
    // userId is populated, so we need to check the _id property
    const returnedUserId = res.body.userId._id || res.body.userId;
    expect(returnedUserId.toString()).toBe(userId.toString());
  });

  it('GET /appointments with invalid ID returns 404', async () => {
    const res = await request(app).get('/appointments/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

});
