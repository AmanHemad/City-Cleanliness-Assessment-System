const express = require("express");
const router = express.Router();

const adminAuth = require("../Middleware/AdminMiddleware");
const upload = require("../config/multer");

const {
  createReport,
  getReports,
  assignContractor,
  uploadAfterImage,
  resolveReport,
  uploadResolvedImage,
  confirmResolution
} = require("../controllers/reportController");

// ================= USER =================
router.post("/report", upload.single("image"), createReport);
router.get("/report", getReports);
router.post("/confirm", confirmResolution); // user confirms

// ================= ADMIN =================
router.post("/assign", adminAuth, assignContractor);

router.post("/upload-resolved",
  adminAuth,
  upload.single("image"),
  uploadResolvedImage
);

router.post("/after-upload",
  adminAuth,
  upload.single("image"),
  uploadAfterImage
);

router.post("/resolve",
  adminAuth,
  resolveReport
);

module.exports = router;