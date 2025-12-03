const Wellness = require("../models/wellness.model");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
  try {
    const wellness = await Wellness.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json(wellness);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid wellness entry ID format" });
    }
    const wellness = await Wellness.findById(req.params.id).populate("userId", "name email");
    if (!wellness) return res.status(404).json({ error: "Wellness entry not found" });
    res.status(200).json(wellness);
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
    const wellness = await Wellness.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(wellness);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Remove userId from body if provided (we set it from auth token)
    const { userId, ...wellnessData } = req.body;
    const wellness = new Wellness({ ...wellnessData, userId: req.user.id });
    await wellness.save();
    const populatedWellness = await Wellness.findById(wellness._id).populate("userId", "name email");
    res.status(201).json(populatedWellness);
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
      return res.status(400).json({ error: "Invalid wellness entry ID format" });
    }
    // Remove userId from body if provided (users can't change their userId)
    const { userId, ...updateData } = req.body;
    const wellness = await Wellness.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "name email");
    if (!wellness)
      return res.status(404).json({ error: "Wellness entry not found or unauthorized" });
    res.status(200).json(wellness);
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

