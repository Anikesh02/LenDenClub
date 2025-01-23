const GameLogic = {
    checkWinner: (board) => {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];
  
      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
  
      return board.includes(null) ? null : 'draw';
    },
  
    isValidMove: (board, position) => {
      return position >= 0 && position < 9 && !board[position];
    }
  };
  
  module.exports = GameLogic;