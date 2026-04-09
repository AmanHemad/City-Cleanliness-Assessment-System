const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 🔐 Load environment variables FIRST
dotenv.config();

// 🔌 Connect to MongoDB
connectDB();

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());

// 📦 Routes
app.use("/api", require("./routes/reportRoutes")); // existing routes
app.use("/api/admin", require("./routes/adminRoutes")); // ✅ admin routes

// ❌ REMOVE duplicate dashboard route (IMPORTANT)

// 🚀 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);