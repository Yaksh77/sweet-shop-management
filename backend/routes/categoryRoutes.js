const express = require("express");
const router = express.Router();

const categories = [
  "Nut-Based",
  "Milk-Based",
  "Syrup-Based",
  "Vegetable-Based",
  "Traditional",
  "Dryfruit",
  "Festival Special",
];

router.get("/", (req, res) => {
  res.status(200).json({ categories });
});

module.exports = router;
