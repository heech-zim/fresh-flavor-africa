-- Drop the catch-all deny policy which is ineffective
DROP POLICY IF EXISTS "Deny all other operations on quote requests" ON quote_requests;

-- Add explicit restrictive policies for UPDATE and DELETE operations
-- These ensure no one can modify or delete quote requests
CREATE POLICY "Deny UPDATE on quote requests"
  ON quote_requests
  FOR UPDATE
  USING (false);

CREATE POLICY "Deny DELETE on quote requests"
  ON quote_requests
  FOR DELETE
  USING (false);

-- Note: The existing policies already properly handle SELECT (admins only) and INSERT (public)
-- By removing the ambiguous catch-all policy and adding explicit blocking policies,
-- we make the security model clearer and more maintainable