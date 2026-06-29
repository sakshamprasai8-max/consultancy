import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const universitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    logo: z.string().url('Invalid logo URL').optional().nullable(),
    image: z.string().url('Invalid image URL').optional().nullable(),
    countryId: z.string().uuid('Invalid country ID'),
    website: z.string().url('Invalid website URL').optional().nullable(),
    ranking: z.number().int().positive().optional().nullable(),
    courses: z.array(z.string()).min(1, 'At least one course is required'),
    requirements: z.string().min(1, 'Requirements description is required'),
    active: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

// @route   GET /api/universities
// @desc    Get all universities with search, pagination, and country filters
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const search = (req.query.search as string) || '';
  const country = (req.query.country as string) || '';
  const featuredOnly = req.query.featured === 'true';

  const skip = (page - 1) * limit;

  try {
    const whereClause: any = { active: true };

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    if (country) {
      whereClause.country = { slug: country };
    }

    if (featuredOnly) {
      whereClause.featured = true;
    }

    const [universities, total] = await prisma.$transaction([
      prisma.university.findMany({
        where: whereClause,
        include: { country: true },
        skip,
        take: limit,
        orderBy: { ranking: 'asc' },
      }),
      prisma.university.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        universities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch universities' });
  }
});

// @route   GET /api/universities/:slug
// @desc    Get university details by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const university = await prisma.university.findUnique({
      where: { slug },
      include: {
        country: true,
        scholarships: {
          where: { active: true },
        },
      },
    });

    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    return res.status(200).json({ success: true, data: university });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch university details' });
  }
});

// @route   POST /api/universities
// @desc    Create a university (Admin)
router.post('/', authenticateJWT, requireRole(['ADMIN']), validate(universitySchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const university = await prisma.university.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: university });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'University name or slug already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create university' });
  }
});

// @route   PUT /api/universities/:id
// @desc    Update a university (Admin)
router.put('/:id', authenticateJWT, requireRole(['ADMIN']), validate(universitySchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.university.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update university' });
  }
});

// @route   DELETE /api/universities/:id
// @desc    Delete a university (Admin)
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.university.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'University deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete university' });
  }
});

export default router;
