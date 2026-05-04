import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects for current user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const isOwner = req.user?.role === 'Admin';
    let projects;

    if (isOwner) {
      projects = await prisma.project.findMany({
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } }, tasks: true },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { members: { some: { userId: req.user?.id } } },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } }, tasks: true },
      });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { include: { assignee: { select: { id: true, name: true } } } },
      },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const { name, description, memberIds } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: memberIds ? memberIds.map((id: number) => ({ userId: id })) : [],
        },
      },
      include: { members: true },
    });
    // ensure admin is also a member
    if (!memberIds?.includes(req.user?.id)) {
        await prisma.projectMember.create({
            data: { projectId: project.id, userId: req.user!.id }
        });
    }
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add member to project (Admin only)
router.post('/:id/members', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const { userId } = req.body;
  const projectId = Number(req.params.id);
  try {
    const member = await prisma.projectMember.create({
      data: { projectId, userId },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
