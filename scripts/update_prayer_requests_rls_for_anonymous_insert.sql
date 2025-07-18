-- Drop the existing policy that requires authentication for inserts
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.prayer_requests;

-- Create a new policy that allows anyone to insert prayer requests
CREATE POLICY "Enable insert for all users" ON public.prayer_requests
FOR INSERT WITH CHECK (true);

-- Optional: If you also want all users to be able to read all prayer requests (be careful with privacy!)
-- DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.prayer_requests;
-- CREATE POLICY "Enable read access for all users" ON public.prayer_requests
-- FOR SELECT USING (true);
