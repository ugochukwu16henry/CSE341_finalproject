const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger");
const passport = require("./config/passport");

const userRoutes = require("./routes/user.routes");
const therapistRoutes = require("./routes/therapist.routes");
const authRoutes = require("./routes/auth.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const wellnessRoutes = require("./routes/wellness.routes");
const externalRoutes = require("./routes/external.routes");

const app = express();

// Passport middleware (for OAuth only, no sessions)
app.use(passport.initialize());

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/therapists", therapistRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/wellness", wellnessRoutes);
app.use("/", externalRoutes); // External API routes (quotes, books)

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send(
    `<h1>Global Counseling API</h1><a href="/api-docs">View API Documentation</a>`
  );
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Don't expose internal errors in production
  const errorMessage =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  res.status(err.status || 500).json({
    error: errorMessage,
    ...(process.env.NODE_ENV !== "production" && { details: err.stack }),
  });
});

module.exports = app;
