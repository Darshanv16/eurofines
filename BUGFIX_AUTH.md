# Authentication Bug Fixes

## Issues Fixed

1. **Sign In "Invalid password or email" error**
   - Fixed case-insensitive email matching
   - Improved error handling and messages

2. **Sign Up "Email already exists" error**
   - Fixed case-insensitive email duplicate checking
   - Improved unique constraint violation detection

## Changes Made

### Backend (`server/routes/auth.go`)
- Normalized all emails to lowercase before processing
- Updated queries to use `LOWER(email)` for case-insensitive matching
- Improved error detection for unique constraint violations
- Better error messages returned to frontend

### Frontend
- Updated `src/context/AuthContext.tsx` to throw errors with API error messages
- Updated `src/pages/SignIn.tsx` and `src/pages/SignUp.tsx` to display actual error messages
- Improved `src/services/api.ts` error handling

## Steps to Apply Fixes

### 1. Restart the Backend Server
```bash
cd server
go run main.go
```

### 2. Normalize Existing Emails (if you have existing users)
If you have existing users with mixed-case emails in your database, run:
```bash
cd server
go run scripts/normalize_emails.go
```

Or manually update emails in PostgreSQL:
```sql
UPDATE users SET email = LOWER(email);
```

### 3. Clear Browser Cache
Clear your browser cache or use an incognito window to test.

### 4. Test the Fixes
1. Try signing up with a new email
2. Try signing in with existing credentials
3. Verify error messages are accurate

## Troubleshooting

If you still see errors:

1. **Check server logs** - Look for any database errors or issues
2. **Verify database connection** - Make sure PostgreSQL is running
3. **Check email format** - Ensure emails are valid format
4. **Clear database** - If testing, you might want to clear the users table and start fresh

## Database Schema Note

The database has a case-sensitive UNIQUE constraint on the email column. The application now:
- Normalizes all emails to lowercase before storing
- Uses case-insensitive queries to find users
- Handles existing mixed-case emails gracefully

If you want to enforce case-insensitive uniqueness at the database level, you can create a unique index:
```sql
CREATE UNIQUE INDEX idx_users_email_lower ON users(LOWER(email));
```

