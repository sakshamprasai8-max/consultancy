import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { Role, ApplicationStatus, LeadStatus } from '@prisma/client';
import { sendEmail, getApplicationStatusTemplate } from '../utils/email';

const router = Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard metrics, charts data, and recent activity (Admin/Consultant)
router.get('/dashboard', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: Role.STUDENT } });
    const activeApplications = await prisma.application.count({
      where: {
        status: {
          notIn: [ApplicationStatus.COMPLETED, ApplicationStatus.VISA_REJECTED],
        },
      },
    });
    const pendingAppointments = await prisma.appointment.count({
      where: {
        status: { in: ['SCHEDULED', 'RESCHEDULED'] },
      },
    });
    const totalLeads = await prisma.lead.count();
    const convertedLeads = await prisma.lead.count({ where: { status: LeadStatus.CONVERTED } });
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Applications by Country
    const apps = await prisma.application.findMany({
      include: {
        university: {
          include: { country: true },
        },
      },
    });

    const countryMap: Record<string, number> = {};
    apps.forEach((app) => {
      const countryName = app.university.country.name;
      countryMap[countryName] = (countryMap[countryName] || 0) + 1;
    });
    const applicationsByCountry = Object.keys(countryMap).map((country) => ({
      country,
      count: countryMap[country],
    }));

    // Applications by Month
    const monthlyMap: Record<string, number> = {};
    apps.forEach((app) => {
      const month = app.createdAt.toLocaleString('default', { month: 'short' });
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });
    const applicationsByMonth = Object.keys(monthlyMap).map((month) => ({
      month,
      count: monthlyMap[month],
    }));

    // Recent lists
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        university: { select: { name: true } },
      },
    });

    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeApplications,
        pendingAppointments,
        totalLeads,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        applicationsByCountry,
        applicationsByMonth,
        recentApplications,
        recentLeads,
      },
    });
  } catch (error) {
    console.error('Admin Dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve dashboard analytics' });
  }
});

// @route   GET /api/admin/students
// @desc    List all students
router.get('/students', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        profile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve students' });
  }
});

// @route   GET /api/admin/applications
// @desc    List all applications
router.get('/applications', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        university: { select: { name: true, country: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve applications' });
  }
});

// @route   PUT /api/admin/applications/:id/status
// @desc    Update application status and email student
router.put('/applications/:id/status', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!Object.values(ApplicationStatus).includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid application status' });
  }

  try {
    const updated = await prisma.application.update({
      where: { id },
      data: { status: status as ApplicationStatus, notes },
      include: {
        student: { select: { firstName: true, lastName: true, email: true } },
        university: { select: { name: true } },
      },
    });

    // Notify student about application update
    await sendEmail({
      to: updated.student.email,
      subject: `Update: Application to ${updated.university.name}`,
      html: getApplicationStatusTemplate(
        `${updated.student.firstName} ${updated.student.lastName}`,
        updated.university.name,
        updated.program,
        status
      ),
    });

    // Also trigger in-app notification
    await prisma.notification.create({
      data: {
        userId: updated.studentId,
        title: 'Application Status Update',
        message: `Your application to ${updated.university.name} for ${updated.program} is now: ${status.replace(/_/g, ' ')}.`,
      },
    });

    return res.status(200).json({ success: true, data: updated, message: 'Application updated and notification sent.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update application status' });
  }
});

// @route   GET /api/admin/staff
// @desc    Get all staff members
router.get('/staff', authenticateJWT, requireRole(['ADMIN']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: [Role.ADMIN, Role.CONSULTANT] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    return res.status(200).json({ success: true, data: staff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch staff members' });
  }
});

export default router;
