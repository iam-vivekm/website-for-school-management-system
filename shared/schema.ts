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
  pgEnum,
  PgTable
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

// Book status enum
export const bookStatusEnum = pgEnum("book_status", [
  "available",
  "issued",
  "reserved",
  "damaged",
  "lost"
]);

// Assignment status enum
export const assignmentStatusEnum = pgEnum("assignment_status", [
  "draft",
  "published",
  "submitted",
  "graded",
  "overdue"
]);

// Exam status enum
export const examStatusEnum = pgEnum("exam_status", [
  "scheduled",
  "ongoing",
  "completed",
  "cancelled"
]);

// Message type enum
export const messageTypeEnum = pgEnum("message_type", [
  "direct",
  "group",
  "announcement"
]);

// Notification type enum
export const notificationTypeEnum = pgEnum("notification_type", [
  "email",
  "sms",
  "push",
  "in_app"
]);

// Asset status enum
export const assetStatusEnum = pgEnum("asset_status", [
  "active",
  "maintenance",
  "retired",
  "lost"
]);

// Leave status enum
export const leaveStatusEnum = pgEnum("leave_status", [
  "pending",
  "approved",
  "rejected",
  "cancelled"
]);

// Forward declarations to break circular reference
export let users: PgTable;
export let schools: PgTable;

// User storage table (mandatory for Replit Auth, extended for school management)
users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("student"),
  status: userStatusEnum("status").notNull().default("active"),
  schoolId: varchar("school_id").references(() => schools.id),
  passwordHash: varchar("password_hash"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Schools table (multi-tenant)
schools = pgTable("schools", {
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Grades table
export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(), // e.g., "Grade 1", "Grade 10"
  level: integer("level").notNull(), // 1, 2, 3, etc.
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(),
  code: varchar("code").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Classes table (combination of grade, section, subject, teacher)
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  gradeId: varchar("grade_id").references(() => grades.id).notNull(),
  sectionId: varchar("section_id").references(() => sections.id).notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  schedule: jsonb("schedule").$type<{ day: string; start_time: string; end_time: string; }[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
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
  publishDate: timestamp("publish_date").default(sql`CURRENT_TIMESTAMP`),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Library tables
export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  title: varchar("title").notNull(),
  author: varchar("author").notNull(),
  isbn: varchar("isbn"),
  category: varchar("category"),
  publisher: varchar("publisher"),
  publicationYear: integer("publication_year"),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  location: varchar("location"), // shelf/rack location
  description: text("description"),
  coverImage: varchar("cover_image"),
  status: bookStatusEnum("status").notNull().default("available"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bookIssues = pgTable("book_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  bookId: varchar("book_id").references(() => books.id).notNull(),
  studentId: varchar("student_id").references(() => students.id),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  issuedBy: varchar("issued_by").references(() => users.id).notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  returnedBy: varchar("returned_by").references(() => users.id),
  fineAmount: decimal("fine_amount", { precision: 10, scale: 2 }).default("0"),
  finePaid: boolean("fine_paid").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Transport tables
export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  distance: decimal("distance", { precision: 10, scale: 2 }), // in km
  estimatedTime: integer("estimated_time"), // in minutes
  fare: decimal("fare", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  registrationNumber: varchar("registration_number").notNull(),
  model: varchar("model"),
  capacity: integer("capacity").notNull(),
  driverId: varchar("driver_id").references(() => users.id),
  routeId: varchar("route_id").references(() => routes.id),
  status: varchar("status").notNull().default("active"), // active, maintenance, inactive
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const routeStops = pgTable("route_stops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").references(() => routes.id).notNull(),
  name: varchar("name").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  pickupTime: varchar("pickup_time"), // HH:MM format
  dropTime: varchar("drop_time"), // HH:MM format
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const studentTransport = pgTable("student_transport", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  routeId: varchar("route_id").references(() => routes.id).notNull(),
  pickupStopId: varchar("pickup_stop_id").references(() => routeStops.id),
  dropStopId: varchar("drop_stop_id").references(() => routeStops.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Timetable tables
export const periods = pgTable("periods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(), // e.g., "Period 1", "Break", "Lunch"
  startTime: varchar("start_time").notNull(), // HH:MM format
  endTime: varchar("end_time").notNull(), // HH:MM format
  duration: integer("duration").notNull(), // in minutes
  isBreak: boolean("is_break").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  gradeId: varchar("grade_id").references(() => grades.id).notNull(),
  sectionId: varchar("section_id").references(() => sections.id).notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  periodId: varchar("period_id").references(() => periods.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6, 0=Sunday
  room: varchar("room"),
  academicYear: varchar("academic_year"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Homework/Assignments tables
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  attachments: jsonb("attachments").$type<string[]>(),
  dueDate: timestamp("due_date").notNull(),
  totalMarks: integer("total_marks"),
  status: assignmentStatusEnum("status").notNull().default("draft"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").references(() => assignments.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  submittedAt: timestamp("submitted_at").notNull(),
  content: text("content"),
  attachments: jsonb("attachments").$type<string[]>(),
  marks: integer("marks"),
  feedback: text("feedback"),
  gradedBy: varchar("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Exams tables
export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  subjectId: varchar("subject_id").references(() => subjects.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  examDate: timestamp("exam_date").notNull(),
  startTime: varchar("start_time").notNull(), // HH:MM format
  endTime: varchar("end_time").notNull(), // HH:MM format
  duration: integer("duration").notNull(), // in minutes
  totalMarks: integer("total_marks").notNull(),
  passingMarks: integer("passing_marks"),
  room: varchar("room"),
  status: examStatusEnum("status").notNull().default("scheduled"),
  instructions: text("instructions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").references(() => exams.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  marks: integer("marks").notNull(),
  grade: varchar("grade"),
  remarks: text("remarks"),
  enteredBy: varchar("entered_by").references(() => users.id).notNull(),
  enteredAt: timestamp("entered_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const reportCards = pgTable("report_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  academicYear: varchar("academic_year").notNull(),
  term: varchar("term").notNull(), // e.g., "Term 1", "Final"
  overallGrade: varchar("overall_grade"),
  overallPercentage: decimal("overall_percentage", { precision: 5, scale: 2 }),
  attendancePercentage: decimal("attendance_percentage", { precision: 5, scale: 2 }),
  remarks: text("remarks"),
  generatedBy: varchar("generated_by").references(() => users.id).notNull(),
  generatedAt: timestamp("generated_at").default(sql`CURRENT_TIMESTAMP`),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Events/Calendar tables
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  startTime: varchar("start_time"),
  endTime: varchar("end_time"),
  location: varchar("location"),
  type: varchar("type").notNull(), // academic, sports, cultural, holiday, etc.
  targetAudience: jsonb("target_audience").$type<string[]>(), // roles or specific classes
  organizerId: varchar("organizer_id").references(() => users.id),
  isAllDay: boolean("is_all_day").default(false),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: jsonb("recurrence_pattern").$type<{
    frequency: string; // daily, weekly, monthly, yearly
    interval: number;
    endDate?: string;
  }>(),
  attachments: jsonb("attachments").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const holidays = pgTable("holidays", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(),
  date: timestamp("date").notNull(),
  type: varchar("type").notNull(), // national, religious, school
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Messaging tables
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  type: messageTypeEnum("type").notNull(),
  title: varchar("title"), // for group chats
  participants: jsonb("participants").$type<string[]>(), // user IDs
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type").notNull().default("text"), // text, image, file, etc.
  attachments: jsonb("attachments").$type<string[]>(),
  replyToId: varchar("reply_to_id").references(() => messages.id),
  isRead: boolean("is_read").default(false),
  readBy: jsonb("read_by").$type<string[]>(), // user IDs who have read this message
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Notifications tables
export const notificationTemplates = pgTable("notification_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(),
  type: notificationTypeEnum("type").notNull(),
  subject: varchar("subject"),
  template: text("template").notNull(),
  variables: jsonb("variables").$type<string[]>(), // available variables for template
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // additional data for the notification
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Assets/Inventory tables
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  description: text("description"),
  serialNumber: varchar("serial_number"),
  purchaseDate: timestamp("purchase_date"),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  location: varchar("location"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  status: assetStatusEnum("status").notNull().default("active"),
  warrantyExpiry: timestamp("warranty_expiry"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const assetMaintenance = pgTable("asset_maintenance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").references(() => assets.id).notNull(),
  maintenanceDate: timestamp("maintenance_date").notNull(),
  type: varchar("type").notNull(), // preventive, corrective, upgrade
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  performedBy: varchar("performed_by"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Payroll tables
export const salaries = pgTable("salaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }).notNull(),
  allowances: jsonb("allowances").$type<{ name: string; amount: number }[]>(),
  deductions: jsonb("deductions").$type<{ name: string; amount: number }[]>(),
  effectiveFrom: timestamp("effective_from").notNull(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const salaryPayments = pgTable("salary_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  salaryId: varchar("salary_id").references(() => salaries.id).notNull(),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date"),
  paymentMethod: varchar("payment_method"),
  transactionId: varchar("transaction_id"),
  status: varchar("status").notNull().default("pending"), // pending, paid, cancelled
  processedBy: varchar("processed_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Leave tables
export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  leaveType: varchar("leave_type").notNull(), // casual, sick, maternity, etc.
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason").notNull(),
  status: leaveStatusEnum("status").notNull().default("pending"),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  documents: jsonb("documents").$type<string[]>(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
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
  books: many(books),
  bookIssues: many(bookIssues),
  routes: many(routes),
  vehicles: many(vehicles),
  periods: many(periods),
  timetables: many(timetables),
  assignments: many(assignments),
  exams: many(exams),
  reportCards: many(reportCards),
  events: many(events),
  holidays: many(holidays),
  conversations: many(conversations),
  notificationTemplates: many(notificationTemplates),
  notifications: many(notifications),
  assets: many(assets),
  salaries: many(salaries),
  leaveRequests: many(leaveRequests),
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

// Library relations
export const booksRelations = relations(books, ({ one, many }) => ({
  school: one(schools, {
    fields: [books.schoolId],
    references: [schools.id],
  }),
  issues: many(bookIssues),
}));

export const bookIssuesRelations = relations(bookIssues, ({ one }) => ({
  school: one(schools, {
    fields: [bookIssues.schoolId],
    references: [schools.id],
  }),
  book: one(books, {
    fields: [bookIssues.bookId],
    references: [books.id],
  }),
  student: one(students, {
    fields: [bookIssues.studentId],
    references: [students.id],
  }),
  teacher: one(teachers, {
    fields: [bookIssues.teacherId],
    references: [teachers.id],
  }),
  issuedBy: one(users, {
    fields: [bookIssues.issuedBy],
    references: [users.id],
  }),
  returnedBy: one(users, {
    fields: [bookIssues.returnedBy],
    references: [users.id],
  }),
}));

// Transport relations
export const routesRelations = relations(routes, ({ one, many }) => ({
  school: one(schools, {
    fields: [routes.schoolId],
    references: [schools.id],
  }),
  vehicles: many(vehicles),
  stops: many(routeStops),
  studentTransport: many(studentTransport),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  school: one(schools, {
    fields: [vehicles.schoolId],
    references: [schools.id],
  }),
  driver: one(users, {
    fields: [vehicles.driverId],
    references: [users.id],
  }),
  route: one(routes, {
    fields: [vehicles.routeId],
    references: [routes.id],
  }),
}));

export const routeStopsRelations = relations(routeStops, ({ one, many }) => ({
  route: one(routes, {
    fields: [routeStops.routeId],
    references: [routes.id],
  }),
  pickupStudents: many(studentTransport, {
    relationName: "pickupStop",
  }),
  dropStudents: many(studentTransport, {
    relationName: "dropStop",
  }),
}));

export const studentTransportRelations = relations(studentTransport, ({ one }) => ({
  school: one(schools, {
    fields: [studentTransport.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [studentTransport.studentId],
    references: [students.id],
  }),
  route: one(routes, {
    fields: [studentTransport.routeId],
    references: [routes.id],
  }),
  pickupStop: one(routeStops, {
    fields: [studentTransport.pickupStopId],
    references: [routeStops.id],
  }),
  dropStop: one(routeStops, {
    fields: [studentTransport.dropStopId],
    references: [routeStops.id],
  }),
}));

// Timetable relations
export const periodsRelations = relations(periods, ({ one, many }) => ({
  school: one(schools, {
    fields: [periods.schoolId],
    references: [schools.id],
  }),
  timetables: many(timetables),
}));

export const timetablesRelations = relations(timetables, ({ one }) => ({
  school: one(schools, {
    fields: [timetables.schoolId],
    references: [schools.id],
  }),
  grade: one(grades, {
    fields: [timetables.gradeId],
    references: [grades.id],
  }),
  section: one(sections, {
    fields: [timetables.sectionId],
    references: [sections.id],
  }),
  subject: one(subjects, {
    fields: [timetables.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [timetables.teacherId],
    references: [teachers.id],
  }),
  period: one(periods, {
    fields: [timetables.periodId],
    references: [periods.id],
  }),
}));

// Assignments relations
export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  school: one(schools, {
    fields: [assignments.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  teacher: one(teachers, {
    fields: [assignments.teacherId],
    references: [teachers.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(students, {
    fields: [assignmentSubmissions.studentId],
    references: [students.id],
  }),
  gradedBy: one(users, {
    fields: [assignmentSubmissions.gradedBy],
    references: [users.id],
  }),
}));

// Exams relations
export const examsRelations = relations(exams, ({ one, many }) => ({
  school: one(schools, {
    fields: [exams.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [exams.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [exams.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [exams.teacherId],
    references: [teachers.id],
  }),
  results: many(examResults),
}));

export const examResultsRelations = relations(examResults, ({ one }) => ({
  exam: one(exams, {
    fields: [examResults.examId],
    references: [exams.id],
  }),
  student: one(students, {
    fields: [examResults.studentId],
    references: [students.id],
  }),
  enteredBy: one(users, {
    fields: [examResults.enteredBy],
    references: [users.id],
  }),
}));

export const reportCardsRelations = relations(reportCards, ({ one }) => ({
  school: one(schools, {
    fields: [reportCards.schoolId],
    references: [schools.id],
  }),
  student: one(students, {
    fields: [reportCards.studentId],
    references: [students.id],
  }),
  generatedBy: one(users, {
    fields: [reportCards.generatedBy],
    references: [users.id],
  }),
}));

// Events relations
export const eventsRelations = relations(events, ({ one }) => ({
  school: one(schools, {
    fields: [events.schoolId],
    references: [schools.id],
  }),
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
}));

export const holidaysRelations = relations(holidays, ({ one }) => ({
  school: one(schools, {
    fields: [holidays.schoolId],
    references: [schools.id],
  }),
}));

// Messaging relations
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  school: one(schools, {
    fields: [conversations.schoolId],
    references: [schools.id],
  }),
  createdBy: one(users, {
    fields: [conversations.createdBy],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  replyTo: one(messages, {
    fields: [messages.replyToId],
    references: [messages.id],
  }),
}));

// Notifications relations
export const notificationTemplatesRelations = relations(notificationTemplates, ({ one, many }) => ({
  school: one(schools, {
    fields: [notificationTemplates.schoolId],
    references: [schools.id],
  }),
  notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  school: one(schools, {
    fields: [notifications.schoolId],
    references: [schools.id],
  }),
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  template: one(notificationTemplates, {
    fields: [notifications.type],
    references: [notificationTemplates.type],
  }),
}));

// Assets relations
export const assetsRelations = relations(assets, ({ one, many }) => ({
  school: one(schools, {
    fields: [assets.schoolId],
    references: [schools.id],
  }),
  assignedTo: one(users, {
    fields: [assets.assignedTo],
    references: [users.id],
  }),
  maintenance: many(assetMaintenance),
}));

export const assetMaintenanceRelations = relations(assetMaintenance, ({ one }) => ({
  asset: one(assets, {
    fields: [assetMaintenance.assetId],
    references: [assets.id],
  }),
}));

// Payroll relations
export const salariesRelations = relations(salaries, ({ one, many }) => ({
  school: one(schools, {
    fields: [salaries.schoolId],
    references: [schools.id],
  }),
  teacher: one(teachers, {
    fields: [salaries.teacherId],
    references: [teachers.id],
  }),
  payments: many(salaryPayments),
}));

export const salaryPaymentsRelations = relations(salaryPayments, ({ one }) => ({
  salary: one(salaries, {
    fields: [salaryPayments.salaryId],
    references: [salaries.id],
  }),
  processedBy: one(users, {
    fields: [salaryPayments.processedBy],
    references: [users.id],
  }),
}));

// Leave relations
export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  school: one(schools, {
    fields: [leaveRequests.schoolId],
    references: [schools.id],
  }),
  teacher: one(teachers, {
    fields: [leaveRequests.teacherId],
    references: [teachers.id],
  }),
  approvedBy: one(users, {
    fields: [leaveRequests.approvedBy],
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

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookIssueSchema = createInsertSchema(bookIssues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRouteStopSchema = createInsertSchema(routeStops).omit({
  id: true,
  createdAt: true,
});

export const insertStudentTransportSchema = createInsertSchema(studentTransport).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPeriodSchema = createInsertSchema(periods).omit({
  id: true,
  createdAt: true,
});

export const insertTimetableSchema = createInsertSchema(timetables).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExamResultSchema = createInsertSchema(examResults).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportCardSchema = createInsertSchema(reportCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHolidaySchema = createInsertSchema(holidays).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssetMaintenanceSchema = createInsertSchema(assetMaintenance).omit({
  id: true,
  createdAt: true,
});

export const insertSalarySchema = createInsertSchema(salaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSalaryPaymentSchema = createInsertSchema(salaryPayments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
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
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
export type InsertBookIssue = z.infer<typeof insertBookIssueSchema>;
export type BookIssue = typeof bookIssues.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertRouteStop = z.infer<typeof insertRouteStopSchema>;
export type RouteStop = typeof routeStops.$inferSelect;
export type InsertStudentTransport = z.infer<typeof insertStudentTransportSchema>;
export type StudentTransport = typeof studentTransport.$inferSelect;
export type InsertPeriod = z.infer<typeof insertPeriodSchema>;
export type Period = typeof periods.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetables.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
export type ExamResult = typeof examResults.$inferSelect;
export type InsertReportCard = z.infer<typeof insertReportCardSchema>;
export type ReportCard = typeof reportCards.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertHoliday = z.infer<typeof insertHolidaySchema>;
export type Holiday = typeof holidays.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAssetMaintenance = z.infer<typeof insertAssetMaintenanceSchema>;
export type AssetMaintenance = typeof assetMaintenance.$inferSelect;
export type InsertSalary = z.infer<typeof insertSalarySchema>;
export type Salary = typeof salaries.$inferSelect;
export type InsertSalaryPayment = z.infer<typeof insertSalaryPaymentSchema>;
export type SalaryPayment = typeof salaryPayments.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
