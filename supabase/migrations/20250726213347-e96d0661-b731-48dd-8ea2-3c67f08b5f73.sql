-- Create storage bucket for product spec sheets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-specs', 'product-specs', true);

-- Create policies for product spec sheet access
CREATE POLICY "Product spec sheets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-specs');

-- Allow authenticated users to upload spec sheets
CREATE POLICY "Authenticated users can upload spec sheets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-specs' AND auth.role() = 'authenticated');

-- Allow authenticated users to update spec sheets
CREATE POLICY "Authenticated users can update spec sheets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-specs' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete spec sheets
CREATE POLICY "Authenticated users can delete spec sheets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-specs' AND auth.role() = 'authenticated');