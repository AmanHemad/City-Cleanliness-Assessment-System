process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");



dotenv.config();        // 🔴 MUST BE BEFORE connectDB()
// 🔐 Load environment variables FIRST
dotenv.config();

// 🔌 Connect to MongoDB
connectDB();

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});
app.use("/api", require("./routes/reportRoutes"));
// 📦 Routes
app.use("/api", require("./routes/reportRoutes")); // existing routes
app.use("/api/admin", require("./routes/AdminRoutes")); // ✅ admin routes

// ❌ REMOVE duplicate dashboard route (IMPORTANT)

// 🚀 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);