import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Package, Truck, Plane, CheckCircle, Shield, Thermometer } from 'lucide-react';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    
    setLoading(true);
    try {
      // Fetch shipment data from database
      const { data: shipment, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', trackingNumber.trim())
        .single();

      if (shipmentError || !shipment) {
        toast({
          title: "Not Found",
          description: "No shipment found with this tracking number",
          variant: "destructive"
        });
        setTrackingResult(null);
        return;
      }

      // Fetch tracking events
      const { data: events, error: eventsError } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('event_timestamp', { ascending: false });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      }

      setTrackingResult({
        shipment,
        events: events || []
      });

      toast({
        title: "Shipment Found",
        description: "Blockchain-verified tracking information loaded"
      });
    } catch (error) {
      console.error('Error tracking shipment:', error);
      toast({
        title: "Error",
        description: "Failed to track shipment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-fresh-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Track Your Shipment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your fresh produce delivery in real-time from farm to your doorstep.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Enter Tracking Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackShipment} className="space-y-4">
                <div>
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    type="text"
                    placeholder="Enter your tracking number (e.g., AFR123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Tracking...' : 'Track Shipment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Shipment Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Shipment Details
                  <Badge variant="outline" className="ml-auto">
                    <Shield className="w-3 h-3 mr-1" />
                    Blockchain Verified
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1">
                      {trackingResult.shipment.current_status}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Status</div>
                  </div>
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1">
                      {trackingResult.shipment.current_location || 'In Transit'}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Location</div>
                  </div>
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1">
                      {new Date(trackingResult.shipment.estimated_delivery_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                  </div>
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1 flex items-center justify-center gap-1">
                      <Thermometer className="w-5 h-5" />
                      {trackingResult.shipment.temperature_range || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Product:</span>
                      <span className="ml-2 font-medium">{trackingResult.shipment.product_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="ml-2 font-medium">{trackingResult.shipment.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Origin:</span>
                      <span className="ml-2 font-medium">{trackingResult.shipment.origin_location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="ml-2 font-medium">{trackingResult.shipment.destination_location}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification */}
                {trackingResult.shipment.vechain_tx_id && (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary mb-2">VeChain Blockchain Verification</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">VeChain TX ID:</span>
                            <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">{trackingResult.shipment.vechain_tx_id}</code>
                          </div>
                          {trackingResult.shipment.blockchain_tx_hash && (
                            <div>
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              <code className="ml-2 text-xs bg-muted px-2 py-1 rounded break-all">{trackingResult.shipment.blockchain_tx_hash}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking Events Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Tracking Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingResult.events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No tracking events recorded yet</p>
                  ) : (
                    trackingResult.events.map((event: any, index: number) => (
                      <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 bg-afresh-green rounded-full flex items-center justify-center flex-shrink-0">
                          {event.event_type === 'pickup' && <CheckCircle className="w-5 h-5 text-white" />}
                          {event.event_type === 'departure' && <Plane className="w-5 h-5 text-white" />}
                          {event.event_type === 'arrival' && <Truck className="w-5 h-5 text-white" />}
                          {event.event_type === 'customs' && <Package className="w-5 h-5 text-white" />}
                          {event.event_type === 'delivery' && <CheckCircle className="w-5 h-5 text-white" />}
                          {!['pickup', 'departure', 'arrival', 'customs', 'delivery'].includes(event.event_type) && <Package className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-foreground capitalize">{event.event_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(event.event_timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{event.location}</div>
                          <div className="text-sm text-foreground">{event.description}</div>
                          {event.temperature && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                              <Thermometer className="w-4 h-4" />
                              Temperature: {event.temperature}°C
                            </div>
                          )}
                          {event.vechain_tx_id && (
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Blockchain Verified
                              </Badge>
                              <code className="text-xs text-muted-foreground">{event.vechain_tx_id}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default Tracking;