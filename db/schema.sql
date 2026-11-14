CREATE TABLE IF NOT EXISTS student_profiles (
  id          serial PRIMARY KEY,
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  grades      jsonb NOT NULL,
  date_added  timestamptz NOT NULL DEFAULT now()
);

-- Seed rows so the "All students" table is never empty for visitors.
INSERT INTO student_profiles (first_name, last_name, email, grades) VALUES
  ('jack', 'kiza', 'jack.kiza@demo-school.edu',
   '{"English III": "100%", "Health Education": "100%", "Chemistry": "94%", "Senior Seminar": "100%"}'),
  ('john', 'doe', 'john.doe@demo-school.edu',
   '{"English III": "80%", "Health Education": "90%", "US History": "85%", "Senior Seminar": "95%"}'),
  ('jane', 'doe', 'jane.doe@demo-school.edu',
   '{"English III": "75%", "Health Education": "85%", "Spanish II": "90%", "Senior Seminar": "80%"}')
ON CONFLICT (email) DO NOTHING;
