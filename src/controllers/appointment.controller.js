const Appointment = require("../models/appointment.model");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
  try {
    const apps = await Appointment.find().populate("userId therapistId", "name email");
    res.json(apps);
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
    const apps = await Appointment.find({ userId: req.params.userId });
    res.json(apps);
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
    const app = new Appointment({ ...req.body, userId: req.user.id });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
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
    const app = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!app)
      return res.status(404).json({ error: "Appointment not found or unauthorized" });
    res.json(app);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
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

