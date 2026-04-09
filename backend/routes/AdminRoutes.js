const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminAuth = require("../Middleware/AdminMiddleware"); // ✅ IMPORT MIDDLEWARE

const router = express.Router();

// 🔐 ENV VARIABLES
const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE || "ADMIN123";
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";


// ==============================
// 🔹 ADMIN REGISTER
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;

    // ✅ Validate fields
    if (!email || !password || !adminCode) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // 🔐 Validate admin secret code
    if (adminCode !== ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin code ❌" });
    }

    // ✅ Check existing admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists ⚠️" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create admin
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.json({ message: "Admin registered successfully ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 🔹 ADMIN LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    // ✅ Validate fields
    if (!email || !password || !adminKey) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // 🔐 Validate admin secret key
    if (adminKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid Admin Key ❌" });
    }

    // ✅ Check admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found ❌" });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    // 🔑 Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// 🔹 PROTECTED ADMIN DASHBOARD
// ==============================
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const adminDetails = await Admin.findById(req.admin.id).select("-password");
    res.json({
      message: "Welcome Admin 🎉",
      admin: adminDetails
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;