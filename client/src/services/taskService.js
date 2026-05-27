import api from "./api";

const TASKS_URL = "/tasks";

// Get all tasks
const getTasks = async () => {
  const response = await api.get(TASKS_URL);
  return response.data;
};

// Create a task
const createTask = async (taskData) => {
  const response = await api.post(TASKS_URL, taskData);
  return response.data;
};

// Update a task
const updateTask = async (taskId, taskData) => {
  const response = await api.put(`${TASKS_URL}/${taskId}`, taskData);
  return response.data;
};

// Delete a task
const deleteTask = async (taskId) => {
  const response = await api.delete(`${TASKS_URL}/${taskId}`);
  return response.data;
};

// Toggle task completion
const toggleTask = async (taskId) => {
  const response = await api.put(`${TASKS_URL}/toggle/${taskId}`);
  return response.data;
};

// Toggle a specific day
const toggleDay = async (taskId, date) => {
  const response = await api.put(`${TASKS_URL}/day/${taskId}`, { date });
  return response.data;
};

// Get task statistics
const getTaskStats = async () => {
  const response = await api.get(`${TASKS_URL}/stats`);
  return response.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  toggleDay,
  getTaskStats,
};

export default taskService;
