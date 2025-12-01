const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");

describe("User Routes", () => {
  describe("GET /users", () => {
    it("should return an empty array when no users exist", async () => {
      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all users", async () => {
      // Create test users
      const user1 = await User.create({
        name: "John Doe",
        email: "john@example.com",
      });
      const user2 = await User.create({
        name: "Jane Smith",
        email: "jane@example.com",
      });

      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe(user1.name);
      expect(response.body[1].name).toBe(user2.name);
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by ID", async () => {
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
      });

      const response = await request(app).get(`/users/${user._id}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
    });

    it("should return 404 if user not found", async () => {
      const mongoose = require("mongoose");
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/users/${fakeId}`);
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "New User",
        email: "newuser@example.com",
      };

      const response = await request(app).post("/users").send(userData);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body._id).toBeDefined();
    });

    it("should return 400 if email is missing", async () => {
      const userData = {
        name: "New User",
      };

      const response = await request(app).post("/users").send(userData);
      expect(response.status).toBe(400);
    });

    it("should return 400 if email already exists", async () => {
      await User.create({
        name: "Existing User",
        email: "existing@example.com",
      });

      const userData = {
        name: "New User",
        email: "existing@example.com",
      };

      const response = await request(app).post("/users").send(userData);
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /users/:id", () => {
    it("should update a user", async () => {
      const user = await User.create({
        name: "Original Name",
        email: "original@example.com",
      });

      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const response = await request(app)
        .put(`/users/${user._id}`)
        .send(updateData);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
    });

    it("should return 404 if user not found", async () => {
      const mongoose = require("mongoose");
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const response = await request(app)
        .put(`/users/${fakeId}`)
        .send(updateData);
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete a user", async () => {
      const user = await User.create({
        name: "To Delete",
        email: "delete@example.com",
      });

      const response = await request(app).delete(`/users/${user._id}`);
      expect(response.status).toBe(204);

      // Verify user is deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it("should return 404 if user not found", async () => {
      const mongoose = require("mongoose");
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/users/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});

