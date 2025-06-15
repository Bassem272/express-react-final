import multer from "multer";
import path from "path";

// Storage for memory
const storage = multer.memoryStorage();

// Only for routes that upload images
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
}

// ✅ This is for routes that expect a file
export const uploadWithFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ This is for routes that only accept fields (no files)
export const uploadNoFile = multer().none();
