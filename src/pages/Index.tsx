import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ValueProposition from '@/components/ValueProposition';
import ProductShowcase from '@/components/ProductShowcase';
import ProductSpecs from '@/components/ProductSpecs';
import HowItWorks from '@/components/HowItWorks';
import ForRetailers from '@/components/ForRetailers';
import ForFarmers from '@/components/ForFarmers';
import Logistics from '@/components/Logistics';
import About from '@/components/About';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ValueProposition />
      <ProductShowcase />
      <ProductSpecs />
      <HowItWorks />
      <ForRetailers />
      <ForFarmers />
      <Logistics />
      <About />
    </div>
  );
};

export default Index;
