-- Create table for buyer produce requests
CREATE TABLE public.buyer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text,
  product_type text NOT NULL,
  specifications jsonb NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  delivery_location text NOT NULL,
  preferred_delivery_date date,
  budget_range text,
  additional_requirements text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'fulfilled', 'cancelled')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit buyer requests (for non-authenticated users)
CREATE POLICY "Anyone can submit buyer requests"
ON public.buyer_requests
FOR INSERT
WITH CHECK (true);

-- Allow users to view their own requests
CREATE POLICY "Users can view own requests"
ON public.buyer_requests
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all requests
CREATE POLICY "Admins can view all buyer requests"
ON public.buyer_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update requests (e.g., change status)
CREATE POLICY "Admins can update buyer requests"
ON public.buyer_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_buyer_requests_updated_at
BEFORE UPDATE ON public.buyer_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();