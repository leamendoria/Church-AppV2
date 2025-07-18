-- 1. Ensure Row Level Security is ENABLED for the prayer_requests table
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing INSERT policies on prayer_requests to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.prayer_requests;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.prayer_requests;

-- 3. Create a new policy that explicitly allows anyone (authenticated or not) to insert prayer requests
CREATE POLICY "Allow all inserts on prayer_requests" ON public.prayer_requests
FOR INSERT WITH CHECK (true);

-- Optional: If you want all users to be able to read all prayer requests (be careful with privacy!)
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.prayer_requests;
-- CREATE POLICY "Allow all reads on prayer_requests" ON public.prayer_requests
-- FOR SELECT USING (true);
