const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });
const mongoose = require("mongoose");
const Sweet = require("../models/Sweet");

const sweets = [
  {
    id: 1002,
    name: "Gajar Halwa",
    category: "Vegetable-Based",
    price: 30,
    quantity: 15,
  },
  {
    id: 1003,
    name: "Gulab Jamun",
    category: "Milk-Based",
    price: 10,
    quantity: 50,
  },
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB Connected");

    await Sweet.deleteMany(); // clear existing
    await Sweet.insertMany(sweets);

    console.log("✅ Seed data inserted");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
