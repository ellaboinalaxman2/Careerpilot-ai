import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import taskService from "../services/taskService";

const Planner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    startDate: "",
    deadline: "",
    priority: "Medium",
    description: "",
  });

  // Helper function to generate dates between start and end
  const generateDates = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate remaining days
  const getRemainingDays = (deadline) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.subject ||
      !formData.startDate ||
      !formData.deadline
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingTask) {
        const updatedTask = await taskService.updateTask(
          editingTask._id,
          formData,
        );
        setTasks(
          tasks.map((task) =>
            task._id === editingTask._id ? updatedTask : task,
          ),
        );
      } else {
        const newTask = await taskService.createTask(formData);
        setTasks([newTask, ...tasks]);
      }

      setFormData({
        title: "",
        subject: "",
        startDate: "",
        deadline: "",
        priority: "Medium",
        description: "",
      });
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving task:", error);
      alert(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
      }
    }
  };

  const handleDayToggle = async (taskId, date) => {
    try {
      const response = await taskService.toggleDay(taskId, date);
      setTasks(tasks.map((task) => (task._id === taskId ? response : task)));
    } catch (error) {
      console.error("Error toggling day:", error);
      alert("Failed to update progress");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      subject: task.subject,
      startDate: task.startDate.split("T")[0],
      deadline: task.deadline.split("T")[0],
      priority: task.priority,
      description: task.description || "",
    });
    setShowForm(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 bg-red-900/20";
      case "Medium":
        return "text-yellow-500 bg-yellow-900/20";
      case "Low":
        return "text-green-500 bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-900/20";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Study Planner</h1>
            <p className="text-gray-400 mt-1">
              Track your daily learning progress
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({
                title: "",
                subject: "",
                startDate: "",
                deadline: "",
                priority: "Medium",
                description: "",
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition flex items-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Add Study Plan</span>
          </button>
        </div>

        {/* Add/Edit Task Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTask ? "Edit Study Plan" : "Create New Study Plan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Learn React Hooks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="High">High 🔴</option>
                    <option value="Medium">Medium 🟡</option>
                    <option value="Low">Low 🟢</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Add more details about this study plan..."
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingTask ? "Update Plan" : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-2">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Study Plans Yet
              </h3>
              <p className="text-gray-400">
                Click "Add Study Plan" to create your first learning schedule
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const allDates = generateDates(task.startDate, task.deadline);
              const remainingDays = getRemainingDays(task.deadline);
              const isOverdue = remainingDays < 0;

              return (
                <div
                  key={task._id}
                  className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                >
                  {/* Task Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-gray-400">Subject: {task.subject}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          📅 {formatDate(task.startDate)} →{" "}
                          {formatDate(task.deadline)}
                        </p>
                        {task.description && (
                          <p className="text-gray-400 text-sm mt-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-blue-400 hover:text-blue-300 transition p-1"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-red-400 hover:text-red-300 transition p-1"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="p-4 border-b border-gray-700 bg-gray-900/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">
                        Overall Progress
                      </span>
                      <span className="text-white font-bold">
                        {task.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`${getProgressColor(task.progress)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>
                        📊 {task.completedDays.length} / {allDates.length} days
                        completed
                      </span>
                      <span>
                        {isOverdue
                          ? "⚠️ Overdue"
                          : `⏰ ${remainingDays} days left`}
                      </span>
                    </div>
                  </div>

                  {/* Daily Checkboxes */}
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-3">
                      Daily Study Tracker
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {allDates.map((date) => {
                        const isCompleted = task.completedDays.includes(date);
                        const dateObj = new Date(date);
                        const isToday =
                          dateObj.toDateString() === new Date().toDateString();
                        const isPast = dateObj < new Date() && !isToday;

                        return (
                          <label
                            key={date}
                            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${
                              isCompleted
                                ? "bg-green-900/30 border border-green-500"
                                : isToday
                                  ? "bg-blue-900/30 border border-blue-500"
                                  : isPast
                                    ? "bg-gray-700/50 border border-gray-600"
                                    : "bg-gray-700 border border-gray-600 hover:bg-gray-650"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleDayToggle(task._id, date)}
                              className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span
                              className={`text-sm ${
                                isCompleted
                                  ? "text-green-400 line-through"
                                  : isToday
                                    ? "text-blue-400 font-medium"
                                    : "text-gray-300"
                              }`}
                            >
                              {dateObj.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Planner;
