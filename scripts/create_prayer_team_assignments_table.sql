-- Create the prayer_team_assignments table
CREATE TABLE IF NOT EXISTS public.prayer_team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_date DATE NOT NULL,
  team_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add an index for faster date lookups
CREATE INDEX IF NOT EXISTS idx_prayer_team_assignments_date ON public.prayer_team_assignments (assignment_date);

-- Set up Row Level Security (RLS)
ALTER TABLE public.prayer_team_assignments ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous/public read access (if you want everyone to see assignments)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prayer_team_assignments;
CREATE POLICY "Enable read access for all users" ON public.prayer_team_assignments
FOR SELECT USING (true);

-- Policy for authenticated users to insert (if you want specific users to add assignments)
-- DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.prayer_team_assignments;
-- CREATE POLICY "Enable insert for authenticated users" ON public.prayer_team_assignments
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');
