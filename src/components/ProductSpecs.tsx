import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileText, Thermometer, Scale, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProductSpecs = () => {
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [specFiles, setSpecFiles] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const productSpecs = [
    {
      id: 'okra',
      name: 'Okra',
      category: 'Vegetables',
      specifications: {
        size: '8-12cm length',
        color: 'Dark green',
        texture: 'Tender, non-fibrous',
        shelfLife: '7-10 days at 10°C',
        packaging: '5kg cartons',
        certification: 'ACIR Certified'
      },
      nutritional: {
        vitamin_c: '23mg/100g',
        fiber: '3.2g/100g',
        folate: '60mcg/100g',
        potassium: '299mg/100g'
      }
    },
    {
      id: 'sweet-potatoes',
      name: 'Sweet Potatoes',
      category: 'Roots & Tubers',
      specifications: {
        size: '150-400g per piece',
        color: 'Orange flesh, brown skin',
        texture: 'Firm, sweet',
        shelfLife: '2-3 weeks at 13-15°C',
        packaging: '10kg mesh bags',
        certification: 'FDA Approved'
      },
      nutritional: {
        beta_carotene: '8509mcg/100g',
        vitamin_a: '709mcg/100g',
        fiber: '3g/100g',
        potassium: '337mg/100g'
      }
    },
    {
      id: 'collard-greens',
      name: 'Collard Greens',
      category: 'Leafy Greens',
      specifications: {
        size: 'Large leaves, 15-25cm',
        color: 'Dark green',
        texture: 'Crisp, tender',
        shelfLife: '5-7 days at 0-2°C',
        packaging: '2kg bunches',
        certification: 'ACIR Certified'
      },
      nutritional: {
        vitamin_k: '230mcg/100g',
        vitamin_c: '35mg/100g',
        calcium: '232mg/100g',
        iron: '0.47mg/100g'
      }
    },
    {
      id: 'baby-corn',
      name: 'Baby Corn',
      category: 'Vegetables',
      specifications: {
        size: '8-10cm length',
        color: 'Pale yellow',
        texture: 'Tender, crisp',
        shelfLife: '5-7 days at 2-4°C',
        packaging: '2kg plastic containers',
        certification: 'FDA Approved'
      },
      nutritional: {
        fiber: '2.7g/100g',
        vitamin_c: '7mg/100g',
        folate: '46mcg/100g',
        potassium: '270mg/100g'
      }
    },
    {
      id: 'butternut-squash',
      name: 'Butternut Squash',
      category: 'Vegetables',
      specifications: {
        size: '1-3kg per piece',
        color: 'Tan exterior, orange interior',
        texture: 'Firm, sweet',
        shelfLife: '2-3 months at 10-13°C',
        packaging: '15kg wooden crates',
        certification: 'ACIR Certified'
      },
      nutritional: {
        vitamin_a: '426mcg/100g',
        vitamin_c: '21mg/100g',
        fiber: '2g/100g',
        potassium: '352mg/100g'
      }
    },
    {
      id: 'passion-fruit',
      name: 'Passion Fruit',
      category: 'Fruits',
      specifications: {
        size: '5-8cm diameter',
        color: 'Purple exterior, yellow pulp',
        texture: 'Wrinkled skin, juicy pulp',
        shelfLife: '2-3 weeks at 6-7°C',
        packaging: '3kg ventilated boxes',
        certification: 'FDA Approved'
      },
      nutritional: {
        vitamin_c: '30mg/100g',
        vitamin_a: '64mcg/100g',
        fiber: '10.4g/100g',
        iron: '1.6mg/100g'
      }
    },
    {
      id: 'birds-eye-chilli',
      name: "Bird's Eye Chilli",
      category: 'Vegetables',
      specifications: {
        size: '2-4cm length',
        color: 'Bright red when ripe',
        texture: 'Firm, very hot',
        shelfLife: '10-14 days at 8-10°C',
        packaging: '1kg ventilated containers',
        certification: 'ACIR Certified'
      },
      nutritional: {
        vitamin_c: '242mg/100g',
        vitamin_a: '48mcg/100g',
        capsaicin: '100,000-225,000 SHU',
        fiber: '1.5g/100g'
      }
    },
    {
      id: 'mange-tout',
      name: 'Mange Tout',
      category: 'Vegetables',
      specifications: {
        size: '5-8cm length',
        color: 'Bright green',
        texture: 'Crisp, tender pods',
        shelfLife: '5-7 days at 0-2°C',
        packaging: '2kg perforated bags',
        certification: 'FDA Approved'
      },
      nutritional: {
        vitamin_c: '60mg/100g',
        vitamin_k: '25mcg/100g',
        fiber: '2.6g/100g',
        folate: '42mcg/100g'
      }
    },
    {
      id: 'fine-beans',
      name: 'Fine Beans',
      category: 'Vegetables',
      specifications: {
        size: '10-14cm length, 4-6mm width',
        color: 'Dark green',
        texture: 'Tender, stringless',
        shelfLife: '7-10 days at 2-4°C',
        packaging: '2kg ventilated boxes',
        certification: 'ACIR Certified'
      },
      nutritional: {
        vitamin_c: '12mg/100g',
        vitamin_k: '43mcg/100g',
        fiber: '2.7g/100g',
        folate: '33mcg/100g'
      }
    },
    {
      id: 'sugar-snap-peas',
      name: 'Sugar Snap Peas',
      category: 'Vegetables',
      specifications: {
        size: '7-10cm length',
        color: 'Bright green',
        texture: 'Crisp, sweet pods',
        shelfLife: '5-8 days at 0-2°C',
        packaging: '2kg clamshell containers',
        certification: 'FDA Approved'
      },
      nutritional: {
        vitamin_c: '60mg/100g',
        vitamin_a: '54mcg/100g',
        fiber: '2.6g/100g',
        protein: '2.8g/100g'
      }
    }
  ];

  // Load existing spec files on component mount
  useEffect(() => {
    loadSpecFiles();
  }, []);

  const loadSpecFiles = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('product-specs')
        .list('', { limit: 100 });

      if (error) throw error;

      const fileMap: Record<string, string> = {};
      files?.forEach(file => {
        // Handle different file naming patterns
        let productId = file.name.replace('.pdf', '').replace(/_compressed$/, '').replace(/ product spec$/, '');
        // Convert to kebab-case to match our product IDs
        productId = productId.toLowerCase().replace(/\s+/g, '-');
        fileMap[productId] = file.name;
      });
      setSpecFiles(fileMap);
    } catch (error) {
      console.error('Error loading spec files:', error);
    }
  };

  const handleFileUpload = async (productId: string, file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(productId);
    try {
      const fileName = `${productId}.pdf`;
      const { error } = await supabase.storage
        .from('product-specs')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      setSpecFiles(prev => ({ ...prev, [productId]: fileName }));
      toast({
        title: "Upload successful",
        description: "Spec sheet uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload spec sheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(null);
    }
  };

  const handleDownload = async (productId: string, productName: string) => {
    const fileName = specFiles[productId];
    if (!fileName) {
      toast({
        title: "No spec sheet available",
        description: "Spec sheet for this product is not yet available.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('product-specs')
        .download(fileName);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName}-spec-sheet.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: `Downloading ${productName} spec sheet.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download spec sheet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-24 bg-fresh-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Product Specifications
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Detailed technical specifications, nutritional information, and downloadable spec sheets for all our products.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {productSpecs.map((product, index) => (
            <Card key={index} className="border-0 shadow-card bg-background">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground mb-2">{product.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      product.specifications.certification === 'ACIR Certified' 
                        ? 'border-afresh-green text-afresh-green' 
                        : 'border-primary text-primary'
                    }`}
                  >
                    {product.specifications.certification}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Physical Specifications */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <Scale className="w-4 h-4 mr-2 text-afresh-green" />
                    Physical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <p className="font-medium text-foreground">{product.specifications.size}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Color:</span>
                      <p className="font-medium text-foreground">{product.specifications.color}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Texture:</span>
                      <p className="font-medium text-foreground">{product.specifications.texture}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Packaging:</span>
                      <p className="font-medium text-foreground">{product.specifications.packaging}</p>
                    </div>
                  </div>
                </div>

                {/* Storage Information */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <Thermometer className="w-4 h-4 mr-2 text-afresh-green" />
                    Storage & Shelf Life
                  </h4>
                  <p className="text-sm text-foreground font-medium">
                    {product.specifications.shelfLife}
                  </p>
                </div>

                {/* Nutritional Information */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Nutritional Highlights (per 100g)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(product.nutritional).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace('_', ' ')}:
                        </span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download and Upload Buttons */}
                <div className="pt-4 border-t border-border space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary hover:text-primary-foreground group"
                    onClick={() => handleDownload(product.id, product.name)}
                    disabled={!specFiles[product.id]}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {specFiles[product.id] ? 'Download Spec Sheet' : 'No Spec Sheet Available'}
                    <Download className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
                  </Button>

                  {/* Upload Dialog for Admin */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Spec Sheet
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Spec Sheet - {product.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`spec-file-${product.id}`}>PDF File</Label>
                          <Input
                            id={`spec-file-${product.id}`}
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(product.id, file);
                              }
                            }}
                            disabled={uploadingFile === product.id}
                          />
                        </div>
                        {uploadingFile === product.id && (
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Need custom specifications or have specific requirements?
          </p>
          <Button size="lg" className="bg-gradient-fresh hover:bg-primary-hover">
            Contact Our Technical Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSpecs;