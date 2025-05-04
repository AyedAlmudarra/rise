import React, { useState, useEffect } from 'react';
import OutlineCard from "@/components/shared/OutlineCard";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const GeneralSettingsTab = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (authLoading || !user) {
        setInitialLoading(false);
        return;
      }
      
      setInitialLoading(true);
      let nameToDisplay = user.user_metadata?.full_name || '';

      if (userRole === 'startup') {
        try {
          const { data: startupData, error, status } = await supabase
            .from('startups')
            .select('founder_name')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error && status !== 406) throw error;

          nameToDisplay = startupData?.founder_name || user.user_metadata?.full_name || '';
        } catch (err) {
          console.error("Error fetching startup founder name:", err);
          nameToDisplay = user.user_metadata?.full_name || '';
        }
      }

      setEmail(user.email || '');
      setFullName(nameToDisplay);
      setInitialLoading(false);
    };

    fetchInitialData();
  }, [user, userRole, authLoading]);

  const handleUpdateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setDetailsLoading(true);
    let updateError = null;

    if (userRole !== 'startup') {
        const authUpdatePayload: { data?: any } = {};
        authUpdatePayload.data = { full_name: fullName };
        try {
            const { error } = await supabase.auth.updateUser(authUpdatePayload);
            if (error) throw error;
        } catch (err: any) {
            console.error("Error updating auth user data:", err);
            updateError = `Failed to save name: ${err.message}`;
        }
    }

    if (userRole === 'startup' && !updateError) {
        try {
            const { error: startupError } = await supabase
                .from('startups')
                .update({ founder_name: fullName, updated_at: new Date().toISOString() })
                .eq('user_id', user.id);
            
            if (startupError) throw startupError;
        } catch (err: any) {
             console.error("Error updating startup founder name:", err);
             const startupErrorMessage = `Failed to update founder name: ${err.message}`;
             updateError = updateError ? `${updateError}\n${startupErrorMessage}` : startupErrorMessage;
        }
    }

    setDetailsLoading(false);

    if (updateError) {
        toast.error(updateError);
    } else {
        toast.success('Name updated successfully!');
    }
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !password || password !== confirmPassword) {
        if(password !== confirmPassword) toast.error('Passwords do not match.');
        else toast.error('Please enter a new password.');
      return;
    }
    setPasswordLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(`Error changing password: ${error.message}`);
    } else {
      toast.success('Password changed successfully!');
      setPassword('');
      setConfirmPassword('');
    }
    setPasswordLoading(false);
  };

  if (initialLoading) {
    return (
        <div className="flex justify-center items-center p-10">
             <Spinner size="lg" />
             <span className="ml-3">Loading settings...</span>
        </div>
       );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="lg:col-span-1"> 
          <OutlineCard>
            <h5 className="card-title">Name & Email</h5>
            <p className="card-subtitle -mt-1">
              Update your account.
            </p>
            <form onSubmit={handleUpdateDetails} className="mt-3">
              <div className="flex flex-col gap-y-4">
                <div>
                    <Label htmlFor="fullName" value={userRole === 'startup' ? "Founder Name" : "Full Name"} className="mb-2 block" />
                    <TextInput
                      id="fullName"
                      type="text"
                      sizing="md"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-control"
                      required
                    />
                </div>
                <div>
                    <Label htmlFor="em" value="Email" className="mb-2 block" />
                    <TextInput
                      id="em"
                      type="email"
                      value={email}
                      sizing="md"
                      className="form-control"
                      disabled
                    />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" color={"primary"} isProcessing={detailsLoading} disabled={detailsLoading}>
                  Save
                </Button>
              </div>
            </form>
          </OutlineCard>
        </div>
        
        <div className="lg:col-span-1"> 
          <OutlineCard>
            <h5 className="card-title">Change Password</h5>
            <p className="card-subtitle -mt-1">
              Update your account password.
            </p>
            <form onSubmit={handleChangePassword} className="mt-3">
              <div className="flex flex-col gap-y-4">
                <div>
                  <Label htmlFor="npwd" value="New Password" />
                  <TextInput
                    id="npwd"
                    type="password"
                    sizing="md"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cfpwd" value="Confirm Password" />
                  <TextInput
                    id="cfpwd"
                    type="password"
                    sizing="md"
                    placeholder="Confirm new password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
               </div>
               <div className="flex justify-end mt-6">
                  <Button type="submit" color={"primary"} isProcessing={passwordLoading} disabled={passwordLoading || !password || password !== confirmPassword}>
                    Change Password
                  </Button>
                </div>
            </form>
          </OutlineCard>
        </div>
      </div>
    </>
  );
};

export default GeneralSettingsTab;
