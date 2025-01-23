const db = require('../config/database');

class Game {
  static async create(player1Id, player2Id) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO games (player1_id, player2_id, status) VALUES (?, ?, ?)',
        [player1Id, player2Id, 'active'],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, player1Id, player2Id });
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT g.*, 
         (SELECT GROUP_CONCAT(position) FROM moves WHERE game_id = g.id) as moves
         FROM games g WHERE g.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async updateStatus(id, status, winnerId = null) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE games SET status = ?, winner_id = ? WHERE id = ?',
        [status, winnerId, id],
        function(err) {
          if (err) reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }

  static async getUserGames(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          g.*,
          u1.username as player1_name,
          u2.username as player2_name,
          w.username as winner_name
         FROM games g
         JOIN users u1 ON g.player1_id = u1.id
         JOIN users u2 ON g.player2_id = u2.id
         LEFT JOIN users w ON g.winner_id = w.id
         WHERE g.player1_id = ? OR g.player2_id = ?
         ORDER BY g.created_at DESC`,
        [userId, userId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = { Game };