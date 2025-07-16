const express = require("express");
const router = express.Router();
const {
  addSweet,
  getAllSweets,
  getSweetById,
  deleteSweet,
  updateSweet,
  purchaseSweet,
  restockSweet,
} = require("../controllers/sweetController");

// ➕ Add Sweet
router.post("/", addSweet);

// 📃 Get all Sweets (with search/sort/filter)
router.get("/", getAllSweets);

// 🔍 Get one sweet by ID
router.get("/:id", getSweetById);

// ❌ Delete a sweet
router.delete("/:id", deleteSweet);

// ✏️ Update sweet details
router.put("/:id", updateSweet);

// 🛒 Purchase sweet (reduce quantity)
router.patch("/:id/purchase", purchaseSweet);

// 📦 Restock sweet (increase quantity)
router.patch("/:id/restock", restockSweet);

module.exports = router;
