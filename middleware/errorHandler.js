const ErrorResponse = require("../utils/ErrorResponse");

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `Duplicate value entered ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.keys(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};
