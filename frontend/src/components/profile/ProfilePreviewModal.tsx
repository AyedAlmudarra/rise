import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Alert, Avatar, Badge, Tooltip, Card as FlowbiteCard } from 'flowbite-react';
import { supabase } from '@/lib/supabaseClient';
import { StartupProfile, InvestorProfile } from '@/types/database';
import { toast } from 'react-hot-toast';
import {
    IconCategory, 
    IconChartBar,
    IconMapPin, 
    IconWorld,
    IconBrandLinkedin,
    IconClipboard,
    IconBuildingSkyscraper,
    IconUsers,
    IconCalendarEvent,
    IconBriefcase,
    IconDeviceFloppy,
    IconFilter
} from '@tabler/icons-react';

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  profileRole: 'startup' | 'investor' | null;
}

// Type for state: Can be one or the other, or null
type ProfileStateData = Partial<StartupProfile> | Partial<InvestorProfile> | null;

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  isOpen,
  onClose,
  userId,
  profileRole,
}) => {
  const [profileData, setProfileData] = useState<ProfileStateData>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isOpen || !userId || !profileRole) {
        setProfileData(null);
        setError(null);
        setLoading(false);
        return;
      }
      
      const currentUserId = userId;
      const currentRole = profileRole;
      if (!currentUserId || !currentRole) return;

      let fetchedData: Partial<StartupProfile> | Partial<InvestorProfile> | null = null;
      let fetchError: any = null;

      setLoading(true);
      setError(null);
      setProfileData(null);

      try {
        if (currentRole === 'startup') {
          const { data, error } = await supabase
            .from('startups')
            .select('id, name, industry, sector, operational_stage, location_city, description, logo_url, website, linkedin_profile, founding_date, num_employees, annual_revenue, kpi_yoy_growth')
            .eq('user_id', currentUserId)
            .single<Partial<StartupProfile>>();
          fetchedData = data;
          fetchError = error;
        } else if (currentRole === 'investor') {
          const { data, error } = await supabase
            .from('investors')
            .select('id, user_id, full_name, job_title, company_name, investor_type, company_description, website, linkedin_profile, preferred_industries, preferred_geography, preferred_stage')
            .eq('user_id', currentUserId)
            .single<Partial<InvestorProfile>>();
          fetchedData = data;
          fetchError = error;
        }

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
             setError(`${currentRole === 'startup' ? 'Startup' : 'Investor'} profile not found.`);
          } else {
             throw fetchError;
          }
        } else if (fetchedData) {
           setProfileData(fetchedData);
        }

      } catch (err: any) {
        console.error(`Error fetching ${currentRole} profile preview:`, err);
        setError(`Failed to load profile: ${err.message}`);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, userId, profileRole]);

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

    if (profileRole === 'startup') {
        const startupData = profileData as StartupProfile;
        const { id, name, industry, sector, operational_stage, location_city, description, logo_url, website, linkedin_profile, founding_date, num_employees } = startupData;
        
        const logoUrlActual = logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Startup')}&background=random&color=fff`;
        const safeDescription = description ?? '';
        
        return (
            <FlowbiteCard className="shadow-none border-0 rounded-none">
                <div className="relative">
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="px-4 pb-4 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
                            <Avatar
                                img={logoUrlActual}
                                alt={`${name || 'Startup'} logo`}
                                size="xl"
                                rounded
                                className="border-4 border-white dark:border-gray-800 shadow-md"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {name || 'Unnamed Startup'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                {industry ? `${industry} company` : 'Startup'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {operational_stage && <Badge color="indigo" size="sm" icon={IconBuildingSkyscraper}>{operational_stage}</Badge>}
                            {sector && <Badge color="purple" size="sm" icon={IconCategory}>{sector}</Badge>}
                            {location_city && <Badge color="warning" size="sm" icon={IconMapPin}>{location_city}</Badge>}
                        </div>

                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">About</h6>
                            <p>{safeDescription || 'No description provided.'}</p>
                        </div>

                        <div className="space-y-2 mb-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                             <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Details</h6>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <IconCalendarEvent size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                                <span className="font-medium w-20">Founded:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">{founding_date || 'N/A'}</span>
                            </div>
                             <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <IconUsers size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                                <span className="font-medium w-20">Team Size:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">{num_employees || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                            {website && (
                                <Tooltip content="Company Website">
                                    <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <IconWorld size={20} />
                                    </a>
                                </Tooltip>
                            )}
                            {linkedin_profile && (
                                <Tooltip content="LinkedIn Profile">
                                    <a href={linkedin_profile.startsWith('http') ? linkedin_profile : `https://${linkedin_profile}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <IconBrandLinkedin size={20} />
                                    </a>
                                </Tooltip>
                            )}
                            <Tooltip content="Copy Profile Link">
                                 <button onClick={() => {
                                     const link = `/app/view/startup/${id}`;
                                     navigator.clipboard.writeText(window.location.origin + link).then(() => {
                                         setSaved(true);
                                         setTimeout(() => setSaved(false), 2000);
                                     }).catch(() => toast.error('Failed to copy link.'));
                                     }}
                                     className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                 >
                                     {saved ? <IconDeviceFloppy size={18} /> : <IconClipboard size={18} />}
                                 </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </FlowbiteCard>
        );
    } else if (profileRole === 'investor') {
        const investorData = profileData as InvestorProfile;
        const { user_id, full_name, job_title, company_name, investor_type, company_description, website, linkedin_profile } = investorData;

        // Define preference arrays outside the return statement
        const industries = investorData.preferred_industries || [];
        const geographies = investorData.preferred_geography || [];
        const stages = investorData.preferred_stage || [];

        // Use initials for placeholder if no specific logo/avatar for investors
        const avatarUrlActual = `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name || 'Investor')}&background=random&color=fff`;

        return (
            <FlowbiteCard className="shadow-none border-0 rounded-none">
                <div className="relative">
                    <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                    <div className="px-4 pb-4 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
                            <Avatar
                                img={avatarUrlActual}
                                alt={`${full_name || 'Investor'} avatar`}
                                size="xl"
                                rounded
                                className="border-4 border-white dark:border-gray-800 shadow-md"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {full_name || 'Investor Name'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {job_title || 'Role N/A'}{company_name ? ` at ${company_name}` : ''}
                                </p>
                    </div>
                </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                           {investor_type && <Badge color="purple" size="sm" icon={IconBriefcase}>{investor_type} Investor</Badge>}
                        </div>

                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                             <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">About / Thesis</h6>
                             <p>{company_description || 'No description provided.'}</p>
                        </div>
                        
                        <div className="space-y-3 mb-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                           <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Preferences</h6>
                           
                           {/* Preferred Industries */}
                           {industries.length > 0 && (
                              <div className="flex items-start">
                                  <IconFilter size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                  <span className="font-medium w-24 flex-shrink-0">Industries:</span>
                                  <div className="ml-2 flex flex-wrap gap-1">
                                    {industries.map(ind => (
                                      <Badge key={ind} color="gray" size="xs">{ind}</Badge>
                                    ))}
                                  </div>
                              </div>
                            )}

                           {/* Preferred Geography */}
                           {geographies.length > 0 && (
                              <div className="flex items-start">
                                  <IconMapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                  <span className="font-medium w-24 flex-shrink-0">Geography:</span>
                                  <div className="ml-2 flex flex-wrap gap-1">
                                    {geographies.map(geo => (
                                      <Badge key={geo} color="gray" size="xs">{geo}</Badge>
                                    ))}
                                  </div>
                              </div>
                            )}

                           {/* Preferred Stage */}
                           {stages.length > 0 && (
                              <div className="flex items-start">
                                  <IconChartBar size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                  <span className="font-medium w-24 flex-shrink-0">Stage:</span>
                                  <div className="ml-2 flex flex-wrap gap-1">
                                    {stages.map(st => (
                                      <Badge key={st} color="gray" size="xs">{st}</Badge>
                                    ))}
                                  </div>
                              </div>
                            )}

                           {/* Show N/A if no preferences are set */}
                           {industries.length === 0 && geographies.length === 0 && stages.length === 0 && (
                              <p className="text-gray-500 dark:text-gray-400 italic text-xs">No specific preferences listed.</p>
                            )
                           }
                        </div>
                        
                        <div className="flex justify-center gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                            {website && (
                                <Tooltip content="Company Website">
                                    <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <IconWorld size={20} />
                                    </a>
                                </Tooltip>
                            )}
                            {linkedin_profile && (
                                <Tooltip content="LinkedIn Profile">
                                    <a href={linkedin_profile.startsWith('http') ? linkedin_profile : `https://linkedin.com/in/${linkedin_profile}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                        <IconBrandLinkedin size={20} />
                                    </a>
                                </Tooltip>
                            )}
                             <Tooltip content="Copy Profile Link">
                                 <button onClick={() => {
                                     const link = `/app/view/investor/${user_id}`;
                                     navigator.clipboard.writeText(window.location.origin + link).then(() => {
                                         setSaved(true);
                                         setTimeout(() => setSaved(false), 2000);
                                     }).catch(() => toast.error('Failed to copy link.'));
                                     }}
                                     className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                 >
                                     {saved ? <IconDeviceFloppy size={18} /> : <IconClipboard size={18} />}
                                 </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </FlowbiteCard>
        );
    }

    return <p className="p-4 text-center text-gray-500">Unsupported profile type.</p>;
  };


  return (
    <Modal show={isOpen} onClose={onClose} size="lg" popup>
      <Modal.Header className="!p-4 !border-b dark:!border-gray-600">
         Profile Preview
      </Modal.Header>
      <Modal.Body className="p-0">
          {renderProfileContent()}
      </Modal.Body>
    </Modal>
  );
};

export default ProfilePreviewModal; 