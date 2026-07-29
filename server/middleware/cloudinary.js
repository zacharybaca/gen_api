import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure the Cloudinary SDK with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Store uploaded files directly in Cloudinary under the "avatar_uploads" folder,
// allowing only JPEG/PNG images (via CloudinaryStorage allowedFormats) up to 5 MB
// (enforced by multer limits below).
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatar_uploads",
    allowedFormats: ["jpeg", "png", "jpg"],
    resource_type: "image",
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

/**
 * handleUpload — returns an Express middleware that uploads a single file
 * from the given form field name to Cloudinary.
 * Intercepts multer's LIMIT_FILE_SIZE error and converts it to a 413 response.
 */
export const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      res.status(413);
      return next(new Error("File too large. Maximum size is 5 MB."));
    }
    next(err);
  });
};

export { cloudinary };
