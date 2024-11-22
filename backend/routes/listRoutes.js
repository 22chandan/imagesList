const express = require("express");
const router = express.Router();
const List = require("../models/List.js");

// Create a list
router.post("/", async (req, res) => {
  const { name, responseCodes, imageLinks, userId } = req.body;

  try {
    console.log("Creating list:", name);
    const list = new List({
      name,
      responseCodes,
      imageLinks,
      userId, // Associate with user
      createdAt: new Date(),
    });
    await list.save();
    console.log("List created successfully");
    res.status(201).json({ message: "List created successfully", list });
  } catch (error) {
    console.error("Error creating list:", error);
    res
      .status(500)
      .json({ error: "Failed to create the list", details: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const lists = await List.find({ userId }); // Filter by userId
    // if (!lists.length) {
    //   console.log("No lists found for this user", lists);
    //   return res.status(404).json({ message: "No lists found for this user" });
    // }
    // console.log("Lists fetched successfully");
    res.json(lists);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch lists", details: error.message });
  }
});

// Create a list
router.post("/", async (req, res) => {
  const { name, responseCodes, imageLinks, userId } = req.body;

  try {
    const list = new List({
      name,
      responseCodes,
      imageLinks,
      userId, // Associate with user
      createdAt: new Date(),
    });
    await list.save();
    console.log("List created successfully");
    res.status(201).json({ message: "List created successfully", list });
  } catch (error) {
    console.error("Error creating list:", error);
    res
      .status(500)
      .json({ error: "Failed to create the list", details: error.message });
  }
});

// Get lists for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const lists = await List.find({ userId }); // Filter by userId
    if (!lists.length) {
      return res.status(404).json({ message: "No lists found for this user" });
    }
    console.log("Lists fetched successfully");
    res.json(lists);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch lists", details: error.message });
  }
});

// Delete a list
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this list" });
    }

    await list.remove();
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete the list", details: error.message });
  }
});

// Update a list
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, name, responseCodes, imageLinks } = req.body;

  try {
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this list" });
    }

    // Update list fields
    list.name = name || list.name;
    list.responseCodes = responseCodes || list.responseCodes;
    list.imageLinks = imageLinks || list.imageLinks;

    await list.save();
    res.status(200).json({ message: "List updated successfully", list });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update the list", details: error.message });
  }
});

module.exports = router;
