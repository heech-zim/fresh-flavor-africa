-- Fix buyer_requests RLS policy to prevent public data exposure
-- Drop the overly permissive policy that allows viewing NULL user_id records
DROP POLICY IF EXISTS "Users can view own requests" ON public.buyer_requests;

-- Create admin-only SELECT policy
CREATE POLICY "Only admins can view buyer requests"
ON public.buyer_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Keep the public INSERT policy (already exists as "Anyone can submit buyer requests")
-- This allows form submissions while keeping data private