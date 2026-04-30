import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, 'data');
const dbPath = join(dbDir, 'database.sqlite');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database.');
    
    db.serialize(() => {
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Create Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          icon TEXT NOT NULL,
          color TEXT NOT NULL
        )
      `, () => {
        // Seed default categories if table is empty
        db.get('SELECT COUNT(*) as count FROM categories', [], (err, row) => {
          if (!err && row.count === 0) {
            console.log('Seeding default categories...');
            const stmt = db.prepare('INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)');
            const defaults = [
              { id: uuidv4(), name: 'Cestování', icon: 'Plane', color: '#3B82F6' },
              { id: uuidv4(), name: 'Vzdělávání', icon: 'Book', color: '#8B5CF6' },
              { id: uuidv4(), name: 'Zážitky', icon: 'Star', color: '#F59E0B' },
              { id: uuidv4(), name: 'Kariéra', icon: 'Briefcase', color: '#10B981' },
              { id: uuidv4(), name: 'Rodina', icon: 'Heart', color: '#EF4444' },
              { id: uuidv4(), name: 'Ostatní', icon: 'MoreHorizontal', color: '#6B7280' }
            ];
            defaults.forEach(cat => stmt.run(cat.id, cat.name, cat.icon, cat.color));
            stmt.finalize();
          }
        });
      });

      // Create Goals table
      db.run(`
        CREATE TABLE IF NOT EXISTS goals (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          categoryId TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT 0,
          createdAt INTEGER NOT NULL,
          FOREIGN KEY(categoryId) REFERENCES categories(id)
        )
      `);
    });
  }
});
