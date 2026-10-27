import { db } from '../../db.js';
import { v4 as uuidv4 } from 'uuid';

class ImportAbl {
  async execute(dtoIn) {
    const { categories = [], goals = [], mode = 'replace' } = dtoIn;

    if (!Array.isArray(categories) || !Array.isArray(goals)) {
      throw {
        code: 'invalidBackupFormat',
        message: 'Záloha musí obsahovat pole categories a goals.'
      };
    }

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        try {
          if (mode === 'replace') {
            db.run('DELETE FROM goals');
            db.run('DELETE FROM categories');
          }

          // Insert or replace categories
          const catStmt = db.prepare(`
            INSERT OR REPLACE INTO categories (id, name, icon, color)
            VALUES (?, ?, ?, ?)
          `);

          categories.forEach((cat) => {
            catStmt.run(cat.id || uuidv4(), cat.name, cat.icon || 'Star', cat.color || '#3B82F6');
          });
          catStmt.finalize();

          // Insert or replace goals
          const goalStmt = db.prepare(`
            INSERT OR REPLACE INTO goals (id, title, categoryId, state, createdAt, deadline, notes, priority, completedAt, subtasks, imageUrl, budget, rating, reflection, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          goals.forEach((goal) => {
            const subtasksJson = JSON.stringify(Array.isArray(goal.subtasks) ? goal.subtasks : []);
            goalStmt.run(
              goal.id || uuidv4(),
              goal.title,
              goal.categoryId,
              goal.state || 'active',
              goal.createdAt || Date.now(),
              goal.deadline || null,
              goal.notes || '',
              goal.priority ? 1 : 0,
              goal.completedAt || null,
              subtasksJson,
              goal.imageUrl || null,
              goal.budget !== undefined && goal.budget !== null ? goal.budget : null,
              goal.rating !== undefined && goal.rating !== null ? goal.rating : null,
              goal.reflection || '',
              goal.location || ''
            );
          });
          goalStmt.finalize();

          db.run('COMMIT', (err) => {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }
            resolve({
              success: true,
              importedCategories: categories.length,
              importedGoals: goals.length,
              mode
            });
          });
        } catch (error) {
          db.run('ROLLBACK');
          reject(error);
        }
      });
    });
  }
}

export default new ImportAbl();
