// validationMiddleware.js
const validateListData = (req, res, next) => {
  const { name, responseCodes, imageLinks } = req.body;

  if (
    !name ||
    !responseCodes ||
    !Array.isArray(responseCodes) ||
    !Array.isArray(imageLinks)
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }
  console.log("Request data is valid");
  next(); // Continue to the next middleware or route handler
};

module.exports = validateListData;
