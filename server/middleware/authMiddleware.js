import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/**
 * protect — requires a valid JWT cookie.
 * Decodes the token, fetches the user from the DB (minus password),
 * and attaches it to req.user before calling next().
 */
const protect = asyncHandler(async (req, res, next) => {
  // JWT is issued as an httpOnly cookie during login.
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Never expose password hash downstream.
      req.user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }

    // Token is valid but the user record no longer exists
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    return next();
  }

  res.status(401);
  throw new Error("Not authorized, no token");
});

// For strictly Admin-only routes
/**
 * admin — must be stacked after `protect`.
 * Allows the request through only when req.user.role === "admin".
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
