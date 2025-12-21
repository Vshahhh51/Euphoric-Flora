const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"), (err) => {
  if (err) console.error("Error:", err);
  else console.log("Connected to database\n");
});

console.log("=== USERS ===");
db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log("Users:", rows.length);
    rows.forEach(row => console.log(row));
  }
  
  console.log("\n=== ORDERS ===");
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) console.error(err);
    else {
      console.log("Orders:", rows.length);
      rows.forEach(row => console.log(row));
    }
    db.close();
  });
});
