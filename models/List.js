const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  responseCodes: [String],
  imageLinks: [String],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chandanuser",
    required: true,
  }, // Reference to User model
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("List", ListSchema);
