import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Alert, Avatar, Badge, Button } from 'flowbite-react';
import { supabase } from '@/lib/supabaseClient';
import { StartupProfile, InvestorProfile } from '@/types/database'; // Assuming these types exist
import {
    HiUserCircle,
    HiOutlineBriefcase,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineGlobeAlt,
    HiOutlineLink,
    HiExternalLink
} from 'react-icons/hi';

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  profileRole: 'startup' | 'investor' | null;
}

type ProfileData = Partial<StartupProfile & InvestorProfile>;

// Define InfoItem locally for this component
const InfoItem: React.FC<{ label: string; value: React.ReactNode | string | null; icon?: React.ReactNode, link?: string }> = ({ label, value, icon, link }) => (
  value ? (
      <div className="flex items-start py-1.5">
          {icon && <span className="text-gray-400 mr-2 mt-0.5 flex-shrink-0">{icon}</span>}
          <div className="flex-grow">
            <span className="font-medium text-gray-500 dark:text-gray-400 mr-2">{label}:</span>
             {link ? (
                 <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center">
                     {value} <HiExternalLink className="ml-1 h-4 w-4 flex-shrink-0" />
                 </a>
             ) : (
                 <span className="text-gray-800 dark:text-gray-200 text-right">{value}</span>
             )}
          </div>
      </div>
  ) : null
);

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  isOpen,
  onClose,
  userId,
  profileRole,
}) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isOpen || !userId || !profileRole) {
        setProfileData(null); // Clear data if modal is closed or info missing
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setProfileData(null); // Clear previous data

      const tableName = profileRole === 'startup' ? 'startups' : 'investors';
      // Update selected columns to include more details
      const selectColumns = profileRole === 'startup'
        ? 'name, industry, sector, operational_stage, location_city, description, logo_url, website, team_size'
        : 'full_name, job_title, company_name, investor_type, company_description, website, linkedin_profile, preferred_industries, preferred_geography, preferred_stage';

      try {
        const { data, error: fetchError } = await supabase
          .from(tableName)
          .select(selectColumns)
          .eq('user_id', userId)
          .single();

        if (fetchError) {
          // Handle profile not found specifically
          if (fetchError.code === 'PGRST116') {
             setError(`${profileRole === 'startup' ? 'Startup' : 'Investor'} profile not found.`);
          } else {
             throw fetchError; // Throw other errors
          }
           setProfileData(null);
        } else {
          setProfileData(data as ProfileData);
        }
      } catch (err: any) {
        console.error(`Error fetching ${profileRole} profile preview:`, err);
        setError(`Failed to load profile: ${err.message}`);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, userId, profileRole]); // Refetch when these change

  // --- Helper to render profile content ---
  const renderProfileContent = () => {
    if (loading) {
      return <div className="text-center p-10"><Spinner size="lg" /></div>;
    }
    if (error) {
      return <Alert color="failure" className="m-4">{error}</Alert>;
    }
    if (!profileData) {
       return <p className="p-4 text-center text-gray-500">No profile data available.</p>;
    }

    // --- UI Adaptation based on role ---
    if (profileRole === 'startup') {
        const { name, industry, sector, operational_stage, location_city, description, logo_url, website, team_size } = profileData;
        return (
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Avatar img={logo_url || undefined} placeholderInitials={name?.[0] || 'S'} rounded size="lg" />
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name || 'Startup Name'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{industry || 'Industry N/A'}</p>
                         {operational_stage && <Badge color="success" size="xs" className="mt-1 inline-block" icon={HiOutlineCalendar}>{operational_stage}</Badge>}
                         {location_city && <Badge color="cyan" size="xs" className="mt-1 ml-1 inline-block" icon={HiOutlineLocationMarker}>{location_city}</Badge>}
                    </div>
                </div>

                <InfoItem label="Sector" value={sector} icon={<HiOutlineBriefcase size={16}/>} />
                <InfoItem label="Team Size" value={team_size?.toString()} icon={<HiUserCircle size={16}/>} />
                <InfoItem label="Website" value={website} link={website || undefined} icon={<HiOutlineLink size={16}/>} />

                <div className="pt-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Description</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {description || 'No description provided.'}
                    </p>
                </div>
            </div>
        );
    } else if (profileRole === 'investor') {
        const { full_name, job_title, company_name, investor_type, company_description, website, linkedin_profile } = profileData;
        return (
            <div className="p-4 space-y-4">
                 <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Avatar placeholderInitials={full_name?.[0] || 'I'} rounded size="lg" />
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{full_name || 'Investor Name'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {job_title || 'Job Title'}
                            {company_name ? ` at ${company_name}` : ''}
                        </p>
                        {investor_type && <Badge color="purple" size="xs" className="mt-1 inline-block" icon={HiUserCircle}>{investor_type} Investor</Badge>}
                    </div>
                </div>

                <InfoItem label="Website" value={website} link={website || undefined} icon={<HiOutlineLink size={16}/>} />
                <InfoItem label="LinkedIn" value={linkedin_profile ? 'View Profile' : null} link={linkedin_profile || undefined} icon={<HiOutlineGlobeAlt size={16}/>} />

                <div className="pt-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">About</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {company_description || 'No company description provided.'}
                    </p>
                </div>


            </div>
        );
    }

    return <p className="p-4 text-center text-gray-500">Could not determine profile type.</p>;
  };


  return (
    <Modal show={isOpen} onClose={onClose} size="lg" popup>
      <Modal.Header className="!p-4 !border-b dark:!border-gray-600"> {/* Added padding and border */}
         Profile Preview
      </Modal.Header>
      <Modal.Body className="pt-0 pb-4 px-0"> {/* Adjust padding */}
          {renderProfileContent()}
      </Modal.Body>
       <Modal.Footer className="!p-3 !border-t-0 justify-end"> {/* Footer styling */} 
         <Button color="light" onClick={onClose} size="sm">
             Close
         </Button>
       </Modal.Footer>
    </Modal>
  );
};

export default ProfilePreviewModal; 