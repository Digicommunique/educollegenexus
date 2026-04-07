-- Drop existing tables to ensure schema consistency and fix type mismatches
-- WARNING: This will delete existing data in these tables.
DROP TABLE IF EXISTS study_activities CASCADE;
DROP TABLE IF EXISTS syllabus CASCADE;
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS org_settings CASCADE;
DROP TABLE IF EXISTS fees CASCADE;
DROP TABLE IF EXISTS fee_plans CASCADE;
DROP TABLE IF EXISTS fee_heads CASCADE;
DROP TABLE IF EXISTS fee_groups CASCADE;
DROP TABLE IF EXISTS fee_group_items CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- Org Settings Table
CREATE TABLE IF NOT EXISTS org_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  branch TEXT,
  designation TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Plans Table
CREATE TABLE IF NOT EXISTS fee_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Heads Table
CREATE TABLE IF NOT EXISTS fee_heads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Semesters Table
CREATE TABLE IF NOT EXISTS semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g. '2023-24'
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT,
  amount NUMERIC NOT NULL,
  type TEXT, -- 'CREDIT', 'DEBIT'
  category TEXT, -- 'FEES', 'FINE', 'OTHER'
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students Table (Expanded)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  roll_no TEXT,
  title TEXT,
  first_name TEXT,
  middle_name TEXT,
  surname TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  branch TEXT,
  batch TEXT,
  year TEXT,
  blood_group TEXT,
  religion TEXT,
  caste TEXT,
  category TEXT,
  address TEXT,
  state TEXT,
  pincode TEXT,
  photo_url TEXT,
  father_name TEXT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_address TEXT,
  allergies TEXT,
  student_docs_url TEXT,
  parent_docs_url TEXT,
  signature_url TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  parent_name TEXT,
  phone TEXT,
  reason TEXT,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'
  is_lead BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  branch TEXT,
  score TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Verified'
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  branch TEXT,
  designation TEXT,
  photo_url TEXT,
  staff_docs_url TEXT,
  nominee_docs_url TEXT,
  signature_url TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL, -- 'Present', 'Absent', 'Late'
  course TEXT,
  branch TEXT,
  year TEXT,
  section TEXT,
  subject TEXT, -- For subject-wise attendance
  time TEXT, -- e.g. '09:30 AM'
  method TEXT DEFAULT 'MANUAL', -- 'MANUAL', 'SCAN', 'BIO'
  ip_address TEXT DEFAULT '0.0.0.0',
  location TEXT DEFAULT 'Unknown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fees Table
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL, -- 'Paid', 'Pending', 'Overdue'
  payment_method TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings Table (Key-Value Store for app settings)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Papers Table (Exam Question Papers)
CREATE TABLE IF NOT EXISTS papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  course TEXT,
  subject TEXT,
  total_marks INTEGER,
  duration INTEGER,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams Table (Scheduled Exams)
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  course TEXT,
  subject TEXT,
  date DATE,
  time TEXT,
  duration INTEGER,
  status TEXT DEFAULT 'UPCOMING',
  students_count INTEGER DEFAULT 0,
  paper_id TEXT REFERENCES papers(id) ON DELETE SET NULL,
  results_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results Table (Exam Results)
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT,
  exam_id TEXT REFERENCES exams(id) ON DELETE CASCADE,
  marks INTEGER DEFAULT 0,
  total_marks INTEGER DEFAULT 100,
  status TEXT DEFAULT 'PENDING', -- 'PASSED', 'FAILED', 'PENDING'
  scanned_sheet_url TEXT,
  answers JSONB,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  department TEXT,
  duration TEXT,
  semesters INTEGER,
  credits INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Syllabus Table
CREATE TABLE IF NOT EXISTS syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  unit_number INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study Activities Table
CREATE TABLE IF NOT EXISTS study_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  batch TEXT,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  activities JSONB NOT NULL, -- Array of strings: ["Activity 1", "Activity 2", ...]
  assignment_subject TEXT,
  assignment_topic TEXT,
  remarks TEXT,
  teacher_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  faculty TEXT,
  room TEXT,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Groups Table
CREATE TABLE IF NOT EXISTS fee_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Group Items Table
CREATE TABLE IF NOT EXISTS fee_group_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_group_id UUID REFERENCES fee_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches Table
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on ALL tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_group_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Create secure policies (Allow all access for development)
-- This ensures the mock authentication works with Supabase.
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated access" ON %I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all access" ON %I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow read for all" ON %I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow write for authenticated" ON %I', t);
        EXECUTE format('CREATE POLICY "Allow all access" ON %I FOR ALL USING (true) WITH CHECK (true)', t);
    END LOOP;
END $$;
