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
import Chatbot from '@/components/Chatbot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ValueProposition />
      <section id="products">
        <ProductShowcase />
        <ProductSpecs />
      </section>
      <HowItWorks />
      <section id="retailers">
        <ForRetailers />
      </section>
      <section id="farmers">
        <ForFarmers />
      </section>
      <section id="logistics">
        <Logistics />
      </section>
      <section id="about">
        <About />
      </section>
      <Chatbot />
    </div>
  );
};

export default Index;
