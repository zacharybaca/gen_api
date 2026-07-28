import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateCode, validateInputs, VALID_TYPES } from "../utils/codeGenerator.js";

// ─── validateInputs ──────────────────────────────────────────────────────────
describe("validateInputs", () => {
  const validFields = [{ name: "title", type: "String" }];

  it("throws when modelName is missing", () => {
    expect(() => validateInputs("", validFields)).toThrow(
      "modelName must be a non-empty string",
    );
  });

  it("throws when modelName contains invalid characters", () => {
    expect(() => validateInputs("my-model", validFields)).toThrow(
      "modelName must start with a letter",
    );
  });

  it("throws when fields array is empty", () => {
    expect(() => validateInputs("Post", [])).toThrow(
      "fields must be a non-empty array",
    );
  });

  it("throws when a field name is not a valid identifier", () => {
    expect(() =>
      validateInputs("Post", [{ name: "123bad", type: "String" }]),
    ).toThrow("not a valid JavaScript identifier");
  });

  it("throws when a field has a duplicate name (case-insensitive)", () => {
    expect(() =>
      validateInputs("Post", [
        { name: "title", type: "String" },
        { name: "Title", type: "Number" },
      ]),
    ).toThrow("Duplicate field name");
  });

  it("throws when a field type is invalid", () => {
    expect(() =>
      validateInputs("Post", [{ name: "count", type: "Array" }]),
    ).toThrow("Invalid type");
  });

  it("passes for a valid modelName and fields", () => {
    expect(() =>
      validateInputs("BlogPost", [
        { name: "title", type: "String", required: true },
        { name: "views", type: "Number" },
      ]),
    ).not.toThrow();
  });
});

// ─── generateCode ────────────────────────────────────────────────────────────
describe("generateCode", () => {
  const fields = [
    { name: "title", type: "String", required: true },
    { name: "body", type: "String" },
    { name: "published", type: "Boolean" },
    { name: "author", type: "ObjectId" },
  ];

  let result;
  beforeEach(() => {
    result = generateCode("Post", fields);
  });

  it("returns model, controller, route, and routePrefix", () => {
    expect(result).toHaveProperty("model");
    expect(result).toHaveProperty("controller");
    expect(result).toHaveProperty("route");
    expect(result).toHaveProperty("routePrefix");
  });

  it("generates the correct route prefix", () => {
    expect(result.routePrefix).toBe("posts");
  });

  it("uses kebab-case with trailing 's' for PascalCase compound names", () => {
    const { routePrefix } = generateCode("BlogPost", [
      { name: "title", type: "String" },
    ]);
    expect(routePrefix).toBe("blog-posts");
  });

  // ── model checks ──────────────────────────────────────────────────────────
  describe("generated model", () => {
    it("includes mongoose import", () => {
      expect(result.model).toContain('import mongoose from "mongoose"');
    });

    it("defines the schema with supplied fields", () => {
      expect(result.model).toContain("title: { type: String, required: true }");
      expect(result.model).toContain("body: { type: String }");
      expect(result.model).toContain("published: { type: Boolean }");
      expect(result.model).toContain(
        "author: { type: mongoose.Schema.Types.ObjectId }",
      );
    });

    it("exports the model as default", () => {
      expect(result.model).toContain("export default Post");
    });
  });

  // ── controller checks ─────────────────────────────────────────────────────
  describe("generated controller", () => {
    it("imports the generated model", () => {
      expect(result.controller).toContain('import Post from "../models/Post.js"');
    });

    it("exports all five CRUD handlers", () => {
      expect(result.controller).toContain("getAllPosts");
      expect(result.controller).toContain("getPostById");
      expect(result.controller).toContain("createPost");
      expect(result.controller).toContain("updatePost");
      expect(result.controller).toContain("deletePost");
    });

    it("uses asyncHandler for each function", () => {
      const count = (result.controller.match(/asyncHandler/g) || []).length;
      // 5 route handlers + 1 import = 6
      expect(count).toBe(6);
    });
  });

  // ── route checks ──────────────────────────────────────────────────────────
  describe("generated route", () => {
    it("imports from the generated controller", () => {
      expect(result.route).toContain(
        'from "../controllers/PostController.js"',
      );
    });

    it("uses protect middleware", () => {
      expect(result.route).toContain("protect");
    });

    it("registers collection and item routes", () => {
      expect(result.route).toContain('router.route("/")');
      // /:id route is chained across multiple lines
      expect(result.route).toContain('.route("/:id")');
    });
  });

  // ── normalisation ─────────────────────────────────────────────────────────
  it("normalises a lowercase modelName to PascalCase", () => {
    const { model } = generateCode("post", [{ name: "title", type: "String" }]);
    expect(model).toContain("const Post = mongoose.model");
  });
});

// ─── VALID_TYPES ─────────────────────────────────────────────────────────────
describe("VALID_TYPES", () => {
  it("exports the expected set of Mongoose types", () => {
    expect(VALID_TYPES).toEqual(
      expect.arrayContaining([
        "String",
        "Number",
        "Boolean",
        "Date",
        "ObjectId",
        "Mixed",
      ]),
    );
  });
});

// ─── generatorController (mocked fs) ─────────────────────────────────────────
describe("generatorController", () => {
  let generateFiles, previewFiles;
  let mkdirMock, writeFileMock;

  beforeEach(async () => {
    mkdirMock = vi.fn().mockResolvedValue(undefined);
    writeFileMock = vi.fn().mockResolvedValue(undefined);

    vi.doMock("fs/promises", () => ({
      default: { mkdir: mkdirMock, writeFile: writeFileMock },
    }));

    const mod = await import("../controllers/generatorController.js");
    generateFiles = mod.generateFiles;
    previewFiles = mod.previewFiles;
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  function makeReqRes(body) {
    const req = { body };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    return { req, res };
  }

  it("previewFiles returns generated code without writing files", async () => {
    const { req, res } = makeReqRes({
      modelName: "Widget",
      fields: [{ name: "label", type: "String" }],
    });

    await previewFiles(req, res, vi.fn());

    expect(writeFileMock).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        routePrefix: "widgets",
        code: expect.objectContaining({
          model: expect.any(String),
          controller: expect.any(String),
          route: expect.any(String),
        }),
      }),
    );
  });

  it("generateFiles writes three files and responds 201", async () => {
    const { req, res } = makeReqRes({
      modelName: "Widget",
      fields: [{ name: "label", type: "String" }],
    });

    await generateFiles(req, res, vi.fn());

    expect(mkdirMock).toHaveBeenCalledTimes(3);
    expect(writeFileMock).toHaveBeenCalledTimes(3);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Widget"),
        routePrefix: "widgets",
        files: expect.objectContaining({
          model: expect.stringContaining("Widget"),
          controller: expect.stringContaining("Widget"),
          route: expect.stringContaining("widget"),
        }),
        code: expect.objectContaining({
          model: expect.any(String),
          controller: expect.any(String),
          route: expect.any(String),
        }),
      }),
    );
  });

  it("generateFiles propagates errors from generateCode (bad modelName)", async () => {
    const { req, res } = makeReqRes({
      modelName: "bad-name",
      fields: [{ name: "label", type: "String" }],
    });
    const next = vi.fn();

    await generateFiles(req, res, next);

    // asyncHandler should forward the error to next()
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(writeFileMock).not.toHaveBeenCalled();
  });
});
