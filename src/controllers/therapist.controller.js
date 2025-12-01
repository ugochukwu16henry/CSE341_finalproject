const Therapist = require("../models/therapist.model");

exports.getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find().select("-__v");
    res.status(200).json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTherapistById = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid therapist ID format" });
    }
    const therapist = await Therapist.findById(req.params.id).select("-__v");
    if (!therapist)
      return res.status(404).json({ error: "Therapist not found" });
    res.status(200).json(therapist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTherapist = async (req, res) => {
  try {
    const therapist = new Therapist(req.body);
    await therapist.save();
    res.status(201).json(therapist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTherapist = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid therapist ID format" });
    }
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!therapist)
      return res.status(404).json({ error: "Therapist not found" });
    res.status(200).json(therapist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTherapist = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid therapist ID format" });
    }
    const therapist = await Therapist.findByIdAndDelete(req.params.id);
    if (!therapist)
      return res.status(404).json({ error: "Therapist not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
