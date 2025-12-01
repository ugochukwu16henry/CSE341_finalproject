const mongoose = require("mongoose");

const wellnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, required: true },
  stressLevel: { type: Number, min: 1, max: 10, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Wellness", wellnessSchema);

