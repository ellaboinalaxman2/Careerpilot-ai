import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Study Progress",
      value: "45%",
      color: "from-blue-500 to-blue-600",
      icon: "📚",
    },
    {
      title: "Tasks Completed",
      value: "12",
      color: "from-green-500 to-green-600",
      icon: "✅",
    },
    {
      title: "Resume Score",
      value: "78%",
      color: "from-purple-500 to-purple-600",
      icon: "📄",
    },
    {
      title: "AI Sessions",
      value: "8",
      color: "from-orange-500 to-orange-600",
      icon: "🤖",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Completed React module",
      time: "2 hours ago",
      type: "study",
    },
    {
      id: 2,
      action: "Uploaded resume for analysis",
      time: "1 day ago",
      type: "resume",
    },
    {
      id: 3,
      action: "Chat with AI about career",
      time: "2 days ago",
      type: "chat",
    },
    { id: 4, action: "Started DBMS course", time: "3 days ago", type: "study" },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400">
          Ready to boost your career today? Let's check your progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm mb-1">
                  {stat.title}
                </p>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {activity.type === "study" && "📖"}
                    {activity.type === "resume" && "📄"}
                    {activity.type === "chat" && "💬"}
                  </span>
                  <div>
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            AI Suggestions
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
              <p className="text-blue-300 text-sm font-medium mb-2">
                💡 Study Tip
              </p>
              <p className="text-white text-sm">
                You haven't studied DBMS this week. Practice SQL joins to
                improve your database skills.
              </p>
            </div>
            <div className="p-4 bg-green-900/30 border border-green-500 rounded-lg">
              <p className="text-green-300 text-sm font-medium mb-2">
                📄 Resume Tip
              </p>
              <p className="text-white text-sm">
                Add more quantifiable achievements to your work experience
                section.
              </p>
            </div>
            <div className="p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
              <p className="text-purple-300 text-sm font-medium mb-2">
                🎯 Career Tip
              </p>
              <p className="text-white text-sm">
                Based on your skills, consider learning Node.js to become a
                full-stack developer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition flex items-center justify-center space-x-2">
          <span className="text-xl">➕</span>
          <span>Add Study Task</span>
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition flex items-center justify-center space-x-2">
          <span className="text-xl">📤</span>
          <span>Upload Resume</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition flex items-center justify-center space-x-2">
          <span className="text-xl">💬</span>
          <span>Ask AI Assistant</span>
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
