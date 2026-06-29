import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const scholarshipSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    amount: z.string().min(1, 'Amount is required'),
    deadline: z.string().transform((val) => new Date(val)),
    eligibility: z.string().min(1, 'Eligibility criteria are required'),
    countryId: z.string().uuid('Invalid country ID'),
    universityId: z.string().uuid('Invalid university ID').optional().nullable(),
    active: z.boolean().optional(),
  }),
});

// @route   GET /api/scholarships
// @desc    Get all active scholarships with optional country filtering
router.get('/', async (req, res) => {
  const country = (req.query.country as string) || '';
  const search = (req.query.search as string) || '';

  try {
    const whereClause: any = { active: true };

    if (country) {
      whereClause.country = { slug: country };
    }

    if (search) {
      whereClause.title = { contains: search, mode: 'insensitive' };
    }

    const scholarships = await prisma.scholarship.findMany({
      where: whereClause,
      include: {
        country: true,
        university: true,
      },
      orderBy: { deadline: 'asc' },
    });

    return res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch scholarships' });
  }
});

// @route   GET /api/scholarships/:slug
// @desc    Get scholarship details by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { slug },
      include: {
        country: true,
        university: true,
      },
    });

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    return res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch scholarship details' });
  }
});

// @route   POST /api/scholarships
// @desc    Create a scholarship (Admin)
router.post('/', authenticateJWT, requireRole(['ADMIN']), validate(scholarshipSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const scholarship = await prisma.scholarship.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: scholarship });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Scholarship slug already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create scholarship' });
  }
});

// @route   PUT /api/scholarships/:id
// @desc    Update a scholarship (Admin)
router.put('/:id', authenticateJWT, requireRole(['ADMIN']), validate(scholarshipSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.scholarship.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update scholarship' });
  }
});

// @route   DELETE /api/scholarships/:id
// @desc    Delete a scholarship (Admin)
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.scholarship.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete scholarship' });
  }
});

export default router;
