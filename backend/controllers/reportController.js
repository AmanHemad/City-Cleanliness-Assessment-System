const Report = require("../models/Report");

// CREATE REPORT (POST /api/report)
const createReport = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Dummy ML logic (replace later)
    const mlScore = Math.floor(Math.random() * 100);
    const condition =
      mlScore > 70 ? "GOOD" : mlScore > 40 ? "MODERATE" : "BAD";

    const reason =
      condition === "GOOD"
        ? "Clean road"
        : condition === "MODERATE"
        ? "Moderate cleanliness issues"
        : "Heavy garbage detected";

    const report = await Report.create({
      imageBefore: req.file.path, // Cloudinary URL
      latitude: Number(latitude),
      longitude: Number(longitude),
      mlScore,
      condition,
      reason,
      status: "OPEN",
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create report" });
  }
};

// GET ALL REPORTS (GET /api/report)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = {
  createReport,
  getAllReports,
};
