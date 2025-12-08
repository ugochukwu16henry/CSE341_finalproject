// src/controllers/wellnessController.js

const WellnessEntry = require('../models/WellnessEntry');
const { validateWellness } = require('../utils/validation');

const createWellnessEntry = async (req, res) => {
  const { error } = validateWellness(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const entry = new WellnessEntry({
      ...req.body,
      userId: req.user.id
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create wellness entry' });
  }
};

const getAllWellnessEntries = async (req, res) => {
  try {
    const entries = await WellnessEntry.find().populate('userId');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserWellnessEntries = async (req, res) => {
  try {
    const entries = await WellnessEntry.find({ userId: req.params.userId });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getWellnessEntryById = async (req, res) => {
  try {
    const entry = await WellnessEntry.findById(req.params.id).populate('userId');
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateWellnessEntry = async (req, res) => {
  const { error } = validateWellness(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const entry = await WellnessEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
};

const deleteWellnessEntry = async (req, res) => {
  try {
    const entry = await WellnessEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createWellnessEntry,
  getAllWellnessEntries,
  getUserWellnessEntries,
  getWellnessEntryById,
  updateWellnessEntry,
  deleteWellnessEntry
};
