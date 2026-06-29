import { Router, Response } from 'express';
import { prisma } from '../utils/db';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';
import multer from 'multer';
import os from 'os';
import { uploadFile } from '../utils/cloudinary';
import { DocumentStatus } from '@prisma/client';

const router = Router();
const upload = multer({ dest: os.tmpdir() });

const profileUpdateSchema = z.object({
  body: z.object({
    dateOfBirth: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    passportNumber: z.string().optional().nullable(),
    currentQualification: z.string().optional().nullable(),
    preferredCountry: z.string().optional().nullable(),
    preferredSubject: z.string().optional().nullable(),
    testType: z.string().optional().nullable(),
    testScore: z.string().optional().nullable(),
    visaStatus: z.string().optional().nullable(),
  }),
});

// @route   GET /api/student/profile
// @desc    Get student profile
router.get('/profile', authenticateJWT, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// @route   PUT /api/student/profile
// @desc    Update student profile
router.put('/profile', authenticateJWT, requireRole(['STUDENT']), validate(profileUpdateSchema), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const data = { ...req.body };
  if (data.dateOfBirth) {
    data.dateOfBirth = new Date(data.dateOfBirth);
  }

  try {
    const updated = await prisma.profile.update({
      where: { userId: req.user.userId },
      data,
    });
    return res.status(200).json({ success: true, data: updated, message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// @route   GET /api/student/applications
// @desc    Get student's applications
router.get('/applications', authenticateJWT, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const applications = await prisma.application.findMany({
      where: { studentId: req.user.userId },
      include: {
        university: {
          select: {
            name: true,
            logo: true,
            country: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// @route   GET /api/student/documents
// @desc    Get student's uploaded documents
router.get('/documents', authenticateJWT, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const documents = await prisma.document.findMany({
      where: { studentId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
});

// @route   POST /api/student/documents
// @desc    Upload a document (Student)
router.post('/documents', authenticateJWT, requireRole(['STUDENT']), upload.single('document'), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const { type } = req.body;
  if (!type) {
    return res.status(400).json({ success: false, message: 'Document type is required (e.g. Transcript, SOP, Passport).' });
  }

  try {
    const uploadResult = await uploadFile(req.file, 'student-documents');

    const document = await prisma.document.create({
      data: {
        studentId: req.user.userId,
        name: req.file.originalname,
        type,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        status: DocumentStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully. Counselors will verify it shortly.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to upload document.' });
  }
});

// @route   GET /api/student/notifications
// @desc    Get student notifications
router.get('/notifications', authenticateJWT, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// @route   PUT /api/student/notifications/:id/read
// @desc    Mark notification as read
router.put('/notifications/:id/read', authenticateJWT, requireRole(['STUDENT']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

export default router;
