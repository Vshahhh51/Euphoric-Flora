const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

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

// Create users table with password field (password is optional for social logins)
db.run(
  `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table ready.");
  }
);

// Create orders table
db.run(
  `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      items TEXT NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  (err) => {
    if (err) console.error("Error creating orders table:", err);
    else console.log("Orders table ready.");
  }
);

// ---- SIGNUP ----
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    
    db.run(sql, [name, email, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Email already registered" });
        }
        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Failed to create account" });
      }

      res.status(201).json({ 
        id: this.lastID,
        name: name,
        email: email,
        message: "Account created successfully" 
      });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- LOGIN ----
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Failed to login" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        message: "Login successful"
      });
    } catch (err) {
      console.error("Error comparing password:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// ---- CREATE ORDER ----
app.post("/api/orders", (req, res) => {
  const { user_id, user_email, items, total_price } = req.body;

  if (!user_id || !user_email || !items || total_price === undefined) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  const itemsJson = JSON.stringify(items);
  const sql = `INSERT INTO orders (user_id, user_email, items, total_price) VALUES (?, ?, ?, ?)`;
  
  db.run(sql, [user_id, user_email, itemsJson, total_price], function(err) {
    if (err) {
      console.error("Error creating order:", err);
      return res.status(500).json({ error: "Failed to create order" });
    }

    res.status(201).json({
      id: this.lastID,
      user_id: user_id,
      user_email: user_email,
      items: items,
      total_price: total_price,
      status: "pending",
      message: "Order created successfully"
    });
  });
});

// ---- GET USER ORDERS ----
app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    const orders = rows.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(orders);
  });
});

// ---- ADD/UPDATE USER (for social logins) ----
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Insert or update based on email (for social logins, no password)
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

// ---- GET ALL USERS (for admin - optional) ----
app.get("/api/users", (req, res) => {
  db.all(`SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(rows);
  });
});

// ---- Firebase Config ----
app.get("/api/firebase-config", (req, res) => {
  let apiKey = process.env.FIREBASE_API_KEY || "";
  apiKey = apiKey.replace(/^["']|["']$/g, "");
  
  res.json({
    apiKey: apiKey,
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
