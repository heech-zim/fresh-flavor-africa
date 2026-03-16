import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sprout, Upload, CheckCircle, ArrowRight, ArrowLeft, X } from 'lucide-react';

const PROVINCES = ['Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands'];
const CROP_OPTIONS = ['Fine Beans', 'Sugar Snap Peas', 'Mange Tout', 'Baby Corn', 'Okra', 'Butternut Squash', 'Sweet Potatoes', 'Passion Fruit', 'Birds Eye Chilli', 'Collard Greens'];

const FarmerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [farmName, setFarmName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [currentCrops, setCurrentCrops] = useState<string[]>([]);
  const [globalGapCertified, setGlobalGapCertified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<{ type: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/farmer/login'); return; }
      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profile) {
        setFarmerId(profile.id);
        if (profile.onboarding_completed) { navigate('/farmer/dashboard'); return; }
        if (profile.farm_name) setFarmName(profile.farm_name);
        if (profile.phone) setPhone(profile.phone);
        if (profile.location) setLocation(profile.location);
        if (profile.province) setProvince(profile.province);
        if (profile.farm_size) setFarmSize(profile.farm_size);
        if (profile.experience_level) setExperienceLevel(profile.experience_level);
        if (profile.current_crops) setCurrentCrops(profile.current_crops);
        setGlobalGapCertified(profile.globalg_ap_certified ?? false);
      }
    };
    init();
  }, [navigate]);

  const toggleCrop = (crop: string) => {
    setCurrentCrops(prev => prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !farmerId) return;

    setUploading(true);
    const filePath = `${userId}/${docType}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('farmer-documents').upload(filePath, file);

    if (error) {
      toast({ title: 'Upload failed: ' + error.message, variant: 'destructive' });
    } else {
      await supabase.from('farmer_documents').insert({
        farmer_id: farmerId,
        document_type: docType,
        file_url: filePath,
        status: 'pending',
      });
      setDocuments(prev => [...prev, { type: docType, name: file.name }]);
      toast({ title: `${docType} uploaded successfully` });
    }
    setUploading(false);
  };

  const handleSaveStep1 = async () => {
    if (!farmName.trim() || !location.trim() || !province) {
      toast({ title: 'Please fill farm name, location, and province', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('farmer_profiles')
      .update({
        farm_name: farmName, phone, location, province,
        farm_size: farmSize, experience_level: experienceLevel,
        current_crops: currentCrops, globalg_ap_certified: globalGapCertified,
      })
      .eq('user_id', userId!);

    if (error) {
      toast({ title: 'Failed to save: ' + error.message, variant: 'destructive' });
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('farmer_profiles')
      .update({ onboarding_completed: true })
      .eq('user_id', userId!);

    if (error) {
      toast({ title: 'Failed to complete: ' + error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Onboarding complete! Welcome to Afreshia.' });
      navigate('/farmer/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sprout className="h-5 w-5 text-primary" /> Farm Details</CardTitle>
              <CardDescription>Tell us about your farm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Farm Name *</Label>
                  <Input value={farmName} onChange={e => setFarmName(e.target.value)} placeholder="e.g. Green Valley Farm" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263..." />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mazowe" />
                </div>
                <div className="space-y-2">
                  <Label>Province *</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Farm Size</Label>
                  <Input value={farmSize} onChange={e => setFarmSize(e.target.value)} placeholder="e.g. 50 hectares" />
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (3-7 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current/Planned Crops</Label>
                <div className="flex flex-wrap gap-2">
                  {CROP_OPTIONS.map(crop => (
                    <Badge
                      key={crop}
                      variant={currentCrops.includes(crop) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleCrop(crop)}
                    >
                      {crop} {currentCrops.includes(crop) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox checked={globalGapCertified} onCheckedChange={(v) => setGlobalGapCertified(!!v)} />
                <Label>GLOBALG.A.P. Certified</Label>
              </div>

              <Button onClick={handleSaveStep1} className="w-full bg-gradient-fresh" disabled={loading}>
                {loading ? 'Saving...' : 'Next: Upload Documents'} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /> Documents</CardTitle>
              <CardDescription>Upload your certifications and identification (optional, can be done later)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['ID Document', 'Land Title', 'GLOBALG.A.P. Certificate', 'Other Certification'].map(docType => (
                <div key={docType} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-sm font-medium">{docType}</span>
                  {documents.find(d => d.type === docType) ? (
                    <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" /> Uploaded</Badge>
                  ) : (
                    <Label className="cursor-pointer">
                      <Input type="file" className="hidden" onChange={e => handleFileUpload(e, docType)} disabled={uploading} accept=".pdf,.jpg,.jpeg,.png" />
                      <Badge variant="outline" className="cursor-pointer">{uploading ? 'Uploading...' : 'Upload'}</Badge>
                    </Label>
                  )}
                </div>
              ))}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-fresh">
                  Next: Review <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Review & Complete</CardTitle>
              <CardDescription>Review your information before completing setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Farm:</span> <span className="font-medium">{farmName}</span></div>
                <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{location}, {province}</span></div>
                <div><span className="text-muted-foreground">Size:</span> <span className="font-medium">{farmSize || 'Not specified'}</span></div>
                <div><span className="text-muted-foreground">Experience:</span> <span className="font-medium">{experienceLevel || 'Not specified'}</span></div>
                <div><span className="text-muted-foreground">GLOBALG.A.P.:</span> <span className="font-medium">{globalGapCertified ? 'Yes' : 'No'}</span></div>
                <div><span className="text-muted-foreground">Documents:</span> <span className="font-medium">{documents.length} uploaded</span></div>
              </div>
              {currentCrops.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Crops:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentCrops.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={handleCompleteOnboarding} className="flex-1 bg-gradient-fresh" disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Setup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FarmerOnboarding;
