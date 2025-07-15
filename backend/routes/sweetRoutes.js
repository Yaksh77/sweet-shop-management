const express = require("express");
const router = express.Router();
const { addSweet } = require("../controllers/sweetController");

// ➕ Add Sweet
router.post("/", addSweet);

module.exports = router;
