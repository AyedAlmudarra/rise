import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Alert, Avatar, Badge } from 'flowbite-react';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile, InvestorProfile } from '../../types/database';
import { HiOutlineOfficeBuilding, HiOutlineUserCircle, HiOutlineLink, HiOutlineLocationMarker, HiBriefcase, HiCheckCircle } from 'react-icons/hi';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

type ProfileData = (Partial<StartupProfile> & { role: 'startup' }) | (Partial<InvestorProfile> & { role: 'investor' }) | { role: 'unknown' };

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userId }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !isOpen) {
        setProfileData(null); // Clear data when modal is closed or no userId
        return;
      }

      setLoading(true);
      setError(null);
      setProfileData(null);

      try {
        // Attempt to fetch investor profile
        const { data: investorData, error: investorError } = await supabase
          .from('investors')
          .select('*') // Select all for modal display
          .eq('user_id', userId)
          .maybeSingle(); // Use maybeSingle as user might not be an investor

        if (investorError && investorError.code !== 'PGRST116') { // Ignore 'Exact one row not found' error
          console.error('Error fetching investor profile:', investorError);
          // Decide if we should throw or try fetching startup profile anyway
        }

        if (investorData) {
          setProfileData({ ...investorData, role: 'investor' });
          setLoading(false);
          return; // Found investor profile, no need to check startup
        }

        // If not found as investor, attempt to fetch startup profile
        const { data: startupData, error: startupError } = await supabase
          .from('startups')
          .select('*') // Select all for modal display
          .eq('user_id', userId)
          .maybeSingle();

        if (startupError && startupError.code !== 'PGRST116') {
           console.error('Error fetching startup profile:', startupError);
           // Decide if we should throw here or just show error
        }

        if (startupData) {
          setProfileData({ ...startupData, role: 'startup' });
        } else if (!investorData) {
            // Neither profile found
            setError('User profile not found.');
            setProfileData({ role: 'unknown' });
        }

      } catch (err: any) {
        console.error('Unexpected error fetching profile:', err);
        setError(err.message || 'Failed to load profile.');
        setProfileData({ role: 'unknown' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOpen]); // Re-fetch when userId changes or modal opens

  const renderProfileDetails = () => {
    if (!profileData || profileData.role === 'unknown') return null;

    const { role } = profileData;
    const displayName = role === 'investor' ? profileData.full_name : profileData.name;
    const avatarUrl = role === 'startup' ? profileData.logo_url : undefined; // Assuming investors don't have specific avatar field here
    const initials = displayName?.[0]?.toUpperCase() || '?';

    return (
      <>
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            img={avatarUrl || undefined} // Use specific avatar if available
            placeholderInitials={initials}
            rounded
            size="lg" // Larger avatar in modal
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{displayName}</h3>
            {role === 'investor' && profileData.job_title && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.job_title}</p>
            )}
             {role === 'startup' && profileData.sector && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.sector}</p>
            )}
             <Badge color={role === 'investor' ? 'info' : 'success'} size="sm" className="mt-1 inline-flex items-center gap-1">
                 {role === 'investor' ? <HiOutlineUserCircle className="h-3 w-3"/> : <HiOutlineOfficeBuilding className="h-3 w-3"/>}
                 {role.charAt(0).toUpperCase() + role.slice(1)}
             </Badge>
          </div>
        </div>

        {/* Added hr for separation */}
        <hr className="my-4 border-gray-200 dark:border-gray-600" />

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          {/* Common Fields */}
          {role === 'investor' && profileData.company_name && (
             <div className="flex items-center gap-2">
                <HiOutlineOfficeBuilding className="h-4 w-4 text-gray-400" />
                <span>Works at <strong>{profileData.company_name}</strong></span>
             </div>
          )}
          {role === 'startup' && profileData.operational_stage && (
             <div className="flex items-center gap-2">
                <HiCheckCircle className="h-4 w-4 text-gray-400" />
                <span>Operational Stage: <strong>{profileData.operational_stage}</strong></span>
             </div>
          )}
          {role === 'startup' && profileData.location_city && (
             <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="h-4 w-4 text-gray-400" />
                <span>Location: <strong>{profileData.location_city}</strong></span>
             </div>
          )}

          {/* Description */}
          {profileData.company_description && (
             <div className="mt-4"> {/* Added margin-top */}
                 <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">About {role === 'startup' ? 'the Company' : profileData.company_name || 'Them'}</h4>
                 <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">{profileData.company_description}</p>
             </div>
          )}

           {/* Investor Specific Preferences */}
           {role === 'investor' && (profileData.preferred_industries?.length || profileData.preferred_geography?.length || profileData.preferred_stage?.length) && (
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-600"> {/* Added border-top and margin */}
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Investment Focus</h4>
                    <div className="space-y-1.5">
                        {profileData.preferred_industries && profileData.preferred_industries.length > 0 && (
                            <div className="flex items-start gap-2">
                                <HiBriefcase className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div><strong>Industries:</strong> {profileData.preferred_industries.join(', ')}</div>
                            </div>
                        )}
                         {profileData.preferred_geography && profileData.preferred_geography.length > 0 && (
                            <div className="flex items-start gap-2">
                                <HiOutlineLocationMarker className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div><strong>Geography:</strong> {profileData.preferred_geography.join(', ')}</div>
                            </div>
                        )}
                         {profileData.preferred_stage && profileData.preferred_stage.length > 0 && (
                            <div className="flex items-start gap-2">
                                <HiCheckCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div><strong>Stage:</strong> {profileData.preferred_stage.join(', ')}</div>
                            </div>
                        )}
                    </div>
                </div>
           )}

           {/* Links */}
           {(profileData.website || profileData.linkedin_profile) && (
               <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-600"> {/* Changed pt-2 to pt-4 and added margin */}
                   <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Links</h4>
                   <div className="flex flex-wrap gap-4">
                      {profileData.website && (
                        <a href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-500">
                          <HiOutlineLink className="h-4 w-4" /> Website
                        </a>
                      )}
                      {profileData.linkedin_profile && (
                        <a href={profileData.linkedin_profile.startsWith('http') ? profileData.linkedin_profile : `https://${profileData.linkedin_profile}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-500">
                          <HiOutlineLink className="h-4 w-4" /> LinkedIn
                        </a>
                      )}
                   </div>
               </div>
           )}
        </div>
      </>
    );
  };


  return (
    <Modal show={isOpen} onClose={onClose} size="lg"> {/* Increased size */}
      <Modal.Header>
        User Profile
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-10">
            <Spinner size="lg" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        )}
        {error && !loading && (
          <Alert color="failure">{error}</Alert>
        )}
        {!loading && !error && profileData && (
            renderProfileDetails()
        )}
         {!loading && !error && !profileData && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-5">No user selected or profile data available.</p>
         )}
      </Modal.Body>
      <Modal.Footer>
         <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Close
          </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfileModal; 