const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Add with other imports
const chatRoutes = require("./routes/chatRoutes");

// Add with other routes

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ---------------------- CORS CONFIGURATION ----------------------
// ✅ CORRECT - No app.options('*', cors()) here
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

// ✅ Preflight requests are handled automatically by cors()
// No need for app.options('*', cors())

// ---------------------- MIDDLEWARE ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/chat", chatRoutes);

// ---------------------- TEST ENDPOINTS ----------------------
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || "development",
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    },
  });
});

// Test Groq API endpoint
app.get("/api/test-groq", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        error: "GROQ_API_KEY not found in environment variables",
      });
    }

    const Groq = require("groq-sdk");
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say 'Groq API is working! This is a test message.'",
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.5,
      max_tokens: 100,
    });

    res.json({
      success: true,
      message: completion.choices[0].message.content,
      apiKeyConfigured: true,
      provider: "Groq AI (Llama 3.1)",
    });
  } catch (error) {
    console.error("Groq test error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      apiKeyConfigured: !!process.env.GROQ_API_KEY,
    });
  }
});

// ---------------------- MAIN API ROUTES ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/resume", resumeRoutes);

// ---------------------- HOME ROUTE ----------------------
app.get("/", (req, res) => {
  res.json({
    message: "CareerPilot AI API is running...",
    version: "1.0.0",
    status: "active",
    timestamp: new Date().toISOString(),
    endpoints: {
      test: "/api/test",
      testGroq: "/api/test-groq",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
      },
      tasks: {
        getAll: "GET /api/tasks",
        create: "POST /api/tasks",
        update: "PUT /api/tasks/:id",
        delete: "DELETE /api/tasks/:id",
        toggle: "PUT /api/tasks/toggle/:id",
        stats: "GET /api/tasks/stats",
      },
      resume: {
        analyze: "POST /api/resume/analyze",
        history: "GET /api/resume/history",
        getById: "GET /api/resume/:id",
        delete: "DELETE /api/resume/:id",
      },
    },
  });
});

// ---------------------- ERROR HANDLING ----------------------
// ✅ CORRECT - No wildcard '*' here
app.use(notFound);
app.use(errorHandler);

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("\n===================================");
  console.log("🚀 CareerPilot AI Server Started");
  console.log("===================================");
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
  console.log("-----------------------------------");
  console.log("📊 Configuration Status:");
  console.log(
    `   - MongoDB: ${process.env.MONGO_URI ? "✅ Connected" : "❌ Not configured"}`,
  );
  console.log(
    `   - JWT Secret: ${process.env.JWT_SECRET ? "✅ Configured" : "❌ Not configured"}`,
  );
  console.log(
    `   - Groq API: ${process.env.GROQ_API_KEY ? "✅ Configured" : "❌ Not configured"}`,
  );
  console.log("===================================\n");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
