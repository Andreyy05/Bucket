import { db } from '../db.js';

class GoalDao {
  async create(goal) {
    const { id, title, categoryId, state, createdAt } = goal;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO goals (id, title, categoryId, state, createdAt) VALUES (?, ?, ?, ?, ?)',
        [id, title, categoryId, state, createdAt],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(goal);
          }
        }
      );
    });
  }

  async list(filter = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM goals';
      let params = [];
      
      if (filter.categoryId) {
        query += ' WHERE categoryId = ?';
        params.push(filter.categoryId);
      }
      
      query += ' ORDER BY createdAt DESC';
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async get(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM goals WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async update(goal) {
    return new Promise((resolve, reject) => {
      const updates = [];
      const params = [];
      
      if (goal.title !== undefined) {
        updates.push('title = ?');
        params.push(goal.title);
      }
      if (goal.state !== undefined) {
        updates.push('state = ?');
        params.push(goal.state);
      }
      
      if (updates.length === 0) {
        return resolve(goal); // Nic ke zmeně
      }
      
      const query = `UPDATE goals SET ${updates.join(', ')} WHERE id = ?`;
      params.push(goal.id);
      
      db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(goal);
        }
      });
    });
  }

  async remove(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM goals WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  }
}

export default new GoalDao();
