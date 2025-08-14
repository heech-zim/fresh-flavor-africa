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
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
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

    setContactMessages(contacts || []);
    setQuoteRequests(quotes || []);
    setContentItems(content || []);
  };

  const handleContentSubmit = async (data: any) => {
    try {
      if (editingContent) {
        const { error } = await (supabase as any)
          .from('content_management')
          .update(data)
          .eq('id', editingContent.id);
        if (error) throw error;
        toast({ title: "Content updated successfully!" });
      } else {
        const { error } = await (supabase as any)
          .from('content_management')
          .insert([data]);
        if (error) throw error;
        toast({ title: "Content created successfully!" });
      }
      
      setDialogOpen(false);
      setEditingContent(null);
      form.reset();
      loadData();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save content", 
        variant: "destructive" 
      });
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Contact Messages</TabsTrigger>
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;