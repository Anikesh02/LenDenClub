const { body } = require('express-validator');

const validators = {
  register: [
    body('username')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters')
      .matches(/^[A-Za-z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
  ],

  login: [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],

  gameMove: [
    body('gameId').isInt().withMessage('Valid game ID is required'),
    body('position')
      .isInt({ min: 0, max: 8 })
      .withMessage('Position must be between 0 and 8')
  ]
};

module.exports = validators;