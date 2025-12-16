const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Serve static files (frontend)
app.use(express.static(__dirname));

// ---- SQLite DATABASE ----
const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"), (err) => {
  if (err) {
    console.error("Error opening SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create table if not exists
db.run(
  `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.error("Error creating table:", err);
    else console.log("Users table ready.");
  }
);

// ---- GET USERS ----
app.get("/api/users", (req, res) => {
  db.all(`SELECT * FROM users ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(rows);
  });
});

// ---- ADD/UPDATE USER ----
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Insert or update based on email
  const sql = `
    INSERT INTO users (name, email)
    VALUES (?, ?)
    ON CONFLICT(email) DO UPDATE SET name = excluded.name
  `;

  db.run(sql, [name, email], function (err) {
    if (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({ error: "Failed to save user" });
    }

    // Return the inserted or updated row
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return res.status(500).json({ error: "Failed to fetch saved user" });
      res.status(201).json(row);
    });
  });
});

// ---- Firebase Config Endpoint ----
app.get("/api/firebase-config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: "react-auth-85339.firebaseapp.com",
    projectId: "react-auth-85339",
    storageBucket: "react-auth-85339.firebasestorage.app",
    messagingSenderId: "827053231900",
    appId: "1:827053231900:web:1805bc81a23504229674d9",
    measurementId: "G-W8QR2WDWNT"
  });
});

// ---- SEND FRONTEND ----
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---- START SERVER ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
