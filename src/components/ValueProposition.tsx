import { Card, CardContent } from '@/components/ui/card';
import { Shield, CreditCard, Truck } from 'lucide-react';
import freshVegetables from '@/assets/fresh-vegetables.jpg';
import coldChainLogistics from '@/assets/cold-chain-logistics.jpg';
import farmersField from '@/assets/farmers-field.jpg';

const ValueProposition = () => {
  const values = [
    {
      icon: Shield,
      title: 'Guaranteed Quality',
      description: 'ACIR & FDA certified produce with comprehensive quality control from farm to delivery. Every shipment meets international standards.',
      image: freshVegetables,
      features: ['GlobalG.A.P. Certified Farms', 'Pre-shipment Quality Control', '100% Traceability']
    },
    {
      icon: CreditCard,
      title: 'Prefinanced Growers',
      description: 'Supporting local farmers with input credit programs and guaranteed purchase agreements, ensuring consistent supply and fair prices.',
      image: farmersField,
      features: ['Input Credit Program', 'Guaranteed Purchase', 'Fair Price Commitment']
    },
    {
      icon: Truck,
      title: 'Cold-Chain to Your Door',
      description: 'Complete temperature-controlled logistics from Zimbabwean farms to your destination. 3-day delivery to major USA, UK & EU markets.',
      image: coldChainLogistics,
      features: ['Temperature Controlled', '3-Day Delivery', 'CIP Incoterms']
    }
  ];

  return (
    <section className="py-24 bg-gradient-fresh-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why Choose Afreshia?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We bridge the gap between African farmers and international markets with 
            reliability, quality, and transparency at every step.
          </p>
        </div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-fresh transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={value.image}
                  alt={value.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center mr-4">
                    <value.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {value.description}
                </p>

                <ul className="space-y-2">
                  {value.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-foreground">
                      <div className="w-1.5 h-1.5 bg-afresh-green rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;