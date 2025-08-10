import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  MapPin, 
  Package, 
  ArrowRight,
  Grid,
  List,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

// Product images
import okraImage from '@/assets/okra.jpg';
import sweetPotatoesImage from '@/assets/sweet-potatoes.jpg';
import collardGreensImage from '@/assets/collard-greens.jpg';
import babyCornImage from '@/assets/baby-corn.jpg';
import butternutSquashImage from '@/assets/butternut-squash.jpg';
import passionFruitImage from '@/assets/passion-fruit.jpg';
import birdsEyeChilliImage from '@/assets/birds-eye-chilli.jpg';
import mangeToutImage from '@/assets/mange-tout.jpg';
import fineBeansImage from '@/assets/fine-beans.jpg';
import sugarSnapPeasImage from '@/assets/sugar-snap-peas.jpg';

const Catalogue = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCertification, setSelectedCertification] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allProducts = [
    {
      id: 1,
      name: 'Okra',
      category: 'Vegetables',
      season: 'Year-round',
      origin: 'Mashonaland East',
      moq: '500kg',
      status: 'ACIR Certified',
      description: 'Fresh tender okra pods, perfect for international markets with excellent export quality.',
      image: okraImage,
      price: '$2.50/kg',
      availability: 'In Stock'
    },
    {
      id: 2,
      name: 'Sweet Potatoes',
      category: 'Roots & Tubers',
      season: 'Mar-Aug',
      origin: 'Manicaland',
      moq: '1000kg',
      status: 'FDA Approved',
      description: 'Orange-fleshed sweet potatoes rich in beta-carotene and nutrients.',
      image: sweetPotatoesImage,
      price: '$1.80/kg',
      availability: 'In Stock'
    },
    {
      id: 3,
      name: 'Collard Greens',
      category: 'Leafy Greens',
      season: 'Year-round',
      origin: 'Mashonaland Central',
      moq: '250kg',
      status: 'ACIR Certified',
      description: 'Nutrient-dense leafy greens, pesticide-free cultivation with premium quality.',
      image: collardGreensImage,
      price: '$3.20/kg',
      availability: 'In Stock'
    },
    {
      id: 4,
      name: 'Baby Corn',
      category: 'Vegetables',
      season: 'Oct-Apr',
      origin: 'Masvingo',
      moq: '300kg',
      status: 'FDA Approved',
      description: 'Tender baby corn, hand-picked at optimal maturity for best flavor.',
      image: babyCornImage,
      price: '$4.50/kg',
      availability: 'Seasonal'
    },
    {
      id: 5,
      name: 'Butternut Squash',
      category: 'Vegetables',
      season: 'Apr-Sep',
      origin: 'Midlands',
      moq: '800kg',
      status: 'ACIR Certified',
      description: 'Premium butternut squash with extended shelf life and excellent storage quality.',
      image: butternutSquashImage,
      price: '$2.20/kg',
      availability: 'Seasonal'
    },
    {
      id: 6,
      name: 'Passion Fruit',
      category: 'Fruits',
      season: 'Dec-Jun',
      origin: 'Eastern Highlands',
      moq: '200kg',
      status: 'FDA Approved',
      description: 'Aromatic passion fruit with high pulp content and intense flavor profile.',
      image: passionFruitImage,
      price: '$6.80/kg',
      availability: 'Seasonal'
    },
    {
      id: 7,
      name: "Bird's Eye Chilli",
      category: 'Vegetables',
      season: 'Year-round',
      origin: 'Mashonaland West',
      moq: '100kg',
      status: 'ACIR Certified',
      description: 'Fiery small chillies perfect for spice lovers and culinary applications.',
      image: birdsEyeChilliImage,
      price: '$8.50/kg',
      availability: 'In Stock'
    },
    {
      id: 8,
      name: 'Mange Tout',
      category: 'Vegetables',
      season: 'May-Oct',
      origin: 'Masvingo',
      moq: '250kg',
      status: 'FDA Approved',
      description: 'Tender snow peas with edible pods, crisp texture and sweet flavor.',
      image: mangeToutImage,
      price: '$5.20/kg',
      availability: 'Seasonal'
    },
    {
      id: 9,
      name: 'Fine Beans',
      category: 'Vegetables',
      season: 'Apr-Nov',
      origin: 'Midlands',
      moq: '300kg',
      status: 'ACIR Certified',
      description: 'Premium thin green beans with excellent texture and consistent quality.',
      image: fineBeansImage,
      price: '$4.80/kg',
      availability: 'Seasonal'
    },
    {
      id: 10,
      name: 'Sugar Snap Peas',
      category: 'Vegetables',
      season: 'Jun-Sep',
      origin: 'Manicaland',
      moq: '200kg',
      status: 'FDA Approved',
      description: 'Sweet, crunchy pea pods perfect for fresh consumption and export.',
      image: sugarSnapPeasImage,
      price: '$5.90/kg',
      availability: 'Seasonal'
    }
  ];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSeason = selectedSeason === 'all' || product.season.includes(selectedSeason);
    const matchesCertification = selectedCertification === 'all' || product.status.includes(selectedCertification);
    
    return matchesSearch && matchesCategory && matchesSeason && matchesCertification;
  });

  const categories = ['all', 'Vegetables', 'Roots & Tubers', 'Leafy Greens', 'Fruits'];
  const seasons = ['all', 'Year-round', 'Mar-Aug', 'Oct-Apr', 'Apr-Sep', 'Dec-Jun', 'May-Oct', 'Apr-Nov', 'Jun-Sep'];
  const certifications = ['all', 'ACIR Certified', 'FDA Approved'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-fresh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Product Catalogue
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore our complete range of premium African produce with detailed specifications and pricing.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Label htmlFor="category" className="text-sm font-medium">Category:</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="season" className="text-sm font-medium">Season:</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem key={season} value={season}>
                        {season === 'all' ? 'All Seasons' : season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="certification" className="text-sm font-medium">Certification:</Label>
                <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {certifications.map(cert => (
                      <SelectItem key={cert} value={cert}>
                        {cert === 'all' ? 'All Certs' : cert}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {allProducts.length} products
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-card transition-all duration-300 overflow-hidden border-0 bg-background"
                >
                  <div className="aspect-square bg-fresh-accent overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
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

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-afresh-green" />
                        <span className="font-medium mr-2">Season:</span>
                        {product.season}
                      </div>
                      <div className="flex items-center text-sm text-foreground">
                        <Package className="w-4 h-4 mr-2 text-afresh-green" />
                        <span className="font-medium mr-2">MOQ:</span>
                        {product.moq}
                      </div>
                      <div className="flex items-center text-sm text-foreground">
                        <span className="font-bold text-primary mr-2">Price:</span>
                        {product.price}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-fresh hover:bg-primary-hover group"
                        size="sm"
                        onClick={() => navigate(`/request-quote?product=${encodeURIComponent(product.name)}`)}
                      >
                        Quote
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Downloading ${product.name} spec sheet...`)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="border-0 shadow-card bg-background">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-48 bg-fresh-accent rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                          <div className="flex gap-2">
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
                            <Badge variant="secondary" className="text-xs">
                              {product.availability}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          {product.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <span className="text-sm text-muted-foreground">Season:</span>
                            <p className="font-medium text-foreground">{product.season}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Origin:</span>
                            <p className="font-medium text-foreground">{product.origin}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">MOQ:</span>
                            <p className="font-medium text-foreground">{product.moq}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Price:</span>
                            <p className="font-bold text-primary">{product.price}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="bg-gradient-fresh hover:bg-primary-hover group"
                            onClick={() => navigate(`/request-quote?product=${encodeURIComponent(product.name)}`)}
                          >
                            Request Quote
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => alert(`Downloading ${product.name} spec sheet...`)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Spec Sheet
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No products found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedSeason('all');
                  setSelectedCertification('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Download Full Catalogue CTA */}
      <section className="py-16 bg-fresh-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need the Complete Catalogue?
          </h2>
          <p className="text-muted-foreground mb-8">
            Download our comprehensive product catalogue with detailed specifications, pricing, and availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-fresh hover:bg-primary-hover"
              onClick={() => alert('Downloading complete catalogue...')}
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF Catalogue
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/request-quote')}
            >
              Request Custom Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalogue;