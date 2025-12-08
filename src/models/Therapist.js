// src/models/Therapist.js

const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  bio: { type: String, default: '' },
  availability: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Therapist', therapistSchema);
