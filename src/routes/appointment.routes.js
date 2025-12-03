const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointment.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { appointmentSchema } = require("../utils/validationSchemas");

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - therapistId
 *         - date
 *         - time
 *       properties:
 *         _id: { type: string, readOnly: true }
 *         userId: { type: string, readOnly: true, description: "Set automatically from JWT token" }
 *         therapistId: { type: string, required: true }
 *         date: { type: string, format: date, required: true, example: "2025-12-25" }
 *         time: { type: string, required: true, pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", example: "14:00" }
 *         status: { type: string, enum: [pending, confirmed, completed, cancelled], default: pending }
 *         notes: { type: string }
 *         createdAt: { type: string, format: date-time, readOnly: true }
 *         updatedAt: { type: string, format: date-time, readOnly: true }
 *     AppointmentRequest:
 *       type: object
 *       required:
 *         - therapistId
 *         - date
 *         - time
 *       properties:
 *         therapistId: { type: string, required: true, description: "Therapist ID" }
 *         date: { type: string, format: date, required: true, example: "2025-12-25" }
 *         time: { type: string, required: true, pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", example: "14:00" }
 *         status: { type: string, enum: [pending, confirmed, completed, cancelled] }
 *         notes: { type: string }
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Returns a list of all appointments with populated user and therapist information
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /appointments/user/{userId}:
 *   get:
 *     summary: Get appointments by user ID
 *     description: Returns all appointments for a specific user with therapist information
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the user
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of user appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid user ID format
 */
router.get("/user/:userId", ctrl.getByUser);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     description: Returns a single appointment by ID with populated user and therapist information
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the appointment
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Appointment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid appointment ID format
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", ctrl.getById);


/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     description: Creates a new appointment. userId is automatically set from the JWT token. Requires authentication.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentRequest'
 *           example:
 *             therapistId: "507f1f77bcf86cd799439011"
 *             date: "2025-12-25"
 *             time: "14:00"
 *             status: "pending"
 *             notes: "Initial consultation"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error or invalid therapist ID
 *       401:
 *         description: Unauthorized - JWT token required
 */
router.post("/", auth, validate(appointmentSchema), ctrl.create);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     description: Updates an appointment. Users can only update their own appointments. userId cannot be changed.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the appointment
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentRequest'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error or invalid ID format
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Appointment not found or unauthorized
 */
router.put("/:id", auth, validate(appointmentSchema), ctrl.update);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     description: Deletes an appointment. Users can only delete their own appointments. Requires authentication.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the appointment
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       400:
 *         description: Invalid appointment ID format
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Appointment not found or unauthorized
 */
router.delete("/:id", auth, ctrl.delete);

module.exports = router;

