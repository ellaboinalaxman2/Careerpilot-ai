import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Chatbot from "./pages/Chatbot"; // ✅ Import the real Chatbot component

// Home Page Component
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="bg-gray-900/50 backdrop-blur-sm p-4 fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            CareerPilot AI
          </h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white px-4 py-2"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your AI-Powered Career & Learning Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Plan your studies, analyze your resume with AI, and get career
            guidance all in one place.
          </p>
          {!isAuthenticated && (
            <a
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-block"
            >
              Start Your Journey →
            </a>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Study Planner</h3>
            <p className="text-gray-400">
              Organize your learning with tasks, deadlines, and progress
              tracking.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">
              AI Resume Analyzer
            </h3>
            <p className="text-gray-400">
              Get AI-powered resume analysis and ATS compatibility scores.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-green-500 transition">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">AI Chatbot</h3>
            <p className="text-gray-400">
              Get career guidance, coding help, and interview preparation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - Require Authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
