-- Add restrictive SELECT policy to ensure only admins can view quote requests
CREATE POLICY "Only admins can view quotes" 
ON quote_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));