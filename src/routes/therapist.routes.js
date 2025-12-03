const express = require("express");
const router = express.Router();
const therapistController = require("../controllers/therapist.controller");
const validate = require("../middleware/validate");
const { therapistSchema } = require("../utils/validationSchemas");

/**
 * @swagger
 * components:
 *   schemas:
 *     Therapist:
 *       type: object
 *       required:
 *         - name
 *         - specialization
 *         - country
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         specialization: { type: string }
 *         country: { type: string }
 *         rating: { type: number, minimum: 0, maximum: 5 }
 *         bio: { type: string }
 *         contactInfo:
 *           type: object
 *           properties:
 *             phone: { type: string }
 *             email: { type: string }
 *         availability:
 *           type: object
 *           properties:
 *             monday: { type: array, items: { type: string } }
 *             tuesday: { type: array, items: { type: string } }
 *             wednesday: { type: array, items: { type: string } }
 *             thursday: { type: array, items: { type: string } }
 *             friday: { type: array, items: { type: string } }
 *             saturday: { type: array, items: { type: string } }
 *             sunday: { type: array, items: { type: string } }
 *       example:
 *         name: Dr. Emily Rodriguez
 *         specialization: Marriage & Family Therapy
 *         country: United States
 *         availability:
 *           monday: ["10:00", "14:00"]
 */

/**
 * @swagger
 * /therapists:
 *   get:
 *     summary: Get all therapists
 *     tags: [Therapists]
 *     responses:
 *       200:
 *         description: List of therapists
 */
router.get("/", therapistController.getAllTherapists);

/**
 * @swagger
 * /therapists/{id}:
 *   get:
 *     summary: Get therapist by ID
 *     tags: [Therapists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Therapist found
 *       404:
 *         description: Therapist not found
 */
router.get("/:id", therapistController.getTherapistById);

/**
 * @swagger
 * /therapists:
 *   post:
 *     summary: Create a new therapist
 *     tags: [Therapists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Therapist'
 *     responses:
 *       201:
 *         description: Therapist created
 */
router.post(
  "/",
  validate(therapistSchema),
  therapistController.createTherapist
);

/**
 * @swagger
 * /therapists/{id}:
 *   put:
 *     summary: Update a therapist
 *     tags: [Therapists]
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
 *             $ref: '#/components/schemas/Therapist'
 *     responses:
 *       200:
 *         description: Therapist updated
 */
router.put(
  "/:id",
  validate(therapistSchema),
  therapistController.updateTherapist
);

/**
 * @swagger
 * /therapists/{id}:
 *   delete:
 *     summary: Delete a therapist
 *     tags: [Therapists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Therapist deleted
 */
router.delete("/:id", therapistController.deleteTherapist);

module.exports = router;
