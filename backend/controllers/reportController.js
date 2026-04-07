const Report = require("../models/Report");
const axios = require("axios");
const FormData = require("form-data");

// 🔥 ML FUNCTION (FastAPI YOLO)
async function scoreWithML(imageUrl) {
  try {
    console.log("📥 Downloading image from Cloudinary...");

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const formData = new FormData();
    formData.append("file", response.data, "image.jpg");

    console.log("🚀 Sending image to ML server...");

    const res = await axios.post(
      "http://localhost:8000/predict/",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const score = res.data.cleanliness_score;

    // 🔥 Convert ML → App format
    let condition;
    if (score >= 80) condition = "GOOD";
    else if (score >= 50) condition = "MODERATE";
    else condition = "BAD";

    console.log("✅ ML RESPONSE:", res.data);

    return {
      mlScore: score,
      condition: condition,
      reason: res.data.severity || "AI detected issue",
      imageAfter: res.data.image, // base64 processed image
    };
  } catch (err) {
    console.error("❌ ML ERROR:", err.message);
    throw err;
  }
}

// 🔥 CREATE REPORT
const createReport = async (req, res) => {
  try {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const username = req.body.username || "Anonymous";
    const email = req.body.email || "No Email";

    console.log("📦 BODY:", req.body);
    console.log("📸 FILE:", req.file);

    const imageUrl = req.file?.path || req.file?.secure_url;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    console.log("🌐 IMAGE URL:", imageUrl);

    let mlScore, condition, reason, imageAfter;

    try {
      // 🔥 CALL ML MODEL
      ({ mlScore, condition, reason, imageAfter } =
        await scoreWithML(imageUrl));
    } catch (err) {
      console.log("⚠️ ML failed → using fallback");

      mlScore = 50;
      condition = "MODERATE";
      reason = "Fallback scoring";
      imageAfter = null;
    }

    // 🔥 SAVE TO DB
    const report = await Report.create({
      imageBefore: imageUrl,
      imageAfter,
      latitude: Number(latitude),
      longitude: Number(longitude),
      mlScore,
      condition,
      reason,
      status: "OPEN",
      username,
      email,
    });

    console.log("✅ REPORT SAVED:", report._id);

    res.status(201).json(report);
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    res.status(500).json({ message: "Failed to create report" });
  }
};

// 🔥 GET ALL REPORTS
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = {
  createReport,
  getReports,
};