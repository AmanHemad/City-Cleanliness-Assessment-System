const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const {
  createReport,
  getReports,
} = require("../controllers/reportController");

router.post("/report", upload.single("image"), createReport);
router.get("/report", getReports);

module.exports = router;