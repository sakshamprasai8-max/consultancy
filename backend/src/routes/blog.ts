import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const blogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    excerpt: z.string().min(1, 'Excerpt description is required'),
    content: z.string().min(1, 'Content is required'),
    coverImage: z.string().url('Invalid image URL').optional().nullable(),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

// @route   GET /api/blog
// @desc    Get published blogs with search and pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const category = (req.query.category as string) || '';
  const search = (req.query.search as string) || '';
  const featuredOnly = req.query.featured === 'true';

  const skip = (page - 1) * limit;

  try {
    const whereClause: any = { published: true };

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featuredOnly) {
      whereClause.featured = true;
    }

    const [blogs, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// @route   GET /api/blog/:slug
// @desc    Get blog post details and increment view counter
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views asynchronously
    await prisma.blogPost.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
  }
});

// @route   POST /api/blog
// @desc    Create a blog post (Admin)
router.post('/', authenticateJWT, requireRole(['ADMIN']), validate(blogSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const blog = await prisma.blogPost.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: blog });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Blog post slug already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create blog post' });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update a blog post (Admin)
router.put('/:id', authenticateJWT, requireRole(['ADMIN']), validate(blogSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update blog post' });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete a blog post (Admin)
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
});

export default router;
