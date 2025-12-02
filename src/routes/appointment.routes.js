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
 *         - userId
 *         - therapistId
 *         - date
 *         - time
 *       properties:
 *         _id: { type: string }
 *         userId: { type: string }
 *         therapistId: { type: string }
 *         date: { type: string, format: date }
 *         time: { type: string }
 *         status: { type: string, enum: [pending, confirmed, completed, cancelled] }
 *         notes: { type: string }
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /appointments/user/{userId}:
 *   get:
 *     summary: Get appointments by user ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of user appointments
 */
router.get("/user/:userId", ctrl.getByUser);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", ctrl.getById);


/**
 * @swagger
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
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.post("/", auth, validate(appointmentSchema), ctrl.create);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.put("/:id", auth, validate(appointmentSchema), ctrl.update);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Appointment deleted
 */
router.delete("/:id", auth, ctrl.delete);

module.exports = router;

