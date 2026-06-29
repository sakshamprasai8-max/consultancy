import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import { ContactType, ContactStatus } from '@prisma/client';
import { sendEmail } from '../utils/email';

const router = Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    type: z.enum(['GENERAL', 'COUNSELING', 'SCHOLARSHIP', 'APPLICATION']).default('GENERAL'),
  }),
});

// @route   POST /api/contact
// @desc    Submit a contact form
router.post('/', validate(contactSchema), async (req, res) => {
  const { name, email, phone, subject, message, type } = req.body;

  try {
    const contact = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        type: type as ContactType,
        status: ContactStatus.NEW,
      },
    });

    // Notify administrators/consultants
    await sendEmail({
      to: 'saksham@educonsultpro.com',
      subject: `[New ${type} Inquiry] - ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
          <h2 style="color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 10px;">New Inquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #b3901b;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      data: contact,
      message: 'Inquiry submitted successfully. Our team will contact you shortly.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit contact request' });
  }
});

// @route   GET /api/contact
// @desc    List all contact submissions (Admin)
router.get('/', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve submissions' });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update submission status (Admin/Consultant)
router.put('/:id/status', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(ContactStatus).includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { status: status as ContactStatus },
    });
    return res.status(200).json({ success: true, data: updated, message: 'Status updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

export default router;
