import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ValueProposition from '@/components/ValueProposition';
import ProductShowcase from '@/components/ProductShowcase';
import HowItWorks from '@/components/HowItWorks';
import ForRetailers from '@/components/ForRetailers';
import ForFarmers from '@/components/ForFarmers';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ValueProposition />
      <ProductShowcase />
      <HowItWorks />
      <ForRetailers />
      <ForFarmers />
    </div>
  );
};

export default Index;
