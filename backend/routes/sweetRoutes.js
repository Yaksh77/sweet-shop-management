const express = require("express");
const router = express.Router();
const {
  addSweet,
  getAllSweets,
  getSweetById,
  deleteSweet,
} = require("../controllers/sweetController");

// ➕ Add Sweet
router.post("/", addSweet);

// 📃 Get all Sweets (with search/sort/filter)
router.get("/", getAllSweets);

// 🔍 Get one sweet by ID
router.get("/:id", getSweetById);

// ❌ Delete a sweet
router.delete("/:id", deleteSweet);

module.exports = router;
