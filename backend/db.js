const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'users.db');

// Open (or create) the database file
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Could not open database:', err.message);
  } else {
    console.log('✅ SQLite database opened at', DB_PATH);
  }
});

// Enable WAL mode for better performance
db.run('PRAGMA journal_mode = WAL');

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password   TEXT    NOT NULL,
    created_at TEXT    DEFAULT (datetime('now'))
  )
`, (err) => {
  if (err) console.error('❌ Could not create users table:', err.message);
  else console.log('✅ Users table ready.');
});

module.exports = db;
