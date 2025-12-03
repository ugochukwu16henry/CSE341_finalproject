const Appointment = require("../models/appointment.model");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
  try {
    const apps = await Appointment.find().populate("userId therapistId", "name email");
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }
    const app = await Appointment.findById(req.params.id).populate("userId therapistId", "name email");
    if (!app) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    // Check if userId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const apps = await Appointment.find({ userId: req.params.userId }).populate("therapistId", "name specialization");
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Validate therapistId
    if (!mongoose.Types.ObjectId.isValid(req.body.therapistId)) {
      return res.status(400).json({ error: "Invalid therapist ID format" });
    }
    // Remove userId from body if provided (we set it from auth token)
    const { userId, ...appointmentData } = req.body;
    const app = new Appointment({ ...appointmentData, userId: req.user.id });
    await app.save();
    const populatedApp = await Appointment.findById(app._id).populate("userId therapistId", "name email");
    res.status(201).json(populatedApp);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Validation Error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }
    // Validate therapistId if provided
    if (req.body.therapistId && !mongoose.Types.ObjectId.isValid(req.body.therapistId)) {
      return res.status(400).json({ error: "Invalid therapist ID format" });
    }
    // Remove userId from body if provided (users can't change their userId)
    const { userId, ...updateData } = req.body;
    const app = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate("userId therapistId", "name email");
    if (!app)
      return res.status(404).json({ error: "Appointment not found or unauthorized" });
    res.status(200).json(app);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Validation Error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }
    const app = await Appointment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!app) return res.status(404).json({ error: "Not found or unauthorized" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

