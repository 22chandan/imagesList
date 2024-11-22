const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import Middleware
const authenticate = require("./middleware/authMiddleware");
const logRequestDetails = require("./middleware/loggingMiddleware");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const validateListData = require("./middleware/validationMiddleware");

const app = express();
const port = 5000;

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());

// Log request details for every request
app.use(logRequestDetails);

// Routes
const userRoutes = require("./routes/userRoutes.js");
const listRoutes = require("./routes/listRoutes.js");

// Apply authentication middleware to the routes that need it
app.use("/api/users", userRoutes);
app.use("/api/lists", authenticate, listRoutes); // All /lists routes will require authentication

// // Example of applying validation middleware for creating lists
// app.post("/api/lists", validateListData, (req, res) => {
//   // Handle the creation of a list here
//   res.status(201).json({ message: "List created successfully" });
// });

// Error handling middleware should always be the last middleware
app.use(errorHandler);

mongoose.connect(
  process.env.mongourl || "mongodb://localhost:27017/mern-auth",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

app.listen(process.env.PORT || port, () =>
  console.log(`Server running on port ${port}`)
);
