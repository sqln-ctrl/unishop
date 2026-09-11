import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "unishop/products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Upload one or more product images
// @route   POST /api/uploads
// @access  Private
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const results = await Promise.all(req.files.map((file) => streamUpload(file.buffer)));

    const urls = results.map((r) => r.secure_url);
    res.status(201).json({ urls });
  } catch (error) {
    next(error);
  }
};