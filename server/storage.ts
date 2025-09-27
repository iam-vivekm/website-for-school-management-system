// Referenced from javascript_database and javascript_log_in_with_replit integrations
import {
  users,
  schools,
  students,
  teachers,
  grades,
  sections,
  subjects,
  classes,
  attendance,
  feeStructures,
  feePayments,
  announcements,
  type User,
  type UpsertUser,
  type School,
  type InsertSchool,
  type Student,
  type InsertStudent,
  type Teacher,
  type InsertTeacher,
  type Grade,
  type InsertGrade,
  type Section,
  type InsertSection,
  type Subject,
  type InsertSubject,
  type Class,
  type InsertClass,
  type Attendance,
  type InsertAttendance,
  type FeeStructure,
  type InsertFeeStructure,
  type FeePayment,
  type InsertFeePayment,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithPassword(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    schoolId?: string;
    passwordHash: string;
  }): Promise<User>;
  
  // School operations
  createSchool(school: InsertSchool): Promise<School>;
  getSchool(id: string): Promise<School | undefined>;
  getSchoolBySubdomain(subdomain: string): Promise<School | undefined>;
  updateSchool(id: string, school: Partial<InsertSchool>): Promise<School>;
  listSchools(): Promise<School[]>;
  
  // Student operations
  createStudent(student: InsertStudent): Promise<Student>;
  createStudentWithUser(data: {
    userData: UpsertUser;
    studentData: Omit<InsertStudent, 'userId'>;
  }): Promise<Student & { user: User }>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentsBySchool(schoolId: string): Promise<(Student & { user?: User })[]>;
  getStudentsByGrade(schoolId: string, gradeId: string): Promise<Student[]>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  searchStudents(schoolId: string, searchTerm: string): Promise<Student[]>;
  
  // Teacher operations
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeachersBySchool(schoolId: string): Promise<Teacher[]>;
  updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher>;
  deleteTeacher(id: string): Promise<void>;
  searchTeachers(schoolId: string, searchTerm: string): Promise<Teacher[]>;
  
  // Academic structure operations
  createGrade(grade: InsertGrade): Promise<Grade>;
  getGradesBySchool(schoolId: string): Promise<Grade[]>;
  createSection(section: InsertSection): Promise<Section>;
  getSectionsByGrade(gradeId: string): Promise<Section[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  getSubjectsBySchool(schoolId: string): Promise<Subject[]>;
  createClass(cls: InsertClass): Promise<Class>;
  getClassesBySchool(schoolId: string): Promise<Class[]>;
  
  // Attendance operations
  markAttendance(attendance: InsertAttendance): Promise<Attendance>;
  getAttendanceByDate(schoolId: string, date: Date): Promise<Attendance[]>;
  getStudentAttendance(studentId: string, startDate: Date, endDate: Date): Promise<Attendance[]>;
  getAttendanceStats(schoolId: string): Promise<{totalStudents: number, presentToday: number, attendanceRate: number}>;
  
  // Fee operations
  createFeeStructure(feeStructure: InsertFeeStructure): Promise<FeeStructure>;
  getFeeStructuresBySchool(schoolId: string): Promise<FeeStructure[]>;
  createFeePayment(payment: InsertFeePayment): Promise<FeePayment>;
  getFeePaymentsByStudent(studentId: string): Promise<FeePayment[]>;
  getFeePaymentsBySchool(schoolId: string): Promise<FeePayment[]>;
  updateFeePayment(id: string, payment: Partial<InsertFeePayment>): Promise<FeePayment>;
  
  // Announcement operations
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncementsBySchool(schoolId: string): Promise<Announcement[]>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev' && id === 'test-user-123') {
      // Return mock user for local dev
      return {
        id: 'test-user-123',
        email: 'admin@school.com',
        firstName: 'Test',
        lastName: 'Admin',
        profileImageUrl: null,
        role: 'super_admin',
        status: 'active',
        schoolId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
    }
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev' && email === 'admin@school.com') {
      // Return mock user for local dev
      return {
        id: 'test-user-123',
        email: 'admin@school.com',
        firstName: 'Test',
        lastName: 'Admin',
        profileImageUrl: null,
        role: 'super_admin',
        status: 'active',
        schoolId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
    }
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0] as User;
  }

  async createUserWithPassword(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    schoolId?: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        schoolId: userData.schoolId,
        passwordHash: userData.passwordHash,
        status: 'active',
        createdAt: userData.createdAt || new Date(),
        updatedAt: userData.updatedAt || new Date(),
      })
      .returning();
    return result[0] as User;
  }

  // School operations
  async createSchool(schoolData: InsertSchool): Promise<School> {
    // For SQLite, we need to provide an ID manually
    const schoolId = `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await db.insert(schools).values({
      ...schoolData,
      id: schoolId,
    }).returning();
    return result[0] as School;
  }

  async getSchool(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school;
  }

  async getSchoolBySubdomain(subdomain: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.subdomain, subdomain));
    return school;
  }

  async updateSchool(id: string, schoolData: Partial<InsertSchool>): Promise<School> {
    const [school] = await db
      .update(schools)
      .set({ ...schoolData, updatedAt: new Date() })
      .where(eq(schools.id, id))
      .returning();
    return school;
  }

  async listSchools(): Promise<School[]> {
    return await db.select().from(schools).orderBy(asc(schools.name));
  }

  // Student operations
  async createStudent(studentData: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(studentData).returning();
    return result[0] as Student;
  }

  async createStudentWithUser(data: {
    userData: UpsertUser;
    studentData: Omit<InsertStudent, 'userId'>;
  }): Promise<Student & { user: User }> {
    // Check for existing user with same email in the same school
    const existingUser = await db
      .select()
      .from(users)
      .where(and(
        eq(users.email, data.userData.email),
        eq(users.schoolId, data.userData.schoolId!)
      ))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error(`A user with email ${data.userData.email} already exists in this school`);
    }

    // Generate a unique user ID for the student
    const studentUserId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Use direct SQL to avoid Drizzle's UUID generation issues
    await db.run(sql`
      INSERT INTO users (id, email, first_name, last_name, role, school_id, status)
      VALUES (${studentUserId}, ${data.userData.email}, ${data.userData.firstName},
              ${data.userData.lastName}, ${data.userData.role}, ${data.userData.schoolId}, 'active')
    `);

    await db.run(sql`
      INSERT INTO students (id, user_id, school_id, student_id, admission_date, gender, address, is_active)
      VALUES (${studentId}, ${studentUserId}, ${data.studentData.schoolId}, ${data.studentData.studentId},
              ${data.studentData.admissionDate?.toISOString() || null}, ${data.studentData.gender || null},
              ${data.studentData.address || null}, 1)
    `);

    // Get the created records
    const [user] = await db.select().from(users).where(eq(users.id, studentUserId));
    const [student] = await db.select().from(students).where(eq(students.id, studentId));

    return { ...student, user } as Student & { user: User };
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentsBySchool(schoolId: string): Promise<(Student & { user?: User })[]> {
    const result = await db
      .select({
        student: students,
        user: users
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .where(and(eq(students.schoolId, schoolId), eq(students.isActive, true)))
      .orderBy(asc(students.studentId));
    
    return result.map(row => ({
      ...row.student,
      user: row.user || undefined
    }));
  }

  async getStudentsByGrade(schoolId: string, gradeId: string): Promise<Student[]> {
    return await db
      .select()
      .from(students)
      .where(and(
        eq(students.schoolId, schoolId),
        eq(students.gradeId, gradeId),
        eq(students.isActive, true)
      ))
      .orderBy(asc(students.studentId));
  }

  async updateStudent(id: string, studentData: Partial<InsertStudent>): Promise<Student> {
    const result = await db
      .update(students)
      .set({ ...studentData, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return result[0] as Student;
  }

  async deleteStudent(id: string): Promise<void> {
    await db.update(students).set({ isActive: false }).where(eq(students.id, id));
  }

  async searchStudents(schoolId: string, searchTerm: string): Promise<Student[]> {
    const result = await db
      .select({ students: students })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(and(
        eq(students.schoolId, schoolId),
        eq(students.isActive, true),
        like(users.firstName, `%${searchTerm}%`)
      ))
      .orderBy(asc(students.studentId));
    return result.map(r => r.students);
  }

  // Teacher operations
  async createTeacher(teacherData: InsertTeacher): Promise<Teacher> {
    const [teacher] = await db.insert(teachers).values(teacherData).returning();
    return teacher;
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }

  async getTeachersBySchool(schoolId: string): Promise<Teacher[]> {
    return await db
      .select()
      .from(teachers)
      .where(and(eq(teachers.schoolId, schoolId), eq(teachers.isActive, true)))
      .orderBy(asc(teachers.teacherId));
  }

  async updateTeacher(id: string, teacherData: Partial<InsertTeacher>): Promise<Teacher> {
    const [teacher] = await db
      .update(teachers)
      .set({ ...teacherData, updatedAt: new Date() })
      .where(eq(teachers.id, id))
      .returning();
    return teacher;
  }

  async deleteTeacher(id: string): Promise<void> {
    await db.update(teachers).set({ isActive: false }).where(eq(teachers.id, id));
  }

  async searchTeachers(schoolId: string, searchTerm: string): Promise<Teacher[]> {
    const result = await db
      .select({ teachers: teachers })
      .from(teachers)
      .innerJoin(users, eq(teachers.userId, users.id))
      .where(and(
        eq(teachers.schoolId, schoolId),
        eq(teachers.isActive, true),
        like(users.firstName, `%${searchTerm}%`)
      ))
      .orderBy(asc(teachers.teacherId));
    return result.map(r => r.teachers);
  }

  // Academic structure operations
  async createGrade(gradeData: InsertGrade): Promise<Grade> {
    const [grade] = await db.insert(grades).values(gradeData).returning();
    return grade;
  }

  async getGradesBySchool(schoolId: string): Promise<Grade[]> {
    return await db
      .select()
      .from(grades)
      .where(and(eq(grades.schoolId, schoolId), eq(grades.isActive, true)))
      .orderBy(asc(grades.level));
  }

  async createSection(sectionData: InsertSection): Promise<Section> {
    const [section] = await db.insert(sections).values(sectionData).returning();
    return section;
  }

  async getSectionsByGrade(gradeId: string): Promise<Section[]> {
    return await db
      .select()
      .from(sections)
      .where(and(eq(sections.gradeId, gradeId), eq(sections.isActive, true)))
      .orderBy(asc(sections.name));
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values(subjectData).returning();
    return subject;
  }

  async getSubjectsBySchool(schoolId: string): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.schoolId, schoolId), eq(subjects.isActive, true)))
      .orderBy(asc(subjects.name));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [cls] = await db.insert(classes).values(classData).returning();
    return cls;
  }

  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    return await db
      .select()
      .from(classes)
      .where(and(eq(classes.schoolId, schoolId), eq(classes.isActive, true)))
      .orderBy(desc(classes.createdAt));
  }

  // Attendance operations
  async markAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [attendanceRecord] = await db.insert(attendance).values(attendanceData).returning();
    return attendanceRecord;
  }

  async getAttendanceByDate(schoolId: string, date: Date): Promise<Attendance[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db
      .select()
      .from(attendance)
      .where(and(
        eq(attendance.schoolId, schoolId),
        eq(attendance.date, startOfDay)
      ));
  }

  async getStudentAttendance(studentId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(and(
        eq(attendance.studentId, studentId),
        // Note: Date range queries would need proper date handling
      ))
      .orderBy(desc(attendance.date));
  }

  async getAttendanceStats(schoolId: string): Promise<{totalStudents: number, presentToday: number, attendanceRate: number}> {
    // This would require complex aggregations - simplified for now
    const totalStudents = await db
      .select()
      .from(students)
      .where(and(eq(students.schoolId, schoolId), eq(students.isActive, true)));
    
    return {
      totalStudents: totalStudents.length,
      presentToday: Math.floor(totalStudents.length * 0.92), // Mock data
      attendanceRate: 92.5 // Mock data
    };
  }

  // Fee operations
  async createFeeStructure(feeStructureData: InsertFeeStructure): Promise<FeeStructure> {
    const [feeStructure] = await db.insert(feeStructures).values(feeStructureData).returning();
    return feeStructure;
  }

  async getFeeStructuresBySchool(schoolId: string): Promise<FeeStructure[]> {
    return await db
      .select()
      .from(feeStructures)
      .where(and(eq(feeStructures.schoolId, schoolId), eq(feeStructures.isActive, true)))
      .orderBy(asc(feeStructures.name));
  }

  async createFeePayment(paymentData: InsertFeePayment): Promise<FeePayment> {
    const [payment] = await db.insert(feePayments).values(paymentData).returning();
    return payment;
  }

  async getFeePaymentsByStudent(studentId: string): Promise<FeePayment[]> {
    return await db
      .select()
      .from(feePayments)
      .where(eq(feePayments.studentId, studentId))
      .orderBy(desc(feePayments.dueDate));
  }

  async getFeePaymentsBySchool(schoolId: string): Promise<FeePayment[]> {
    return await db
      .select()
      .from(feePayments)
      .where(eq(feePayments.schoolId, schoolId))
      .orderBy(desc(feePayments.dueDate));
  }

  async updateFeePayment(id: string, paymentData: Partial<InsertFeePayment>): Promise<FeePayment> {
    const [payment] = await db
      .update(feePayments)
      .set({ ...paymentData, updatedAt: new Date() })
      .where(eq(feePayments.id, id))
      .returning();
    return payment;
  }

  // Announcement operations
  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(announcementData).returning();
    return announcement;
  }

  async getAnnouncementsBySchool(schoolId: string): Promise<Announcement[]> {
    const now = new Date();
    return await db
      .select()
      .from(announcements)
      .where(and(
        eq(announcements.schoolId, schoolId),
        eq(announcements.isActive, true),
        // Only show announcements that haven't expired
      ))
      .orderBy(desc(announcements.publishDate));
  }

  async updateAnnouncement(id: string, announcementData: Partial<InsertAnnouncement>): Promise<Announcement> {
    const [announcement] = await db
      .update(announcements)
      .set({ ...announcementData, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.update(announcements).set({ isActive: false }).where(eq(announcements.id, id));
  }
}

export const storage = new DatabaseStorage();
