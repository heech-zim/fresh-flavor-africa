import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-farm-landscape.jpg';
const Hero = () => {
  return <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="African farm landscape with fresh produce" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Tagline */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary-foreground border border-primary/20 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              ACIR & FDA Certified Fresh Produce
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Fresh African flavour, delivered{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-afresh-green to-fresh-accent">
              Afreshia
            </span>{' '}
            every time.
          </h1>

          {/* Elevator Pitch */}
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Premium African produce from farm to your door. Guaranteed quality, 
            prefinanced growers, and complete cold-chain logistics to USA, UK & EU markets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-gradient-fresh hover:bg-primary-hover text-lg px-8 py-6">
              Request a Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 text-green-600"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/contact';
                }
              }}
            >
              Get in Touch
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-afresh-green" />
              <span>PACA Licensed</span>
            </div>
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2 text-afresh-green" />
              <span>3-Day Delivery</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-afresh-green" />
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;