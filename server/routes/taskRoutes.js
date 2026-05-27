const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  toggleTaskDay,
  getTaskStats,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.route("/").get(protect, getTasks).post(protect, createTask);

router.get("/stats", protect, getTaskStats);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

router.put("/toggle/:id", protect, toggleTask);
router.put("/day/:id", protect, toggleTaskDay);

module.exports = router;
