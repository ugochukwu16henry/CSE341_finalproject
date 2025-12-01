const request = require("supertest");
const app = require("../src/app");

describe("GET Endpoints - Week 06", () => {
  test("GET /users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
  });

  test("GET /therapists", async () => {
    const res = await request(app).get("/therapists");
    expect(res.status).toBe(200);
  });

  test("GET /appointments", async () => {
    const res = await request(app).get("/appointments");
    expect(res.status).toBe(200);
  });

  test("GET /wellness", async () => {
    const res = await request(app).get("/wellness");
    expect(res.status).toBe(200);
  });
});

