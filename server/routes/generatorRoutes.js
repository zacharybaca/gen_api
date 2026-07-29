import express from "express";
import { body, validationResult } from "express-validator";
import { generateFiles, previewFiles } from "../controllers/generatorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Returns the first validation error as a 422 response
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ message: errors.array()[0].msg });
  }
  next();
};

// Input validators for the schema generation endpoints
const schemaValidators = [
  body("modelName")
    .trim()
    .notEmpty()
    .withMessage("modelName is required")
    .matches(/^[A-Za-z][A-Za-z0-9]*$/)
    .withMessage(
      "modelName must start with a letter and contain only alphanumeric characters",
    ),
  body("fields")
    .isArray({ min: 1 })
    .withMessage("fields must be a non-empty array"),
  body("fields.*.name")
    .trim()
    .notEmpty()
    .withMessage("Each field must have a non-empty name")
    .matches(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)
    .withMessage("Field names must be valid JavaScript identifiers"),
  body("fields.*.type")
    .trim()
    .notEmpty()
    .withMessage("Each field must have a type")
    .isIn(["String", "Number", "Boolean", "Date", "ObjectId", "Mixed"])
    .withMessage(
      "Field type must be one of: String, Number, Boolean, Date, ObjectId, Mixed",
    ),
];

// POST /api/generator/generate  — generate and write files to disk
router.post("/generate", protect, schemaValidators, validate, generateFiles);

// POST /api/generator/preview   — return generated code without writing to disk
router.post("/preview", protect, schemaValidators, validate, previewFiles);

export default router;
