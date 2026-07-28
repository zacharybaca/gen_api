import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("jsonwebtoken", () => ({
  default: { verify: vi.fn() },
}));

vi.mock("../models/User.js", () => ({
  default: { findById: vi.fn() },
}));

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Helper: run asyncHandler-wrapped middleware and collect the next() argument
const runMiddleware = (fn, req, res) =>
  new Promise((resolve) => {
    fn(req, res, (err) => resolve(err));
  });

describe("protect middleware", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { cookies: {}, originalUrl: "/api/test" };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  });

  it("attaches user and calls next() with a valid token", async () => {
    req.cookies.jwt = "valid-token";
    jwt.verify.mockReturnValue({ userId: "user123" });
    User.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ _id: "user123", role: "user" }),
    });

    const err = await runMiddleware(protect, req, res);

    expect(err).toBeUndefined();
    expect(req.user).toEqual({ _id: "user123", role: "user" });
  });

  it("calls next(Error) when no token is present", async () => {
    const err = await runMiddleware(protect, req, res);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Not authorized, no token");
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("calls next(Error) when token verification fails", async () => {
    req.cookies.jwt = "bad-token";
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const err = await runMiddleware(protect, req, res);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Not authorized, token failed");
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("admin middleware", () => {
  it("calls next() when user has admin role", () => {
    const req = { user: { role: "admin" } };
    const res = { status: vi.fn().mockReturnThis() };
    const next = vi.fn();

    admin(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("throws when user is not an admin", () => {
    const req = { user: { role: "user" } };
    const res = { status: vi.fn().mockReturnThis() };
    const next = vi.fn();

    expect(() => admin(req, res, next)).toThrow("Not authorized as an admin");
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
