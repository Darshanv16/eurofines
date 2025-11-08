# Backend Setup Guide

## Prerequisites

1. **Install Go**: Download and install Go 1.21 or higher from https://golang.org/dl/
2. **Install PostgreSQL**: Download and install PostgreSQL 12+ from https://www.postgresql.org/download/

## Step-by-Step Setup

### 1. Database Setup

#### Create Database
```sql
CREATE DATABASE eurofines;
```

#### Run Schema
Execute the SQL commands from `db/schema.sql`:

```bash
# Option 1: Using psql command line
psql -U postgres -d eurofines -f db/schema.sql

# Option 2: Copy and paste the SQL into your PostgreSQL client (pgAdmin, DBeaver, etc.)
```

### 2. Install Go Dependencies

```bash
cd server
go mod download
```

This will download all required packages:
- gin-gonic/gin (web framework)
- gorm.io/gorm (ORM)
- gorm.io/driver/postgres (PostgreSQL driver)
- golang-jwt/jwt (JWT authentication)
- golang.org/x/crypto (password hashing)

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eurofines
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSLMODE=disable

PORT=3001
GIN_MODE=debug

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars_long
```

**Important**: 
- Replace `your_postgres_password` with your actual PostgreSQL password
- Replace `JWT_SECRET` with a strong random string (at least 32 characters)

### 4. Run the Server

```bash
go run main.go
```

You should see:
```
Successfully connected to PostgreSQL database
Database migration completed successfully
Server starting on port 3001
```

### 5. Test the Server

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3001/health

# Should return: {"status":"ok"}
```

## Troubleshooting

### Database Connection Issues

**Error**: `failed to connect to database`

**Solutions**:
1. Check PostgreSQL is running:
   ```bash
   # Windows
   services.msc (look for PostgreSQL service)
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verify database credentials in `.env` file
3. Check if database exists:
   ```sql
   \l  -- List all databases in psql
   ```

4. Test connection manually:
   ```bash
   psql -U postgres -d eurofines
   ```

### Port Already in Use

**Error**: `bind: address already in use`

**Solution**: Change `PORT` in `.env` file or stop the process using port 3001

### Migration Issues

**Error**: `failed to migrate database`

**Solutions**:
1. Check database connection
2. Verify you have CREATE TABLE permissions
3. Manually run the schema SQL if auto-migration fails

### JWT Token Issues

**Error**: `invalid token`

**Solutions**:
1. Make sure `JWT_SECRET` is set in `.env`
2. Clear browser localStorage and login again
3. Check token expiration (default: 24 hours)

## Development Tips

### Auto-reload (Optional)

Install air for auto-reload during development:

```bash
go install github.com/cosmtrek/air@latest
```

Create `.air.toml`:
```toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

Then run:
```bash
air
```

## API Testing

### Using curl

```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"admin"}'

# Sign in
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Production Deployment

1. Set `GIN_MODE=release` in `.env`
2. Use a strong `JWT_SECRET`
3. Enable SSL for PostgreSQL (`DB_SSLMODE=require`)
4. Use environment variables instead of `.env` file
5. Build the binary:
   ```bash
   go build -o eurofines-server main.go
   ```
6. Run the binary:
   ```bash
   ./eurofines-server
   ```

## Database Backup

```bash
# Backup
pg_dump -U postgres eurofines > backup.sql

# Restore
psql -U postgres eurofines < backup.sql
```

