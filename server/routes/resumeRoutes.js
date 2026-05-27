const express = require("express");
const router = express.Router();
const {
  analyzeResume,
  getResumeHistory,
  getResumeById,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All routes are protected
// POST /api/resume/analyze - Upload and analyze resume
router.post("/analyze", protect, upload.single("resume"), analyzeResume);

// GET /api/resume/history - Get user's resume history
router.get("/history", protect, getResumeHistory);

// GET /api/resume/:id - Get specific resume analysis
router.get("/:id", protect, getResumeById);

module.exports = router;
