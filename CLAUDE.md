# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains three separate applications:

1. **builders-code-v3/** - Main React public website (Create React App + Tailwind CSS)
2. **builders-code-cms-backend/** - Node.js/Express API backend (MongoDB with Mongoose)
3. **builders-code-cms-frontend/** - React admin panel (Vite + React Router)

## Development Commands

### builders-code-v3 (Main Website)
```bash
cd builders-code-v3
npm start          # Development server (http://localhost:3000)
npm run build      # Production build
npm test           # Run tests
```

### builders-code-cms-backend (API)
```bash
cd builders-code-cms-backend
npm run dev        # Development with nodemon
npm start          # Production server
```

### builders-code-cms-frontend (Admin Panel)
```bash
cd builders-code-cms-frontend
npm run dev        # Vite development server
npm run build      # Production build
npm run preview    # Preview production build
```

## Architecture Overview

### CMS Backend Structure
- **Express.js API** with security middleware (helmet, xss-clean, rate limiting)
- **MongoDB/Mongoose** for data persistence
- **JWT authentication** with role-based access control
- **RESTful API** routes under `/api/` prefix
- **MVC pattern**: controllers, models, routes, middleware
- **File uploads** handled via multer
- **Environment-based configuration** (development/production)

### Key Backend Components
- `src/app.js` - Express application setup and middleware
- `src/server.js` - Server initialization and admin user creation
- `src/models/` - Mongoose schemas for all entities
- `src/controllers/` - Business logic for API endpoints
- `src/routes/` - Route definitions and middleware
- `src/middleware/authMiddleware.js` - JWT authentication

### CMS Frontend Architecture
- **React SPA** with React Router for navigation
- **Protected routes** requiring authentication
- **Context API** for global state management (AuthContext)
- **Admin/Public layouts** with different navigation structures
- **CRUD interfaces** for all content types (projetos, logs, ideias, etc.)
- **Form validation** and error handling

### Main Website (v3)
- **Create React App** with Tailwind CSS for styling
- **Component-based architecture** with reusable UI components
- **Static content presentation** (no authentication required)

## Content Management Entities

The CMS manages these content types:
- **Projetos** (Projects) - Main project entries
- **Logs** (Activity Logs) - Project updates and progress
- **Ideias** (Ideas) - Project ideas and concepts
- **Seções** (Sections) - Content sections for organization
- **Categorias** (Categories) - Content categorization
- **Mídias** (Media) - File and image management
- **Configurações** (Settings) - System configuration

## Database and Authentication

- **MongoDB** connection configured in `builders-code-cms-backend/src/config/db.js`
- **Initial admin user** automatically created on first run (username: admin, password: admin123)
- **Role-based access** with 'admin' role for full access
- **JWT tokens** stored in HTTP-only cookies for security

## Environment Configuration

Backend requires these environment variables:
- `NODE_ENV` - development/production
- `FRONTEND_URL` - CORS origin configuration
- MongoDB connection string
- JWT secret

## Development Workflow

1. Start backend API first: `cd builders-code-cms-backend && npm run dev`
2. Start frontend admin panel: `cd builders-code-cms-frontend && npm run dev`
3. For main website: `cd builders-code-v3 && npm start`

Each application runs independently and can be developed separately.