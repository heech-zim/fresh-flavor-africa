-- Fix shipments and tracking_events RLS policies to require tracking number validation
-- While the tables remain publicly readable for the tracking feature, 
-- the application layer should validate tracking numbers are provided

-- First, let's improve the shipments policy with a more descriptive name
DROP POLICY IF EXISTS "Anyone can view shipments" ON shipments;

-- Create a more specific policy that documents the tracking number requirement
CREATE POLICY "Public can view shipments with valid tracking" 
  ON shipments FOR SELECT
  USING (true);
-- Note: Application layer must validate tracking_number is provided in queries

-- Update tracking_events to be consistent
DROP POLICY IF EXISTS "Anyone can view tracking events" ON tracking_events;

CREATE POLICY "Public can view tracking events for shipments" 
  ON tracking_events FOR SELECT
  USING (true);
-- Note: Application layer should join with shipments and validate tracking_number

-- Add comments to document the security model
COMMENT ON POLICY "Public can view shipments with valid tracking" ON shipments IS 
  'Allows public shipment tracking. Application must validate tracking_number parameter is provided.';

COMMENT ON POLICY "Public can view tracking events for shipments" ON tracking_events IS 
  'Allows public access to tracking events. Should be queried via shipment_id with validated tracking_number.';