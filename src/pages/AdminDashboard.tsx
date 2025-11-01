import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { z } from 'zod';

// Validation schemas
const contentSchema = z.object({
  section_key: z.string().trim().min(1, "Section key is required").max(50, "Section key must be less than 50 characters"),
  title: z.string().trim().max(200, "Title must be less than 200 characters").optional().or(z.literal('')),
  content: z.string().trim().max(5000, "Content must be less than 5000 characters").optional().or(z.literal('')),
  image_url: z.string().trim().max(500, "Image URL must be less than 500 characters").optional().or(z.literal('')).refine(
    (val) => !val || val === '' || /^https?:\/\/.+/.test(val),
    "Image URL must be a valid HTTP/HTTPS URL"
  ),
  is_active: z.boolean()
});

const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category must be less than 100 characters"),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional().or(z.literal('')),
  physical_specs: z.string().trim().max(2000, "Physical specs must be less than 2000 characters").optional().or(z.literal('')).refine(
    (val) => {
      if (!val || val === '') return true;
      try { JSON.parse(val); return true; } catch { return false; }
    },
    "Physical specs must be valid JSON format"
  ),
  nutritional_info: z.string().trim().max(2000, "Nutritional info must be less than 2000 characters").optional().or(z.literal('')).refine(
    (val) => {
      if (!val || val === '') return true;
      try { JSON.parse(val); return true; } catch { return false; }
    },
    "Nutritional info must be valid JSON format"
  ),
  certifications: z.string().trim().max(500, "Certifications must be less than 500 characters").optional().or(z.literal('')),
  storage_requirements: z.string().trim().max(500, "Storage requirements must be less than 500 characters").optional().or(z.literal('')),
  is_active: z.boolean()
});

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingSpec, setUploadingSpec] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      section_key: '',
      title: '',
      content: '',
      image_url: '',
      is_active: true
    }
  });

  const productForm = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      physical_specs: '',
      nutritional_info: '',
      certifications: '',
      storage_requirements: '',
      is_active: true
    }
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin/login');
      return;
    }

    setUser(session.user);

    // Check if user is admin
    const { data: roles } = await (supabase as any)
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin');

    if (!roles || roles.length === 0) {
      navigate('/');
      return;
    }

    setIsAdmin(true);
    loadData();
    setLoading(false);
  };

  const loadData = async () => {
    // Load contact messages
    const { data: contacts } = await (supabase as any)
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    // Load quote requests
    const { data: quotes } = await (supabase as any)
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    // Load content items
    const { data: content } = await (supabase as any)
      .from('content_management')
      .select('*')
      .order('created_at', { ascending: false });

    // Load products
    const { data: productData } = await (supabase as any)
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    setContactMessages(contacts || []);
    setQuoteRequests(quotes || []);
    setContentItems(content || []);
    setProducts(productData || []);
  };

  const handleContentSubmit = async (data: any) => {
    try {
      // Validate input data
      const validatedData = contentSchema.parse(data);
      
      if (editingContent) {
        const { error } = await (supabase as any)
          .from('content_management')
          .update(validatedData)
          .eq('id', editingContent.id);
        if (error) throw error;
        toast({ title: "Content updated successfully!" });
      } else {
        const { error } = await (supabase as any)
          .from('content_management')
          .insert([validatedData]);
        if (error) throw error;
        toast({ title: "Content created successfully!" });
      }
      
      setDialogOpen(false);
      setEditingContent(null);
      form.reset();
      loadData();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({ 
          title: "Validation Error", 
          description: firstError.message, 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to save content", 
          variant: "destructive" 
        });
      }
    }
  };

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    form.reset({
      section_key: content.section_key,
      title: content.title || '',
      content: content.content || '',
      image_url: content.image_url || '',
      is_active: content.is_active
    });
    setDialogOpen(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const { error } = await (supabase as any)
        .from('content_management')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Content deleted successfully!" });
      loadData();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete content", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('content_management')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Content status updated!" });
      loadData();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update content status", 
        variant: "destructive" 
      });
    }
  };

  // Product management functions
  const handleProductSubmit = async (data: any) => {
    try {
      // Validate input data
      const validatedData = productSchema.parse(data);
      
      // Parse JSON fields with try-catch for safety (validation already checked format)
      let physicalSpecs = null;
      let nutritionalInfo = null;
      
      if (validatedData.physical_specs && validatedData.physical_specs !== '') {
        try {
          physicalSpecs = JSON.parse(validatedData.physical_specs);
        } catch (e) {
          throw new Error("Invalid JSON format in physical specs");
        }
      }
      
      if (validatedData.nutritional_info && validatedData.nutritional_info !== '') {
        try {
          nutritionalInfo = JSON.parse(validatedData.nutritional_info);
        } catch (e) {
          throw new Error("Invalid JSON format in nutritional info");
        }
      }
      
      const productData = {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description || null,
        physical_specs: physicalSpecs,
        nutritional_info: nutritionalInfo,
        certifications: validatedData.certifications ? validatedData.certifications.split(',').map((cert: string) => cert.trim()).filter(cert => cert.length > 0) : [],
        storage_requirements: validatedData.storage_requirements || null,
        is_active: validatedData.is_active
      };

      if (editingProduct) {
        const { error } = await (supabase as any)
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast({ title: "Product updated successfully!" });
      } else {
        const { error } = await (supabase as any)
          .from('products')
          .insert([productData]);
        if (error) throw error;
        toast({ title: "Product created successfully!" });
      }
      
      setProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
      loadData();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({ 
          title: "Validation Error", 
          description: firstError.message, 
          variant: "destructive" 
        });
      } else if (error instanceof Error) {
        toast({ 
          title: "Error", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to save product", 
          variant: "destructive" 
        });
      }
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      category: product.category,
      description: product.description || '',
      physical_specs: product.physical_specs ? JSON.stringify(product.physical_specs) : '',
      nutritional_info: product.nutritional_info ? JSON.stringify(product.nutritional_info) : '',
      certifications: product.certifications ? product.certifications.join(', ') : '',
      storage_requirements: product.storage_requirements || '',
      is_active: product.is_active
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await (supabase as any)
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Product deleted successfully!" });
      loadData();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete product", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleProductActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Product status updated!" });
      loadData();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update product status", 
        variant: "destructive" 
      });
    }
  };

  const handleSpecSheetUpload = async (productId: string, file: File) => {
    if (!file || file.type !== 'application/pdf') {
      toast({ 
        title: "Error", 
        description: "Please select a PDF file", 
        variant: "destructive" 
      });
      return;
    }

    setUploadingSpec(true);
    try {
      const fileName = `${productId}-spec-sheet.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('product-specs')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await (supabase as any)
        .from('products')
        .update({ spec_sheet_url: fileName })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast({ title: "Spec sheet uploaded successfully!" });
      loadData();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to upload spec sheet", 
        variant: "destructive" 
      });
    } finally {
      setUploadingSpec(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Contact Messages</TabsTrigger>
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages ({contactMessages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactMessages.map((message: any) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{message.name}</h3>
                        <Badge variant={message.status === 'read' ? 'secondary' : 'default'}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.email} • {new Date(message.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm">{message.message}</p>
                      {message.phone && (
                        <p className="text-sm text-muted-foreground mt-1">Phone: {message.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Quote Requests ({quoteRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quoteRequests.map((quote: any) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{quote.company_name}</h3>
                        <Badge variant={quote.status === 'responded' ? 'secondary' : 'default'}>
                          {quote.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Contact:</strong> {quote.contact_name}</p>
                          <p><strong>Email:</strong> {quote.email}</p>
                          <p><strong>Phone:</strong> {quote.phone}</p>
                        </div>
                        <div>
                          <p><strong>Product:</strong> {quote.product_type}</p>
                          <p><strong>Quantity:</strong> {quote.quantity}</p>
                          <p><strong>Delivery:</strong> {quote.delivery_location}</p>
                        </div>
                      </div>
                      {quote.additional_requirements && (
                        <p className="text-sm mt-2">
                          <strong>Requirements:</strong> {quote.additional_requirements}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Content Management ({contentItems.length})</CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingContent(null);
                        form.reset({
                          section_key: '',
                          title: '',
                          content: '',
                          image_url: '',
                          is_active: true
                        });
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Content
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingContent ? 'Edit Content' : 'Add New Content'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleContentSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="section_key"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Section Key</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., hero, about, features" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Content title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Content description" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Active Status</FormLabel>
                                  <div className="text-sm text-muted-foreground">
                                    Make this content visible on the website
                                  </div>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingContent ? 'Update' : 'Create'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.section_key}</TableCell>
                        <TableCell>{item.title || 'No title'}</TableCell>
                        <TableCell>
                          <Badge variant={item.is_active ? 'default' : 'secondary'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                            >
                              {item.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContent(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {contentItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No content items found. Create your first content item above.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management ({products.length})</CardTitle>
                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingProduct(null);
                        productForm.reset({
                          name: '',
                          category: '',
                          description: '',
                          physical_specs: '',
                          nutritional_info: '',
                          certifications: '',
                          storage_requirements: '',
                          is_active: true
                        });
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...productForm}>
                        <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Baby Corn" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={productForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Vegetables" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={productForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Product description" 
                                    className="min-h-[80px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="physical_specs"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Physical Specs (JSON)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder='{"size": "4-6cm", "weight": "15-20g"}' 
                                      className="min-h-[80px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={productForm.control}
                              name="nutritional_info"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nutritional Info (JSON)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder='{"calories": "26 per 100g", "vitamin_c": "High"}' 
                                      className="min-h-[80px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={productForm.control}
                            name="certifications"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certifications (comma-separated)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., GLOBAL GAP, Organic, Fair Trade" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="storage_requirements"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Storage Requirements</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Storage temperature, humidity, etc." 
                                    className="min-h-[60px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="is_active"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Active Status</FormLabel>
                                  <div className="text-sm text-muted-foreground">
                                    Make this product visible on the website
                                  </div>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingProduct ? 'Update' : 'Create'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Spec Sheet</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {product.spec_sheet_url ? (
                              <Badge variant="outline">Available</Badge>
                            ) : (
                              <Badge variant="secondary">None</Badge>
                            )}
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleSpecSheetUpload(product.id, file);
                                }}
                              />
                              <Button variant="ghost" size="sm" disabled={uploadingSpec}>
                                <Upload className="h-4 w-4" />
                              </Button>
                            </label>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(product.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleProductActive(product.id, product.is_active)}
                            >
                              {product.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {products.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No products found. Create your first product above.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;