import multer from "multer";

// Images are held in memory only long enough to stream to Cloudinary.
// Nothing is written to disk.

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

// General upload middleware
export default upload;

// Product image upload middleware
export const uploadProductImages = upload.array("images", 5);