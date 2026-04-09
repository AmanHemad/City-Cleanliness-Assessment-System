const Report = require("../models/Report");
const axios = require("axios");
const FormData = require("form-data");
const cloudinary = require("../config/cloudinary");

// 🔥 SAFE ML FUNCTION
async function scoreWithML(imageUrl) {
  try {
    console.log("📥 Downloading image...");

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const formData = new FormData();
    formData.append("file", response.data, "image.jpg");

    console.log("🚀 Sending to ML...");

    const mlRes = await axios.post(
      "http://localhost:8000/predict/",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    console.log("✅ ML RESPONSE:", mlRes.data);

    const score = mlRes.data?.cleanliness_score || 50;

    let condition;
    if (score >= 80) condition = "GOOD";
    else if (score >= 50) condition = "MODERATE";
    else condition = "BAD";

    let imageML = null;

    try {
      if (mlRes.data?.image) {
        let base64Image = mlRes.data.image;

        if (!base64Image.startsWith("data:image")) {
          base64Image = `data:image/jpeg;base64,${base64Image}`;
        }

        const uploadRes = await cloudinary.uploader.upload(base64Image, {
          folder: "city_cleanliness/ml",
        });

        imageML = uploadRes.secure_url;
      }
    } catch (err) {
      console.error("❌ CLOUDINARY ML IMAGE ERROR:", err.message);
    }

    return {
      mlScore: score,
      condition,
      reason: mlRes.data?.severity || "AI detected issue",
      imageML,
    };
  } catch (err) {
    console.error("❌ ML FAILED:", err.message);

    return {
      mlScore: 50,
      condition: "MODERATE",
      reason: "ML failed → fallback",
      imageML: null,
    };
  }
}

// 🔥 CREATE REPORT
const createReport = async (req, res) => {
  try {
    console.log("🔥 INCOMING FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { latitude, longitude, username, email } = req.body;

    const imageUrl =
      req.file.path ||
      req.file.url ||
      req.file.secure_url;

    if (!imageUrl) {
      return res.status(500).json({ message: "Image URL missing" });
    }

    console.log("📸 IMAGE URL:", imageUrl);

    // 🔥 ML CALL (SAFE)
    const { mlScore, condition, reason, imageML } =
      await scoreWithML(imageUrl);

    const report = await Report.create({
      imageBefore: imageUrl,
      imageML,
      imageAfter: null,
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
    console.error("❌ SERVER ERROR FULL:", error);

    res.status(500).json({
      message: "Failed to create report",
      error: error.message,
    });
  }
};

// 🔥 GET REPORTS
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("❌ FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = {
  createReport,
  getReports,
};