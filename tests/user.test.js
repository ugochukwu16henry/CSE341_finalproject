// tests/user.test.js

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('User API', () => {
  afterEach(async () => await User.deleteMany({}));

  it('GET /users returns empty array', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it('GET /users/:id returns 404 for invalid ID', async () => {
    const res = await request(app).get('/users/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  it('POST /users creates a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const res = await request(app)
      .post('/users')
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
  });

  it('GET /users/:id returns user by valid ID', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com'
    });
    await user.save();

    const res = await request(app).get(`/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(user._id.toString());
    expect(res.body.name).toBe('Test User');
  });
});

