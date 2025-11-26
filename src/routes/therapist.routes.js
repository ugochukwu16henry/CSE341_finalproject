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

router.get("/:id", therapistController.getTherapistById);

router.post(
  "/",
  validate(therapistSchema),
  therapistController.createTherapist
);

router.put(
  "/:id",
  validate(therapistSchema),
  therapistController.updateTherapist
);

router.delete("/:id", therapistController.deleteTherapist);

module.exports = router;
