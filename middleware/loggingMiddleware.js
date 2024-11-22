// loggingMiddleware.js
const logRequestDetails = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass the request to the next middleware or route handler
};

module.exports = logRequestDetails;
