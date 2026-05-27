import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: "📊" },
  { path: "/planner", name: "Study Planner", icon: "📚" },
  { path: "/resume-analyzer", name: "Resume Analyzer", icon: "📄" },
  { path: "/chatbot", name: "AI Chatbot", icon: "💬" },
];

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/planner", name: "Study Planner", icon: "📚" },
    { path: "/resume-analyzer", name: "Resume Analyzer", icon: "📄" },
    { path: "/chatbot", name: "AI Chatbot", icon: "💬" },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 fixed left-0 top-16 h-full overflow-y-auto">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
