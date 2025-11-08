# How to Start the Server

## Quick Start

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd server
go run main.go
```

You should see:
```
✅ Connected to PostgreSQL (eurofines)
🚀 Server listening on :3001
```

### 2. Verify Server is Running

Open another terminal and test:
```bash
curl http://localhost:3001/health
```

Or open in browser: http://localhost:3001/health

You should see: `{"status":"ok","db":"connected","name":"eurofines"}`

### 3. Start the Frontend (if not already running)

In a separate terminal:
```bash
npm run dev
```

## Troubleshooting

### Server Won't Start

1. **Check PostgreSQL is running**
   - Windows: Check Services or run `pg_ctl status`
   - Make sure PostgreSQL service is started

2. **Check database connection**
   - Verify `.env` file exists in `server/` directory
   - Check database credentials are correct

3. **Check port 3001 is available**
   - Windows: `netstat -ano | findstr :3001`
   - If something is using port 3001, either stop it or change PORT in `.env`

### "Failed to Fetch" Error

This means the frontend cannot connect to the backend. Check:

1. ✅ Backend server is running (see step 1 above)
2. ✅ Backend is accessible at http://localhost:3001
3. ✅ Frontend is using correct API URL (default: http://localhost:3001/api)
4. ✅ No firewall blocking localhost connections

### Database Connection Error

If you see "Database connection failed":
1. Make sure PostgreSQL is installed and running
2. Check your `.env` file has correct database credentials
3. Verify database `eurofines` exists:
   ```sql
   CREATE DATABASE eurofines;
   ```

