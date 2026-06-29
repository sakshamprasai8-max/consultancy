import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import { ContactStatus } from '@prisma/client';

const router = Router();

const reviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(5, 'Content must be at least 5 characters'),
    universityName: z.string().optional().nullable(),
    countryName: z.string().optional().nullable(),
    program: z.string().optional().nullable(),
  }),
});

// @route   GET /api/reviews
// @desc    Get all approved student reviews
router.get('/', async (_req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: ContactStatus.RESOLVED, // In Prisma schema, standard enum is RESOLVED for finished statuses. Let's make sure it matches the status enums.
        // Wait, what are the status enums for Review?
        // Let's check:
        // status ContactStatus @default(NEW)
        // Enum: NEW, IN_PROGRESS, RESOLVED.
        // So we can use RESOLVED for approved reviews, and maybe NEW/IN_PROGRESS for pending. Or we can just filter by RESOLVED. Let's use RESOLVED as "Approved" status.
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review (Student)
router.post('/', authenticateJWT, requireRole(['STUDENT']), validate(reviewSchema), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { rating, title, content, universityName, countryName, program } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        studentId: req.user.userId,
        rating,
        title,
        content,
        universityName,
        countryName,
        program,
        status: ContactStatus.NEW, // Starts as NEW (needs approval)
      },
    });
    return res.status(201).json({ success: true, data: review, message: 'Review submitted. Awaiting admin approval.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve a review (Admin)
router.put('/:id/approve', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.review.update({
      where: { id },
      data: { status: ContactStatus.RESOLVED }, // Set to RESOLVED (Approved)
    });
    return res.status(200).json({ success: true, data: updated, message: 'Review approved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to approve review' });
  }
});

// @route   PUT /api/reviews/:id/reject
// @desc    Reject/Archive a review (Admin)
router.put('/:id/reject', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.review.update({
      where: { id },
      data: { status: ContactStatus.IN_PROGRESS }, // Set status to IN_PROGRESS (Rejected / Hidden)
    });
    return res.status(200).json({ success: true, data: updated, message: 'Review status set to rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reject review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (Admin)
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

export default router;
