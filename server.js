const express    = require("express");
const mongoose   = require("mongoose");
const dotenv     = require("dotenv");
const Task       = require("./model");

dotenv.config(); // Load variables from .env file

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ─── Connect to MongoDB ────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });

// ─── GET / — API info ──────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Manager API with MongoDB is running",
    endpoints: {
      "GET    /tasks":       "Get all tasks from database",
      "GET    /tasks/:id":   "Get one task by ID",
      "POST   /tasks":       "Create and save a new task",
      "PUT    /tasks/:id":   "Update an existing task",
      "DELETE /tasks/:id":   "Delete a task permanently",
    },
  });
});

// ─── GET /tasks — fetch all tasks from DB ─────────────
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); // SELECT * FROM tasks
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── GET /tasks/:id — fetch one task by ID ────────────
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // SELECT * WHERE id = ?

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    // If the ID format is invalid (not a valid MongoDB ID)
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── POST /tasks — create and save a new task ─────────
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Mongoose validates against the schema automatically
    const newTask = await Task.create({  // INSERT INTO tasks
      title,
      description,
      status,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Task created and saved to database",
      data: newTask,
    });
  } catch (err) {
    // Mongoose validation errors (required fields, enum values etc)
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── PUT /tasks/:id — update a task ───────────────────
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // runValidators ensures schema rules apply on update too
    const updated = await Task.findByIdAndUpdate(  // UPDATE tasks SET ... WHERE id = ?
      req.params.id,
      { title, description, status, priority },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updated,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── DELETE /tasks/:id — delete a task ────────────────
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id); // DELETE FROM tasks WHERE id = ?

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: `Task "${deleted.title}" deleted from database`,
      data: deleted,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── 404 — unknown routes ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});
