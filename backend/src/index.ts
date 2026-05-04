import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import { authenticateToken } from './middleware/auth';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Dashboard stats endpoint
app.get('/api/dashboard', authenticateToken, async (req: any, res) => {
  try {
    const isOwner = req.user?.role === 'Admin';
    let projectsCount = 0;
    let tasksCount = 0;
    let overdueCount = 0;
    let completedCount = 0;
    
    if (isOwner) {
        projectsCount = await prisma.project.count();
        tasksCount = await prisma.task.count();
        overdueCount = await prisma.task.count({
            where: {
                dueDate: { lt: new Date() },
                status: { not: 'Completed' }
            }
        });
        completedCount = await prisma.task.count({ where: { status: 'Completed' } });
    } else {
        const userProjects = await prisma.projectMember.findMany({
            where: { userId: req.user.id }
        });
        projectsCount = userProjects.length;
        
        tasksCount = await prisma.task.count({
            where: { assigneeId: req.user.id }
        });
        
        overdueCount = await prisma.task.count({
            where: {
                assigneeId: req.user.id,
                dueDate: { lt: new Date() },
                status: { not: 'Completed' }
            }
        });
        
        completedCount = await prisma.task.count({
            where: {
                assigneeId: req.user.id,
                status: 'Completed'
            }
        });
    }

    res.json({
        projects: projectsCount,
        tasks: tasksCount,
        overdue: overdueCount,
        completed: completedCount
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
