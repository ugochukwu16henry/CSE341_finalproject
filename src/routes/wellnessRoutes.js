// src/routes/wellnessRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  createWellnessEntry,
  getAllWellnessEntries,
  getUserWellnessEntries,
  getWellnessEntryById,
  updateWellnessEntry,
  deleteWellnessEntry
} = require('../controllers/wellnessController');

// Public GET routes
router.get('/', getAllWellnessEntries);
router.get('/user/:userId', getUserWellnessEntries);
router.get('/:id', getWellnessEntryById);

// Protected POST/PUT/DELETE
router.post('/', authenticateToken, createWellnessEntry);
router.put('/:id', authenticateToken, updateWellnessEntry);
router.delete('/:id', authenticateToken, deleteWellnessEntry);

module.exports = router;
