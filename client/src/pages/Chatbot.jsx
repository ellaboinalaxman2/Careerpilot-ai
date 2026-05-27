import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import chatService from "../services/chatService";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatService.getChatHistory();
      setConversations(history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const loadConversation = async (id) => {
    try {
      const conversation = await chatService.getConversation(id);
      setMessages(conversation.messages);
      setConversationId(id);
      setShowSidebar(false);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to UI
    const userMessage = {
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);

    const userMessageText = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await chatService.sendMessage(
        userMessageText,
        conversationId,
      );

      // Add AI response to UI
      const aiMessage = {
        role: "assistant",
        content: response.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Update conversation ID
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
        loadChatHistory(); // Refresh history
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setShowSidebar(false);
    inputRef.current?.focus();
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation?")) {
      try {
        await chatService.deleteConversation(id);
        loadChatHistory();
        if (conversationId === id) {
          startNewChat();
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)]">
        {/* Chat History Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-gray-800 rounded-lg mr-4 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={startNewChat}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span>New Chat</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => loadConversation(conv._id)}
                  className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition group mb-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {conv.title}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(conv.updatedAt).toLocaleDateString()} •{" "}
                        {conv.messageCount} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(conv._id, e)}
                      className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a new chat!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 bg-gray-800 rounded-lg flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-gray-400 hover:text-white transition"
              >
                ☰
              </button>
              <h2 className="text-white font-semibold">
                {conversationId ? "Chat Conversation" : "New Chat"}
              </h2>
            </div>
            {messages.length > 0 && (
              <button
                onClick={startNewChat}
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear Chat
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  CareerPilot AI Assistant
                </h3>
                <p className="max-w-md mx-auto">
                  Ask me anything about careers, coding, interviews, or study
                  plans!
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setMessage("How to learn MERN stack?")}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm transition"
                  >
                    How to learn MERN stack?
                  </button>
                  <button
                    onClick={() => setMessage("Interview questions for React")}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm transition"
                  >
                    React interview questions
                  </button>
                  <button
                    onClick={() => setMessage("Best projects for portfolio")}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm transition"
                  >
                    Portfolio projects
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-3">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about careers, coding, interviews..."
                className="flex-1 bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
                style={{ minHeight: "50px", maxHeight: "100px" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
