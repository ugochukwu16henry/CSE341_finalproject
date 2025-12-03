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
 *         _id: { type: string, readOnly: true }
 *         userId: { type: string, readOnly: true, description: "Set automatically from JWT token" }
 *         mood: { type: string, required: true, minLength: 2, example: "Happy" }
 *         stressLevel: { type: number, minimum: 1, maximum: 10, required: true, example: 5 }
 *         note: { type: string, example: "Feeling good today" }
 *         createdAt: { type: string, format: date-time, readOnly: true }
 *     WellnessRequest:
 *       type: object
 *       required:
 *         - mood
 *         - stressLevel
 *       properties:
 *         mood: { type: string, required: true, minLength: 2, example: "Happy" }
 *         stressLevel: { type: number, minimum: 1, maximum: 10, required: true, example: 5 }
 *         note: { type: string, example: "Feeling good today" }
 */

/**
 * @swagger
 * /wellness:
 *   get:
 *     summary: Get all wellness entries
 *     description: Returns all wellness entries sorted by creation date (newest first) with populated user information
 *     tags: [Wellness]
 *     responses:
 *       200:
 *         description: List of all wellness entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wellness'
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /wellness/user/{userId}:
 *   get:
 *     summary: Get wellness entries by user ID
 *     description: Returns all wellness entries for a specific user, sorted by creation date (newest first)
 *     tags: [Wellness]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the user
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of user wellness entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wellness'
 *       400:
 *         description: Invalid user ID format
 */
router.get("/user/:userId", ctrl.getByUser);

/**
 * @swagger
 * /wellness/{id}:
 *   get:
 *     summary: Get wellness entry by ID
 *     description: Returns a single wellness entry by ID with populated user information
 *     tags: [Wellness]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the wellness entry
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Wellness entry found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wellness'
 *       400:
 *         description: Invalid wellness entry ID format
 *       404:
 *         description: Wellness entry not found
 */
router.get("/:id", ctrl.getById);


/**
 * @swagger
 * /wellness:
 *   post:
 *     summary: Create a new wellness entry
 *     description: Creates a new wellness check-in entry. userId is automatically set from the JWT token. Requires authentication.
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WellnessRequest'
 *           example:
 *             mood: "Happy"
 *             stressLevel: 3
 *             note: "Feeling great today!"
 *     responses:
 *       201:
 *         description: Wellness entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wellness'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - JWT token required
 */
router.post("/", auth, validate(wellnessSchema), ctrl.create);

/**
 * @swagger
 * /wellness/{id}:
 *   put:
 *     summary: Update a wellness entry
 *     description: Updates a wellness entry. Users can only update their own entries. userId cannot be changed.
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the wellness entry
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WellnessRequest'
 *     responses:
 *       200:
 *         description: Wellness entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wellness'
 *       400:
 *         description: Validation error or invalid ID format
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Wellness entry not found or unauthorized
 */
router.put("/:id", auth, validate(wellnessSchema), ctrl.update);

/**
 * @swagger
 * /wellness/{id}:
 *   delete:
 *     summary: Delete a wellness entry
 *     description: Deletes a wellness entry. Users can only delete their own entries. Requires authentication.
 *     tags: [Wellness]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the wellness entry
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       204:
 *         description: Wellness entry deleted successfully
 *       400:
 *         description: Invalid wellness entry ID format
 *       401:
 *         description: Unauthorized - JWT token required
 *       404:
 *         description: Wellness entry not found or unauthorized
 */
router.delete("/:id", auth, ctrl.delete);

module.exports = router;

