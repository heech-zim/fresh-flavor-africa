import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Truck, Ship, Clock, Shield, MapPin } from 'lucide-react';

const Logistics = () => {
  const supplyChainSteps = [
    {
      icon: MapPin,
      location: 'Zimbabwean Farms',
      description: 'Fresh produce harvested from our certified farms',
      timing: 'Day 0',
      details: ['GlobalG.A.P. certified farms', 'Pre-harvest quality control', 'Optimal harvest timing']
    },
    {
      icon: Truck,
      location: 'Cold Storage Facilities',
      description: 'Temperature-controlled processing and packaging',
      timing: 'Day 0-1',
      details: ['2-4°C storage', 'Quality inspection', 'Export packaging']
    },
    {
      icon: Plane,
      location: 'Harare Airport (HRE)',
      description: 'Air freight to international destinations',
      timing: 'Day 1-2',
      details: ['Cargo consolidation', 'Export documentation', 'Flight departure']
    },
    {
      icon: Ship,
      location: 'International Hubs',
      description: 'JFK/MIA (USA) • LHR/AMS (EU) distribution',
      timing: 'Day 2-3',
      details: ['Customs clearance', '3PL distribution', 'Final mile delivery']
    }
  ];

  const destinations = [
    { region: 'USA East Coast', ports: ['JFK (New York)', 'MIA (Miami)'], time: '48-72 hours' },
    { region: 'USA West Coast', ports: ['LAX (Los Angeles)', 'SFO (San Francisco)'], time: '52-76 hours' },
    { region: 'United Kingdom', ports: ['LHR (London)', 'MAN (Manchester)'], time: '44-68 hours' },
    { region: 'European Union', ports: ['AMS (Amsterdam)', 'CDG (Paris)'], time: '46-70 hours' }
  ];

  return (
    <section id="logistics" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Global Logistics Network
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Temperature-controlled supply chain from Zimbabwean farms to your door. 
            Professional cold-chain logistics ensuring fresh delivery within 72 hours.
          </p>
        </div>

        {/* Supply Chain Journey */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Farm to Market Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supplyChainSteps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-fresh transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-fresh rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary" className="mb-2">{step.timing}</Badge>
                  <CardTitle className="text-lg">{step.location}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    {step.description}
                  </p>
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-xs text-foreground">
                        <div className="w-1 h-1 bg-afresh-green rounded-full mr-2"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < supplyChainSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-0.5 bg-gradient-fresh"></div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Destination Matrix */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            International Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <Card key={index} className="hover:shadow-fresh transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Plane className="w-5 h-5 mr-2 text-primary" />
                    {dest.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Major Hubs:</p>
                      {dest.ports.map((port, portIndex) => (
                        <Badge key={portIndex} variant="outline" className="mr-1 mb-1 text-xs">
                          {port}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{dest.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Incoterms & Insurance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="hover:shadow-fresh transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                CIP Incoterms Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We deliver using <strong>Carriage and Insurance Paid (CIP)</strong> terms, 
                meaning Afreshia covers:
              </p>
              <ul className="space-y-2">
                {[
                  'Transportation costs to your designated port',
                  'Cargo insurance covering full product value',
                  'Export documentation and customs clearance',
                  'Temperature monitoring throughout journey'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-afresh-green rounded-full mr-3 mt-2"></div>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Your responsibility:</strong> Import duties, local taxes, and final mile 
                  delivery from the international hub to your facility.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-fresh transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                Cargo Insurance & Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Comprehensive coverage protecting your investment from farm to destination:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Covered Risks:</h4>
                  <ul className="space-y-1 text-sm">
                    {['Temperature breach', 'Physical damage', 'Weather delays', 'Carrier default'].map((risk, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-afresh-green rounded-full mr-2"></div>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Coverage Details:</h4>
                  <ul className="space-y-1 text-sm">
                    {['110% of invoice value', 'Door-to-door coverage', '24/7 claim support', 'Quick settlements'].map((detail, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-afresh-green rounded-full mr-2"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gradient-fresh-subtle p-4 rounded-lg mt-4">
                <p className="text-sm text-foreground">
                  <strong>Temperature Guarantee:</strong> Continuous 2-4°C monitoring with 
                  automated alerts and full compensation for quality loss due to temperature breaches.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-fresh-subtle p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need Custom Logistics Solutions?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our logistics team can design bespoke supply chain solutions for high-volume 
              orders, seasonal campaigns, or specialized handling requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-fresh hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Discuss Logistics
              </button>
              <button className="border border-border hover:bg-muted text-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Download Shipping Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logistics;