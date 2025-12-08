// src/routes/appointmentRoutes.js

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 *
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               therapistId:
 *                 type: string
 *                 example: "607c8b3b9f1b2f001f1e8b02"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-15T10:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "First session"
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of appointments
 *
 * /appointments/user/{userId}:
 *   get:
 *     summary: Get appointments by user ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User appointments
 *
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 *       404:
 *         description: Not found
 *
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
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
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *     responses:
 *       200:
 *         description: Updated appointment
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
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
 */

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

// Public routes (GET only)
router.get('/', getAllAppointments);
router.get('/user/:userId', getUserAppointments);
router.get('/:id', getAppointmentById);

// Protected routes (require JWT)
router.post('/', authenticateToken, createAppointment);
router.put('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);

module.exports = router;
