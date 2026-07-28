import path from "path";
import fs from "fs/promises";
import asyncHandler from "express-async-handler";
import { generateCode } from "../utils/codeGenerator.js";

/**
 * Resolves the output directory from the environment variable OUTPUT_DIR,
 * falling back to a "generated" folder next to this file's parent directory.
 */
function resolveOutputDir() {
  return process.env.OUTPUT_DIR
    ? path.resolve(process.env.OUTPUT_DIR)
    : path.resolve(import.meta.dirname, "..", "generated");
}

/**
 * @desc  Generate Express route, controller, and Mongoose model from a schema
 * @route POST /api/generator/generate
 * @access Private
 */
const generateFiles = asyncHandler(async (req, res) => {
  const { modelName, fields } = req.body;

  // generateCode validates inputs and throws on invalid data
  const { model, controller, route, routePrefix } = generateCode(
    modelName,
    fields,
  );

  const outputDir = resolveOutputDir();
  const modelsDir = path.join(outputDir, "models");
  const controllersDir = path.join(outputDir, "controllers");
  const routesDir = path.join(outputDir, "routes");

  await fs.mkdir(modelsDir, { recursive: true });
  await fs.mkdir(controllersDir, { recursive: true });
  await fs.mkdir(routesDir, { recursive: true });

  const pascal = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  await Promise.all([
    fs.writeFile(path.join(modelsDir, `${pascal}.js`), model, "utf8"),
    fs.writeFile(
      path.join(controllersDir, `${pascal}Controller.js`),
      controller,
      "utf8",
    ),
    fs.writeFile(
      path.join(routesDir, `${pascal.toLowerCase()}Routes.js`),
      route,
      "utf8",
    ),
  ]);

  res.status(201).json({
    message: `Files generated successfully for model "${pascal}"`,
    routePrefix,
    files: {
      model: `generated/models/${pascal}.js`,
      controller: `generated/controllers/${pascal}Controller.js`,
      route: `generated/routes/${pascal.toLowerCase()}Routes.js`,
    },
    code: { model, controller, route },
  });
});

/**
 * @desc  Preview generated code without writing files to disk
 * @route POST /api/generator/preview
 * @access Private
 */
const previewFiles = asyncHandler(async (req, res) => {
  const { modelName, fields } = req.body;

  const { model, controller, route, routePrefix } = generateCode(
    modelName,
    fields,
  );

  res.json({
    routePrefix,
    code: { model, controller, route },
  });
});

export { generateFiles, previewFiles };
