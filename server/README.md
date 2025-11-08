# Eurofines Backend Server

A Golang backend server using Gin framework and PostgreSQL database.

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher
- Git

## Setup

### 1. Install Dependencies

```bash
cd server
go mod download
```

### 2. Configure Database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE eurofines;
```

2. Run the schema SQL file to create tables:
```bash
psql -U postgres -d eurofines -f db/schema.sql
```

Or manually execute the SQL commands from `db/schema.sql` in your PostgreSQL client.

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eurofines
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSLMODE=disable

PORT=3001
GIN_MODE=debug

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
```

### 4. Run the Server

```bash
go run main.go
```

Or for development with auto-reload:

```bash
go run main.go
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user (requires authentication)

### Test Items

- `GET /api/test-items` - Get all test items (optional query: `?entity=adgyl`)
- `GET /api/test-items/:id` - Get a specific test item
- `POST /api/test-items` - Create a new test item (requires authentication)
- `PUT /api/test-items/:id` - Update a test item (requires authentication)
- `DELETE /api/test-items/:id` - Delete a test item (requires admin)

### Studies

- `GET /api/studies` - Get all studies (optional query: `?entity=adgyl`)
- `GET /api/studies/:id` - Get a specific study
- `POST /api/studies` - Create a new study (requires authentication)
- `PUT /api/studies/:id` - Update a study (requires authentication)
- `DELETE /api/studies/:id` - Delete a study (requires admin)

### Facility Docs

- `GET /api/facility-docs` - Get all facility docs (optional query: `?entity=adgyl`)
- `GET /api/facility-docs/:id` - Get a specific facility doc
- `POST /api/facility-docs` - Create a new facility doc (requires authentication)
- `PUT /api/facility-docs/:id` - Update a facility doc (requires authentication)
- `DELETE /api/facility-docs/:id` - Delete a facility doc (requires admin)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `test_items` - Test item records
- `studies` - Study records
- `facility_docs` - Facility document records

All entries are linked to an entity (adgyl, agro, or biopharma) and track who created them.

## Development

The server uses:
- **Gin** - Web framework
- **GORM** - ORM for database operations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **PostgreSQL** - Database

## Building for Production

```bash
go build -o eurofines-server main.go
./eurofines-server
```

Make sure to set `GIN_MODE=release` in production.

