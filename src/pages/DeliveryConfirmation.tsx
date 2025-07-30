import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Star, MessageSquare } from 'lucide-react';

const DeliveryConfirmation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-fresh-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-afresh-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Delivery Completed!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your fresh produce has been successfully delivered. Thank you for choosing Afreshia.
          </p>
        </div>
      </section>

      {/* Delivery Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Delivery Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">AFR-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Date:</span>
                  <span className="font-medium">January 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Time:</span>
                  <span className="font-medium">2:30 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="font-medium">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Address:</span>
                  <span className="font-medium">123 Main St, New York, NY</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Delivery Receipt
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Your Experience
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How was your experience?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                We'd love to hear about your experience with Afreshia. Your feedback helps us improve our service.
              </p>
              <div className="flex gap-4">
                <Button>Leave a Review</Button>
                <Button variant="outline">Request Another Quote</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DeliveryConfirmation;