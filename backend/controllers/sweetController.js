const Sweet = require("../models/Sweet");

// ➕ Add a new sweet
exports.addSweet = async (req, res) => {
  try {
    const { id, name, category, price, quantity, greenScore } = req.body;

    // Check for duplicate ID
    const exists = await Sweet.findOne({ id });
    if (exists) {
      return res.status(400).json({ message: "Sweet ID already exists" });
    }

    const sweet = await Sweet.create({
      id,
      name,
      category,
      price,
      quantity,
      greenScore,
    });
    res.status(201).json({ message: "Sweet added successfully", data: sweet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add sweet", error: error.message });
  }
};

// 📃 Get all sweets (with optional filter/sort)
exports.getAllSweets = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;

    const query = {};

    // Filtering
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sweets = Sweet.find(query);

    // Sorting
    if (sort) {
      const sortField = sort.replace("_asc", "").replace("_desc", "");
      const sortOrder = sort.endsWith("_desc") ? -1 : 1;
      sweets = sweets.sort({ [sortField]: sortOrder });
    }

    const results = await sweets;
    res.status(200).json({ count: results.length, data: results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch sweets", error: error.message });
  }
};

// 🔍 Get one sweet by ID
exports.getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findOne({ id: req.params.id });

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.status(200).json({ data: sweet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sweet", error: error.message });
  }
};

// ❌ Delete a sweet
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findOneAndDelete({ id: req.params.id });

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found to delete" });
    }

    res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sweet", error: error.message });
  }
};

// ✏️ Update a sweet (optional full update)
exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!sweet)
      return res.status(404).json({ message: "Sweet not found to update" });
    res.status(200).json({ message: "Sweet updated", data: sweet });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// 🛒 Purchase sweet (decrease quantity)
exports.purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findOne({ id: req.params.id });

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({ message: "Sweet purchased", data: sweet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error purchasing sweet", error: error.message });
  }
};

// 📦 Restock sweet (increase quantity)
exports.restockSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findOne({ id: req.params.id });

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({ message: "Sweet restocked", data: sweet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error restocking sweet", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { name, message, rating } = req.body;

  if (!name || !message || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sweet = await Sweet.findOne({ id: req.params.id });
  if (!sweet) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  sweet.reviews.push({ name, message, rating });
  sweet.loyaltyPoints += 10;
  await sweet.save();

  res.status(201).json({ message: "Review added", data: sweet });
};

exports.addImage = async (req, res) => {
  try {
    const sweet = await Sweet.findOne({ id: req.params.id });

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    sweet.imagePath = req.file.path;
    await sweet.save();

    res.status(200).json({ message: "Image uploaded", path: req.file.path });
  } catch (error) {
    console.error("Upload error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
