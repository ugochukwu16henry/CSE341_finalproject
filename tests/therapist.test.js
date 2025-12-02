const request = require("supertest");
const app = require("../src/app");
const Therapist = require("../src/models/therapist.model");

describe("Therapist Routes - GET Endpoints", () => {
  test("GET /therapists - should return an empty array when no therapists exist", async () => {
    const response = await request(app).get("/therapists");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET /therapists - should return all therapists", async () => {
    // Create test therapists
    const therapist1 = await Therapist.create({
      name: "Dr. John Smith",
      specialization: "Cognitive Behavioral Therapy",
      country: "United States",
      availability: {
        monday: ["10:00", "14:00"],
        tuesday: ["10:00"],
      },
    });
    const therapist2 = await Therapist.create({
      name: "Dr. Jane Doe",
      specialization: "Family Therapy",
      country: "Canada",
      availability: {
        monday: ["09:00"],
        wednesday: ["11:00", "15:00"],
      },
    });

    const response = await request(app).get("/therapists");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe(therapist1.name);
    expect(response.body[1].name).toBe(therapist2.name);
  });

  test("GET /therapists/:id - should return a therapist by ID", async () => {
    const therapist = await Therapist.create({
      name: "Dr. Test Therapist",
      specialization: "Test Therapy",
      country: "Test Country",
      availability: {
        monday: ["10:00"],
      },
    });

    const response = await request(app).get(`/therapists/${therapist._id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(therapist.name);
    expect(response.body.specialization).toBe(therapist.specialization);
  });

  test("GET /therapists/:id - should return 404 if therapist not found", async () => {
    const mongoose = require("mongoose");
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/therapists/${fakeId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Therapist not found");
  });
});

