import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, FileText, Scale, TrendingUp, Download, ArrowRight, Building2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const ForRetailers = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    tonnage: '',
    products: '',
    deliveryLocation: ''
  });
  const [complianceFiles, setComplianceFiles] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.functions.invoke('send-form-email', {
        body: {
          formType: 'retailer',
          data: formData
        }
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Our team will contact you within 24 hours with a detailed quote.",
      });

      // Reset form
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        tonnage: '',
        products: '',
        deliveryLocation: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Direct from farm pricing with transparent costs. No middleman markups.',
      highlight: 'Save 15-25%'
    },
    {
      icon: FileText,
      title: 'Full Compliance',
      description: 'ACIR, FDA, and PACA certified. All documentation handled for you.',
      highlight: 'Zero Compliance Risk'
    },
    {
      icon: Scale,
      title: 'Flexible Quantities',
      description: 'From 250kg to 10+ tonnes. Scale with your business needs.',
      highlight: 'MOQ from 250kg'
    },
    {
      icon: TrendingUp,
      title: 'Consistent Supply',
      description: 'Year-round availability with demand forecasting and planning.',
      highlight: '98% Fill Rate'
    }
  ];

  const complianceDocs = [
    { id: 'acir-certificate', name: 'ACIR Certificate 2024', keywords: ['acir', 'certificate'] },
    { id: 'fda-registration', name: 'FDA Registration Proof', keywords: ['fda', 'registration'] },
    { id: 'paca-license', name: 'PACA License Documentation', keywords: ['paca', 'license'] },
    { id: 'globalgap-certificates', name: 'GlobalG.A.P. Farm Certificates', keywords: ['globalgap', 'global', 'gap', 'farm'] },
    { id: 'cold-chain-validation', name: 'Cold Chain Validation Report', keywords: ['cold', 'chain', 'validation'] }
  ];

  // Load existing compliance files
  const loadComplianceFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('compliance-docs')
        .list('', { limit: 100 });

      if (error) throw error;

      const fileMap: Record<string, string> = {};
      data?.forEach(file => {
        const fileName = file.name.toLowerCase();
        
        // Try to match files to documents using keywords
        complianceDocs.forEach(doc => {
          const hasKeyword = doc.keywords.some(keyword => 
            fileName.includes(keyword.toLowerCase())
          );
          
          if (hasKeyword && !fileMap[doc.id]) {
            fileMap[doc.id] = file.name;
          }
        });
        
        // Fallback: try to match by exact ID prefix (original logic)
        const docId = file.name.split('-')[0];
        if (!fileMap[docId]) {
          fileMap[docId] = file.name;
        }
      });
      setComplianceFiles(fileMap);
    } catch (error) {
      console.error('Error loading compliance files:', error);
    }
  };

  // Upload compliance document
  const handleFileUpload = async (docId: string, file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(docId);
    try {
      const fileName = `${docId}-${Date.now()}.pdf`;
      const { error } = await supabase.storage
        .from('compliance-docs')
        .upload(fileName, file);

      if (error) throw error;

      setComplianceFiles(prev => ({ ...prev, [docId]: fileName }));
      toast({
        title: "Upload successful",
        description: "Compliance document uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  // Download compliance document
  const handleDownload = async (docId: string, docName: string) => {
    const fileName = complianceFiles[docId];
    if (!fileName) {
      toast({
        title: "Document not available",
        description: "This compliance document has not been uploaded yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('compliance-docs')
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your compliance document is downloading.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadComplianceFiles();
  }, []);

  return (
    <section id="retailers" className="py-24 bg-gradient-fresh-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            <Building2 className="w-4 h-4 mr-2" />
            For Retailers & Buyers
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Reliable African Produce Sourcing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Partner with Afreshia for consistent, quality African produce supply. 
            Streamlined procurement with full compliance and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Benefits Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Procurement Benefits
            </h3>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-foreground">{benefit.title}</h4>
                          <Badge variant="outline" className="text-xs text-afresh-green border-afresh-green">
                            {benefit.highlight}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Downloads */}
            <Card className="mt-8 border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-afresh-green" />
                    Compliance Downloads
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Compliance Documents</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {complianceDocs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                            <span className="text-sm font-medium">{doc.name}</span>
                            <div className="flex items-center space-x-2">
                              {complianceFiles[doc.id] && (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  Uploaded
                                </Badge>
                              )}
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(doc.id, file);
                                }}
                                className="hidden"
                                id={`upload-${doc.id}`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={uploading === doc.id}
                                onClick={() => document.getElementById(`upload-${doc.id}`)?.click()}
                              >
                                {uploading === doc.id ? 'Uploading...' : 'Choose File'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-foreground">{doc.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={!complianceFiles[doc.id]}
                        onClick={() => handleDownload(doc.id, doc.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Form */}
          <div>
            <Card className="border-0 bg-background/90 backdrop-blur-sm shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Get Started as a Buyer</CardTitle>
                <p className="text-muted-foreground">
                  Tell us about your requirements and we'll prepare a custom quote.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Company Name *
                      </label>
                      <Input 
                        placeholder="Your company name" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Contact Person *
                      </label>
                      <Input 
                        placeholder="Your full name" 
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="your@company.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number *
                      </label>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Expected Weekly Tonnage
                    </label>
                    <select 
                      className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                      value={formData.tonnage}
                      onChange={(e) => setFormData({...formData, tonnage: e.target.value})}
                    >
                      <option value="">Select volume range</option>
                      <option value="0.5-2">0.5 - 2 tonnes</option>
                      <option value="2-5">2 - 5 tonnes</option>
                      <option value="5-10">5 - 10 tonnes</option>
                      <option value="10+">10+ tonnes</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Products of Interest
                    </label>
                    <Textarea 
                      placeholder="Tell us which African produce you're interested in sourcing..."
                      rows={3}
                      value={formData.products}
                      onChange={(e) => setFormData({...formData, products: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Delivery Location
                    </label>
                    <select 
                      className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                      value={formData.deliveryLocation}
                      onChange={(e) => setFormData({...formData, deliveryLocation: e.target.value})}
                    >
                      <option value="">Select destination</option>
                      <option value="usa-east">USA - East Coast</option>
                      <option value="usa-west">USA - West Coast</option>
                      <option value="uk">United Kingdom</option>
                      <option value="eu">European Union</option>
                      <option value="dubai">Dubai, UAE</option>
                      <option value="doha">Doha, Qatar</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-fresh hover:bg-primary-hover" size="lg">
                    Submit Application
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center">
                  Our team will contact you within 24 hours with a detailed quote.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForRetailers;