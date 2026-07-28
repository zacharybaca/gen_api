import express from "express";
import { body, validationResult } from "express-validator";
import {
  loginUser,
  registerUser,
  logoutUser,
  isUserAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
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

const registerValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username may only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidators = [
  body("email")
    .optional({ checkFalsy: true })
    .trim()

    .isEmail()
    .withMessage("Please enter a valid email address")

    .normalizeEmail(),

  body("username")
    .optional({ checkFalsy: true })

    .trim()

    .isLength({ min: 3, max: 30 })

    .withMessage("Username must be 3–30 characters")

    .matches(/^[a-zA-Z0-9_]+$/)

    .withMessage("Username may only contain letters, numbers, and underscores"),

  body().custom((_, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error("Email or username is required");
    }

    return true;
  }),

  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidators, validate, registerUser);
router.post("/login", loginValidators, validate, loginUser);
router.post("/logout", logoutUser);
router.get("/is-admin", protect, isUserAdmin); // Route to check if the user is an admin
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

export default router;
