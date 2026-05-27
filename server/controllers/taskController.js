const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, subject, startDate, deadline, priority, description } =
    req.body;

  if (!title || !subject || !startDate || !deadline) {
    res.status(400);
    throw new Error("Please add title, subject, start date and deadline");
  }

  // Validate dates
  if (new Date(startDate) > new Date(deadline)) {
    res.status(400);
    throw new Error("Start date cannot be after deadline");
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    subject,
    startDate,
    deadline,
    completedDays: [],
    progress: 0,
    priority: priority || "Medium",
    description: description || "",
  });

  res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await task.deleteOne();
  res.status(200).json({ message: "Task deleted successfully" });
});

// @desc    Toggle task completion status
// @route   PUT /api/tasks/toggle/:id
// @access  Private
const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  task.completed = !task.completed;
  const updatedTask = await task.save();

  res.status(200).json(updatedTask);
});

// @desc    Toggle a specific day for a task
// @route   PUT /api/tasks/day/:id
// @access  Private
const toggleTaskDay = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Check if date is within range
  const checkDate = new Date(date);
  const start = new Date(task.startDate);
  const end = new Date(task.deadline);

  if (checkDate < start || checkDate > end) {
    res.status(400);
    throw new Error("Date is outside task range");
  }

  // Toggle the date in completedDays array
  const exists = task.completedDays.includes(date);

  if (exists) {
    task.completedDays = task.completedDays.filter((d) => d !== date);
  } else {
    task.completedDays.push(date);
  }

  // Calculate total days in range
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Calculate progress percentage
  task.progress = Math.round((task.completedDays.length / totalDays) * 100);

  await task.save();

  res.status(200).json(task);
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = asyncHandler(async (req, res) => {
  const totalTasks = await Task.countDocuments({ user: req.user._id });
  const completedTasks = await Task.countDocuments({
    user: req.user._id,
    completed: true,
  });
  const pendingTasks = totalTasks - completedTasks;

  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  // Calculate average progress of all tasks
  const tasks = await Task.find({ user: req.user._id });
  const avgProgress =
    tasks.length > 0
      ? tasks.reduce((sum, task) => sum + (task.progress || 0), 0) /
        tasks.length
      : 0;

  res.status(200).json({
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: parseInt(completionRate),
    averageProgress: Math.round(avgProgress),
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  toggleTaskDay,
  getTaskStats,
};
