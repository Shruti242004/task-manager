import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks for current user
router.get('/my-tasks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: req.user?.id },
      include: { project: { select: { name: true } } },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const { title, description, status, dueDate, projectId, assigneeId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'Todo',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId,
      },
      include: { assignee: { select: { id: true, name: true } } }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { status, title, description, dueDate, assigneeId } = req.body;
  const taskId = Number(req.params.id);
  
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Ensure member is assignee or Admin
    if (req.user?.role !== 'Admin' && task.assigneeId !== req.user?.id) {
        return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    
    // Only admin can change these fields
    if (req.user?.role === 'Admin') {
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: { assignee: { select: { id: true, name: true } } }
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
