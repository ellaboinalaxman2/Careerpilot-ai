const fs = require("fs");
const asyncHandler = require("express-async-handler");
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");

// Analyze resume
const analyzeResume = asyncHandler(async (req, res) => {
  console.log("=== RESUME ANALYSIS STARTED ===");

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a PDF file");
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    const wordCount = resumeText.split(" ").length;
    const hasEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(resumeText);
    const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeText);

    let score = 60;
    if (hasEmail) score += 10;
    if (hasPhone) score += 10;
    if (wordCount > 300) score += 10;
    score = Math.min(score, 95);

    const analysisData = {
      score: score,
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "Communication",
        "Problem Solving",
      ],
      strengths: ["Good structure", "Clear experience"],
      weaknesses: ["Add quantifiable achievements"],
      suggestions: ["Add numbers to achievements", "Improve summary"],
      missingKeywords: ["Leadership", "Project Management"],
      atsCompatibility: score > 70 ? "Good" : "Average",
      summary: `Resume has ${wordCount} words. ${hasEmail ? "Email found" : "Add email"}.`,
    };

    const resumeRecord = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
      analysis: analysisData,
      score: analysisData.score,
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      analysis: analysisData,
      resumeId: resumeRecord._id,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error:", error.message);
    res.status(500);
    throw new Error(error.message || "Failed to analyze resume");
  }
});

// Get resume history
const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(resumes);
});

// Get resume by ID
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  res.json(resume);
});

module.exports = {
  analyzeResume,
  getResumeHistory,
  getResumeById,
};
