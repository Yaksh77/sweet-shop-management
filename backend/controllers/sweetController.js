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
