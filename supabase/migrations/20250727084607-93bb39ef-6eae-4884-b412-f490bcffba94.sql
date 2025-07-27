-- Create storage buckets for compliance documents and product specs
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-docs', 'compliance-docs', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-specs', 'product-specs', false);

-- Create policies for compliance-docs bucket
CREATE POLICY "Allow authenticated users to upload compliance docs" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'compliance-docs');

CREATE POLICY "Allow authenticated users to view compliance docs" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'compliance-docs');

CREATE POLICY "Allow authenticated users to update compliance docs" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'compliance-docs');

CREATE POLICY "Allow authenticated users to delete compliance docs" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'compliance-docs');

-- Create policies for product-specs bucket
CREATE POLICY "Allow public to view product specs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-specs');

CREATE POLICY "Allow authenticated users to upload product specs" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-specs');

CREATE POLICY "Allow authenticated users to update product specs" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-specs');

CREATE POLICY "Allow authenticated users to delete product specs" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-specs');