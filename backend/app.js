const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const sweetRoutes = require("./routes/sweetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/sweets", sweetRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;
