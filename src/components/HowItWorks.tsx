import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'Submit Requirements':
        navigate('/request-quote');
        break;
      case 'Track Shipment':
        navigate('/tracking');
        break;
      case 'Receive Goods':
        navigate('/delivery-confirmation');
        break;
      default:
        break;
    }
  };

  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Request Quote',
      description: 'Tell us your produce requirements, quantities, and delivery timeline. Our team responds within 24 hours with detailed pricing and availability.',
      action: 'Submit Requirements'
    },
    {
      number: '02',
      icon: Truck,
      title: 'Farm to Airport',
      description: 'Once confirmed, our farmers harvest fresh produce and transport via temperature-controlled vehicles to Harare International Airport.',
      action: 'Track Shipment'
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Delivered Fresh',
      description: 'Your produce arrives at JFK, MIA, LHR, or AMS within 72 hours, maintaining peak freshness through our complete cold-chain logistics.',
      action: 'Receive Goods'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From Zimbabwean farms to your doorstep in just 3 simple steps. 
            Experience the reliability of our proven supply chain.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-afresh-green via-deep-leaf to-afresh-green transform -translate-y-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative z-10 hover:shadow-fresh transition-all duration-300 border-0 bg-background group"
            >
              <CardContent className="p-8 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-gradient-fresh rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-fresh-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-fresh transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-afresh-green group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleButtonClick(step.action)}
                  className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-300"
                >
                  {step.action}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-fresh-subtle rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of retailers already sourcing premium African produce through Afreshia.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/request-quote')}
              className="bg-gradient-fresh hover:bg-primary-hover"
            >
              Request Your First Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;