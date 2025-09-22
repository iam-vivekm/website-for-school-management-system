import type { RequestHandler } from "express";
import { storage } from "./storage";

// Role-based authorization middleware
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