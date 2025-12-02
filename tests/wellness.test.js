const request = require("supertest");
const app = require("../src/app");
const Wellness = require("../src/models/wellness.model");
const User = require("../src/models/user.model");

describe("Wellness Routes - GET Endpoints", () => {
  test("GET /wellness - should return an empty array when no wellness entries exist", async () => {
    const response = await request(app).get("/wellness");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET /wellness - should return all wellness entries", async () => {
    const user = await User.create({
      name: "Test User",
      email: "wellnessuser@example.com",
    });

    const wellness1 = await Wellness.create({
      userId: user._id,
      mood: "Happy",
      stressLevel: 3,
      note: "Feeling good today",
    });

    const wellness2 = await Wellness.create({
      userId: user._id,
      mood: "Calm",
      stressLevel: 2,
      note: "Relaxed",
    });

    const response = await request(app).get("/wellness");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("GET /wellness/:id - should return a wellness entry by ID", async () => {
    const user = await User.create({
      name: "Test User 2",
      email: "wellnessuser2@example.com",
    });

    const wellness = await Wellness.create({
      userId: user._id,
      mood: "Anxious",
      stressLevel: 7,
      note: "Feeling stressed",
    });

    const response = await request(app).get(`/wellness/${wellness._id}`);
    expect(response.status).toBe(200);
    expect(response.body._id.toString()).toBe(wellness._id.toString());
    expect(response.body.mood).toBe("Anxious");
    expect(response.body.stressLevel).toBe(7);
  });

  test("GET /wellness/user/:userId - should return wellness entries for a specific user", async () => {
    const user1 = await User.create({
      name: "User One",
      email: "wellnessuser3@example.com",
    });
    const user2 = await User.create({
      name: "User Two",
      email: "wellnessuser4@example.com",
    });

    await Wellness.create({
      userId: user1._id,
      mood: "Happy",
      stressLevel: 2,
    });

    await Wellness.create({
      userId: user1._id,
      mood: "Content",
      stressLevel: 3,
    });

    await Wellness.create({
      userId: user2._id,
      mood: "Stressed",
      stressLevel: 8,
    });

    const response = await request(app).get(`/wellness/user/${user1._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((w) => w.userId.toString() === user1._id.toString())).toBe(true);
  });
});

