-- Fix contact_messages RLS policies to prevent public data exposure
-- Drop the overly restrictive ALL policy that blocks even admin SELECT
DROP POLICY IF EXISTS "Deny all other operations on contact messages" ON public.contact_messages;

-- Add specific deny policies for UPDATE and DELETE to prevent modification
CREATE POLICY "Deny UPDATE on contact messages"
ON public.contact_messages
AS RESTRICTIVE
FOR UPDATE
USING (false);

CREATE POLICY "Deny DELETE on contact messages"
ON public.contact_messages
AS RESTRICTIVE
FOR DELETE
USING (false);