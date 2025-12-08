// src/routes/therapistRoutes.js

const express = require('express');
const router = express.Router();
const Therapist = require('../models/Therapist');

// GET /therapists
router.get('/', async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /therapists/:id
router.get('/:id', async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) return res.status(404).json({ error: 'Therapist not found' });
    res.json(therapist);
  } catch (err) {
    res.status(404).json({ error: 'Therapist not found' });
  }
});

// POST /therapists
router.post('/', async (req, res) => {
  try {
    const therapist = new Therapist(req.body);
    await therapist.save();
    res.status(201).json(therapist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create therapist' });
  }
});

module.exports = router;
