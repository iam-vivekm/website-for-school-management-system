import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // For SQLite, we need to create tables manually since drizzle-kit push doesn't work well in development
    // In production with PostgreSQL, you would use drizzle-kit push

    if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev') {
      console.log('📦 Using SQLite for development');

      // Create tables manually for SQLite development - one by one
      const tableStatements = [
        // Sessions table
        `CREATE TABLE IF NOT EXISTS sessions (
          sid VARCHAR PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire)`,

        // Users table
        `CREATE TABLE IF NOT EXISTS users (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          email VARCHAR UNIQUE,
          first_name VARCHAR,
          last_name VARCHAR,
          profile_image_url VARCHAR,
          role VARCHAR DEFAULT 'student',
          status VARCHAR DEFAULT 'active',
          school_id VARCHAR,
          password_hash VARCHAR,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Schools table
        `CREATE TABLE IF NOT EXISTS schools (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          name VARCHAR NOT NULL,
          subdomain VARCHAR UNIQUE,
          logo VARCHAR,
          primary_color VARCHAR DEFAULT '#1d4ed8',
          secondary_color VARCHAR DEFAULT '#64748b',
          address TEXT,
          phone VARCHAR,
          email VARCHAR,
          website VARCHAR,
          principal_id VARCHAR,
          settings JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Students table
        `CREATE TABLE IF NOT EXISTS students (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          user_id VARCHAR NOT NULL,
          school_id VARCHAR NOT NULL,
          student_id VARCHAR NOT NULL,
          grade_id VARCHAR,
          section_id VARCHAR,
          admission_date TIMESTAMP,
          date_of_birth TIMESTAMP,
          gender VARCHAR,
          blood_group VARCHAR,
          address TEXT,
          parent_phone VARCHAR,
          parent_email VARCHAR,
          emergency_contact TEXT,
          medical_info TEXT,
          documents JSON,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Teachers table
        `CREATE TABLE IF NOT EXISTS teachers (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          user_id VARCHAR NOT NULL,
          school_id VARCHAR NOT NULL,
          teacher_id VARCHAR NOT NULL,
          qualifications TEXT,
          subjects JSON,
          date_of_joining TIMESTAMP,
          salary DECIMAL(10,2),
          phone VARCHAR,
          address TEXT,
          emergency_contact TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Grades table
        `CREATE TABLE IF NOT EXISTS grades (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          level INTEGER NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Sections table
        `CREATE TABLE IF NOT EXISTS sections (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          grade_id VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          capacity INTEGER DEFAULT 30,
          class_teacher_id VARCHAR,
          room VARCHAR,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Subjects table
        `CREATE TABLE IF NOT EXISTS subjects (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          code VARCHAR NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Classes table
        `CREATE TABLE IF NOT EXISTS classes (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          grade_id VARCHAR NOT NULL,
          section_id VARCHAR NOT NULL,
          subject_id VARCHAR NOT NULL,
          teacher_id VARCHAR NOT NULL,
          schedule JSON,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Attendance table
        `CREATE TABLE IF NOT EXISTS attendance (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          student_id VARCHAR NOT NULL,
          class_id VARCHAR,
          date TIMESTAMP NOT NULL,
          status VARCHAR NOT NULL,
          marked_by VARCHAR NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Fee structures table
        `CREATE TABLE IF NOT EXISTS fee_structures (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          grade_id VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          amount VARCHAR NOT NULL,
          frequency VARCHAR NOT NULL,
          due_date INTEGER,
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Fee payments table
        `CREATE TABLE IF NOT EXISTS fee_payments (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          student_id VARCHAR NOT NULL,
          fee_structure_id VARCHAR NOT NULL,
          total_amount VARCHAR NOT NULL,
          paid_amount VARCHAR DEFAULT '0',
          status VARCHAR DEFAULT 'pending',
          due_date TIMESTAMP NOT NULL,
          payment_date TIMESTAMP,
          payment_method VARCHAR,
          transaction_id VARCHAR,
          receipt VARCHAR,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // Announcements table
        `CREATE TABLE IF NOT EXISTS announcements (
          id VARCHAR PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
          school_id VARCHAR NOT NULL,
          title VARCHAR NOT NULL,
          content TEXT NOT NULL,
          type VARCHAR DEFAULT 'info',
          priority VARCHAR DEFAULT 'medium',
          target_audience JSON,
          author_id VARCHAR NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expiry_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      ];

      // Execute each table creation statement individually
      for (const statement of tableStatements) {
        await db.run(sql.raw(statement));
      }
      console.log('✅ Database tables created successfully');
    } else {
      console.log('🗄️ Using PostgreSQL - run `npm run db:push` to create tables');
    }

    console.log('🎉 Database setup completed!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase().then(() => {
  console.log('🏁 Database setup finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Database setup failed:', error);
  process.exit(1);
});
