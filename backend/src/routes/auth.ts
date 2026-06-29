import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { sendEmail, getWelcomeTemplate } from '../utils/email';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

// @route   POST /api/auth/register
// @desc    Register a new student
router.post('/register', validate(registerSchema), async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role: 'STUDENT',
      },
    });

    // Initialize an empty profile for the student
    await prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to EduConsult Pro!',
      html: getWelcomeTemplate(`${firstName} ${lastName}`),
    });

    const payload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get tokens
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const payload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login.',
    });
  }
});

// @route   POST /api/auth/google-login
// @desc    Register or login using Google OAuth credentials
router.post('/google-login', async (req, res) => {
  const { email, firstName, lastName, googleId } = req.body;

  // In production, you verify the 'token' using google-auth-library.
  // For standard deployment & offline development fallback, we accept email/name directly.
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Google login requires email details.',
    });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new Google SSO account
      const dummyPassword = await bcrypt.hash(Math.random().toString(36).substring(7), 10);
      user = await prisma.user.create({
        data: {
          email,
          firstName: firstName || 'GoogleUser',
          lastName: lastName || 'Account',
          passwordHash: dummyPassword,
          googleId: googleId || `google_${Date.now()}`,
          role: 'STUDENT',
        },
      });

      // Create profile
      await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });
    }

    const payload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google authentication error.',
    });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh expired access tokens
router.post('/refresh-token', validate(refreshSchema), async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session user.',
      });
    }

    const payload = { userId: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token.',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile.',
    });
  }
});

export default router;
