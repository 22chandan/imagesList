// errorHandlingMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // Send a standardized error message to the client
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message || err,
  });
};

module.exports = errorHandler;
