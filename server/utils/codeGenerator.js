/**
 * codeGenerator.js
 *
 * Produces in-memory source code for a Mongoose model, an Express controller,
 * and an Express router — all derived from a simple schema descriptor.
 *
 * @param {string} modelName  PascalCase model name, e.g. "BlogPost"
 * @param {Array<{name: string, type: string, required?: boolean}>} fields
 * @returns {{ model: string, controller: string, route: string }}
 */

const VALID_TYPES = [
  "String",
  "Number",
  "Boolean",
  "Date",
  "ObjectId",
  "Mixed",
];

/**
 * Validates generator inputs and throws a descriptive Error on failure.
 */
function validateInputs(modelName, fields) {
  if (!modelName || typeof modelName !== "string") {
    throw new Error("modelName must be a non-empty string");
  }
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(modelName)) {
    throw new Error(
      "modelName must start with a letter and contain only alphanumeric characters",
    );
  }
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new Error("fields must be a non-empty array");
  }

  const seenNames = new Set();
  for (const field of fields) {
    if (!field.name || typeof field.name !== "string") {
      throw new Error("Each field must have a non-empty string name");
    }
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(field.name)) {
      throw new Error(
        `Field name "${field.name}" is not a valid JavaScript identifier`,
      );
    }
    if (seenNames.has(field.name.toLowerCase())) {
      throw new Error(`Duplicate field name: "${field.name}"`);
    }
    seenNames.add(field.name.toLowerCase());

    if (!VALID_TYPES.includes(field.type)) {
      throw new Error(
        `Invalid type "${field.type}" for field "${field.name}". Valid types: ${VALID_TYPES.join(", ")}`,
      );
    }
  }
}

/**
 * Converts a PascalCase model name to camelCase for variable names.
 */
function toCamel(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts a PascalCase model name to a kebab-case route prefix.
 * e.g. "BlogPost" → "blog-posts"
 */
function toRoutePrefix(str) {
  return (
    str
      .replace(/([A-Z])/g, (m, l, offset) => (offset ? "-" : "") + l)
      .toLowerCase() + "s"
  );
}

// ─── Template builders ────────────────────────────────────────────────────────

function buildModel(modelName, fields) {
  const schemaFields = fields
    .map((f) => {
      const typeRef = f.type === "ObjectId" ? "mongoose.Schema.Types.ObjectId" : f.type;
      const required = f.required ? ", required: true" : "";
      return `    ${f.name}: { type: ${typeRef}${required} },`;
    })
    .join("\n");

  return `import mongoose from "mongoose";

const ${toCamel(modelName)}Schema = new mongoose.Schema(
  {
${schemaFields}
  },
  { timestamps: true },
);

const ${modelName} = mongoose.model("${modelName}", ${toCamel(modelName)}Schema);

export default ${modelName};
`;
}

function buildController(modelName, fields) {
  const camel = toCamel(modelName);
  const assignableFields = fields.map((f) => f.name);
  const bodyDestructure = assignableFields.join(", ");
  const bodyAssign = assignableFields.map((n) => `      ${n},`).join("\n");
  const updateAssign = assignableFields
    .map((n) => `  ${camel}.${n} = req.body.${n} ?? ${camel}.${n};`)
    .join("\n");

  return `import asyncHandler from "express-async-handler";
import ${modelName} from "../models/${modelName}.js";

// @desc  Get all ${modelName} documents
// @route GET /api/${toRoutePrefix(modelName)}
// @access Private
const getAll${modelName}s = asyncHandler(async (req, res) => {
  const items = await ${modelName}.find({});
  res.json(items);
});

// @desc  Get a single ${modelName} by id
// @route GET /api/${toRoutePrefix(modelName)}/:id
// @access Private
const get${modelName}ById = asyncHandler(async (req, res) => {
  const ${camel} = await ${modelName}.findById(req.params.id);
  if (!${camel}) {
    res.status(404);
    throw new Error("${modelName} not found");
  }
  res.json(${camel});
});

// @desc  Create a new ${modelName}
// @route POST /api/${toRoutePrefix(modelName)}
// @access Private
const create${modelName} = asyncHandler(async (req, res) => {
  const { ${bodyDestructure} } = req.body;
  const ${camel} = await ${modelName}.create({
${bodyAssign}
  });
  res.status(201).json(${camel});
});

// @desc  Update a ${modelName}
// @route PUT /api/${toRoutePrefix(modelName)}/:id
// @access Private
const update${modelName} = asyncHandler(async (req, res) => {
  const ${camel} = await ${modelName}.findById(req.params.id);
  if (!${camel}) {
    res.status(404);
    throw new Error("${modelName} not found");
  }
${updateAssign}
  const updated = await ${camel}.save();
  res.json(updated);
});

// @desc  Delete a ${modelName}
// @route DELETE /api/${toRoutePrefix(modelName)}/:id
// @access Private
const delete${modelName} = asyncHandler(async (req, res) => {
  const ${camel} = await ${modelName}.findById(req.params.id);
  if (!${camel}) {
    res.status(404);
    throw new Error("${modelName} not found");
  }
  await ${camel}.deleteOne();
  res.json({ message: "${modelName} deleted successfully" });
});

export {
  getAll${modelName}s,
  get${modelName}ById,
  create${modelName},
  update${modelName},
  delete${modelName},
};
`;
}

function buildRoute(modelName) {
  const prefix = toRoutePrefix(modelName);
  return `import express from "express";
import {
  getAll${modelName}s,
  get${modelName}ById,
  create${modelName},
  update${modelName},
  delete${modelName},
} from "../controllers/${modelName}Controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAll${modelName}s).post(protect, create${modelName});
router
  .route("/:id")
  .get(protect, get${modelName}ById)
  .put(protect, update${modelName})
  .delete(protect, delete${modelName});

export default router;
`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate source code strings for a Mongoose model, controller, and route file.
 *
 * @param {string} modelName
 * @param {Array<{name: string, type: string, required?: boolean}>} fields
 * @returns {{ model: string, controller: string, route: string, routePrefix: string }}
 */
function generateCode(modelName, fields) {
  validateInputs(modelName, fields);

  // Normalize: PascalCase model name
  const pascal = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return {
    model: buildModel(pascal, fields),
    controller: buildController(pascal, fields),
    route: buildRoute(pascal),
    routePrefix: toRoutePrefix(pascal),
  };
}

export { generateCode, validateInputs, VALID_TYPES };
