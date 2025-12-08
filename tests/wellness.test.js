// tests/wellness.test.js

const request = require('supertest');
const app = require('../src/app');
const WellnessEntry = require('../src/models/WellnessEntry');
const User = require('../src/models/User');

describe('Wellness Entry API', () => {
  let userId;

  beforeAll(async () => {
    const user = await User.create({ name: 'Wellness User', email: 'wellness@test.com', googleId: '456' });
    userId = user._id;
  });

  afterEach(async () => await WellnessEntry.deleteMany({}));

  it('GET /wellness returns list', async () => {
    const res = await request(app).get('/wellness');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /wellness/user/:userId returns entries', async () => {
    await WellnessEntry.create({ userId, mood: 'calm', stressLevel: 2 });

    const res = await request(app).get(`/wellness/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /wellness/:id returns single entry', async () => {
    const entry = await WellnessEntry.create({ userId, mood: 'happy', stressLevel: 1 });

    const res = await request(app).get(`/wellness/${entry._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.mood).toBe('happy');
  });

  it('GET /wellness with invalid ID returns 404', async () => {
    const res = await request(app).get('/wellness/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

});
