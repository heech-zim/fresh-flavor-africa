-- Create storage bucket for compliance documents
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-docs', 'compliance-docs', true);

-- Create policies for compliance document access
CREATE POLICY "Compliance documents are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'compliance-docs');

-- Allow authenticated users to upload compliance documents
CREATE POLICY "Authenticated users can upload compliance documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'compliance-docs' AND auth.role() = 'authenticated');

-- Allow authenticated users to update compliance documents
CREATE POLICY "Authenticated users can update compliance documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'compliance-docs' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete compliance documents
CREATE POLICY "Authenticated users can delete compliance documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'compliance-docs' AND auth.role() = 'authenticated');