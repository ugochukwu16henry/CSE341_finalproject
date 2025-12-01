const request = require("supertest");
const app = require("../src/app");

describe("Authentication Routes", () => {
  describe("GET /auth/google", () => {
    it("should redirect to Google OAuth", async () => {
      const response = await request(app).get("/auth/google");
      // Passport redirects to Google, so we expect a 302 or similar redirect
      expect([302, 307]).toContain(response.status);
    });
  });
});

