const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Sweet name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Nut-Based", "Vegetable-Based", "Milk-Based"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be >= 0"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be >= 0"],
    },
  },
  { timestamps: true }
);

const Sweet = mongoose.model("Sweet", sweetSchema);
module.exports = Sweet;

// This code defines a Mongoose schema for a Sweet model, which includes fields for id, name, category,
// price, and quantity. Each field has validation rules to ensure data integrity. The model is then exported
// for use in other parts of the application.
