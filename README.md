# Team Task Manager

A full-stack application built for team task management.

## Tech Stack
- **Frontend**: React, Vite, React Router, TailwindCSS (via Vanilla CSS emulation for custom design), Axios
- **Backend**: Node.js, Express, Prisma ORM, SQLite (local), PostgreSQL (Railway)
- **Authentication**: JWT & bcrypt

## Features
- Signup/Login Authentication
- Role-based Access Control (Admin / Member)
- Admin: Can create projects, add members to projects, and create tasks.
- Member: Can view assigned projects, view their dashboard, and update the status of their assigned tasks.
- Responsive modern UI design with Glassmorphism and rich aesthetics.

## Local Setup

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment to Railway

This project is structured perfectly to be deployed on [Railway](https://railway.app/).

1. Push this entire repository to GitHub.
2. Go to Railway and click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository.
4. Railway will automatically detect the backend and frontend if you deploy them as separate services, or you can add a `Dockerfile` to deploy them together.
5. **Database Setup in Railway:**
   - Add a PostgreSQL database service in Railway.
   - Go to your backend service settings in Railway and add an environment variable `DATABASE_URL` with the connection string from your PostgreSQL service.
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `backend/prisma/schema.prisma`.
   - Ensure you run `npx prisma db push` during the build step.
   - Add `JWT_SECRET=your_super_secret_key` to your environment variables.

## Submission Details
- **Live URL:** [To be added after deployment]
- **GitHub Repo:** [To be added]
- **Demo Video:** [Record your 2-5 min video using an online screen recorder]
