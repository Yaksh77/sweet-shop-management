const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const sweetRoutes = require("./routes/sweetRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/sweets", sweetRoutes);

// Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
