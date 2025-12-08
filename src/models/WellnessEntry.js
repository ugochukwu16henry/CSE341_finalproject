// src/models/WellnessEntry.js

const mongoose = require('mongoose');

const wellnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { 
    type: String, 
    enum: ['happy', 'sad', 'anxious', 'calm', 'angry', 'hopeful'], 
    required: true 
  },
  stressLevel: { type: Number, min: 1, max: 10, required: true },
  note: { type: String, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('WellnessEntry', wellnessSchema);
