const express = require("express");
const router = express.Router();
const { addSweet, getAllSweets } = require("../controllers/sweetController");

// ➕ Add Sweet
router.post("/", addSweet);

// 📃 Get all Sweets (with search/sort/filter)
router.get("/", getAllSweets);

module.exports = router;
