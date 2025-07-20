import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, Leaf, Users, Award, Truck } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Quality",
      description: "We're committed to delivering the freshest, highest-quality produce that meets international standards."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting African farmers to markets worldwide, bridging continents through fresh produce."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Supporting sustainable farming practices that protect our environment for future generations."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Empowering local farming communities by providing fair prices and reliable market access."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining the highest standards in every aspect of our operations, from farm to table."
    },
    {
      icon: Truck,
      title: "Reliable Logistics",
      description: "Ensuring seamless delivery with our advanced cold chain logistics and tracking systems."
    }
  ];

  const stats = [
    { number: "500+", label: "Partner Farmers" },
    { number: "50+", label: "Export Destinations" },
    { number: "10k+", label: "Tons Exported Annually" },
    { number: "15+", label: "Years Experience" }
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Afreshia</Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Connecting African Agriculture to the World
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founded in Zimbabwe, Afreshia has grown to become a trusted bridge between African farmers 
            and global markets, specializing in fresh produce export with a commitment to quality, 
            sustainability, and community empowerment.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Story</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Afreshia was born from a simple yet powerful vision: to showcase the incredible quality 
                and variety of African produce to the world. Starting as a small export company in Zimbabwe, 
                we recognized the immense potential of our continent's agricultural wealth.
              </p>
              <p>
                Over the years, we've built strong relationships with farmers across Zimbabwe and 
                neighboring countries, providing them with the support, training, and market access 
                they need to thrive. Our commitment goes beyond business – we're dedicated to 
                transforming lives and communities.
              </p>
              <p>
                Today, Afreshia exports premium fresh produce to over 50 destinations worldwide, 
                maintaining the highest quality standards while ensuring fair compensation for 
                our farming partners.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Mission</h3>
            <div className="bg-gradient-fresh-subtle p-8 rounded-lg">
              <p className="text-lg text-foreground mb-4">
                "To be the leading bridge connecting African agriculture to global markets, 
                delivering exceptional quality produce while empowering farming communities 
                and promoting sustainable practices."
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Vision:</strong> A world where African farmers have direct access to global markets.</p>
                <p><strong>Values:</strong> Quality, Integrity, Sustainability, Community, Excellence.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-20">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">Our Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h3 className="text-2xl font-bold text-center text-foreground mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center mr-4">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">{value.title}</h4>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Partner with Us?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to expand your market reach or a retailer seeking 
            premium African produce, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+263771414102"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-fresh text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              Contact Us Today
            </a>
            <a 
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;