const mongoose = require("mongoose");

// ─── Schema Design ─────────────────────────────────────
// This defines the structure of every task stored in MongoDB.
// Think of it like designing a table in a spreadsheet —
// you decide what columns exist and what type of data goes in them.

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],   // NOT NULL equivalent
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "Status must be: pending, in-progress, or completed",
      },
      default: "pending",
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be: low, medium, or high",
      },
      default: "medium",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the model — this is what we use to query the database
module.exports = mongoose.model("Task", taskSchema);
