import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
