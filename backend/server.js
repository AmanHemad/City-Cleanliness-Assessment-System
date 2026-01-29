const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();        // 🔴 MUST BE BEFORE connectDB()
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api", require("./routes/reportRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
