const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  addSweet,
  getAllSweets,
  getSweetById,
  deleteSweet,
  updateSweet,
  purchaseSweet,
  restockSweet,
  addReview,
  addImage,
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

// 💬 Add a review to a sweet
router.post("/:id/review", addReview);

// 🖼️ Add an image to a sweet
router.post("/:id/image", upload.single("image"), addImage);

module.exports = router;
