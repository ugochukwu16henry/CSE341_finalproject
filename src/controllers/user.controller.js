const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email or Google ID already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Validation Error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email or Google ID already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        error: "Validation Error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Check if ID is valid ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
