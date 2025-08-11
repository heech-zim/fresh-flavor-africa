import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const navigate = useNavigate();

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

    setContactMessages(contacts || []);
    setQuoteRequests(quotes || []);
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
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Content management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;