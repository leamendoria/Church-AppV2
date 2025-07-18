-- Step 1: Ensure Row Level Security is ENABLED for the prayer_requests table.
-- This is the most common reason for RLS errors if it's accidentally turned off.
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing INSERT policies on prayer_requests to clear any conflicts.
-- This ensures we start fresh with the policy we intend to apply.
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.prayer_requests;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.prayer_requests;
DROP POLICY IF EXISTS "Allow all inserts on prayer_requests" ON public.prayer_requests; -- Drop previous attempt

-- Step 3: Create a new policy that explicitly allows anyone (authenticated or not) to insert prayer requests.
-- This policy is the most permissive for inserts and should resolve the error.
CREATE POLICY "Allow_all_inserts_on_prayer_requests_final" ON public.prayer_requests
FOR INSERT WITH CHECK (true);

-- Optional: If you also want all users to be able to read all prayer requests (be careful with privacy!)
-- DROP POLICY IF EXISTS "Allow all reads on prayer_requests" ON public.prayer_requests;
-- CREATE POLICY "Allow_all_reads_on_prayer_requests_final" ON public.prayer_requests
-- FOR SELECT USING (true);
