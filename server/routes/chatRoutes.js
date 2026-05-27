const express = require("express");
const router = express.Router();
const {
  chatWithAI,
  getChatHistory,
  getConversation,
  deleteConversation,
  clearAllConversations,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
// POST /api/chat - Send message to AI
router.post("/", protect, chatWithAI);

// GET /api/chat/history - Get all conversations
router.get("/history", protect, getChatHistory);

// GET /api/chat/:id - Get specific conversation
router.get("/:id", protect, getConversation);

// DELETE /api/chat/:id - Delete a conversation
router.delete("/:id", protect, deleteConversation);

// DELETE /api/chat - Clear all conversations
router.delete("/", protect, clearAllConversations);

module.exports = router;
