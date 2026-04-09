const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ADMIN_SECRET = process.env.ADMIN_SECRET || "mySuperSecret123";

// 🔐 ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  const { email, password, adminKey } = req.body;

  try {
    // 1. Check secret key
    if (adminKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid Admin Key ❌" });
    }

    // 2. Check admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found ❌" });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};