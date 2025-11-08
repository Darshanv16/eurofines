-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE eurofines;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Items table
CREATE TABLE IF NOT EXISTS test_items (
  id SERIAL PRIMARY KEY,
  test_item_name VARCHAR(255),
  test_item_code VARCHAR(100),
  company_name VARCHAR(255),
  date_of_receipt DATE,
  batch_no VARCHAR(100),
  arc_no VARCHAR(100),
  rack_no VARCHAR(100),
  index_no VARCHAR(100),
  storage VARCHAR(100),
  expiry_date DATE,
  retest_date DATE,
  quantity VARCHAR(100),
  date_of_archive DATE,
  archived_by VARCHAR(255),
  disposed_or_returned VARCHAR(255),
  sponsor_approval_date DATE,
  remark TEXT,
  entity VARCHAR(50) NOT NULL CHECK (entity IN ('adgyl', 'agro', 'biopharma')),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Studies table
CREATE TABLE IF NOT EXISTS studies (
  id SERIAL PRIMARY KEY,
  study_number VARCHAR(255),
  study_code VARCHAR(100),
  test_item_code VARCHAR(100),
  sd_or_pi_name VARCHAR(255),
  study_plan_page_no VARCHAR(100),
  study_plan_amendment_pages VARCHAR(100),
  date_of_receipt DATE,
  rd_index VARCHAR(100),
  fr_index VARCHAR(100),
  block_slides_index VARCHAR(100),
  tissues_index VARCHAR(100),
  carcass_index VARCHAR(100),
  raw_data_count INTEGER DEFAULT 0,
  final_or_terminated_report VARCHAR(100),
  amendment_to_final_report VARCHAR(255),
  others VARCHAR(255),
  electronic_data_archived_using_archive_system BOOLEAN DEFAULT FALSE,
  manually_archiving_data BOOLEAN DEFAULT FALSE,
  provantis_data BOOLEAN DEFAULT FALSE,
  empower_data BOOLEAN DEFAULT FALSE,
  other_electronic_if_any BOOLEAN DEFAULT FALSE,
  details_of_electronic_data_archived_through VARCHAR(50),
  block_slides_name_box_no VARCHAR(100),
  block_slides_no_of_box VARCHAR(100),
  tissue_box_name_box_no VARCHAR(100),
  tissue_box_no_of_box VARCHAR(100),
  carcass_box_name_box_no VARCHAR(100),
  carcass_box_no_of_box VARCHAR(100),
  study_completion_date DATE,
  remarks TEXT,
  raw_data_items JSONB,
  entity VARCHAR(50) NOT NULL CHECK (entity IN ('adgyl', 'agro', 'biopharma')),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facility Docs table
CREATE TABLE IF NOT EXISTS facility_docs (
  id SERIAL PRIMARY KEY,
  dept_section VARCHAR(255),
  date DATE,
  particulars VARCHAR(255),
  total_no_of_pages INTEGER,
  submitted_by VARCHAR(255),
  admin_index_no VARCHAR(100),
  admin_date_of_receipt DATE,
  admin_date_of_indexing DATE,
  admin_remarks TEXT,
  entity VARCHAR(50) NOT NULL CHECK (entity IN ('adgyl', 'agro', 'biopharma')),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_items_entity ON test_items(entity);
CREATE INDEX IF NOT EXISTS idx_test_items_created_by ON test_items(created_by);
CREATE INDEX IF NOT EXISTS idx_studies_entity ON studies(entity);
CREATE INDEX IF NOT EXISTS idx_studies_created_by ON studies(created_by);
CREATE INDEX IF NOT EXISTS idx_facility_docs_entity ON facility_docs(entity);
CREATE INDEX IF NOT EXISTS idx_facility_docs_created_by ON facility_docs(created_by);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

