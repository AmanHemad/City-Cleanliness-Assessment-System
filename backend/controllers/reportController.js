const Report = require("../models/Report");
const axios = require("axios");
require("dotenv").config(); // 🔥 IMPORTANT

// ─── Convert image URL → base64 ─────────────────────────────
async function imageUrlToBase64(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });

  const base64 = Buffer.from(response.data).toString("base64");
  const mimeType = response.headers["content-type"] || "image/jpeg";

  return { base64, mimeType };
}

// ─── Gemini AI Scoring ─────────────────────────────────────
async function scoreImageWithGemini(imageUrl) {
  console.log("⚡ Using DUMMY scoring instead of Gemini");

  // Generate random realistic score
  const mlScore = Math.floor(Math.random() * 100);

  let condition;
  if (mlScore <= 40) condition = "BAD";
  else if (mlScore <= 70) condition = "MODERATE";
  else condition = "GOOD";

  const reasons = {
    BAD: [
      "Heavy garbage accumulation visible",
      "Open waste and poor sanitation",
      "Severe littering detected",
    ],
    MODERATE: [
      "Some litter present",
      "Area needs cleaning attention",
      "Moderate waste observed",
    ],
    GOOD: [
      "Clean and well maintained area",
      "No visible garbage",
      "Properly maintained surroundings",
    ],
  };

  const reason =
    reasons[condition][
      Math.floor(Math.random() * reasons[condition].length)
    ];

  return { mlScore, condition, reason };
}

// ─── CREATE REPORT ─────────────────────────────────────────
const createReport = async (req, res) => {
  try {
    const { latitude, longitude, username, email } = req.body;

    console.log("📸 FILE RECEIVED:", req.file);

    const imageUrl = req.file?.path || req.file?.secure_url;

    console.log("🌐 IMAGE URL:", imageUrl);

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    let mlScore, condition, reason;

    try {
      ({ mlScore, condition, reason } =
        await scoreImageWithGemini(imageUrl));

      console.log(
        `✅ Dummy Score: ${mlScore} | ${condition} | ${reason}`
      );
    } catch (err) {
      mlScore = 50;
      condition = "MODERATE";
      reason = "Fallback scoring used.";
    }

    const report = await Report.create({
      imageBefore: imageUrl,
      latitude: Number(latitude),
      longitude: Number(longitude),
      mlScore,
      condition,
      reason,
      status: "OPEN",

      // 🔥 NEW FIELDS
      username,
      email
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    res.status(500).json({ message: "Failed to create report" });
  }
};

// ─── GET ALL REPORTS ───────────────────────────────────────
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("❌ FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = { createReport, getAllReports };