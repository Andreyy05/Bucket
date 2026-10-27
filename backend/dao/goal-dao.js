import { db } from '../db.js';

function formatGoalRow(row) {
  if (!row) return row;
  let parsedSubtasks = [];
  try {
    parsedSubtasks = row.subtasks ? JSON.parse(row.subtasks) : [];
  } catch {
    parsedSubtasks = [];
  }
  return {
    ...row,
    subtasks: parsedSubtasks
  };
}

class GoalDao {
  async create(goal) {
    const { 
      id, 
      title, 
      categoryId, 
      state, 
      createdAt, 
      deadline, 
      notes, 
      priority, 
      subtasks, 
      imageUrl,
      budget,
      rating,
      reflection,
      location
    } = goal;
    const subtasksJson = JSON.stringify(subtasks || []);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO goals (id, title, categoryId, state, createdAt, deadline, notes, priority, subtasks, imageUrl, budget, rating, reflection, location)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, 
          title, 
          categoryId, 
          state, 
          createdAt, 
          deadline || null, 
          notes || '', 
          priority || 0, 
          subtasksJson, 
          imageUrl || null,
          budget !== undefined && budget !== null ? budget : null,
          rating !== undefined && rating !== null ? rating : null,
          reflection || '',
          location || ''
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...goal,
              subtasks: subtasks || []
            });
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
      
      query += ' ORDER BY priority DESC, createdAt DESC';
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(formatGoalRow));
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
          resolve(formatGoalRow(row));
        }
      });
    });
  }

  async countByCategoryId(categoryId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM goals WHERE categoryId = ?', [categoryId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  }

  async update(goal) {
    return new Promise((resolve, reject) => {
      const updatableFields = [
        'title', 
        'state', 
        'categoryId', 
        'deadline', 
        'notes', 
        'priority', 
        'completedAt', 
        'subtasks', 
        'imageUrl',
        'budget',
        'rating',
        'reflection',
        'location'
      ];
      const updates = [];
      const params = [];
      
      updatableFields.forEach(field => {
        if (goal[field] !== undefined) {
          updates.push(`${field} = ?`);
          if (field === 'subtasks') {
            params.push(JSON.stringify(goal.subtasks || []));
          } else {
            params.push(goal[field]);
          }
        }
      });
      
      if (updates.length === 0) {
        return resolve(goal); // Nic ke změně
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

  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM goals WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedCount: this.changes });
        }
      });
    });
  }
}

export default new GoalDao();
