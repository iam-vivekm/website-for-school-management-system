import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  boolean, 
  integer, 
  decimal,
  jsonb,
  index,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "school_admin", 
  "principal",
  "teacher",
  "student",
  "parent"
]);

// User status enum
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive", 
  "suspended",
  "pending"
]);

// Fee status enum
export const feeStatusEnum = pgEnum("fee_status", [
  "pending",
  "partial", 
  "paid",
  "overdue"
]);

// Attendance status enum
export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late", 
  "excused"
]);

// User storage table (mandatory for Replit Auth, extended for school management)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("student"),
  status: userStatusEnum("status").notNull().default("active"),
  schoolId: varchar("school_id").references(() => schools.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schools table (multi-tenant)
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  subdomain: varchar("subdomain").unique(),
  logo: varchar("logo"),
  primaryColor: varchar("primary_color").default("#1d4ed8"),
  secondaryColor: varchar("secondary_color").default("#64748b"),
  address: text("address"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  principalId: varchar("principal_id").references(() => users.id),
  settings: jsonb("settings").$type<{
    academic_year_start?: string;
    academic_year_end?: string;
    working_days?: string[];
    time_zone?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  studentId: varchar("student_id").notNull(),
  gradeId: varchar("grade_id").references(() => grades.id),
  sectionId: varchar("section_id").references(() => sections.id),
  admissionDate: timestamp("admission_date"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender"),
  bloodGroup: varchar("blood_group"),
  address: text("address"),
  parentPhone: varchar("parent_phone"),
  parentEmail: varchar("parent_email"),
  emergencyContact: text("emergency_contact"),
  medicalInfo: text("medical_info"),
  documents: jsonb("documents").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  teacherId: varchar("teacher_id").notNull(),
  qualifications: text("qualifications"),
  subjects: jsonb("subjects").$type<string[]>(),
  dateOfJoining: timestamp("date_of_joining"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  phone: varchar("phone"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Grades table
export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(), // e.g., "Grade 1", "Grade 10"
  level: integer("level").notNull(), // 1, 2, 3, etc.
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sections table 
export const sections = pgTable("sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  gradeId: varchar("grade_id").references(() => grades.id).notNull(),
  name: varchar("name").notNull(), // e.g., "A", "B", "C"
  capacity: integer("capacity").default(30),
  classTeacherId: varchar("class_teacher_id").references(() => teachers.id),
  room: varchar("room"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(),
  code: varchar("code").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Classes table (combination of grade, section, subject, teacher)
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  gradeId: varchar("grade_id").references(() => grades.id).notNull(),
  sectionId: varchar("section_id").references(() => sections.id).notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  schedule: jsonb("schedule").$type<{
    day: string;
    start_time: string;
    end_time: string;
  }[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  classId: varchar("class_id").references(() => classes.id),
  date: timestamp("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  markedBy: varchar("marked_by").references(() => users.id).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee structures table
export const feeStructures = pgTable("fee_structures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  gradeId: varchar("grade_id").references(() => grades.id).notNull(),
  name: varchar("name").notNull(), // e.g., "Tuition Fee", "Transport Fee"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  frequency: varchar("frequency").notNull(), // monthly, quarterly, yearly
  dueDate: integer("due_date"), // day of month for monthly fees
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee payments table
export const feePayments = pgTable("fee_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  feeStructureId: varchar("fee_structure_id").references(() => feeStructures.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
  status: feeStatusEnum("status").notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  paymentDate: timestamp("payment_date"),
  paymentMethod: varchar("payment_method"), // stripe, cash, check
  transactionId: varchar("transaction_id"),
  receipt: varchar("receipt"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  type: varchar("type").notNull().default("info"), // info, warning, urgent, success
  priority: varchar("priority").notNull().default("medium"), // low, medium, high
  targetAudience: jsonb("target_audience").$type<string[]>(), // roles that can see this
  authorId: varchar("author_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  publishDate: timestamp("publish_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const schoolsRelations = relations(schools, ({ many, one }) => ({
  students: many(students),
  teachers: many(teachers),
  users: many(users),
  grades: many(grades),
  sections: many(sections),
  subjects: many(subjects),
  classes: many(classes),
  attendance: many(attendance),
  feeStructures: many(feeStructures),
  feePayments: many(feePayments),
  announcements: many(announcements),
  principal: one(users, {
    fields: [schools.principalId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  studentProfile: one(students),
  teacherProfile: one(teachers),
  markedAttendance: many(attendance),
  announcements: many(announcements),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  grade: one(grades, {
    fields: [students.gradeId],
    references: [grades.id],
  }),
  section: one(sections, {
    fields: [students.sectionId],
    references: [sections.id],
  }),
  attendance: many(attendance),
  feePayments: many(feePayments),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [teachers.schoolId],
    references: [schools.id],
  }),
  classes: many(classes),
  sections: many(sections),
}));

export const gradesRelations = relations(grades, ({ one, many }) => ({
  school: one(schools, {
    fields: [grades.schoolId],
    references: [schools.id],
  }),
  sections: many(sections),
  students: many(students),
  classes: many(classes),
  feeStructures: many(feeStructures),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  school: one(schools, {
    fields: [sections.schoolId],
    references: [schools.id],
  }),
  grade: one(grades, {
    fields: [sections.gradeId],
    references: [grades.id],
  }),
  classTeacher: one(teachers, {
    fields: [sections.classTeacherId],
    references: [teachers.id],
  }),
  students: many(students),
  classes: many(classes),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  school: one(schools, {
    fields: [subjects.schoolId],
    references: [schools.id],
  }),
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
  grade: one(grades, {
    fields: [classes.gradeId],
    references: [grades.id],
  }),
  section: one(sections, {
    fields: [classes.sectionId],
    references: [sections.id],
  }),
  subject: one(subjects, {
    fields: [classes.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  school: one(schools, {
    fields: [attendance.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [attendance.classId],
    references: [classes.id],
  }),
  markedBy: one(users, {
    fields: [attendance.markedBy],
    references: [users.id],
  }),
}));

export const feeStructuresRelations = relations(feeStructures, ({ one, many }) => ({
  school: one(schools, {
    fields: [feeStructures.schoolId],
    references: [schools.id],
  }),
  grade: one(grades, {
    fields: [feeStructures.gradeId],
    references: [grades.id],
  }),
  payments: many(feePayments),
}));

export const feePaymentsRelations = relations(feePayments, ({ one }) => ({
  school: one(schools, {
    fields: [feePayments.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [feePayments.studentId],
    references: [students.id],
  }),
  feeStructure: one(feeStructures, {
    fields: [feePayments.feeStructureId],
    references: [feeStructures.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  school: one(schools, {
    fields: [announcements.schoolId],
    references: [schools.id],
  }),
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true,
});

export const insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertFeeStructureSchema = createInsertSchema(feeStructures).omit({
  id: true,
  createdAt: true,
});

export const insertFeePaymentSchema = createInsertSchema(feePayments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;
export type FeeStructure = typeof feeStructures.$inferSelect;
export type InsertFeePayment = z.infer<typeof insertFeePaymentSchema>;
export type FeePayment = typeof feePayments.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
