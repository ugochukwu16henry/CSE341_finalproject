// src/utils/validation.js

const Joi = require('joi');

// Appointment validation
const appointmentSchema = Joi.object({
  userId: Joi.string().required(),
  therapistId: Joi.string().required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled'),
  notes: Joi.string().max(500)
});

// Wellness validation
const wellnessSchema = Joi.object({
  userId: Joi.string().required(),
  mood: Joi.string().valid('happy', 'sad', 'anxious', 'calm', 'angry', 'hopeful').required(),
  stressLevel: Joi.number().integer().min(1).max(10).required(),
  note: Joi.string().max(500)
});

const validateAppointment = (data) => appointmentSchema.validate(data);
const validateWellness = (data) => wellnessSchema.validate(data);

module.exports = { validateAppointment, validateWellness };
