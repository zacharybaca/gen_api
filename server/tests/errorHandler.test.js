import { describe, it, expect, vi } from "vitest";
import { errorHandler } from "../middleware/errorHandler.js";

const makeRes = (statusCode) => ({
  statusCode,
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

describe("errorHandler", () => {
  it("defaults to 500 when response status is 200", () => {
    const err = new Error("Something went wrong");
    const res = makeRes(200);

    errorHandler(err, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Something went wrong" }),
    );
  });

  it("preserves a non-200 status code", () => {
    const err = new Error("Not found");
    const res = makeRes(404);

    errorHandler(err, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("omits stack trace in production", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const err = new Error("Prod error");
    const res = makeRes(500);

    errorHandler(err, {}, res, vi.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ stack: null }),
    );

    process.env.NODE_ENV = original;
  });

  it("includes stack trace in development", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const err = new Error("Dev error");
    const res = makeRes(500);

    errorHandler(err, {}, res, vi.fn());

    const call = res.json.mock.calls[0][0];
    expect(call.stack).toBeTruthy();

    process.env.NODE_ENV = original;
  });
});
