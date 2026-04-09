const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token ❌" });
    }

    // 🔑 Extract token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const verified = jwt.verify(token, JWT_SECRET);

    if (verified.role !== "admin") {
      return res.status(403).json({ message: "Not an admin ❌" });
    }

    req.admin = verified;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token ❌" });
  }
};

module.exports = adminAuth;