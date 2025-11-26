const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    country: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    bio: { type: String },
    contactInfo: {
      phone: String,
      email: String,
    },
    availability: {
      monday: [String],
      tuesday: [String],
      wednesday: [String],
      thursday: [String],
      friday: [String],
      saturday: [String],
      sunday: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Therapist", therapistSchema);
