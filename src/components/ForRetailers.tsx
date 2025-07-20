import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, FileText, Scale, TrendingUp, Download, ArrowRight, Building2 } from 'lucide-react';

const ForRetailers = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Direct from farm pricing with transparent costs. No middleman markups.',
      highlight: 'Save 15-25%'
    },
    {
      icon: FileText,
      title: 'Full Compliance',
      description: 'ACIR, FDA, and PACA certified. All documentation handled for you.',
      highlight: 'Zero Compliance Risk'
    },
    {
      icon: Scale,
      title: 'Flexible Quantities',
      description: 'From 250kg to 10+ tonnes. Scale with your business needs.',
      highlight: 'MOQ from 250kg'
    },
    {
      icon: TrendingUp,
      title: 'Consistent Supply',
      description: 'Year-round availability with demand forecasting and planning.',
      highlight: '98% Fill Rate'
    }
  ];

  const complianceDocs = [
    'ACIR Certificate 2024',
    'FDA Registration Proof',
    'PACA License Documentation',
    'GlobalG.A.P. Farm Certificates',
    'Cold Chain Validation Report'
  ];

  return (
    <section id="retailers" className="py-24 bg-gradient-fresh-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            <Building2 className="w-4 h-4 mr-2" />
            For Retailers & Buyers
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Reliable African Produce Sourcing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Partner with Afreshia for consistent, quality African produce supply. 
            Streamlined procurement with full compliance and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Benefits Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Procurement Benefits
            </h3>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-foreground">{benefit.title}</h4>
                          <Badge variant="outline" className="text-xs text-afresh-green border-afresh-green">
                            {benefit.highlight}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Downloads */}
            <Card className="mt-8 border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-afresh-green" />
                  Compliance Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceDocs.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-foreground">{doc}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Form */}
          <div>
            <Card className="border-0 bg-background/90 backdrop-blur-sm shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Get Started as a Buyer</CardTitle>
                <p className="text-muted-foreground">
                  Tell us about your requirements and we'll prepare a custom quote.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Company Name *
                    </label>
                    <Input placeholder="Your company name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Contact Person *
                    </label>
                    <Input placeholder="Your full name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <Input type="email" placeholder="your@company.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Expected Weekly Tonnage
                  </label>
                  <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select volume range</option>
                    <option value="0.5-2">0.5 - 2 tonnes</option>
                    <option value="2-5">2 - 5 tonnes</option>
                    <option value="5-10">5 - 10 tonnes</option>
                    <option value="10+">10+ tonnes</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Products of Interest
                  </label>
                  <Textarea 
                    placeholder="Tell us which African produce you're interested in sourcing..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Delivery Location
                  </label>
                  <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select destination</option>
                    <option value="usa-east">USA - East Coast</option>
                    <option value="usa-west">USA - West Coast</option>
                    <option value="uk">United Kingdom</option>
                    <option value="eu">European Union</option>
                  </select>
                </div>

                <Button className="w-full bg-gradient-fresh hover:bg-primary-hover" size="lg">
                  Submit Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Our team will contact you within 24 hours with a detailed quote.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForRetailers;