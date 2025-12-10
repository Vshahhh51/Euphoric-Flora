// db.js
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite DB at", dbPath);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL
    )
  `);
});

export function getUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function addUser({ email, name }) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO users (email, name) VALUES (?, ?)`;
    db.run(stmt, [email, name], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, email, name });
    });
  });
}

export default db;
