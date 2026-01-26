const Report = require("../models/Report");

/*
  Temporary ML logic
  (later you will replace this with real ML model output)
*/
const runMLModel = () => {
  const score = Math.floor(Math.random() * 100);

  let condition = "GOOD";
  let reason = "Road is clean";

  if (score < 40) {
    condition = "BAD";
    reason = "Heavy garbage / severe road issue detected";
  } else if (score < 80) {
    condition = "MODERATE";
    reason = "Moderate cleanliness issues detected";
  }

  return { score, condition, reason };
};

/*
  @route   POST /api/report
  @desc    User uploads image + GPS → ML score → store in MongoDB
*/
const createReport = async (req, res) => {
  try {
    console.log("HIT /api/report");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image not received" });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Coordinates missing" });
    }

    const mlResult = runMLModel();

    const report = await Report.create({
      imageBefore: req.file.filename,
      latitude: Number(latitude),
      longitude: Number(longitude),
      mlScore: mlResult.score,
      condition: mlResult.condition,
      reason: mlResult.reason,
      status: "OPEN",
    });

    console.log("SAVED REPORT:", report);

    res.status(201).json(report);
  } catch (error) {
    console.error("CREATE REPORT ERROR:", error);
    res.status(500).json({ error: "Server error while saving report" });
  }
};

/*
  @route   GET /api/reports
  @desc    Get all reports (for map & admin)
*/
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("GET REPORTS ERROR:", error);
    res.status(500).json({ error: "Server error while fetching reports" });
  }
};

/*
  @route   POST /api/report/:id/resolve
  @desc    Admin uploads after-clean image → re-score → mark resolved
*/
const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "After-clean image missing" });
    }

    const mlResult = runMLModel();

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        imageAfter: req.file.filename,
        mlScore: mlResult.score,
        condition: mlResult.condition,
        reason: mlResult.reason,
        status: "RESOLVED",
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(updatedReport);
  } catch (error) {
    console.error("RESOLVE REPORT ERROR:", error);
    res.status(500).json({ error: "Server error while resolving report" });
  }
};

/* 🔴 THIS EXPORT IS CRITICAL — DO NOT CHANGE */
module.exports = {
  createReport,
  getReports,
  resolveReport,
};
