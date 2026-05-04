Team Task Manager (Full-Stack)
==============================

Description
-----------
This is a full-stack web application designed for team task management. It allows users to create projects, assign tasks to team members, and track progress through a dynamic dashboard. It features a secure authentication system and role-based access control (Admin/Member).

Tech Stack
----------
* Frontend: React.js, Vite, React Router, Custom CSS
* Backend: Node.js, Express.js
* Database: Prisma ORM with SQLite (Local) / PostgreSQL (Production)
* Authentication: JSON Web Tokens (JWT) & bcrypt for password hashing

Key Features Implemented
------------------------
1. Authentication: Secure Signup and Login functionality.
2. Role-Based Access Control: 
   - Admin: Can create projects, invite members, and assign tasks.
   - Member: Can view their assigned projects and update task statuses.
3. Project & Team Management: Create projects and add registered users to them.
4. Task Management: Create tasks, assign due dates, and update statuses (Todo, In Progress, Completed).
5. Dynamic Dashboard: Shows real-time statistics for Total Projects, Active Tasks, Completed Tasks, and Overdue Tasks based on the user's role.

How to Run Locally
------------------
1. Open a terminal and navigate to the backend folder:
   cd backend
   npm install
   npx prisma db push
   npm run dev

2. Open a second terminal and navigate to the frontend folder:
   cd frontend
   npm install
   npm run dev

3. Open the provided localhost URL (usually http://localhost:5173) in your browser.

Deployment Details
------------------
This application is designed to be easily deployed on Railway. 
- The backend API runs on Node/Express and connects to a Railway PostgreSQL instance using a DATABASE_URL environment variable.
- The frontend is a built React static site configured to point to the live API URL.

Live Application URL: [Link will be provided in form]
GitHub Repository: [Link will be provided in form]
Demo Video: [Link will be provided in form]
