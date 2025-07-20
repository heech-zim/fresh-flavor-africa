import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Package, ArrowRight } from 'lucide-react';

const ProductShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vegetables', 'Roots & Tubers', 'Leafy Greens', 'Fruits'];

  const products = [
    {
      name: 'Okra',
      category: 'Vegetables',
      season: 'Year-round',
      origin: 'Mashonaland East',
      moq: '500kg',
      status: 'ACIR Certified',
      description: 'Fresh tender okra pods, perfect for international markets.',
      image: '/placeholder.svg'
    },
    {
      name: 'Sweet Potatoes',
      category: 'Roots & Tubers',
      season: 'Mar-Aug',
      origin: 'Manicaland',
      moq: '1000kg',
      status: 'FDA Approved',
      description: 'Orange-fleshed sweet potatoes rich in beta-carotene.',
      image: '/placeholder.svg'
    },
    {
      name: 'Collard Greens',
      category: 'Leafy Greens',
      season: 'Year-round',
      origin: 'Mashonaland Central',
      moq: '250kg',
      status: 'ACIR Certified',
      description: 'Nutrient-dense leafy greens, pesticide-free cultivation.',
      image: '/placeholder.svg'
    },
    {
      name: 'Baby Corn',
      category: 'Vegetables',
      season: 'Oct-Apr',
      origin: 'Masvingo',
      moq: '300kg',
      status: 'FDA Approved',
      description: 'Tender baby corn, hand-picked at optimal maturity.',
      image: '/placeholder.svg'
    },
    {
      name: 'Butternut Squash',
      category: 'Vegetables',
      season: 'Apr-Sep',
      origin: 'Midlands',
      moq: '800kg',
      status: 'ACIR Certified',
      description: 'Premium butternut squash with extended shelf life.',
      image: '/placeholder.svg'
    },
    {
      name: 'Passion Fruit',
      category: 'Fruits',
      season: 'Dec-Jun',
      origin: 'Eastern Highlands',
      moq: '200kg',
      status: 'FDA Approved',
      description: 'Aromatic passion fruit with high pulp content.',
      image: '/placeholder.svg'
    }
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="products" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Premium African Produce
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover our carefully curated selection of fresh African produce, 
            available year-round with full traceability and certification.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-fresh" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-card transition-all duration-300 overflow-hidden border-0 bg-background"
            >
              <div className="aspect-square bg-fresh-accent p-8 flex items-center justify-center">
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      product.status === 'ACIR Certified' 
                        ? 'border-afresh-green text-afresh-green' 
                        : 'border-primary text-primary'
                    }`}
                  >
                    {product.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-afresh-green" />
                    <span className="font-medium mr-2">Season:</span>
                    {product.season}
                  </div>
                  <div className="flex items-center text-sm text-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-afresh-green" />
                    <span className="font-medium mr-2">Origin:</span>
                    {product.origin}
                  </div>
                  <div className="flex items-center text-sm text-foreground">
                    <Package className="w-4 h-4 mr-2 text-afresh-green" />
                    <span className="font-medium mr-2">MOQ:</span>
                    {product.moq}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-fresh hover:bg-primary-hover group"
                  size="sm"
                >
                  Request Quote
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Looking for specific products or custom requirements?
          </p>
          <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
            View Full Catalogue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;