const path = require("path");
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({ path: path.resolve(__dirname, envFile) });
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
