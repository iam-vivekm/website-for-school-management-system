// Referenced from javascript_log_in_with_replit integration
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { requireRoles, requirePermission, requireSchoolAccess, requireJsonContent } from "./middleware";
import { insertStudentSchema, insertTeacherSchema, insertAnnouncementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Apply CSRF protection to all routes
  app.use('/api', requireJsonContent());

  // Auth routes
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
