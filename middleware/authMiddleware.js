// authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  //   console.log("Token:", token);
  if (!token) {
    console.log("No token, authorization denied");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Extract the token from the header and verify it
    const t = token.split(" ")[1]; // Remove Bearer from token
    console.log("Token:", t);
    const decoded = jwt.verify(t, "iamchandankumar"); // Use your JWT secret here
    req.user = decoded; // Attach user info to the request
    console.log("Decoded token:", decoded);
    next(); // Move to the next middleware/route handler
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authenticate;
