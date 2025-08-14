import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Truck, Package, MapPin, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RequestQuote = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    product: '',
    quantity: '',
    unit: '',
    destination: '',
    deliveryDate: '',
    additionalInfo: ''
  });

  // Pre-fill product if coming from product page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productParam = searchParams.get('product');
    if (productParam) {
      setFormData(prev => ({
        ...prev,
        product: productParam
      }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to database
      const { error: dbError } = await (supabase as any)
        .from('quote_requests')
        .insert([{
          company_name: formData.company || 'Individual',
          contact_person: formData.name,
          email: formData.email,
          phone: formData.phone,
          product_type: formData.product,
          quantity: `${formData.quantity} ${formData.unit}`,
          delivery_location: formData.destination,
          delivery_date: formData.deliveryDate || null,
          additional_requirements: formData.additionalInfo
        }]);

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-form-email', {
        body: {
          formType: 'quote',
          data: formData
        }
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw error here, request was saved to database
      }

      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you within 24 hours with a detailed quote.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        product: '',
        quantity: '',
        unit: '',
        destination: '',
        deliveryDate: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const products = [
    'Baby Corn',
    'Birds Eye Chilli',
    'Butternut Squash',
    'Collard Greens',
    'Fine Beans',
    'Mange Tout',
    'Okra',
    'Passion Fruit',
    'Sugar Snap Peas',
    'Sweet Potatoes',
    'Green Bell Peppers',
    'Red Bell Peppers',
    'Yellow Bell Peppers',
    'Cucumber',
    'Tomatoes',
    'Carrots',
    'Onions',
    'Garlic',
    'Ginger',
    'Avocado',
    'Pineapple',
    'Mango',
    'Papaya',
    'Watermelon',
    'Lettuce',
    'Spinach',
    'Cabbage',
    'Broccoli',
    'Cauliflower',
    'Eggplant',
    'Zucchini',
    'Pumpkin',
    'Custom Mix'
  ];

  const units = [
    'Kilograms (kg)',
    'Tonnes',
    'Boxes',
    'Crates',
    'Pallets'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-fresh text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Request a Quote
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Get a personalized quote for fresh, quality produce delivered to your destination
          </p>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Get Your Custom Quote</CardTitle>
              <CardDescription className="text-lg">
                Fill out the form below and we'll provide you with a detailed quote within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Product Information */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Product Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product *</Label>
                      <Select value={formData.product} onValueChange={(value) => handleChange('product', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product} value={product}>
                              {product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select value={formData.unit} onValueChange={(value) => handleChange('unit', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Delivery Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="destination"
                          className="pl-10"
                          placeholder="City, Country"
                          value={formData.destination}
                          onChange={(e) => handleChange('destination', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => handleChange('deliveryDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Requirements</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Please specify any special requirements, packaging preferences, quality standards, or other details that would help us provide an accurate quote..."
                      value={formData.additionalInfo}
                      onChange={(e) => handleChange('additionalInfo', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-fresh hover:bg-primary-hover text-lg py-6"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Request Quote
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quote Process Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Submit Request</h3>
                <p className="text-muted-foreground text-sm">
                  Fill out the form with your requirements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Review & Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Our team analyzes your needs and prepares a detailed quote
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Receive Quote</h3>
                <p className="text-muted-foreground text-sm">
                  Get your personalized quote within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestQuote;