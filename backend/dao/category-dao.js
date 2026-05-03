import { db } from '../db.js';

class CategoryDao {
  async get(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async list() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getByName(name) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE name = ?', [name], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async create(category) {
    const { id, name, icon, color } = category;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
        [id, name, icon, color],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(category);
          }
        }
      );
    });
  }
}

export default new CategoryDao();
