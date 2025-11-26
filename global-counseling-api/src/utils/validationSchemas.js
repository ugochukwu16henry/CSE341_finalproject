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

module.exports = { userSchema, therapistSchema };
