-- Create the prayer_requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_text TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to insert their own requests
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.prayer_requests;
CREATE POLICY "Enable insert for authenticated users" ON public.prayer_requests
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL); -- Requires user to be logged in

-- Policy for pastors/admins to view all requests (you'll need to define roles or specific user IDs for this)
-- For now, let's allow authenticated users to see their own requests, and no one else.
-- If you want all authenticated users to see all requests, use:
-- CREATE POLICY "Enable read access for authenticated users" ON public.prayer_requests FOR SELECT USING (auth.uid() IS NOT NULL);
