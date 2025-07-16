const Sweet = require("../models/Sweet");

// ➕ Add a new sweet
exports.addSweet = async (req, res) => {
  try {
    const { id, name, category, price, quantity } = req.body;

    // Check for duplicate ID
    const exists = await Sweet.findOne({ id });
    if (exists) {
      return res.status(400).json({ message: "Sweet ID already exists" });
    }

    const sweet = await Sweet.create({ id, name, category, price, quantity });
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
