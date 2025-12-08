// src/controllers/appointmentController.js

const Appointment = require('../models/Appointment');
const { validateAppointment } = require('../utils/validation');

// POST /appointments
const createAppointment = async (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.user.id // from JWT middleware
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// GET /appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('userId therapistId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /appointments/user/:userId
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('userId therapistId');
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /appointments/:id
const updateAppointment = async (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// DELETE /appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
