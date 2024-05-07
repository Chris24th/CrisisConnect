// api/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Open a connection to the SQLite database
export const openDB = open({
  filename: './database.db',
  driver: sqlite3.Database,
});

// Create tables if they don't exist
export async function createTables() {
  const db = await openDB;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      thumbsUp INTEGER DEFAULT 0,
      thumbsDown INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS thumbs (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       comment_id INTEGER,
//       value INTEGER, -- 1 for up, -1 for down
//       FOREIGN KEY (comment_id) REFERENCES comments(id)
//     )
//   `);
}
