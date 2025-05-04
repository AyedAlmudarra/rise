import React, { useState } from 'react';
import { 
  Card as CardBox, Avatar, Badge, Button, Modal, Tabs, Progress, Tooltip
} from 'flowbite-react';
import { 
  IconMail, IconWorld, 
  IconBrandLinkedin, IconSettings, IconUserCircle,
  IconInfoCircle, IconBuildingSkyscraper, IconHierarchy, IconLocation, IconLicense
} from '@tabler/icons-react';
import { InvestorProfile } from '@/types/database';

interface InvestorProfileCardProps {
  investorData: InvestorProfile | null;
  isLoading: boolean;
  error: string | null;
  userEmail?: string;
  userName?: string;
  avatar_url?: string | null;
}

const InvestorProfileCard: React.FC<InvestorProfileCardProps> = ({ 
  investorData, isLoading, error, userEmail, userName, avatar_url
}) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');

  if (isLoading) {
    return (
      <CardBox className="animate-pulse">
        <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
        <div className="px-4 pb-4">
          <div className="-mt-10 mb-4">
            <div className="rounded-full bg-gray-400 dark:bg-gray-700 h-20 w-20 border-4 border-white dark:border-gray-800 mx-auto"></div>
          </div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3 mx-auto"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </CardBox>
    );
  }

  if (error) {
    return <CardBox><div className="p-4 text-center text-red-500">Error loading investor profile: {error}</div></CardBox>;
  }

  if (!investorData) {
    return (
      <CardBox>
        <div className="flex flex-col items-center justify-center h-full text-center py-8">
          <IconUserCircle size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-3">
            Investor profile details are not available.
          </p>
          <Button 
            size="xs" 
            color="blue" 
            onClick={() => console.log('TODO: Implement Create/Edit Profile navigation')}
          >
            Complete Your Profile
          </Button>
        </div>
      </CardBox>
    );
  }

  const { 
    company_name, job_title, website, linkedin_profile, 
    preferred_industries, preferred_stage, preferred_geography,
    company_description
  } = investorData;

  const hasWebsite = website && website.trim() !== '';
  const hasLinkedin = linkedin_profile && linkedin_profile.trim() !== '';

  const requiredFields: (keyof InvestorProfile)[] = [
    'company_name', 'job_title', 'preferred_industries', 
    'preferred_stage', 'preferred_geography'
  ];
  
  const filledFieldsCount = requiredFields.filter(field => {
    const value = investorData[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    } 
    return value !== null && value !== undefined && value !== '';
  }).length;
  const completionPercentage = Math.round((filledFieldsCount / requiredFields.length) * 100);

  const avatarUrlActual = avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName?.[0] || 'I')}&background=random&color=fff`;

  return (
    <>
      <CardBox className="overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800">
        <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 relative">
          <div className="absolute top-3 right-3 z-10">
            <Tooltip content="View Full Profile & Settings">
              <Button 
                size="xs" 
                color="light" 
                className="bg-white/10 hover:bg-white/20 border-0 text-white rounded-full p-1.5 shadow-sm" 
                onClick={() => setShowProfileModal(true)}
              >
                <IconSettings size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="px-4 pb-4 relative">
          <div className="flex flex-col items-center -mt-12 mb-3">
            <Avatar
              img={avatarUrlActual}
              alt={`${userName || 'Investor'} avatar`}
              size="xl"
              rounded
              className="border-4 border-white dark:border-gray-800 shadow-md"
            />
          </div>

          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {userName || userEmail?.split('@')[0] || 'Investor'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job_title || 'Investor'} {company_name ? `at ${company_name}` : ''}
            </p>
            <div className="flex justify-center gap-3 mt-2">
              {hasWebsite && (
                <Tooltip content="Website">
                  <a 
                    href={website!.startsWith('http') ? website! : `https://${website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                  >
                    <IconWorld size={18} />
                  </a>
                </Tooltip>
              )}
              {hasLinkedin && (
                 <Tooltip content="LinkedIn Profile">
                   <a 
                     href={linkedin_profile!.startsWith('http') ? linkedin_profile! : `https://${linkedin_profile}`}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                   >
                     <IconBrandLinkedin size={18} />
                   </a>
                 </Tooltip>
              )}
              {userEmail && (
                 <Tooltip content="Email">
                   <a 
                     href={`mailto:${userEmail}`} 
                     className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                   >
                     <IconMail size={18} />
                   </a>
                 </Tooltip>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Profile completion
              </div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {completionPercentage}%
              </div>
            </div>
            <Progress
              progress={completionPercentage}
              color={completionPercentage < 50 ? 'red' : completionPercentage < 80 ? 'yellow' : 'green'}
              size="sm"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <IconInfoCircle size={12} className="mr-1" />
              A complete profile helps find better startup matches
            </div>
          </div>

          <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
            <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Investment Focus</h6>
            
            <div className="flex items-start">
              <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center min-w-[90px]">
                <IconBuildingSkyscraper size={16} className="mr-2 text-blue-500 flex-shrink-0" />
                Industries:
              </span>
              <div className="ml-2 flex flex-wrap gap-1">
                {preferred_industries && preferred_industries.length > 0 ? (
                  preferred_industries.map((item, index) => (
                    <Badge key={index} color="gray" size="xs">{item}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">N/A</span>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center min-w-[90px]">
                <IconHierarchy size={16} className="mr-2 text-blue-500 flex-shrink-0" />
                Stages:
              </span>
              <div className="ml-2 flex flex-wrap gap-1">
                {preferred_stage && preferred_stage.length > 0 ? (
                  preferred_stage.map((item, index) => (
                    <Badge key={index} color="gray" size="xs">{item}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">N/A</span>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center min-w-[90px]">
                <IconLocation size={16} className="mr-2 text-blue-500 flex-shrink-0" />
                Geography:
              </span>
              <div className="ml-2 flex flex-wrap gap-1">
                {preferred_geography && preferred_geography.length > 0 ? (
                  preferred_geography.map((item, index) => (
                    <Badge key={index} color="gray" size="xs">{item}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">N/A</span>
                )}
              </div>
            </div>

             <div className="flex items-start">
                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center min-w-[90px]">
                  <IconLicense size={16} className="mr-2 text-blue-500 flex-shrink-0" />
                  Fund/Company:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {company_name || 'N/A'}
                 </span>
             </div>
          </div>
          
           {company_description && (
               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">About</h6>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                      {company_description}
                  </p>
               </div>
           )}

        </div>
      </CardBox>

      <Modal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        size="lg"
      >
        <Modal.Header>
          Investor Profile Details
        </Modal.Header>
        <Modal.Body>
          <Tabs
            aria-label="Investor profile tabs" 
            onActiveTabChange={(tab: number) => setActiveTab(tab === 0 ? 'profile' : tab === 1 ? 'settings' : 'preferences')}
          >
            <Tabs.Item 
              title="Profile Information" 
              icon={IconUserCircle}
              active={activeTab === 'profile'}
            >
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Avatar 
                    placeholderInitials={(userName || userEmail || '?')[0].toUpperCase()}
                    alt={investorData?.company_name || 'Investor'} 
                    size="lg" 
                    rounded
                  />
                  <div className="ml-4">
                    <h5 className="text-lg font-bold">
                      {userName || userEmail?.split('@')[0] || 'Investor'}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {investorData?.job_title || 'Investor'} at {investorData?.company_name || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-semibold mb-2">Contact Information</h6>
                  <ul className="space-y-2 text-sm">
                    <li className="flex">
                      <span className="font-medium w-24">Email:</span>
                      <span className="text-gray-600 dark:text-gray-400">{userEmail || 'N/A'}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-24">Website:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {hasWebsite ? (
                          <a 
                            href={investorData!.website!} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {investorData!.website}
                          </a>
                        ) : 'N/A'}
                      </span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-24">LinkedIn:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {hasLinkedin ? (
                          <a 
                            href={investorData!.linkedin_profile!} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Profile Link
                          </a>
                        ) : 'N/A'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h6 className="text-sm font-semibold mb-2">Investment Preferences</h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-xs font-medium text-gray-500 mb-1">Preferred Industries</h6>
                      <div className="flex flex-wrap gap-1">
                        {investorData?.preferred_industries && investorData.preferred_industries.length > 0 ? (
                          investorData.preferred_industries.map((industry, index) => (
                            <Badge key={index} color="blue" className="text-xs">{industry}</Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No preferences set</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-xs font-medium text-gray-500 mb-1">Preferred Geography</h6>
                      <div className="flex flex-wrap gap-1">
                        {investorData?.preferred_geography && investorData.preferred_geography.length > 0 ? (
                          investorData.preferred_geography.map((geo, index) => (
                            <Badge key={index} color="indigo" className="text-xs">{geo}</Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No preferences set</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-xs font-medium text-gray-500 mb-1">Preferred Stages</h6>
                      <div className="flex flex-wrap gap-1">
                        {investorData?.preferred_stage && investorData.preferred_stage.length > 0 ? (
                          investorData.preferred_stage.map((stage, index) => (
                            <Badge key={index} color="purple" className="text-xs">{stage}</Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No preferences set</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {investorData?.company_description && (
                  <div>
                    <h6 className="text-sm font-semibold mb-2">About Company</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {investorData.company_description}
                    </p>
                  </div>
                )}
              </div>
            </Tabs.Item>
            
            <Tabs.Item 
              title="Account Settings" 
              icon={IconSettings}
              active={activeTab === 'settings'}
            >
              <div className="p-4 text-center text-gray-500">
                <p>Account settings will be available here.</p>
                <Button 
                  color="blue" 
                  size="sm" 
                  className="mt-3" 
                  onClick={() => console.log('TODO: Implement Edit Profile action from modal')}
                >
                  Edit Profile
                </Button>
              </div>
            </Tabs.Item>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InvestorProfileCard; 