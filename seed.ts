import bcrypt from 'bcrypt';
import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create a sample school
    const schoolId = 'school_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    await db.run(sql`
      INSERT INTO schools (id, name, subdomain, email, address, phone, website, primary_color, secondary_color)
      VALUES (${schoolId}, 'Demo International School', 'demo-school', 'admin@demo-school.com',
              '123 Education Street, Learning City', '+1-555-0123', 'https://demo-school.com',
              '#1d4ed8', '#64748b')
    `);
    console.log('✅ Created school: Demo International School');

    // Create sample admin user with hashed password
    const adminPassword = 'admin123';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const adminUserId = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    await db.run(sql`
      INSERT INTO users (id, email, first_name, last_name, role, school_id, password_hash, status)
      VALUES (${adminUserId}, 'admin@demo-school.com', 'School', 'Administrator', 'school_admin',
              ${schoolId}, ${adminPasswordHash}, 'active')
    `);
    console.log('✅ Created admin user: admin@demo-school.com');
    console.log('   Password: admin123');

    // Create a sample teacher user
    const teacherUserId = 'teacher_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    await db.run(sql`
      INSERT INTO users (id, email, first_name, last_name, role, school_id, status)
      VALUES (${teacherUserId}, 'teacher@demo-school.com', 'John', 'Smith', 'teacher',
              ${schoolId}, 'active')
    `);

    // Create teacher profile
    const teacherId = 'teacher_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    await db.run(sql`
      INSERT INTO teachers (id, user_id, school_id, teacher_id, qualifications, subjects, date_of_joining, salary, phone, address)
      VALUES (${teacherId}, ${teacherUserId}, ${schoolId}, 'T001', 'M.Ed, B.Ed',
              '["Mathematics", "Physics"]', '2023-01-15', 50000, '+1-555-0124',
              '456 Teacher Lane, Education City')
    `);
    console.log('✅ Created teacher: John Smith');

    // Create a sample student user
    const studentUserId = 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    await db.run(sql`
      INSERT INTO users (id, email, first_name, last_name, role, school_id, status)
      VALUES (${studentUserId}, 'alice@student.com', 'Alice', 'Johnson', 'student',
              ${schoolId}, 'active')
    `);

    // Create student profile
    const studentId = 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    await db.run(sql`
      INSERT INTO students (id, user_id, school_id, student_id, admission_date, date_of_birth,
                           gender, address, parent_phone, parent_email, emergency_contact,
                           blood_group, medical_info, is_active)
      VALUES (${studentId}, ${studentUserId}, ${schoolId}, 'S001', '2024-01-15', '2010-05-15',
              'female', '123 Student Street, Learning City', '+1-555-1000',
              'parent1@example.com', 'Parent of Alice', 'O+', 'No known allergies', 1)
    `);
    console.log('✅ Created student: Alice Johnson');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample login credentials:');
    console.log('Admin: admin@demo-school.com (password: admin123)');
    console.log('Teacher: teacher@demo-school.com');
    console.log('Student: alice@student.com');

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
