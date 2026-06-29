import { Router, Response } from 'express';
import multer from 'multer';
import os from 'os';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { uploadFile } from '../utils/cloudinary';

const router = Router();
const upload = multer({ dest: os.tmpdir() });

// @route   POST /api/upload/image
// @desc    Upload an image for blogs or universities (Admin/Consultant)
router.post('/image', authenticateJWT, requireRole(['ADMIN', 'CONSULTANT']), upload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }

  try {
    const uploadResult = await uploadFile(req.file, 'cms-images');
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// @route   POST /api/upload/document
// @desc    Upload general document files
router.post('/document', authenticateJWT, upload.single('document'), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No document file uploaded' });
  }

  try {
    const uploadResult = await uploadFile(req.file, 'system-documents');
    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to upload document' });
  }
});

export default router;
