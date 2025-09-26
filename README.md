# EduConnect - School Management System

A comprehensive full-stack school management web application built with React, Node.js, Express, PostgreSQL, and JWT authentication.

## Features

### Core Functionality
- **Multi-Role Authentication**: Admin, Principal, Teacher, Student, Parent roles with JWT-based authentication
- **Student Management**: Complete CRUD operations for student records
- **Teacher Management**: Staff management with role assignments
- **Academic Structure**: Grades, sections, subjects, and class management
- **Attendance System**: Daily attendance tracking with reports
- **Fee Management**: Fee structure setup, payment tracking, and receipts
- **Announcements**: School-wide communication system
- **Reports**: Student lists, attendance reports, and fee reports

### Technical Features
- **Secure Authentication**: JWT tokens stored in HttpOnly cookies
- **Role-Based Access Control**: Permission-based middleware
- **Multi-Tenant Architecture**: Support for multiple schools
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Data**: React Query for efficient data fetching
- **Database**: PostgreSQL with Drizzle ORM

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with HttpOnly cookies
- **ORM**: Drizzle
- **State Management**: TanStack Query

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iam-vivekm/website-for-school-management-system.git
   cd website-for-school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The `.env` file is already configured with:
   ```env
   DATABASE_URL=postgresql://neondb_owner:your-connection-string
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-very-long-and-secure
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create database tables
   npm run db:setup

   # Seed with sample data (creates admin user with password 'admin123')
   npm run seed
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Sample Login Credentials

After running the seed script, you can use these credentials:

### Admin Account
- **Email**: `admin@demo-school.com`
- **Password**: Any password (mock authentication)

### Teacher Account
- **Email**: `teacher@demo-school.com`
- **Password**: Any password (mock authentication)

### Student Accounts
- **Email**: `alice@student.com`, `bob@student.com`, `charlie@student.com`, etc.
- **Password**: Any password (mock authentication)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh access token

### Students
- `GET /api/students` - List students (role-based)
- `POST /api/students` - Create student

### Teachers
- `GET /api/teachers` - List teachers
- `POST /api/teachers` - Create teacher

### Other Resources
- `GET /api/schools` - List schools
- `GET /api/fees` - List fee payments
- `GET /api/announcements` - List announcements
- `GET /api/attendance/stats` - Attendance statistics

## Project Structure

```
website-for-school-management-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                 # Express backend
│   ├── auth.ts            # JWT authentication logic
│   ├── db.ts              # Database connection
│   ├── jwt.ts             # JWT utilities
│   ├── middleware.ts      # Authentication & authorization middleware
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── seed.ts                # Database seeding script
└── package.json           # Dependencies and scripts
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Prevents XSS attacks
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Request validation middleware
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

## Development

### Adding New Features

1. **Database Schema**: Update `shared/schema.ts`
2. **API Routes**: Add routes in `server/routes.ts`
3. **Storage Methods**: Implement in `server/storage.ts`
4. **Frontend Components**: Create in `client/src/components/`
5. **Pages**: Add to `client/src/pages/`

### Testing

```bash
# Run TypeScript checks
npm run check

# Build for production
npm run build
```

## Deployment

The application is configured for deployment on Replit, but can be deployed to any platform supporting Node.js:

1. Set `NODE_ENV=production` in environment variables
2. Ensure PostgreSQL database is accessible
3. Set secure `JWT_SECRET`
4. Run `npm run build && npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on the GitHub repository.
