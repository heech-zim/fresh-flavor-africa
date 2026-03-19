
-- Drop open write/delete policies on compliance-docs bucket
DROP POLICY IF EXISTS "Anyone can upload compliance documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update compliance documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete compliance documents" ON storage.objects;

-- Replace with admin-only policies
CREATE POLICY "Admins can upload compliance docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'compliance-docs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update compliance docs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'compliance-docs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete compliance docs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'compliance-docs' AND public.has_role(auth.uid(), 'admin'));
