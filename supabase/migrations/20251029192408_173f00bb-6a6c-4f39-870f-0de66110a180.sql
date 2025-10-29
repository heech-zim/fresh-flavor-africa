-- Create shipments table for blockchain-tracked cargo
CREATE TABLE public.shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number text NOT NULL UNIQUE,
  product_id uuid REFERENCES public.products(id),
  product_name text NOT NULL,
  quantity numeric NOT NULL,
  origin_location text NOT NULL,
  destination_location text NOT NULL,
  estimated_delivery_date date,
  current_status text NOT NULL DEFAULT 'pending',
  current_location text,
  blockchain_tx_hash text,
  vechain_tx_id text,
  temperature_range text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create tracking events table for blockchain audit trail
CREATE TABLE public.tracking_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id uuid NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  temperature numeric,
  blockchain_tx_hash text,
  vechain_tx_id text,
  event_timestamp timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments
CREATE POLICY "Anyone can view shipments"
ON public.shipments
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage shipments"
ON public.shipments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tracking events
CREATE POLICY "Anyone can view tracking events"
ON public.tracking_events
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tracking events"
ON public.tracking_events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger for shipments
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster tracking number lookups
CREATE INDEX idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX idx_tracking_events_shipment_id ON public.tracking_events(shipment_id);
CREATE INDEX idx_tracking_events_timestamp ON public.tracking_events(event_timestamp DESC);