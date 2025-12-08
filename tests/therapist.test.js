// tests/therapist.test.js

const request = require('supertest');
const app = require('../src/app');
const Therapist = require('../src/models/Therapist');

describe('Therapist API', () => {
  afterEach(async () => await Therapist.deleteMany({}));

  it('GET /therapists returns list', async () => {
    await Therapist.create({ name: 'Dr. Smith', specialization: 'Anxiety', country: 'USA', rating: 4.5, bio: '...', availability: {} });

    const res = await request(app).get('/therapists');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /therapists/:id returns therapist', async () => {
    const therapist = await Therapist.create({ name: 'Dr. Lee', specialization: 'Family', country: 'Canada', rating: 4.8, bio: '...', availability: {} });

    const res = await request(app).get(`/therapists/${therapist._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Dr. Lee');
  });

  it('GET /therapists/:id returns 404 for invalid ID', async () => {
    const res = await request(app).get('/therapists/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  it('POST /therapists creates a new therapist', async () => {
    const newTherapist = {
      name: 'Dr. Johnson',
      specialization: 'Depression',
      country: 'USA',
      rating: 4.7,
      bio: 'Experienced therapist',
      availability: {}
    };

    const res = await request(app)
      .post('/therapists')
      .send(newTherapist);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newTherapist.name);
    expect(res.body.specialization).toBe(newTherapist.specialization);
  });
});

