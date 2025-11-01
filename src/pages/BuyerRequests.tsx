import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, Package, TrendingUp } from 'lucide-react';
import { z } from 'zod';

// Validation schema for buyer request
const buyerRequestSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200, "Company name must be less than 200 characters"),
  contact_person: z.string().trim().min(1, "Contact person is required").max(100, "Contact person must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number must be less than 20 characters").optional(),
  product_type: z.string().min(1, "Please select a product"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  delivery_location: z.string().trim().min(1, "Delivery location is required").max(200, "Delivery location must be less than 200 characters"),
  preferred_delivery_date: z.string().optional(),
  budget_range: z.string().trim().max(100, "Budget range must be less than 100 characters").optional(),
  additional_requirements: z.string().trim().max(1000, "Additional requirements must be less than 1000 characters").optional(),
  spec_grade: z.string().trim().max(100, "Grade must be less than 100 characters").optional(),
  spec_size: z.string().trim().max(100, "Size must be less than 100 characters").optional(),
  spec_color: z.string().trim().max(100, "Color must be less than 100 characters").optional(),
  spec_packaging: z.string().trim().max(100, "Packaging must be less than 100 characters").optional(),
  spec_other: z.string().trim().max(500, "Other specifications must be less than 500 characters").optional()
});

const BuyerRequests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    product_type: '',
    quantity: '',
    unit: 'kg',
    delivery_location: '',
    preferred_delivery_date: '',
    budget_range: '',
    additional_requirements: '',
    // Specifications
    spec_grade: '',
    spec_size: '',
    spec_color: '',
    spec_packaging: '',
    spec_other: ''
  });

  const products = [
    "Baby Corn", "Fine Beans", "Mange Tout", "Sugar Snap Peas",
    "Okra", "Birds Eye Chilli", "Sweet Potatoes", "Butternut Squash",
    "Collard Greens", "Passion Fruit", "Other"
  ];

  const units = ["kg", "tons", "crates", "boxes"];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = buyerRequestSchema.parse(formData);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const specifications = {
        grade: validatedData.spec_grade || null,
        size: validatedData.spec_size || null,
        color: validatedData.spec_color || null,
        packaging: validatedData.spec_packaging || null,
        other: validatedData.spec_other || null
      };

      const { error } = await supabase
        .from('buyer_requests')
        .insert({
          user_id: user?.id || null,
          company_name: validatedData.company_name,
          contact_person: validatedData.contact_person,
          email: validatedData.email,
          phone: validatedData.phone || null,
          product_type: validatedData.product_type,
          specifications,
          quantity: parseFloat(validatedData.quantity),
          unit: validatedData.unit,
          delivery_location: validatedData.delivery_location,
          preferred_delivery_date: validatedData.preferred_delivery_date || null,
          budget_range: validatedData.budget_range || null,
          additional_requirements: validatedData.additional_requirements || null
        });

      if (error) throw error;

      toast({
        title: "Request Submitted Successfully",
        description: "We'll match your request with suitable farmers and get back to you soon.",
      });

      // Reset form
      setFormData({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        product_type: '',
        quantity: '',
        unit: 'kg',
        delivery_location: '',
        preferred_delivery_date: '',
        budget_range: '',
        additional_requirements: '',
        spec_grade: '',
        spec_size: '',
        spec_color: '',
        spec_packaging: '',
        spec_other: ''
      });
    } catch (error: any) {
      console.error('Error submitting request:', error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Submit Your Produce Request
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us what you need and we'll match you with farmers who can supply your requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Submit Request</h3>
                <p className="text-sm text-muted-foreground">
                  Specify your produce needs and requirements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">We Match</h3>
                <p className="text-sm text-muted-foreground">
                  We connect you with suitable farmers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Package className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Receive Offers</h3>
                <p className="text-sm text-muted-foreground">
                  Get competitive quotes from farmers
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>
                Fill in the details below and we'll find the best match for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        required
                        value={formData.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_person">Contact Person *</Label>
                      <Input
                        id="contact_person"
                        required
                        value={formData.contact_person}
                        onChange={(e) => handleChange('contact_person', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_type">Product Type *</Label>
                      <Select
                        value={formData.product_type}
                        onValueChange={(value) => handleChange('product_type', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
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
                      <div className="flex gap-2">
                        <Input
                          id="quantity"
                          type="number"
                          step="0.01"
                          required
                          value={formData.quantity}
                          onChange={(e) => handleChange('quantity', e.target.value)}
                          className="flex-1"
                        />
                        <Select
                          value={formData.unit}
                          onValueChange={(value) => handleChange('unit', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
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
                </div>

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="spec_grade">Grade</Label>
                      <Input
                        id="spec_grade"
                        placeholder="e.g., Premium, Class A"
                        value={formData.spec_grade}
                        onChange={(e) => handleChange('spec_grade', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spec_size">Size</Label>
                      <Input
                        id="spec_size"
                        placeholder="e.g., 10-12cm, Large"
                        value={formData.spec_size}
                        onChange={(e) => handleChange('spec_size', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spec_color">Color</Label>
                      <Input
                        id="spec_color"
                        placeholder="e.g., Dark green"
                        value={formData.spec_color}
                        onChange={(e) => handleChange('spec_color', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spec_packaging">Packaging</Label>
                      <Input
                        id="spec_packaging"
                        placeholder="e.g., 5kg boxes"
                        value={formData.spec_packaging}
                        onChange={(e) => handleChange('spec_packaging', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="spec_other">Other Specifications</Label>
                      <Textarea
                        id="spec_other"
                        placeholder="Any other specific requirements..."
                        value={formData.spec_other}
                        onChange={(e) => handleChange('spec_other', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Delivery Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="delivery_location">Delivery Location *</Label>
                      <Input
                        id="delivery_location"
                        required
                        placeholder="City, Country"
                        value={formData.delivery_location}
                        onChange={(e) => handleChange('delivery_location', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred_delivery_date">Preferred Delivery Date</Label>
                      <Input
                        id="preferred_delivery_date"
                        type="date"
                        value={formData.preferred_delivery_date}
                        onChange={(e) => handleChange('preferred_delivery_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Budget Range</Label>
                      <Input
                        id="budget_range"
                        placeholder="e.g., $5000-$10000"
                        value={formData.budget_range}
                        onChange={(e) => handleChange('budget_range', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="additional_requirements">Additional Requirements</Label>
                  <Textarea
                    id="additional_requirements"
                    placeholder="Any special requirements or notes..."
                    value={formData.additional_requirements}
                    onChange={(e) => handleChange('additional_requirements', e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BuyerRequests;
