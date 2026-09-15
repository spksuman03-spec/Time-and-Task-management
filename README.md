# TaskSphere — Advanced Task Management & Team Collaboration Platform

TaskSphere is a production-ready, full-stack **Task Management & Team Collaboration SaaS Platform** built with the **MERN Stack** (MongoDB, Express.js, React.js with Vite, Node.js), Tailwind CSS, and Socket.IO. Inspired by modern developer-centric platforms like Linear, ClickUp, Jira, and Notion.

---

## 🌟 Key Features

### 1. Multi-Tenant Workspace Architecture
- Create, switch, and manage multiple workspaces.
- Workspace member management with dynamic role permissions (Admin, Manager, Member).
- Workspace activity audit logs.

### 2. Role-Based Access Control (RBAC)
- **Admin**: Complete system oversight, workspace management, user activation/deactivation, user role updates, full analytics, system activity monitoring.
- **Manager**: Project creation, member assignment, task creation & status updating, project analytics.
- **Member**: Assigned tasks view, status progression, checklist items, comment posting, attachment metadata upload.
- Middleware-secured backend routes (`protect`, `authorizeRoles`, `authorizeWorkspaceRole`).

### 3. Interactive Drag-and-Drop Kanban Board
- Re-order and drag task cards across 5 columns: `Backlog` → `Todo` → `In Progress` → `Review` → `Completed`.
- Real-time persistence of position and status changes directly to MongoDB.

### 4. Interactive Task & Project Calendar
- Month, Week, and Day calendar views.
- Display task deadlines and project milestones with instant modal preview.

### 5. Real-Time Socket.IO Collaboration & Notifications
- Live WebSocket broadcasts on task creation, status updates, comment additions, and workspace activities.
- In-app notification center with live unread badge, "Mark all as read" button, and automated deadline reminders.

### 6. Automated Deadline Cron Jobs
- Server-side `node-cron` scanning for approaching due dates and overdue tasks with automated notifications.

### 7. Interactive Recharts Analytics
- Visualized task completion velocity (last 7 days).
- Task status breakdown pie charts & priority distribution bar charts.
- Team member productivity comparison (Assigned vs Completed).

### 8. Global Debounced Search & Advanced Filtering
- Search across tasks, projects, tags, and users.
- Multi-faceted filter by status, priority, assignee, project, and tags.
- Flexible sorting (Newest, Oldest, Priority, Due Date).

### 9. Modern SaaS UI/UX
- Responsive desktop & mobile drawer layout.
- Glassmorphism design elements and custom Tailwind CSS theme.
- Dark & Light mode toggle with persistent local state.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React Icons, Recharts, `@hello-pangea/dnd`, Axios, React Hook Form, Socket.io-client, `date-fns`.
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT Authentication, `bcryptjs`, Socket.IO, `node-cron`, `multer`, `helmet`, `cors`.
- **Database**: MongoDB with automatic zero-config `mongodb-memory-server` fallback for local evaluation + full Mongo Atlas support.

---

## 🔑 Demo Credentials

Run `npm run seed` to populate the database with ready-to-use demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@tasksphere.com` | `password123` |
| **Manager** | `manager@tasksphere.com` | `password123` |
| **Member** | `member@tasksphere.com` | `password123` |

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Clone & Install Dependencies
Run from project root directory:
```bash
# Install dependencies for root, backend, and frontend
npm run install-all
```

### 3. Environment Configuration
The backend contains a pre-configured `.env` file (`backend/.env`).

`.env` example:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/tasksphere
JWT_SECRET=tasksphere_jwt_secret_key_super_secure_2026_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

*Note: If local MongoDB daemon is not running on your machine, the backend will automatically initialize an embedded `mongodb-memory-server` so the application runs with zero extra setup!*

### 4. Seed Development Database
Populate database with sample workspaces, projects, tasks, comments, and users:
```bash
# From root
npm run seed

# OR from backend folder
cd backend
npm run seed
```

### 5. Running the Application

#### Option A: Running with Two Separate Terminals (Recommended for clarity)

**Terminal 1 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm install
npm run dev
```

#### Option B: Running Concurrently from Root
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`

---

## 📂 Project Structure

```
time and task management/
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── context/     # AuthContext, WorkspaceContext, SocketContext, ThemeContext
│       ├── services/    # Axios API client services
│       ├── components/  # Common, Layout, Kanban, Calendar, Tasks, Projects, Notifications
│       ├── pages/       # Landing, Login, Register, Dashboard, Workspaces, Projects, Tasks, Kanban, Calendar, Analytics, Profile, Admin
│       ├── main.jsx
│       └── App.jsx
├── backend/
│   ├── config/          # DB connection & JWT helpers
│   ├── controllers/     # Auth, Workspace, Project, Task, Comment, Notification, Analytics
│   ├── middleware/      # Auth, RBAC, Error Handler, Upload
│   ├── models/          # User, Workspace, Project, Task, Comment, Notification, Activity
│   ├── routes/          # Express route definitions
│   ├── seeders/         # Seed script
│   ├── services/        # Socket.IO, Activity, Notification, Cron services
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── .env.example
├── package.json         # Root runner with concurrently
└── README.md
```

---

## 📡 REST API Overview

- `POST /api/auth/register` — Register user & create default workspace
- `POST /api/auth/login` — Authenticate user & return JWT token
- `GET /api/workspaces` — Get user accessible workspaces
- `POST /api/workspaces/:id/members` — Invite user to workspace
- `GET /api/projects` — Fetch workspace projects
- `POST /api/projects` — Create project (Manager/Admin)
- `GET /api/tasks` — Fetch tasks with search, filter, pagination
- `POST /api/tasks` — Create task
- `PUT /api/tasks/:id/status` — Update task status & Kanban position
- `POST /api/comments` — Add comment with @mention parsing
- `GET /api/notifications` — Fetch user notifications
- `GET /api/analytics/dashboard` — Fetch Recharts metrics & velocity stats
- `GET /api/users` — Manage users (Admin)

---

## 🔮 Future Extensibility

The architecture is built with modular controllers, services, and schemas to support:
- Cloudinary / AWS S3 direct cloud file uploads
- AI Task Assistant & AI-generated task summary extensions
- Google & Microsoft OAuth 2.0 Single Sign-On
- Slack & GitHub Webhook integrations
