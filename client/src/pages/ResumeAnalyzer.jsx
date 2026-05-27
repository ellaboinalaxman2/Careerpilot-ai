import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import resumeService from "../services/resumeService";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      setError("Please upload a PDF file");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    // Check if token exists before making request
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login again.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    try {
      console.log("Uploading file:", file.name);
      const result = await resumeService.analyzeResume(file);
      console.log("Analysis result:", result);
      setAnalysis(result.analysis);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("resume-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Failed to analyze resume. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === "Network Error") {
        errorMessage =
          "Network error. Please check if backend server is running.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">AI Resume Analyzer</h1>
          <p className="text-gray-400 mt-1">
            Upload your resume for AI-powered analysis and suggestions
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleUpload}>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-300 mb-2">
                {file
                  ? file.name
                  : "Drag & drop your resume here or click to browse"}
              </p>
              <p className="text-gray-500 text-sm">
                Supported format: PDF (Max 5MB)
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-block mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer transition"
              >
                Browse Files
              </label>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📎</span>
                  <span className="text-white">{file.name}</span>
                  <span className="text-gray-400 text-sm">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span>Analyzing Resume...</span>
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </form>
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-800 rounded-lg p-4 text-xs">
            <p className="text-gray-400">Debug Info:</p>
            <p className="text-gray-500">
              Token exists: {localStorage.getItem("token") ? "Yes" : "No"}
            </p>
            <p className="text-gray-500">
              User logged in: {localStorage.getItem("user") ? "Yes" : "No"}
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Resume Score
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#374151"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={getScoreBgColor(analysis.score)}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(analysis.score / 100) * 351.86} 351.86`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}
                    >
                      {analysis.score}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{analysis.summary}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        analysis.atsCompatibility === "Excellent"
                          ? "bg-green-900/50 text-green-400"
                          : analysis.atsCompatibility === "Good"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-red-900/50 text-red-400"
                      }`}
                    >
                      ATS Compatibility: {analysis.atsCompatibility}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                📋 Detected Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.skills &&
                  analysis.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-green-400 mb-4">
                  ✅ Strengths
                </h2>
                <ul className="space-y-2">
                  {analysis.strengths &&
                    analysis.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="text-gray-300 flex items-start space-x-2"
                      >
                        <span className="text-green-400">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">
                  ⚠️ Areas to Improve
                </h2>
                <ul className="space-y-2">
                  {analysis.weaknesses &&
                    analysis.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="text-gray-300 flex items-start space-x-2"
                      >
                        <span className="text-yellow-400">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-orange-400 mb-4">
                🔑 Missing Keywords for ATS
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords &&
                  analysis.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-purple-400 mb-4">
                💡 Improvement Suggestions
              </h2>
              <ul className="space-y-3">
                {analysis.suggestions &&
                  analysis.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="text-gray-300 flex items-start space-x-2"
                    >
                      <span className="text-purple-400">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* No Analysis State */}
        {!analysis && !loading && !error && (
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Resume Analyzed Yet
            </h3>
            <p className="text-gray-400">
              Upload your resume in PDF format to get detailed AI-powered
              analysis
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;
