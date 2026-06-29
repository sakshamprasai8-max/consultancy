import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import { AppointmentStatus, Role } from '@prisma/client';
import { sendEmail, getAppointmentTemplate } from '../utils/email';

const router = Router();

const bookSchema = z.object({
  body: z.object({
    consultantId: z.string().uuid('Invalid consultant ID').optional().nullable(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    dateTime: z.string().transform((val) => new Date(val)),
    duration: z.number().int().positive().default(30),
  }),
});

const rescheduleSchema = z.object({
  body: z.object({
    dateTime: z.string().transform((val) => new Date(val)),
  }),
});

// @route   POST /api/appointments/book
// @desc    Book a new consultation (Student)
router.post('/book', authenticateJWT, requireRole(['STUDENT']), validate(bookSchema), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  let { consultantId, title, description, dateTime, duration } = req.body;

  try {
    // If no consultant specified, assign the first active consultant
    if (!consultantId) {
      const activeConsultant = await prisma.user.findFirst({
        where: { role: Role.CONSULTANT },
      });
      if (!activeConsultant) {
        return res.status(500).json({ success: false, message: 'No consultants are currently available.' });
      }
      consultantId = activeConsultant.id;
    }

    const student = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    const consultantUser = await prisma.user.findUnique({
      where: { id: consultantId },
    });

    if (!consultantUser || consultantUser.role !== Role.CONSULTANT) {
      return res.status(404).json({ success: false, message: 'Consultant not found' });
    }

    // Generate a mock Google Meet Link
    const mockMeetId = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const meetLink = `https://meet.google.com/${mockMeetId}`;

    const appointment = await prisma.appointment.create({
      data: {
        studentId: req.user.userId,
        consultantId,
        title,
        description,
        dateTime,
        duration,
        status: AppointmentStatus.SCHEDULED,
        meetLink,
      },
    });

    // Notify student and consultant
    if (student) {
      await sendEmail({
        to: student.email,
        subject: `Appointment Scheduled: ${title}`,
        html: getAppointmentTemplate(
          `${student.firstName} ${student.lastName}`,
          `${consultantUser.firstName} ${consultantUser.lastName}`,
          dateTime.toString(),
          meetLink
        ),
      });
    }

    return res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment scheduled successfully. A Google Meet link has been generated and emailed.',
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to book appointment' });
  }
});

// @route   GET /api/appointments/my
// @desc    Get user's appointments (Student or Consultant)
router.get('/my', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    let appointments;
    if (req.user.role === Role.STUDENT) {
      appointments = await prisma.appointment.findMany({
        where: { studentId: req.user.userId },
        include: { consultant: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { dateTime: 'desc' },
      });
    } else {
      appointments = await prisma.appointment.findMany({
        where: { consultantId: req.user.userId },
        include: { student: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { dateTime: 'desc' },
      });
    }

    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// @route   PUT /api/appointments/:id/reschedule
// @desc    Reschedule appointment
router.put('/:id/reschedule', authenticateJWT, validate(rescheduleSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { dateTime } = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        dateTime,
        status: AppointmentStatus.RESCHEDULED,
      },
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        consultant: { select: { firstName: true, lastName: true } },
      },
    });

    // Notify student of rescheduling
    await sendEmail({
      to: updated.student.email,
      subject: `Rescheduled: ${updated.title}`,
      html: `
        <h3>Your consultation has been rescheduled</h3>
        <p><strong>New Time:</strong> ${new Date(dateTime).toLocaleString()}</p>
        <p><strong>Consultant:</strong> ${updated.consultant.firstName} ${updated.consultant.lastName}</p>
        <p><strong>Meeting link remains:</strong> <a href="${updated.meetLink}">${updated.meetLink}</a></p>
      `,
    });

    return res.status(200).json({ success: true, data: updated, message: 'Appointment rescheduled successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reschedule appointment' });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
router.put('/:id/cancel', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    // Notify student
    await sendEmail({
      to: updated.student.email,
      subject: `Cancelled: ${updated.title}`,
      html: `
        <h3>Your consultation has been cancelled</h3>
        <p>The appointment scheduled on ${new Date(updated.dateTime).toLocaleString()} was cancelled.</p>
        <p>Please log in to your portal to schedule a new time slot.</p>
      `,
    });

    return res.status(200).json({ success: true, data: updated, message: 'Appointment cancelled successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
  }
});

// @route   GET /api/appointments (Admin Dashboard)
// @desc    List all appointments
router.get('/', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        consultant: { select: { firstName: true, lastName: true } },
      },
      orderBy: { dateTime: 'desc' },
    });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve appointments' });
  }
});

export default router;
