const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // 🔴 default import

const {
  createReport,
  getReports,
  resolveReport,
} = require("../controllers/reportController");

// USER reports issue
router.post("/report", upload.single("image"), createReport);

// GET all reports
router.get("/reports", getReports);

// ADMIN resolves issue
router.post(
  "/report/:id/resolve",
  upload.single("image"),
  resolveReport
);

module.exports = router;
