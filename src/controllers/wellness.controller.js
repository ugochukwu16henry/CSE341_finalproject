const Wellness = require("../models/wellness.model");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
  try {
    const wellness = await Wellness.find().populate("userId", "name email");
    res.json(wellness);
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
    const wellness = await Wellness.find({ userId: req.params.userId });
    res.json(wellness);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const wellness = new Wellness({ ...req.body, userId: req.user.id });
    await wellness.save();
    res.status(201).json(wellness);
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
      return res.status(400).json({ error: "Invalid wellness entry ID format" });
    }
    const wellness = await Wellness.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!wellness)
      return res.status(404).json({ error: "Wellness entry not found or unauthorized" });
    res.json(wellness);
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
      return res.status(400).json({ error: "Invalid wellness entry ID format" });
    }
    const wellness = await Wellness.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!wellness) return res.status(404).json({ error: "Not found or unauthorized" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

