export const notFound = (req, res, next) => {
  next(Object.assign(new Error(`Not Found - ${req.originalUrl}`), { status: 404 }));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message;

  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "You can upload a maximum of 5 images";
    } else if (err.code === "LIMIT_FILE_SIZE") {
      message = "Each image must be 5MB or smaller";
    }
  }
  if (err.message === "Only JPEG, PNG, WEBP, or GIF images are allowed") statusCode = 400;

  if (err.code === "P2002") {
    statusCode = 400;
    message = "Duplicate field value entered";
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.code === "P2003") {
    statusCode = 400;
    message = "The related user or product no longer exists";
  } else if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Invalid request data";
  } else if (err.name === "PrismaClientInitializationError" || ["P1008", "P2024", "P2034"].includes(err.code)) {
    statusCode = 503;
    message = "Database unavailable. Please try again.";
  } else if (err.name?.startsWith("Prisma")) {
    message = "Database operation failed";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
