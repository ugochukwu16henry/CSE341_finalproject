const { MongoMemoryServer } = require("mongodb-memory-server-core");
const mongoose = require("mongoose");

// Set up environment variables for tests
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
process.env.BASE_URL = "http://localhost:5000";

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  jest.setTimeout(30000); // Increase timeout for MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: "jest-test-db",
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 30000);

// Cleanup after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Teardown after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

