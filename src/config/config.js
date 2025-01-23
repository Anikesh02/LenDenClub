const config = {
    development: {
      port: process.env.PORT || 3000,
      jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
      database: {
        name: 'tictactoe.db',
        options: {
          verbose: true
        }
      }
    },
    test: {
      port: 3001,
      jwtSecret: 'test-secret-key',
      database: {
        name: ':memory:',
        options: {
          verbose: true
        }
      }
    },
    production: {
      port: process.env.PORT,
      jwtSecret: process.env.JWT_SECRET,
      database: {
        name: process.env.DB_NAME,
        options: {
          verbose: false
        }
      }
    }
  };
  
  const env = process.env.NODE_ENV || 'development';
  module.exports = config[env];