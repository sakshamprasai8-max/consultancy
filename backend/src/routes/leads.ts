import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import { LeadStatus } from '@prisma/client';

const router = Router();

const leadSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST']).default('NEW'),
    source: z.string().default('WEBSITE'),
    interestedCountry: z.string().optional().nullable(),
    interestedService: z.string().optional().nullable(),
    assignedToId: z.string().uuid('Invalid consultant ID').optional().nullable(),
  }),
});

const noteSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content cannot be empty'),
  }),
});

const followupSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    dueDate: z.string().transform((val) => new Date(val)),
  }),
});

// @route   GET /api/leads
// @desc    List all leads with details (Admin/Consultant)
router.get('/', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        assignedTo: { select: { firstName: true, lastName: true } },
        notes: {
          include: { createdBy: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        followups: { orderBy: { dueDate: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve leads' });
  }
});

// @route   POST /api/leads
// @desc    Create a new CRM lead
router.post('/', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), validate(leadSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = await prisma.lead.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A lead with this email already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead (Admin/Consultant)
router.put('/:id', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), validate(leadSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ success: true, data: updated, message: 'Lead updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.lead.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
});

// @route   POST /api/leads/:id/notes
// @desc    Log a team communication note on a lead
router.post('/:id/notes', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), validate(noteSchema), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { id } = req.params;
  const { content } = req.body;

  try {
    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        content,
        createdById: req.user.userId,
      },
      include: {
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    // Bump the lead updated time
    await prisma.lead.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return res.status(201).json({ success: true, data: note, message: 'Note logged successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to log communication note' });
  }
});

// @route   POST /api/leads/:id/followups
// @desc    Schedule a client followup task
router.post('/:id/followups', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), validate(followupSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  try {
    const followup = await prisma.leadFollowup.create({
      data: {
        leadId: id,
        title,
        description,
        dueDate,
        completed: false,
      },
    });
    return res.status(201).json({ success: true, data: followup, message: 'Follow-up task scheduled' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create follow-up' });
  }
});

// @route   PUT /api/leads/followups/:id/complete
// @desc    Mark a lead follow-up task as complete
router.put('/followups/:id/complete', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const updated = await prisma.leadFollowup.update({
      where: { id },
      data: { completed: !!completed },
    });
    return res.status(200).json({ success: true, data: updated, message: 'Follow-up marked complete' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update follow-up task' });
  }
});

// @route   GET /api/leads/analytics
// @desc    Get conversion funnel stats and leads by sources (Admin/Consultant)
router.get('/analytics', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    // Stage counts
    const stages = Object.values(LeadStatus);
    const stageCounts = await Promise.all(
      stages.map(async (status) => {
        const count = await prisma.lead.count({ where: { status } });
        return { name: status.replace(/_/g, ' '), value: count };
      })
    );

    // Source counts
    const leads = await prisma.lead.findMany({ select: { source: true } });
    const sourceMap: Record<string, number> = {};
    leads.forEach((l) => {
      sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
    });
    const sourceAnalytics = Object.keys(sourceMap).map((source) => ({
      source,
      count: sourceMap[source],
    }));

    return res.status(200).json({
      success: true,
      data: {
        funnel: stageCounts,
        sources: sourceAnalytics,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to compile CRM analytics' });
  }
});

export default router;
