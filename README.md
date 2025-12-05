# Face Recognition Brain API - Backend

RESTful API server for the Face Recognition Brain application. Handles user authentication, database operations, session management with Redis, and coordinates image processing with the Clarifai API.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Session Management**: Redis-based session storage
- **Database Management**: PostgreSQL integration for user data and entry tracking
- **Image Processing**: Integration with Clarifai API for face detection
- **RESTful Endpoints**: Well-structured API routes
- **CORS Enabled**: Configured for cross-origin requests from the frontend
- **Security**: Environment variable configuration and bcrypt password encryption

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Redis** - Session storage and caching
- **Knex.js** - SQL query builder
- **bcrypt.js** - Password hashing
- **JWT** - JSON Web Tokens for authentication
- **cors** - Cross-Origin Resource Sharing middleware
- **Clarifai API** - Face detection service

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- npm or yarn
- Clarifai API account

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/ckapsalis2710/face-recognition-brain-api.git
cd face-recognition-brain-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
```sql
CREATE DATABASE smart-brain;
```

4. Create the required tables:
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email TEXT UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL,
    age INTEGER,
    pet VARCHAR(100)
);

-- Login table
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email TEXT UNIQUE NOT NULL
);
```

5. Install and start Redis:

**On macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**On Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**On Windows:**
Download and install from [Redis Windows port](https://github.com/microsoftarchive/redis/releases)

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

6. Configure environment variables:
Create a `.env.development` file in the root directory:
```env
# Clarifai Configuration
CLARIFAI_APP_ID=main
CLARIFAI_MODEL_ID=face-detection
CLARIFAI_PAT=your_clarifai_personal_access_token
CLARIFAI_USER_ID=clarifai

# Database Configuration
DATABASE_URL=""
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_postgres_username
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=smart-brain

# Server Configuration
PORT=3000

# Security
JWT_SECRET_KEY=your_secure_secret_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

7. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000` (or your configured PORT)

## 🔌 API Endpoints

### Authentication

#### POST `/signin`
Sign in an existing user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "entries": 5,
  "joined": "2024-01-01T00:00:00.000Z",
  "age": 25,
  "pet": "dog"
}
```

#### POST `/register`
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "age": 25,
  "pet": "dog"
}

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "entries": 0,
  "joined": "2024-01-01T00:00:00.000Z",
  "age": "",
  "pet": ""
}
```

### User Operations

#### GET `/profile/:id`
Get user profile by ID
```json
Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "entries": 5,
  "joined": "2024-01-01T00:00:00.000Z",
  "age": 25,
  "pet": "dog"
}
```

#### PUT `/image`
Increment user's entry count
```json
Request:
{
  "id": 1
}

Response:
{
  "entries": 6
}
```

### Image Processing

#### POST `/imageurl`
Process image URL for face detection
```json
Request:
{
  "input": "https://example.com/image.jpg"
}

Response:
{
  "outputs": [...] // Clarifai API response with detected faces
}
```

### Health Check

#### GET `/`
Check if server is running
```json
Response:
{
  "message": "Server is running"
}
```

## 🗄️ Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | User's full name |
| email | TEXT | Unique email address |
| entries | BIGINT | Number of images processed |
| joined | TIMESTAMP | Registration date |
| age | INTEGER | User's age (optional) |
| pet | VARCHAR(100) | User's pet type (optional) |

### Login Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| hash | VARCHAR(100) | Bcrypt password hash |
| email | TEXT | Foreign key to users |

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Redis Sessions**: Temporary session storage with automatic expiration
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS Protection**: Configured to accept requests only from authorized origins
- **SQL Injection Prevention**: Uses parameterized queries via Knex.js

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CLARIFAI_APP_ID` | Clarifai application ID | `main` |
| `CLARIFAI_MODEL_ID` | Face detection model ID | `face-detection` |
| `CLARIFAI_PAT` | Clarifai Personal Access Token | Your token |
| `CLARIFAI_USER_ID` | Clarifai user ID | `clarifai` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | Database username | Your username |
| `DATABASE_PASSWORD` | Database password | Your password |
| `DATABASE_NAME` | Database name | `smart-brain` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | Strong random string |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

**Important**: Never commit your `.env` or `.env.development` files to version control.

## 🏗️ Project Structure

```
face-recognition-brain-api/
├── controllers/         # Route controllers
│   ├── signin.js
│   ├── register.js
│   ├── profile.js
│   └── image.js
├── server.js           # Main application file
├── .env.development    # Development environment variables (not in repo)
├── package.json
└── README.md
```

## 🔗 Frontend Integration

This backend is designed to work with the frontend application:
[face-recognition-brain](https://github.com/ckapsalis2710/face-recognition-brain)

Make sure the frontend's `REACT_APP_API_URL` is configured to point to this API's URL.

## 🚀 Running Locally

For local development, use:
```bash
npm run dev
```

This provides better development experience with hot-reloading and debugging features.

## 🐛 Known Issues & Fixes

This repository includes fixes from the original Zero to Mastery course to ensure:
- Compatibility with latest Node.js and npm versions
- Proper error handling
- Updated dependencies
- Security improvements
- Redis integration for session management
- JWT authentication implementation

## 🔍 Testing Redis Connection

To verify Redis is working correctly:
```bash
# Connect to Redis CLI
redis-cli

# Test connection
ping
# Should return: PONG

# Check if keys are being stored
keys *

# Exit Redis CLI
exit
```

## 🚀 Deployment

For production deployment:

1. Set up PostgreSQL and Redis on your hosting platform
2. Set all environment variables (create `.env.production`)
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name face-recognition-api
```
4. Set up SSL/TLS certificates for HTTPS
5. Configure your database and Redis connections for production
6. Update CORS settings to allow your frontend domain
7. Consider using managed Redis (AWS ElastiCache, Redis Cloud, etc.)

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ckapsalis2710/face-recognition-brain-api/issues).

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**ckapsalis2710**

- GitHub: [@ckapsalis2710](https://github.com/ckapsalis2710)

## 🙏 Acknowledgments

- Based on the Zero to Mastery course project
- Powered by Clarifai's face detection API
- Built with Express.js, PostgreSQL, and Redis

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Knex.js Documentation](http://knexjs.org/)
- [Clarifai API Documentation](https://docs.clarifai.com/)
- [JWT Documentation](https://jwt.io/)

---

**Note**: Never commit your `.env` files or expose your API keys publicly. Always use strong, unique values for `JWT_SECRET_KEY` in production.