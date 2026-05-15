# Project 3 — Database Integration
### DecodeLabs Full Stack Internship | Batch May 2026

---

## What This Project Is

Project 3 connects the backend API from Project 2 to a real database — MongoDB. Instead of storing data in memory (which resets every time the server restarts), tasks are now permanently saved to a cloud database using MongoDB Atlas.

This is the persistence phase of the internship. The goal is to design a database schema and perform full CRUD operations against a real database.

---

## What Was Built

A Task Manager API connected to MongoDB Atlas with:

- A defined database schema with data types and constraints
- Full CRUD — Create, Read, Update, Delete tasks
- Data that persists even after the server restarts
- Proper error handling for database errors
- Input validation enforced at the schema level

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | Runs the JavaScript server |
| Express | Handles HTTP requests and routing |
| MongoDB Atlas | Cloud database where tasks are stored |
| Mongoose | Connects Node.js to MongoDB, defines schema |
| dotenv | Loads the database connection string from .env |

**What is Mongoose?**
Mongoose is an ODM (Object Data Modelling) library. It lets you define the shape of your data (schema), then handles all the communication between your Node.js code and MongoDB. Instead of writing raw MongoDB queries, you use simple JavaScript methods like `Task.find()` or `Task.create()`.

**What is dotenv?**
dotenv reads variables from a `.env` file and makes them available in your code via `process.env`. This keeps sensitive info like database passwords out of your main code files.

---

## Project Structure

```
project3/
├── server.js      ← API routes and database queries
├── model.js       ← Schema design (structure of a task)
├── package.json   ← Project info and dependencies
└── .env           ← MongoDB connection string (keep this private)
```

---

## Database Schema

The schema is defined in `model.js`. It describes exactly what a task looks like in the database:

| Field | Type | Required | Default | Allowed Values |
|-------|------|----------|---------|----------------|
| title | String | Yes | — | Min 3, Max 100 chars |
| description | String | No | "" | Any text |
| status | String | No | "pending" | pending, in-progress, completed |
| priority | String | No | "medium" | low, medium, high |
| createdAt | Date | Auto | — | Set by MongoDB |
| updatedAt | Date | Auto | — | Set by MongoDB |

Mongoose enforces these rules automatically. If you try to save a task without a title or with an invalid status, it returns a validation error before anything touches the database.

---

## Setup & Run

**Step 1 — Make sure Node.js is installed**
```
node -v
npm -v
```

**Step 2 — Create the project folder**
```
project3/
├── server.js
├── model.js
├── package.json
└── .env
```

**Step 3 — Install dependencies**
Open terminal inside the project folder:
```bash
npm install
```
This installs Express, Mongoose, and dotenv.

**Step 4 — Start the server**
```bash
npm start
```

You should see:
```
Connected to MongoDB
Server running at http://localhost:3000
```

If you see "Connected to MongoDB" — your database connection works.

---

## API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /tasks | Fetch all tasks from database |
| GET | /tasks/:id | Fetch one task by ID |
| POST | /tasks | Create and save a new task |
| PUT | /tasks/:id | Update an existing task |
| DELETE | /tasks/:id | Delete a task permanently |

---

## How to Test — Postman Guide

Download Postman from **postman.com** (free).

---

## Validation Rules

If you send bad data, the API returns a 400 error with a clear message.

| Field | Rule | Error if broken |
|-------|------|-----------------|
| title | Required, min 3 chars, max 100 | "Title is required" |
| status | Must be valid value | "Status must be: pending, in-progress, or completed" |
| priority | Must be valid value | "Priority must be: low, medium, or high" |

Example of a validation error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required"
  ]
}
```

---

## HTTP Status Codes Used

| Code | Meaning | When it appears |
|------|---------|-----------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation failed or invalid ID |
| 404 | Not Found | Task ID doesn't exist in database |
| 500 | Server Error | Database connection issue or crash |

---

## How to Check Data in MongoDB Atlas

1. Go to **mongodb.com/atlas** and log in
2. Click your cluster → click **Browse Collections**
3. You'll see a database called `taskmanager` with a collection called `tasks`
4. Every task you create via POST appears here in real time

---

## What the Brief Required

| Requirement | Done |
|-------------|------|
| Design a simple database schema | model.js with typed fields and constraints |
| Perform basic CRUD operations | GET, POST, PUT, DELETE all connected to MongoDB |
| Ensure proper data handling | Validation, error handling, proper status codes |
| Connect backend with a database | MongoDB Atlas via Mongoose |
