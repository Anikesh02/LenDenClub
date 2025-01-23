const db = require('../config/database');

class Move {
  static async create(gameId, playerId, position) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO moves (game_id, player_id, position) VALUES (?, ?, ?)',
        [gameId, playerId, position],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, gameId, playerId, position });
        }
      );
    });
  }

  static async getGameMoves(gameId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT m.*, u.username
         FROM moves m
         JOIN users u ON m.player_id = u.id
         WHERE m.game_id = ?
         ORDER BY m.created_at ASC`,
        [gameId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = { Move };