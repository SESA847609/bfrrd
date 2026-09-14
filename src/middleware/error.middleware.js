const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // Duplicate MongoDB key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate record already exists",
    });
  }

  const status = err.status || 500;

  return res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message,
  });
};

module.exports = errorHandler;
