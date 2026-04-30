import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CATEGORIES API ---
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { id, name, icon, color } = req.body;
  db.run(
    'INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
    [id, name, icon, color],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Kategorie s tímto názvem již existuje.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id, name, icon, color });
    }
  );
});

// --- GOALS API ---
app.get('/api/goals', (req, res) => {
  db.all('SELECT * FROM goals ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const goals = rows.map(row => ({
      ...row,
      completed: row.completed === 1
    }));
    res.json(goals);
  });
});

app.post('/api/goals', (req, res) => {
  // Now expect categoryId instead of category string
  const { id, title, categoryId, completed, createdAt } = req.body;
  db.run(
    'INSERT INTO goals (id, title, categoryId, completed, createdAt) VALUES (?, ?, ?, ?, ?)',
    [id, title, categoryId, completed ? 1 : 0, createdAt],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id, title, categoryId, completed, createdAt });
    }
  );
});

app.put('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run(
    'UPDATE goals SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

app.delete('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM goals WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
