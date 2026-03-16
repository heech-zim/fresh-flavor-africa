import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import FarmerAuthGuard from '@/components/FarmerAuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Sprout, Package, DollarSign, Truck, Plus, LogOut, LayoutDashboard, User } from 'lucide-react';

const FarmerDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [showAddListing, setShowAddListing] = useState(false);
  const [newListing, setNewListing] = useState({ product_name: '', category: '', quantity: '', unit: 'kg', price_per_unit: '', harvest_date: '', available_from: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // Realtime subscriptions
    const listingsChannel = supabase
      .channel('farmer-listings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farmer_produce_listings' }, () => loadListings())
      .subscribe();

    const paymentsChannel = supabase
      .channel('farmer-payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farmer_payments' }, () => loadPayments())
      .subscribe();

    return () => { supabase.removeChannel(listingsChannel); supabase.removeChannel(paymentsChannel); };
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: p } = await supabase.from('farmer_profiles').select('*').eq('user_id', session.user.id).maybeSingle();
    setProfile(p);
    if (p) {
      loadListings(p.id);
      loadPayments(p.id);
    }
    // Load shipments (public read)
    const { data: s } = await supabase.from('shipments').select('*').order('created_at', { ascending: false }).limit(20);
    setShipments(s || []);
  };

  const loadListings = async (fid?: string) => {
    const farmerId = fid || profile?.id;
    if (!farmerId) return;
    const { data } = await supabase.from('farmer_produce_listings').select('*').eq('farmer_id', farmerId).order('created_at', { ascending: false });
    setListings(data || []);
  };

  const loadPayments = async (fid?: string) => {
    const farmerId = fid || profile?.id;
    if (!farmerId) return;
    const { data } = await supabase.from('farmer_payments').select('*').eq('farmer_id', farmerId).order('created_at', { ascending: false });
    setPayments(data || []);
  };

  const handleAddListing = async () => {
    if (!profile || !newListing.product_name || !newListing.category || !newListing.quantity) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('farmer_produce_listings').insert({
      farmer_id: profile.id,
      product_name: newListing.product_name,
      category: newListing.category,
      quantity: parseFloat(newListing.quantity),
      unit: newListing.unit,
      price_per_unit: newListing.price_per_unit ? parseFloat(newListing.price_per_unit) : null,
      harvest_date: newListing.harvest_date || null,
      available_from: newListing.available_from || null,
    });
    if (error) {
      toast({ title: 'Failed: ' + error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Listing added!' });
      setShowAddListing(false);
      setNewListing({ product_name: '', category: '', quantity: '', unit: 'kg', price_per_unit: '', harvest_date: '', available_from: '' });
      loadListings();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/farmer/login');
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = { available: 'default', sold: 'secondary', reserved: 'outline', completed: 'default', pending: 'secondary', failed: 'destructive' };
    return (map[s] || 'outline') as any;
  };

  const totalEarned = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <FarmerAuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Farmer Dashboard</span>
              {profile && <Badge variant="outline">{profile.farm_name}</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview"><LayoutDashboard className="h-4 w-4 mr-1" /> Overview</TabsTrigger>
              <TabsTrigger value="listings"><Package className="h-4 w-4 mr-1" /> Listings</TabsTrigger>
              <TabsTrigger value="payments"><DollarSign className="h-4 w-4 mr-1" /> Payments</TabsTrigger>
              <TabsTrigger value="shipments"><Truck className="h-4 w-4 mr-1" /> Shipments</TabsTrigger>
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{listings.length}</div><p className="text-sm text-muted-foreground">Total Listings</p></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{listings.filter(l => l.status === 'available').length}</div><p className="text-sm text-muted-foreground">Available</p></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div><p className="text-sm text-muted-foreground">Total Earned</p></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{payments.filter(p => p.status === 'pending').length}</div><p className="text-sm text-muted-foreground">Pending Payments</p></CardContent></Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Recent Listings</CardTitle></CardHeader>
                <CardContent>
                  {listings.slice(0, 5).map(l => (
                    <div key={l.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <div><span className="font-medium">{l.product_name}</span> <span className="text-muted-foreground text-sm">— {l.quantity} {l.unit}</span></div>
                      <Badge variant={statusColor(l.status)}>{l.status}</Badge>
                    </div>
                  ))}
                  {listings.length === 0 && <p className="text-muted-foreground text-sm">No listings yet. Add your first produce listing!</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Listings */}
            <TabsContent value="listings">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Produce Listings</h2>
                <Dialog open={showAddListing} onOpenChange={setShowAddListing}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-fresh"><Plus className="h-4 w-4 mr-2" /> Add Listing</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Produce Listing</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1"><Label>Product Name *</Label><Input value={newListing.product_name} onChange={e => setNewListing(p => ({ ...p, product_name: e.target.value }))} /></div>
                      <div className="space-y-1">
                        <Label>Category *</Label>
                        <Select value={newListing.category} onValueChange={v => setNewListing(p => ({ ...p, category: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {['Vegetables', 'Fruits', 'Herbs', 'Legumes'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1"><Label>Quantity *</Label><Input type="number" value={newListing.quantity} onChange={e => setNewListing(p => ({ ...p, quantity: e.target.value }))} /></div>
                        <div className="space-y-1">
                          <Label>Unit</Label>
                          <Select value={newListing.unit} onValueChange={v => setNewListing(p => ({ ...p, unit: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['kg', 'tonnes', 'crates', 'bundles'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1"><Label>Price per Unit (USD)</Label><Input type="number" value={newListing.price_per_unit} onChange={e => setNewListing(p => ({ ...p, price_per_unit: e.target.value }))} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1"><Label>Harvest Date</Label><Input type="date" value={newListing.harvest_date} onChange={e => setNewListing(p => ({ ...p, harvest_date: e.target.value }))} /></div>
                        <div className="space-y-1"><Label>Available From</Label><Input type="date" value={newListing.available_from} onChange={e => setNewListing(p => ({ ...p, available_from: e.target.value }))} /></div>
                      </div>
                      <Button onClick={handleAddListing} className="w-full bg-gradient-fresh" disabled={loading}>{loading ? 'Adding...' : 'Add Listing'}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Quantity</TableHead><TableHead>Price/Unit</TableHead><TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map(l => (
                        <TableRow key={l.id}>
                          <TableCell className="font-medium">{l.product_name}</TableCell>
                          <TableCell>{l.category}</TableCell>
                          <TableCell>{l.quantity} {l.unit}</TableCell>
                          <TableCell>{l.price_per_unit ? `$${l.price_per_unit}` : '—'}</TableCell>
                          <TableCell><Badge variant={statusColor(l.status)}>{l.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {listings.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No listings yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments */}
            <TabsContent value="payments">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Payment History</h2>
                <p className="text-muted-foreground text-sm">Total earned: <span className="font-bold text-foreground">${totalEarned.toFixed(2)}</span></p>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Reference</TableHead><TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map(p => (
                        <TableRow key={p.id}>
                          <TableCell>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>{p.description || '—'}</TableCell>
                          <TableCell className="font-medium">${Number(p.amount).toFixed(2)} {p.currency}</TableCell>
                          <TableCell className="text-xs font-mono">{p.reference_number || '—'}</TableCell>
                          <TableCell><Badge variant={statusColor(p.status)}>{p.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {payments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No payments yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipments */}
            <TabsContent value="shipments">
              <h2 className="text-xl font-bold mb-4">Shipment Tracking</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead><TableHead>Product</TableHead><TableHead>Origin → Destination</TableHead><TableHead>Status</TableHead><TableHead>Blockchain</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono text-xs">{s.tracking_number}</TableCell>
                          <TableCell>{s.product_name}</TableCell>
                          <TableCell className="text-sm">{s.origin_location} → {s.destination_location}</TableCell>
                          <TableCell><Badge variant={statusColor(s.current_status)}>{s.current_status}</Badge></TableCell>
                          <TableCell>{s.vechain_tx_id ? <Badge variant="outline" className="text-xs">Verified</Badge> : '—'}</TableCell>
                        </TableRow>
                      ))}
                      {shipments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No shipments yet</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile">
              <h2 className="text-xl font-bold mb-4">Farm Profile</h2>
              {profile && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Farm Name:</span> <span className="font-medium">{profile.farm_name}</span></div>
                      <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{profile.phone || '—'}</span></div>
                      <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{profile.location}, {profile.province}</span></div>
                      <div><span className="text-muted-foreground">Farm Size:</span> <span className="font-medium">{profile.farm_size || '—'}</span></div>
                      <div><span className="text-muted-foreground">Experience:</span> <span className="font-medium">{profile.experience_level || '—'}</span></div>
                      <div><span className="text-muted-foreground">GLOBALG.A.P.:</span> <span className="font-medium">{profile.globalg_ap_certified ? 'Certified' : 'Not certified'}</span></div>
                    </div>
                    {profile.current_crops?.length > 0 && (
                      <div className="mt-4">
                        <span className="text-sm text-muted-foreground">Crops:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.current_crops.map((c: string) => <Badge key={c} variant="secondary">{c}</Badge>)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </FarmerAuthGuard>
  );
};

export default FarmerDashboard;
