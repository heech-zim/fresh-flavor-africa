-- Make compliance-docs bucket public for easier access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'compliance-docs';

-- Create policies for compliance-docs bucket
CREATE POLICY "Anyone can view compliance documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'compliance-docs');

CREATE POLICY "Anyone can upload compliance documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'compliance-docs');

CREATE POLICY "Anyone can update compliance documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'compliance-docs');

CREATE POLICY "Anyone can delete compliance documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'compliance-docs');