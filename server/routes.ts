// Referenced from javascript_log_in_with_replit integration
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { requireRoles, requirePermission, requireSchoolAccess, requireJsonContent } from "./middleware";
import { requireAuth, setAuthCookies, clearAuthCookies, authenticateRefreshToken } from "./auth";
import { insertStudentSchema, insertTeacherSchema, insertAnnouncementSchema, insertSchoolSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Apply CSRF protection to all routes
  app.use('/api', requireJsonContent());

  // JWT Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // For now, we'll use a simple mock login since we don't have password hashing yet
      // In production, you'd verify the password hash
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Set JWT cookies
      setAuthCookies(res, user);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          schoolId: user.schoolId,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName, schoolName, role = 'school_admin' } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      let schoolId: string | undefined;

      // If creating a school admin, create the school first
      if (role === 'school_admin' && schoolName) {
        const schoolData = insertSchoolSchema.parse({
          name: schoolName,
          email: email,
          // Other school fields can be updated later
        });
        const school = await storage.createSchool(schoolData);
        schoolId = school.id;
      }

      // Create user
      const userData = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName,
        role,
        schoolId,
        status: 'active' as const,
      };

      const user = await storage.upsertUser(userData);

      // Set JWT cookies
      setAuthCookies(res, user);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          schoolId: user.schoolId,
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Signup failed' });
    }
  });

  app.post('/api/auth/refresh', authenticateRefreshToken, async (req, res) => {
    try {
      const user = req.user!;
      setAuthCookies(res, user);
      res.json({ message: 'Token refreshed' });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ message: 'Token refresh failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    clearAuthCookies(res);
    res.json({ message: 'Logged out successfully' });
  });

  // Get current user (JWT version)
  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Legacy Replit Auth routes (for backward compatibility)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student routes
  app.get('/api/students', isAuthenticated, requireRoles('super_admin', 'school_admin', 'principal', 'teacher'), requireSchoolAccess(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = req.currentUser || await storage.getUser(userId);
      const students = await storage.getStudentsBySchool(user.schoolId);
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post('/api/students', isAuthenticated, requireRoles('super_admin', 'school_admin', 'principal'), requireSchoolAccess(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = req.currentUser || await storage.getUser(userId);
      
      // Create validation schema for student+user creation
      const createStudentSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Please enter a valid email"),
        studentId: z.string().min(1, "Student ID is required"),
        gradeId: z.string().optional(),
        sectionId: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        address: z.string().optional(),
        parentName: z.string().optional(),
        parentEmail: z.string().email().optional().or(z.literal("")),
        parentPhone: z.string().optional(),
        bloodGroup: z.string().optional(),
        medicalInfo: z.string().optional(),
      });
      
      const validatedData = createStudentSchema.parse(req.body);
      const {
        firstName,
        lastName,
        email,
        studentId,
        gradeId,
        sectionId,
        dateOfBirth,
        gender,
        address,
        parentName,
        parentEmail,
        parentPhone,
        bloodGroup,
        medicalInfo,
      } = validatedData;
      
      const student = await storage.createStudentWithUser({
        userData: {
          firstName,
          lastName,
          email,
          role: 'student',
          schoolId: user.schoolId,
        },
        studentData: {
          studentId,
          gradeId,
          sectionId,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender,
          address,
          emergencyContact: parentName,
          parentEmail: parentEmail || undefined,
          parentPhone: parentPhone || undefined,
          bloodGroup,
          medicalInfo,
          schoolId: user.schoolId,
          isActive: true,
        },
      });
      
      res.json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Teacher routes
  app.get('/api/teachers', isAuthenticated, requireRoles('super_admin', 'school_admin', 'principal'), requireSchoolAccess(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.schoolId) {
        return res.status(400).json({ message: "User not associated with a school" });
      }

      const teachers = await storage.getTeachersBySchool(user.schoolId);
      res.json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.post('/api/teachers', isAuthenticated, requireRoles('super_admin', 'school_admin', 'principal'), requireSchoolAccess(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.schoolId) {
        return res.status(400).json({ message: "User not associated with a school" });
      }

      const teacherData = insertTeacherSchema.parse({
        ...req.body,
        schoolId: user.schoolId
      });
      
      const teacher = await storage.createTeacher(teacherData);
      res.json(teacher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating teacher:", error);
      res.status(500).json({ message: "Failed to create teacher" });
    }
  });

  // School routes  
  app.get('/api/schools', isAuthenticated, requireRoles('super_admin', 'school_admin', 'principal'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only super admin can list all schools
      if (user?.role !== 'super_admin') {
        if (!user?.schoolId) {
          return res.status(400).json({ message: "User not associated with a school" });
        }
        const school = await storage.getSchool(user.schoolId);
        return res.json([school]);
      }
      
      const schools = await storage.listSchools();
      res.json(schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
      res.status(500).json({ message: "Failed to fetch schools" });
    }
  });

  // Fee routes
  app.get('/api/fees', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.schoolId) {
        return res.status(400).json({ message: "User not associated with a school" });
      }

      const fees = await storage.getFeePaymentsBySchool(user.schoolId);
      res.json(fees);
    } catch (error) {
      console.error("Error fetching fees:", error);
      res.status(500).json({ message: "Failed to fetch fees" });
    }
  });

  // Announcement routes
  app.get('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.schoolId) {
        return res.status(400).json({ message: "User not associated with a school" });
      }

      const announcements = await storage.getAnnouncementsBySchool(user.schoolId);
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post('/api/announcements', isAuthenticated, requireRoles('super_admin', 'school_admin', 'principal', 'teacher'), requireSchoolAccess(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.schoolId) {
        return res.status(400).json({ message: "User not associated with a school" });
      }

      const announcementData = insertAnnouncementSchema.parse({
        ...req.body,
        schoolId: user.schoolId,
        authorId: userId
      });
      
      const announcement = await storage.createAnnouncement(announcementData);
      res.json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Attendance stats route
  app.get('/api/attendance/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.schoolId) {
        return res.status(400).json({ message: "User not associated with a school" });
      }

      const stats = await storage.getAttendanceStats(user.schoolId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
      res.status(500).json({ message: "Failed to fetch attendance stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
