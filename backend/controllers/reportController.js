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
const assignContractor = async (req, res) => {
  try {
    const { reportId, contractorName } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.assignedContractor = contractorName;
    report.contractorStatus = "IN_PROGRESS";

    await report.save();

    res.json({ message: "Contractor assigned ✅", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const uploadAfterImage = async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image missing" });
    }

    // 🔥 Run ML again
    const { mlScore, condition, reason } =
      await scoreWithML(imageUrl);

    report.imageAfter = imageUrl;
    report.mlScore = mlScore;
    report.condition = condition;
    report.reason = reason;
    report.contractorStatus = "COMPLETED";

    await report.save();

    res.json({ message: "After image uploaded ✅", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const uploadResolvedImage = async (req, res) => {
  try {
    if (!req.admin || req.admin.role !== "admin") {
      return res.status(403).json({ message: "Admin only ❌" });
    }

    const { reportId } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Not found" });
    }

    const imageUrl = req.file?.path;
    if (!imageUrl) {
      return res.status(400).json({ message: "Image missing" });
    }

    const { mlScore, condition, reason, imageML } =
      await scoreWithML(imageUrl);

    report.imageAfter = imageUrl;
    report.resolvedML = imageML;
    report.mlScore = mlScore;
    report.condition = condition;
    report.reason = reason;

    await report.save();

    res.json({ message: "Resolved image uploaded ✅", report });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const confirmResolution = async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Not found" });
    }

    report.userConfirmed = true;
    report.status = "RESOLVED";

    await report.save();

    res.json({ message: "User confirmed ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = await Report.findById(reportId);
    if (!req.admin || req.admin.role !== "admin") {
  return res.status(403).json({ message: "Admin only ❌" });
}
    if (!report) {
      return res.status(404).json({ message: "Not found" });
    }

    report.status = "RESOLVED";
    report.resolvedAt = new Date();

    await report.save();

    res.json({ message: "Resolved ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
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
  assignContractor,
  uploadAfterImage,
  resolveReport,
  uploadResolvedImage,   // ✅ MUST BE HERE
  confirmResolution      // ✅ MUST BE HERE
};