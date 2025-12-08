// src/routes/wellnessRoutes.js

/**
 * @swagger
 * tags:
 *   name: Wellness
 *   description: Wellness entry management
 *
 * /wellness:
 *   get:
 *     summary: Get all wellness entries
 *     tags: [Wellness]
 *     responses:
 *       200:
 *         description: List of wellness entries
 *
 *   post:
 *     summary: Create a new wellness entry
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mood:
 *                 type: string
 *                 enum: [happy, sad, anxious, calm, angry, hopeful]
 *               stressLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wellness entry created
 *       401:
 *         description: Unauthorized
 *
 * /wellness/user/{userId}:
 *   get:
 *     summary: Get wellness entries by user ID
 *     tags: [Wellness]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User wellness entries
 *
 * /wellness/{id}:
 *   get:
 *     summary: Get wellness entry by ID
 *     tags: [Wellness]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wellness entry details
 *       404:
 *         description: Entry not found
 *
 *   put:
 *     summary: Update a wellness entry
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mood:
 *                 type: string
 *                 enum: [happy, sad, anxious, calm, angry, hopeful]
 *               stressLevel:
 *                 type: integer
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated wellness entry
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete a wellness entry
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 */

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
