-- Add explicit policy to deny anonymous access to profiles table
-- This prevents unauthenticated users from reading any profile data including emails
CREATE POLICY "Deny anonymous access to profiles"
ON profiles
FOR SELECT
TO anon
USING (false);

-- Note: Authenticated users can still view their own profiles via the existing
-- "Users can view own profile" policy which checks auth.uid() = id