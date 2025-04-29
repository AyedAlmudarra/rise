import React, { useState, useEffect } from 'react';
import OutlineCard from "@/components/shared/OutlineCard";
import { Button, Label, TextInput } from "flowbite-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const GeneralSettingsTab = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setFullName(user.user_metadata?.full_name || '');
    }
  }, [user]);

  const handleUpdateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setDetailsLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      phone: phone,
      data: { 
        full_name: fullName,
      },
    });

    if (error) {
      toast.error(`Error updating details: ${error.message}`);
    } else {
      toast.success('Details updated successfully!');
    }
    setDetailsLoading(false);
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-1">
          <OutlineCard>
            <h5 className="card-title">General Details</h5>
            <p className="card-subtitle -mt-1">
              Update your name and contact information.
            </p>
            <form onSubmit={handleUpdateDetails} className="mt-3">
              <div className="flex flex-col gap-y-4">
                <div>
                    <Label htmlFor="fullName" value="Full Name" className="mb-2 block" />
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
                <div>
                    <Label htmlFor="ph" value="Phone" className="mb-2 block"/>
                    <TextInput
                      id="ph"
                      type="tel"
                      sizing="md"
                      placeholder="+1 123 456 7890" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                    />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" color={"primary"} isProcessing={detailsLoading} disabled={detailsLoading}>
                  Save Details
                </Button>
              </div>
            </form>
          </OutlineCard>
        </div>
        
        <div className="col-span-1 md:col-span-1">
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
