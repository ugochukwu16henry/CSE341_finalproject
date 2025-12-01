const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  googleId: Joi.string(),
  avatar: Joi.string().uri().allow(""),
  role: Joi.string().valid("user", "admin"),
});

const therapistSchema = Joi.object({
  name: Joi.string().min(2).required(),
  specialization: Joi.string().required(),
  country: Joi.string().required(),
  rating: Joi.number().min(0).max(5),
  bio: Joi.string().allow(""),
  contactInfo: Joi.object({
    phone: Joi.string(),
    email: Joi.string().email(),
  }),
  availability: Joi.object({
    monday: Joi.array().items(Joi.string()),
    tuesday: Joi.array().items(Joi.string()),
    wednesday: Joi.array().items(Joi.string()),
    thursday: Joi.array().items(Joi.string()),
    friday: Joi.array().items(Joi.string()),
    saturday: Joi.array().items(Joi.string()),
    sunday: Joi.array().items(Joi.string()),
  }).required(),
});

const appointmentSchema = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  therapistId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required(),
  status: Joi.string().valid("pending", "confirmed", "completed", "cancelled"),
  notes: Joi.string().allow(""),
});

const wellnessSchema = Joi.object({
  mood: Joi.string().min(2).required(),
  stressLevel: Joi.number().integer().min(1).max(10).required(),
  note: Joi.string().allow(""),
});

module.exports = { userSchema, therapistSchema, appointmentSchema, wellnessSchema };
