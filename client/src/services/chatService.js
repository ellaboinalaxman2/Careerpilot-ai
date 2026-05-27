import api from "./api";

const CHAT_URL = "/chat";

// Send message to AI
const sendMessage = async (message, conversationId = null) => {
  const response = await api.post(CHAT_URL, { message, conversationId });
  return response.data;
};

// Get chat history
const getChatHistory = async () => {
  const response = await api.get(`${CHAT_URL}/history`);
  return response.data;
};

// Get single conversation
const getConversation = async (conversationId) => {
  const response = await api.get(`${CHAT_URL}/${conversationId}`);
  return response.data;
};

// Delete conversation
const deleteConversation = async (conversationId) => {
  const response = await api.delete(`${CHAT_URL}/${conversationId}`);
  return response.data;
};

// Clear all conversations
const clearAllConversations = async () => {
  const response = await api.delete(CHAT_URL);
  return response.data;
};

const chatService = {
  sendMessage,
  getChatHistory,
  getConversation,
  deleteConversation,
  clearAllConversations,
};

export default chatService;
