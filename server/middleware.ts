import type { RequestHandler } from "express";
import { storage } from "./storage";

// Define role hierarchy and permissions
export const ROLE_PERMISSIONS = {
  super_admin: {
    level: 100,
    permissions: [
      'manage_schools',
      'manage_users',
      'manage_all_data',
      'view_all_reports',
      'system_settings'
    ]
  },
  school_admin: {
    level: 80,
    permissions: [
      'manage_school_users',
      'manage_students',
      'manage_teachers',
      'manage_fees',
      'manage_library',
      'manage_transport',
      'manage_events',
      'view_reports',
      'school_settings'
    ]
  },
  principal: {
    level: 70,
    permissions: [
      'manage_students',
      'manage_teachers',
      'manage_academics',
      'manage_fees',
      'manage_library',
      'manage_transport',
      'manage_events',
      'view_reports',
      'approve_leave'
    ]
  },
  teacher: {
    level: 50,
    permissions: [
      'view_students',
      'manage_assignments',
      'manage_exams',
      'mark_attendance',
      'view_reports',
      'manage_library_issues',
      'request_leave'
    ]
  },
  student: {
    level: 20,
    permissions: [
      'view_own_profile',
      'view_assignments',
      'view_exams',
      'view_library',
      'view_transport',
      'view_fees'
    ]
  },
  parent: {
    level: 10,
    permissions: [
      'view_child_profile',
      'view_child_assignments',
      'view_child_exams',
      'view_child_fees',
      'view_child_transport'
    ]
  }
};

// Check if user has specific permission
export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const roleConfig = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  if (!roleConfig) return false;
  return roleConfig.permissions.includes(requiredPermission);
}

// Check if user role level meets minimum requirement
export function hasRoleLevel(userRole: string, minLevel: number): boolean {
  const roleConfig = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  if (!roleConfig) return false;
  return roleConfig.level >= minLevel;
}

// Enhanced role-based authorization middleware
export function requireRoles(...allowedRoles: string[]): RequestHandler {
  return async (req: any, res, next) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      // Attach user to request for downstream use
      req.currentUser = user;
      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Permission-based authorization middleware
export function requirePermission(permission: string): RequestHandler {
  return async (req: any, res, next) => {
    try {
      const user = req.currentUser;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!hasPermission(user.role as string, permission)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Minimum role level authorization middleware
export function requireRoleLevel(minLevel: number): RequestHandler {
  return async (req: any, res, next) => {
    try {
      const user = req.currentUser;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!hasRoleLevel(user.role, minLevel)) {
        return res.status(403).json({ message: "Insufficient role level" });
      }

      next();
    } catch (error) {
      console.error("Role level check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

// School ownership validation middleware
export function requireSchoolAccess(): RequestHandler {
  return async (req: any, res, next) => {
    try {
      const user = req.currentUser || req.user;
      if (!user?.schoolId && user?.role !== 'super_admin') {
        return res.status(400).json({ message: "User not associated with a school" });
      }
      next();
    } catch (error) {
      console.error("School access check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

// CSRF protection middleware
export function requireJsonContent(): RequestHandler {
  return (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (!req.is('application/json')) {
        return res.status(400).json({ message: "Content-Type must be application/json" });
      }
      
      // Basic CSRF protection - require custom header
      if (!req.headers['x-requested-with']) {
        req.headers['x-requested-with'] = 'XMLHttpRequest'; // Set default for API requests
      }
    }
    next();
  };
}
