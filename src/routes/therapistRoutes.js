// src/routes/therapistRoutes.js

/**
 * @swagger
 * tags:
 *   name: Therapists
 *   description: Therapist management
 *
 * /therapists:
 *   get:
 *     summary: Get all therapists
 *     tags: [Therapists]
 *     responses:
 *       200:
 *         description: List of therapists
 *
 *   post:
 *     summary: Create a new therapist
 *     tags: [Therapists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               country:
 *                 type: string
 *               rating:
 *                 type: number
 *               bio:
 *                 type: string
 *               availability:
 *                 type: object
 *     responses:
 *       201:
 *         description: Therapist created
 *
 * /therapists/{id}:
 *   get:
 *     summary: Get therapist by ID
 *     tags: [Therapists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapist details
 *       404:
 *         description: Therapist not found
 */

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
