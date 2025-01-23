# Tic-tac-toe Backend API

A RESTful API backend for a multiplayer Tic-tac-toe game built with Node.js, Express, and SQLite.

## Features

- User authentication with JWT
- Real-time game state management
- Game history tracking
- Rate limiting and security middleware
- Input validation
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

## Running the Application

Development mode with hot reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Architecture

### Directory Structure

```
src/
├── config/          # Configuration files
├── middlewares/     # Express middlewares
├── models/          # Data models
├── routes/          # Route handlers
├── utils/          # Utility functions
└── app.js          # Application entry point
```

### Key Components

1. **Database Layer**

   - SQLite3 for data persistence
   - Three main tables: users, games, and moves
   - Handles game state and user data storage
2. **Authentication**

   - JWT-based authentication
   - Password hashing with bcryptjs
   - Token verification middleware
3. **Game Logic**

   - Move validation
   - Win condition checking
   - Game state management
4. **API Routes**

   - User routes (/api/users)
     - Registration
     - Login
     - Profile management
   - Game routes (/api/games)
     - Game creation
     - Move handling
     - Game history

### Security Features

- Helmet.js for secure HTTP headers
- Rate limiting
- CORS support
- Input validation
- Error handling middleware
- Password hashing

### Production Dependencies

- `express`: Web framework
- `sqlite3`: Database
- `jsonwebtoken`: Authentication
- `bcryptjs`: Password hashing
- `helmet`: Security headers
- `cors`: Cross-origin resource sharing
- `express-rate-limit`: Rate limiting
- `express-validator`: Input validation
- `morgan`: HTTP request logging
- `dotenv`: Environment variable management

### Development Dependencies

- `nodemon`: Development server
- `jest`: Testing framework
- `supertest`: API testing
- `eslint`: Code linting
- `prettier`: Code formatting

## API Endpoints

### Authentication

- `POST /api/users/register`: Create new user account
- `POST /api/users/login`: User login
- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile

### Game

- `POST /api/games/start`: Start new game
- `POST /api/games/move`: Make a move
- `GET /api/games/history`: Get game history

## Error Handling

The application includes centralized error handling middleware that:

- Handles validation errors
- Manages authentication errors
- Provides appropriate error responses
- Includes detailed errors in development mode
