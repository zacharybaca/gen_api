import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/cloudinary.js";

const router = express.Router();

/**
 * Profile Routes
 * GET:    Retrieve logged-in user's profile
 * PUT:    Update profile (name, email, password, avatar)
 * DELETE: Delete account
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, handleUpload("avatar"), updateUserProfile)
  .delete(protect, deleteUser);

export default router;
