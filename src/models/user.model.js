const db = require('../config/database');

class User {
  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async create(userData) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [userData.username, userData.password],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, ...userData });
        }
      );
    });
  }

  static async updateProfile(id, updates) {
    const allowedUpdates = ['username'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .map(key => `${key} = ?`);
    
    if (updateFields.length === 0) return null;

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const values = [...Object.values(updates), id];

    return new Promise((resolve, reject) => {
      db.run(query, values, function(err) {
        if (err) reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = { User };