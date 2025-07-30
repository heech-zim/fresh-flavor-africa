import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Package, Truck, Plane, CheckCircle } from 'lucide-react';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrackShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    
    // Placeholder tracking result - will be replaced with ShipsGo API integration
    setTrackingResult({
      status: 'In Transit',
      location: 'Dubai International Airport',
      estimatedDelivery: '2024-01-15',
      events: [
        { date: '2024-01-10', time: '14:30', location: 'Harare, Zimbabwe', status: 'Package picked up from farm' },
        { date: '2024-01-11', time: '08:15', location: 'Harare International Airport', status: 'Departed origin airport' },
        { date: '2024-01-12', time: '22:45', location: 'Dubai International Airport', status: 'In transit hub' },
        { date: '2024-01-13', time: '16:20', location: 'Dubai International Airport', status: 'Customs clearance in progress' }
      ]
    });
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
                <Button type="submit" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Track Shipment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Shipment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1">
                      {trackingResult.status}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Status</div>
                  </div>
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1">
                      {trackingResult.location}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Location</div>
                  </div>
                  <div className="text-center p-4 bg-fresh-accent rounded-lg">
                    <div className="text-2xl font-bold text-afresh-green mb-1">
                      {trackingResult.estimatedDelivery}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Tracking Events</h3>
                  <div className="space-y-3">
                    {trackingResult.events.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-afresh-green rounded-full flex items-center justify-center flex-shrink-0">
                          {index === 0 && <CheckCircle className="w-5 h-5 text-white" />}
                          {index === 1 && <Plane className="w-5 h-5 text-white" />}
                          {index === 2 && <Truck className="w-5 h-5 text-white" />}
                          {index === 3 && <Package className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-foreground">{event.status}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.date} at {event.time}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{event.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Notice */}
                <div className="bg-fresh-accent p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This is a demo interface. Real-time tracking will be powered by ShipsGo API integration.
                  </p>
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