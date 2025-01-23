const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const GameLogic = require('../utils/gameLogic');
const db = require('../config/database');

router.post('/start', auth.verifyToken, (req, res) => {
  const { opponent_id } = req.body;
  const player1_id = req.userId;

  db.run(
    'INSERT INTO games (player1_id, player2_id) VALUES (?, ?)',
    [player1_id, opponent_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json({ gameId: this.lastID });
    }
  );
});

router.post('/move', auth.verifyToken, async (req, res) => {
  const { gameId, position } = req.body;
  const playerId = req.userId;

  // Get current game state
  db.get(
    `SELECT g.*,
     (SELECT GROUP_CONCAT(position) FROM moves WHERE game_id = g.id) as moves
     FROM games g WHERE g.id = ? AND g.status = 'active'`,
    [gameId],
    (err, game) => {
      if (err || !game) {
        return res.status(400).json({ error: 'Invalid game' });
      }

      // Reconstruct board
      const board = Array(9).fill(null);
      const moves = game.moves ? game.moves.split(',').map(Number) : [];
      moves.forEach((pos, i) => {
        board[pos] = i % 2 === 0 ? 'X' : 'O';
      });

      // Validate move
      if (!GameLogic.isValidMove(board, position)) {
        return res.status(400).json({ error: 'Invalid move' });
      }

      // Make move
      db.run(
        'INSERT INTO moves (game_id, player_id, position) VALUES (?, ?, ?)',
        [gameId, playerId, position],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }

          // Check for winner
          board[position] = moves.length % 2 === 0 ? 'X' : 'O';
          const result = GameLogic.checkWinner(board);

          if (result) {
            const winner_id = result === 'draw' ? null : playerId;
            db.run(
              'UPDATE games SET status = ?, winner_id = ? WHERE id = ?',
              ['completed', winner_id, gameId]
            );
          }

          res.json({ 
            result: result || 'ongoing',
            board 
          });
        }
      );
    }
  );
});

router.get('/history', auth.verifyToken, (req, res) => {
  db.all(
    `SELECT 
      g.*,
      u1.username as player1_name,
      u2.username as player2_name,
      w.username as winner_name,
      GROUP_CONCAT(m.position) as moves
     FROM games g
     JOIN users u1 ON g.player1_id = u1.id
     JOIN users u2 ON g.player2_id = u2.id
     LEFT JOIN users w ON g.winner_id = w.id
     LEFT JOIN moves m ON g.id = m.game_id
     WHERE g.player1_id = ? OR g.player2_id = ?
     GROUP BY g.id
     ORDER BY g.created_at DESC`,
    [req.userId, req.userId],
    (err, games) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(games);
    }
  );
});

module.exports = router;