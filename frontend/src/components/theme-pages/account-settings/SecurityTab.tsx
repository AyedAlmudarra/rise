import { useState, useEffect } from 'react';
import { Button, Spinner, Alert } from "flowbite-react";
import OutlineCard from "@/components/shared/OutlineCard";
import { IconLogout, IconShieldCheck, IconShieldOff } from "@tabler/icons-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const SecurityTab = () => {
  const { session } = useAuth();

  const [isMfaEnabled, setIsMfaEnabled] = useState<boolean | null>(null);
  const [loadingMfaStatus, setLoadingMfaStatus] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    const checkMfaStatus = async () => {
      setLoadingMfaStatus(true);
      if (!session) {
          setIsMfaEnabled(false);
          setLoadingMfaStatus(false);
          return;
      }
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        
        if (error) {
          console.error("Error fetching MFA status:", error);
          setIsMfaEnabled(false); 
        } else if (data) {
          setIsMfaEnabled(data.currentLevel === 'aal2'); 
        }
      } catch (error) {
         console.error("Unexpected error fetching MFA status:", error);
         setIsMfaEnabled(false);
      } finally {
        setLoadingMfaStatus(false);
      }
    };

    checkMfaStatus();
  }, [session]);

  const handleSignOutAll = async () => {
    setSignOutLoading(true);
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    setSignOutLoading(false);

    if (error) {
      toast.error(`Error signing out everywhere: ${error.message}`);
    } else {
      toast.success('Successfully signed out from all devices.');
    }
  };
  
  const handleManageMfa = () => {
      toast('MFA Management page/modal not yet implemented.');
  };

  const handleEnableMfa = () => {
      toast('MFA Setup page/modal not yet implemented.');
  };

  return (
    <>
      <div className="space-y-6">
        <OutlineCard className="shadow-none">
          <h5 className="card-title mb-3">Two-Factor Authentication (2FA)</h5>
          {loadingMfaStatus ? (
            <div className="flex items-center text-gray-500">
              <Spinner size="sm" className="mr-2" />
              <span>Checking 2FA status...</span>
            </div>
          ) : isMfaEnabled === null ? (
             <Alert color="warning">Could not determine 2FA status.</Alert>
          ) : isMfaEnabled ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <IconShieldCheck size={20} />
                <span>Status: Enabled</span>
              </div>
              <Button color="primary" size="sm" onClick={handleManageMfa}>Manage 2FA</Button>
            </div>
          ) : (
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <IconShieldOff size={20} />
                 <span>Status: Disabled</span>
              </div>
              <Button color="primary" size="sm" onClick={handleEnableMfa}>Enable 2FA</Button>
            </div>
          )}
           <p className="card-subtitle mt-3 text-sm">
              Enhance your account security by requiring a second verification step when you sign in.
           </p>
        </OutlineCard>

        <OutlineCard className="shadow-none">
            <h5 className="card-title mb-3">Active Sessions</h5>
             <p className="card-subtitle text-sm mb-4">
               If you suspect unauthorized access or are using a public computer, you can sign out from all other active sessions across all devices.
            </p>
             <Button 
               color={"warning"} 
               onClick={handleSignOutAll}
               isProcessing={signOutLoading}
               disabled={signOutLoading}
             >
              <IconLogout size={18} className="mr-2"/>
               Sign out from all devices
             </Button>
        </OutlineCard>
      </div>
    </>
  );
};

export default SecurityTab;
