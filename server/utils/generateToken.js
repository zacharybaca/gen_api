import jwt from "jsonwebtoken";

/**
 * generateToken — signs a JWT containing the user's ID and sets it as an
 * httpOnly cookie on the response.  The cookie is marked secure + sameSite=none
 * in production so it works across origins; in development it uses lax so plain
 * HTTP still works.  Token and cookie both expire after 30 days.
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
