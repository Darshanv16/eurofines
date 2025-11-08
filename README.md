# Eurofines - Full Stack Application

A modern inventory management system for Eurofines with separate login for users and admins, built with React, TypeScript, Golang, and PostgreSQL.

## Features

- 🔐 User and Admin authentication with JWT
- 📝 Sign Up and Sign In pages
- 🏢 Entity selection (Adgyl, Agro, Biopharma)
- 📦 Inventory selection (Test Item, Study, Facility Doc)
- 🔒 Protected routes
- 👤 Separate dashboards for users and admins
- 🎨 Beautiful, modern UI with Tailwind CSS
- 🗄️ PostgreSQL database for data persistence
- 🚀 Golang backend with Gin framework
- 🛡️ Type-safe with TypeScript

## Project Structure

```
eurofines/
├── src/                    # Frontend React application
│   ├── components/         # Reusable components
│   ├── context/           # React Context (AuthContext)
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   └── types/             # TypeScript type definitions
├── server/                 # Backend Golang server
│   ├── config/            # Configuration
│   ├── db/                # Database models and schema
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
└── README.md
```

## Prerequisites

### Frontend
- Node.js 18+ and npm
- Vite

### Backend
- Go 1.21 or higher
- PostgreSQL 12 or higher

## Getting Started

### 1. Database Setup

1. Install PostgreSQL if you haven't already
2. Create a database:
```sql
CREATE DATABASE eurofines;
```

3. Run the schema:
```bash
cd server
psql -U postgres -d eurofines -f db/schema.sql
```

Or execute the SQL from `server/db/schema.sql` in your PostgreSQL client.

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install Go dependencies:
```bash
go mod download
```

3. Create a `.env` file:
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

4. Run the backend server:
```bash
go run main.go
```

The backend will start on `http://localhost:3001`

### 3. Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:3001):
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

### Creating Accounts

1. Click "Sign Up" to create a new account
2. Choose either "User" or "Admin" account type
3. Fill in your email and password
4. You'll be redirected to the entity selection page

### Signing In

1. Click "Sign In"
2. Enter your email and password
3. You'll be redirected to the entity selection page

### Selecting an Entity

After logging in, you'll see the Eurofines entity selection page with three options:
- **Adgyl** 🏭 - Manufacturing entity
- **Agro** 🌾 - Agriculture entity
- **Biopharma** 💊 - Pharmaceutical entity

Select your preferred entity to continue.

### Selecting Inventory

After selecting an entity, you'll see the inventory selection page with three options:
- **Test Item** 🧪 - Test items management
- **Study** 📊 - Study management
- **Facility Doc** 📁 - Facility documentation

Select your inventory type to access your dashboard.

### Adding New Entries

Admin users can add new entries through the dashboard:
- Click the "+ Add New Test Item" button for test items
- Click the "+ Add New Study" button for studies
- Click the "+ Add New Facility Doc" button for facility docs

All entries are saved to the PostgreSQL database and linked to the selected entity.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user (requires authentication)

### Test Items
- `GET /api/test-items?entity=adgyl` - Get all test items
- `POST /api/test-items` - Create a new test item
- `PUT /api/test-items/:id` - Update a test item
- `DELETE /api/test-items/:id` - Delete a test item (admin only)

### Studies
- `GET /api/studies?entity=adgyl` - Get all studies
- `POST /api/studies` - Create a new study
- `PUT /api/studies/:id` - Update a study
- `DELETE /api/studies/:id` - Delete a study (admin only)

### Facility Docs
- `GET /api/facility-docs?entity=adgyl` - Get all facility docs
- `POST /api/facility-docs` - Create a new facility doc
- `PUT /api/facility-docs/:id` - Update a facility doc
- `DELETE /api/facility-docs/:id` - Delete a facility doc (admin only)

## Built With

### Frontend
- React 18
- TypeScript
- Vite
- React Router v6
- Tailwind CSS

### Backend
- Go 1.21+
- Gin Web Framework
- GORM (ORM)
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Development

### Running in Development Mode

1. Start PostgreSQL
2. Start the backend server (in `server/` directory):
```bash
go run main.go
```

3. Start the frontend (in project root):
```bash
npm run dev
```

### Building for Production

**Backend:**
```bash
cd server
go build -o eurofines-server main.go
./eurofines-server
```

**Frontend:**
```bash
npm run build
```

## Database Schema

The database includes the following tables:
- `users` - User accounts with email, password (hashed), and role
- `test_items` - Test item records with all fields from the form
- `studies` - Study records with all fields from the form
- `facility_docs` - Facility document records with all fields from the form

All entries are linked to an entity (adgyl, agro, or biopharma) and track who created them.

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Admin-only routes are protected
- CORS is configured for frontend access
- Environment variables for sensitive data

## License

This project is private and proprietary.
