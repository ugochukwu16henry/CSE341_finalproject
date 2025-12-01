const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/wellness.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { wellnessSchema } = require("../utils/validationSchemas");

/**
 * @swagger
 * components:
 *   schemas:
 *     Wellness:
 *       type: object
 *       required:
 *         - mood
 *         - stressLevel
 *       properties:
 *         _id: { type: string }
 *         userId: { type: string }
 *         mood: { type: string }
 *         stressLevel: { type: number, minimum: 1, maximum: 10 }
 *         note: { type: string }
 *         createdAt: { type: string, format: date-time }
 */

/**
 * @swagger
 * /wellness:
 *   get:
 *     summary: Get all wellness entries
 *     tags: [Wellness]
 *     responses:
 *       200:
 *         description: List of all wellness entries
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /wellness/user/{userId}:
 *   get:
 *     summary: Get wellness entries by user ID
 *     tags: [Wellness]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of user wellness entries
 */
router.get("/user/:userId", ctrl.getByUser);

/**
 * @swagger
 * /wellness:
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
 *             $ref: '#/components/schemas/Wellness'
 *     responses:
 *       201:
 *         description: Wellness entry created
 */
router.post("/", auth, validate(wellnessSchema), ctrl.create);

/**
 * @swagger
 * /wellness/{id}:
 *   put:
 *     summary: Update a wellness entry
 *     tags: [Wellness]
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
 *             $ref: '#/components/schemas/Wellness'
 *     responses:
 *       200:
 *         description: Wellness entry updated
 */
router.put("/:id", auth, validate(wellnessSchema), ctrl.update);

/**
 * @swagger
 * /wellness/{id}:
 *   delete:
 *     summary: Delete a wellness entry
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Wellness entry deleted
 */
router.delete("/:id", auth, ctrl.delete);

module.exports = router;

