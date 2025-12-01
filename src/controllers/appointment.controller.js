const Appointment = require("../models/appointment.model");

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
    const apps = await Appointment.find({ userId: req.params.userId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const app = new Appointment({ ...req.body, userId: req.user.id });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const app = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!app)
      return res.status(404).json({ error: "Appointment not found or unauthorized" });
    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
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

