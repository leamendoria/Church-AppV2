-- Add the session_type column to the prayer_team_assignments table
ALTER TABLE public.prayer_team_assignments
ADD COLUMN session_type TEXT NOT NULL DEFAULT 'morning';

-- Add a check constraint to ensure session_type can only be 'morning' or 'evening'
ALTER TABLE public.prayer_team_assignments
ADD CONSTRAINT chk_session_type CHECK (session_type IN ('morning', 'evening'));

-- Optional: Update existing rows if you have any, setting a default session_type
-- UPDATE public.prayer_team_assignments
-- SET session_type = 'morning'
-- WHERE session_type IS NULL;
