import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface FarmerAuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const FarmerAuthGuard = ({ children, requireOnboarding = true }: FarmerAuthGuardProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/farmer/login');
        return;
      }

      // Check farmer role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'farmer')
        .maybeSingle();

      if (!roleData) {
        navigate('/farmer/login');
        return;
      }

      if (requireOnboarding) {
        // Check onboarding status
        const { data: profile } = await supabase
          .from('farmer_profiles')
          .select('onboarding_completed')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!profile?.onboarding_completed) {
          navigate('/farmer/onboarding');
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate, requireOnboarding]);

  if (loading && !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default FarmerAuthGuard;
