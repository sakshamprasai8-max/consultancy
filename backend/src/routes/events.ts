import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import { sendEmail } from '../utils/email';

const router = Router();

const eventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    dateTime: z.string().transform((val) => new Date(val)),
    location: z.string().min(1, 'Location is required'),
    type: z.enum(['ONLINE', 'IN_PERSON']),
    image: z.string().url('Invalid image URL').optional().nullable(),
    capacity: z.number().int().positive().default(100),
  }),
});

const registrationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
  }),
});

// @route   GET /api/events
// @desc    Get all upcoming events
router.get('/', async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        dateTime: { gte: new Date() }, // Upcoming events only
      },
      include: {
        _count: { select: { registrations: true } },
      },
      orderBy: { dateTime: 'asc' },
    });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// @route   GET /api/events/:slug
// @desc    Get event details by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        registrations: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch event details' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
router.post('/:id/register', validate(registrationSchema), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event._count.registrations >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity.' });
    }

    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: { eventId: id, email },
    });

    if (existingRegistration) {
      return res.status(409).json({ success: false, message: 'You have already registered for this event.' });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        name,
        email,
        phone,
      },
    });

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: `Registration Confirmed: ${event.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a237e; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">Event Registration Confirmed</h2>
          </div>
          <div style="padding: 24px; color: #334155; line-height: 1.6;">
            <p>Hi ${name},</p>
            <p>You have successfully registered for **${event.title}**.</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #b3901b; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${new Date(event.dateTime).toLocaleString()}</p>
              <p style="margin: 0;"><strong>Location/Details:</strong> ${event.location}</p>
            </div>
            <p>If this is an online event, meeting coordinates or link updates will be sent shortly before the event.</p>
            <p>We look forward to having you join us!</p>
          </div>
        </div>
      `,
    });

    return res.status(201).json({ success: true, data: registration, message: 'Registration successful.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to complete registration.' });
  }
});

// @route   POST /api/events
// @desc    Create an event (Admin)
router.post('/', authenticateJWT, requireRole(['ADMIN']), validate(eventSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newEvent = await prisma.event.create({
      data: req.body,
    });
    return res.status(201).json({ success: true, data: newEvent });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Event slug already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create event' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event (Admin)
router.put('/:id', authenticateJWT, requireRole(['ADMIN']), validate(eventSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.event.update({
      where: { id },
      data: req.body,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event (Admin)
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: { id },
    });
    return res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

export default router;
