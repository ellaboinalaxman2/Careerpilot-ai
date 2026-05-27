const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    title: {
      type: String,
      default: "New Conversation",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Chat", chatSchema);
