
-- 2. Create farmer_profiles table
CREATE TABLE public.farmer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  farm_name text,
  phone text,
  location text,
  province text,
  farm_size text,
  experience_level text,
  current_crops text[],
  globalg_ap_certified boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can read own profile" ON public.farmer_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Farmers can update own profile" ON public.farmer_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Farmers can insert own profile" ON public.farmer_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all farmer profiles" ON public.farmer_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all farmer profiles" ON public.farmer_profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Create farmer_documents table
CREATE TABLE public.farmer_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  file_url text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.farmer_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can read own documents" ON public.farmer_documents
  FOR SELECT TO authenticated
  USING (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Farmers can insert own documents" ON public.farmer_documents
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all documents" ON public.farmer_documents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Create farmer_produce_listings table
CREATE TABLE public.farmer_produce_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  product_name text NOT NULL,
  category text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  price_per_unit numeric,
  harvest_date date,
  available_from date,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.farmer_produce_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage own listings" ON public.farmer_produce_listings
  FOR ALL TO authenticated
  USING (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()))
  WITH CHECK (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all listings" ON public.farmer_produce_listings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read available listings" ON public.farmer_produce_listings
  FOR SELECT TO anon
  USING (status = 'available');

-- 5. Create farmer_payments table
CREATE TABLE public.farmer_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_date date,
  reference_number text,
  description text,
  status text DEFAULT 'pending',
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.farmer_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can read own payments" ON public.farmer_payments
  FOR SELECT TO authenticated
  USING (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all payments" ON public.farmer_payments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('farmer-documents', 'farmer-documents', false);

-- Storage RLS policies
CREATE POLICY "Farmers can upload own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'farmer-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Farmers can read own documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'farmer-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can read all farmer documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'farmer-documents' AND public.has_role(auth.uid(), 'admin'));

-- Updated_at triggers
CREATE TRIGGER update_farmer_profiles_updated_at
  BEFORE UPDATE ON public.farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_produce_listings_updated_at
  BEFORE UPDATE ON public.farmer_produce_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
