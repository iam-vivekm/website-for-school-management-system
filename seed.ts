import { storage } from './server/storage';
import { insertSchoolSchema, insertGradeSchema, insertSectionSchema, insertSubjectSchema } from './shared/schema';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create a sample school
    const schoolData = insertSchoolSchema.parse({
      name: 'Demo International School',
      subdomain: 'demo-school',
      email: 'admin@demo-school.com',
      address: '123 Education Street, Learning City',
      phone: '+1-555-0123',
      website: 'https://demo-school.com',
      primaryColor: '#1d4ed8',
      secondaryColor: '#64748b',
    });

    const school = await storage.createSchool(schoolData);
    console.log('✅ Created school:', school.name);

    // Create grades
    const grades = [
      { name: 'Kindergarten', level: 0 },
      { name: 'Grade 1', level: 1 },
      { name: 'Grade 2', level: 2 },
      { name: 'Grade 3', level: 3 },
      { name: 'Grade 4', level: 4 },
      { name: 'Grade 5', level: 5 },
      { name: 'Grade 6', level: 6 },
      { name: 'Grade 7', level: 7 },
      { name: 'Grade 8', level: 8 },
      { name: 'Grade 9', level: 9 },
      { name: 'Grade 10', level: 10 },
      { name: 'Grade 11', level: 11 },
      { name: 'Grade 12', level: 12 },
    ];

    for (const gradeData of grades) {
      const grade = await storage.createGrade(insertGradeSchema.parse({
        ...gradeData,
        schoolId: school.id,
        description: `${gradeData.name} class`,
      }));
      console.log('✅ Created grade:', grade.name);
    }

    // Create subjects
    const subjects = [
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English', code: 'ENG' },
      { name: 'Science', code: 'SCI' },
      { name: 'History', code: 'HIST' },
      { name: 'Geography', code: 'GEO' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'Biology', code: 'BIO' },
      { name: 'Computer Science', code: 'CS' },
      { name: 'Physical Education', code: 'PE' },
      { name: 'Art', code: 'ART' },
      { name: 'Music', code: 'MUS' },
    ];

    for (const subjectData of subjects) {
      const subject = await storage.createSubject({
        ...subjectData,
        schoolId: school.id,
        description: `${subjectData.name} subject`,
      });
      console.log('✅ Created subject:', subject.name);
    }

    // Create sample admin user
    const adminUser = await storage.upsertUser({
      id: 'admin-user-123',
      email: 'admin@demo-school.com',
      firstName: 'School',
      lastName: 'Administrator',
      role: 'school_admin',
      schoolId: school.id,
      status: 'active',
    });
    console.log('✅ Created admin user:', adminUser.email);

    // Create sample teacher
    const teacherUser = await storage.upsertUser({
      id: 'teacher-user-123',
      email: 'teacher@demo-school.com',
      firstName: 'John',
      lastName: 'Smith',
      role: 'teacher',
      schoolId: school.id,
      status: 'active',
    });

    const teacher = await storage.createTeacher({
      userId: teacherUser.id,
      schoolId: school.id,
      teacherId: 'T001',
      qualifications: 'M.Ed, B.Ed',
      subjects: ['Mathematics', 'Physics'],
      dateOfJoining: new Date('2023-01-15'),
      salary: 50000,
      phone: '+1-555-0124',
      address: '456 Teacher Lane, Education City',
    });
    console.log('✅ Created teacher:', teacherUser.firstName, teacherUser.lastName);

    // Create sample students
    const studentUsers = [
      { firstName: 'Alice', lastName: 'Johnson', email: 'alice@student.com' },
      { firstName: 'Bob', lastName: 'Williams', email: 'bob@student.com' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@student.com' },
      { firstName: 'Diana', lastName: 'Davis', email: 'diana@student.com' },
      { firstName: 'Eva', lastName: 'Miller', email: 'eva@student.com' },
    ];

    for (let i = 0; i < studentUsers.length; i++) {
      const studentUser = await storage.upsertUser({
        id: `student-user-${i + 1}`,
        email: studentUsers[i].email,
        firstName: studentUsers[i].firstName,
        lastName: studentUsers[i].lastName,
        role: 'student',
        schoolId: school.id,
        status: 'active',
      });

      const student = await storage.createStudent({
        userId: studentUser.id,
        schoolId: school.id,
        studentId: `S${String(i + 1).padStart(3, '0')}`,
        gradeId: 'grade-1', // This would need to be the actual grade ID
        sectionId: 'section-a', // This would need to be the actual section ID
        admissionDate: new Date('2024-01-15'),
        dateOfBirth: new Date('2010-05-15'),
        gender: i % 2 === 0 ? 'female' : 'male',
        address: `${123 + i} Student Street, Learning City`,
        parentPhone: '+1-555-1000',
        parentEmail: `parent${i + 1}@example.com`,
        emergencyContact: `Parent of ${studentUsers[i].firstName}`,
        bloodGroup: 'O+',
        medicalInfo: 'No known allergies',
        isActive: true,
      });
      console.log('✅ Created student:', studentUser.firstName, studentUser.lastName);
    }

    // Create sample fee structures
    const feeStructures = [
      { name: 'Tuition Fee', amount: 500, frequency: 'monthly' },
      { name: 'Transport Fee', amount: 200, frequency: 'monthly' },
      { name: 'Library Fee', amount: 50, frequency: 'yearly' },
      { name: 'Sports Fee', amount: 100, frequency: 'yearly' },
    ];

    for (const feeData of feeStructures) {
      const feeStructure = await storage.createFeeStructure({
        schoolId: school.id,
        gradeId: 'grade-1', // This would need to be the actual grade ID
        name: feeData.name,
        amount: feeData.amount.toString(),
        frequency: feeData.frequency,
        dueDate: 1, // 1st of the month
        isActive: true,
      });
      console.log('✅ Created fee structure:', feeStructure.name);
    }

    // Create sample announcement
    const announcement = await storage.createAnnouncement({
      schoolId: school.id,
      title: 'Welcome to Demo International School',
      content: 'We are excited to welcome all students and parents to the new academic year. Please ensure all fees are paid by the due date.',
      type: 'info',
      priority: 'high',
      targetAudience: ['student', 'parent'],
      authorId: adminUser.id,
      isActive: true,
      publishDate: new Date(),
    });
    console.log('✅ Created announcement:', announcement.title);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample login credentials:');
    console.log('Admin: admin@demo-school.com');
    console.log('Teacher: teacher@demo-school.com');
    console.log('Students: alice@student.com, bob@student.com, etc.');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log('🏁 Seeding process finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Seeding process failed:', error);
  process.exit(1);
});
