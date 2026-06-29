import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const countrySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().url('Invalid image URL').optional().nullable(),
    requirements: z.string().min(1, 'Requirements description is required'),
    visas: z.string().min(1, 'Visa requirements details are required'),
    active: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

// @route   GET /api/countries
// @desc    Get all active countries
router.get('/', async (_req, res) => {
  try {
    const countries = await prisma.country.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
    return res.status(200).json({ success: true, data: countries });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch countries' });
  }
});

// @route   GET /api/countries/:slug
// @desc    Get country by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const country = await prisma.country.findUnique({
      where: { slug },
      include: {
        universities: {
          where: { active: true },
        },
        scholarships: {
          where: { active: true },
        },
      },
    });

    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }

    return res.status(200).json({ success: true, data: country });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch country details' });
  }
});

// @route   POST /api/countries
// @desc    Create a country (Admin)
router.post('/', authenticateJWT, requireRole(['ADMIN']), validate(countrySchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newCountry = await prisma.country.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: newCountry });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Country name or slug already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create country' });
  }
});

// @route   PUT /api/countries/:id
// @desc    Update a country (Admin)
router.put('/:id', authenticateJWT, requireRole(['ADMIN']), validate(countrySchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.country.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update country' });
  }
});

// @route   DELETE /api/countries/:id
// @desc    Delete a country (Admin)
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.country.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'Country deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete country' });
  }
});

export default router;
