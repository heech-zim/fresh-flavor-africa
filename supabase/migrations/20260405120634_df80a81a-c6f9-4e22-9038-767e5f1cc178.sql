
-- 1. Add NULL guard to has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $$
  SELECT CASE
    WHEN _user_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = _role
    )
  END
$$;

-- 2. Fix buyer_requests SELECT policies: drop public-role ones, recreate as authenticated-only
DROP POLICY IF EXISTS "Admins can view all buyer requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Only admins can view buyer requests" ON public.buyer_requests;

CREATE POLICY "Admins can view all buyer requests"
ON public.buyer_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Also fix the UPDATE policy from public to authenticated
DROP POLICY IF EXISTS "Admins can update buyer requests" ON public.buyer_requests;

CREATE POLICY "Admins can update buyer requests"
ON public.buyer_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Fix product-specs storage: drop permissive policies, add admin-only
DROP POLICY IF EXISTS "Authenticated users can upload product specs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product specs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product specs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product specs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product specs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product specs" ON storage.objects;

CREATE POLICY "Admins can upload product specs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-specs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product specs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-specs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product specs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-specs' AND public.has_role(auth.uid(), 'admin'));
