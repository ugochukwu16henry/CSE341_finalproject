const request = require("supertest");
const app = require("../src/app");
const Appointment = require("../src/models/appointment.model");
const User = require("../src/models/user.model");
const Therapist = require("../src/models/therapist.model");

describe("Appointment Routes - GET Endpoints", () => {
  test("GET /appointments - should return an empty array when no appointments exist", async () => {
    const response = await request(app).get("/appointments");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET /appointments - should return all appointments", async () => {
    // Create test data
    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
    });
    const therapist = await Therapist.create({
      name: "Dr. Test",
      specialization: "Test Therapy",
      country: "Test Country",
      availability: { monday: ["10:00"] },
    });

    const appointment1 = await Appointment.create({
      userId: user._id,
      therapistId: therapist._id,
      date: new Date("2024-12-25"),
      time: "14:00",
      status: "pending",
    });

    const appointment2 = await Appointment.create({
      userId: user._id,
      therapistId: therapist._id,
      date: new Date("2024-12-26"),
      time: "15:00",
      status: "confirmed",
    });

    const response = await request(app).get("/appointments");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("GET /appointments/:id - should return an appointment by ID", async () => {
    const user = await User.create({
      name: "Test User",
      email: "testuser2@example.com",
    });
    const therapist = await Therapist.create({
      name: "Dr. Test 2",
      specialization: "Test Therapy",
      country: "Test Country",
      availability: { monday: ["10:00"] },
    });

    const appointment = await Appointment.create({
      userId: user._id,
      therapistId: therapist._id,
      date: new Date("2024-12-25"),
      time: "14:00",
    });

    const response = await request(app).get(`/appointments/${appointment._id}`);
    expect(response.status).toBe(200);
    expect(response.body._id.toString()).toBe(appointment._id.toString());
    expect(response.body.time).toBe("14:00");
  });

  test("GET /appointments/user/:userId - should return appointments for a specific user", async () => {
    const user1 = await User.create({
      name: "User One",
      email: "user1@example.com",
    });
    const user2 = await User.create({
      name: "User Two",
      email: "user2@example.com",
    });
    const therapist = await Therapist.create({
      name: "Dr. Test 3",
      specialization: "Test Therapy",
      country: "Test Country",
      availability: { monday: ["10:00"] },
    });

    await Appointment.create({
      userId: user1._id,
      therapistId: therapist._id,
      date: new Date("2024-12-25"),
      time: "10:00",
    });

    await Appointment.create({
      userId: user1._id,
      therapistId: therapist._id,
      date: new Date("2024-12-26"),
      time: "11:00",
    });

    await Appointment.create({
      userId: user2._id,
      therapistId: therapist._id,
      date: new Date("2024-12-27"),
      time: "12:00",
    });

    const response = await request(app).get(`/appointments/user/${user1._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((apt) => apt.userId.toString() === user1._id.toString())).toBe(true);
  });
});

