const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a task title"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Please add a subject"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Please add a start date"],
    },
    deadline: {
      type: Date,
      required: [true, "Please add a deadline"],
    },
    completedDays: [
      {
        type: String,
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
