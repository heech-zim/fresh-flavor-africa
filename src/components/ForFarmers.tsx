import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, GraduationCap, TrendingUp, Users, ArrowRight, Sprout } from 'lucide-react';

const ForFarmers = () => {
  const programs = [
    {
      icon: CreditCard,
      title: 'Input Credit Program',
      description: 'Get seeds, fertilizers, and tools upfront. Pay back after harvest with guaranteed purchase.',
      benefit: 'Up to $2,000 credit'
    },
    {
      icon: GraduationCap,
      title: 'GlobalG.A.P. Support',
      description: 'Free training and certification support to meet international quality standards.',
      benefit: 'Full certification support'
    },
    {
      icon: TrendingUp,
      title: 'Price Transparency',
      description: 'Access weekly price dashboards and market insights. Know your earnings upfront.',
      benefit: 'Real-time pricing'
    },
    {
      icon: Users,
      title: 'Farmer Community',
      description: 'Join a network of 500+ farmers sharing knowledge and best practices.',
      benefit: '500+ active farmers'
    }
  ];

  return (
    <section id="farmers" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            <Sprout className="w-4 h-4 mr-2" />
            For Farmers & Out-Growers
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Grow With Afreshia
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our network of farmers and grow premium produce for international markets. 
            Get support, fair prices, and guaranteed purchase agreements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Programs Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Farmer Support Programs
            </h3>
            
            <div className="space-y-6">
              {programs.map((program, index) => (
                <Card key={index} className="border-0 bg-gradient-fresh-subtle">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center flex-shrink-0">
                        <program.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-foreground">{program.title}</h4>
                          <Badge variant="outline" className="text-xs text-afresh-green border-afresh-green">
                            {program.benefit}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {program.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Success Stats */}
            <Card className="mt-8 border-0 bg-background shadow-card">
              <CardHeader>
                <CardTitle className="text-center">
                  Impact by Numbers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-afresh-green mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Active Farmers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-afresh-green mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Payment Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-afresh-green mb-2">$2.5M</div>
                    <div className="text-sm text-muted-foreground">Farmer Payments</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-afresh-green mb-2">12</div>
                    <div className="text-sm text-muted-foreground">Provinces</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div>
            <Card className="border-0 bg-background shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Apply as Out-Grower</CardTitle>
                <p className="text-muted-foreground">
                  Join our farmer network and start growing for international markets.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <Input placeholder="+263 123 456 789" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input type="email" placeholder="your@email.com (optional)" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Location *
                  </label>
                  <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select your province</option>
                    <option value="mashonaland-east">Mashonaland East</option>
                    <option value="mashonaland-west">Mashonaland West</option>
                    <option value="mashonaland-central">Mashonaland Central</option>
                    <option value="manicaland">Manicaland</option>
                    <option value="midlands">Midlands</option>
                    <option value="masvingo">Masvingo</option>
                    <option value="matabeleland-north">Matabeleland North</option>
                    <option value="matabeleland-south">Matabeleland South</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Farm Size
                  </label>
                  <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select farm size</option>
                    <option value="0.5-2">0.5 - 2 hectares</option>
                    <option value="2-5">2 - 5 hectares</option>
                    <option value="5-10">5 - 10 hectares</option>
                    <option value="10+">10+ hectares</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Current Crops
                  </label>
                  <Textarea 
                    placeholder="What crops do you currently grow?"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Experience Level
                  </label>
                  <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                    <option value="">Select experience</option>
                    <option value="beginner">New to farming (0-2 years)</option>
                    <option value="intermediate">Some experience (2-5 years)</option>
                    <option value="experienced">Experienced (5+ years)</option>
                  </select>
                </div>

                <Button className="w-full bg-gradient-fresh hover:bg-primary-hover" size="lg">
                  Submit Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Our field agents will visit within 7 days to discuss opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForFarmers;