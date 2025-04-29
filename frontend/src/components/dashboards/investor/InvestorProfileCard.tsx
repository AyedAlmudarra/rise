import React, { useState } from 'react';
import { 
  Card, Avatar, Badge, Button, Modal, Tabs,
} from 'flowbite-react';
import { 
  IconMail, IconWorld, 
  IconBrandLinkedin, IconEdit, IconSettings, IconUserCircle
} from '@tabler/icons-react';
import { InvestorProfile } from '@/types/database';

interface InvestorProfileCardProps {
  investorData: InvestorProfile | null;
  isLoading: boolean;
  error: string | null;
  userEmail?: string;
  userName?: string;
}

const InvestorProfileCard: React.FC<InvestorProfileCardProps> = ({ 
  investorData, isLoading, error, userEmail, userName 
}) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="p-4 text-center">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-4 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-3 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-3 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded-full w-1/3 mb-3 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-3 mx-auto"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-4 text-center text-red-500">
          <p className="mb-2 font-medium">Error loading investor profile</p>
          <p className="text-sm">{error}</p>
          {/* TODO: Implement re-fetch logic for investor data */}
          <Button 
            color="light" 
            size="xs" 
            className="mt-2" 
            onClick={() => console.log('TODO: Implement Try Again functionality')}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  // Helper to display array data nicely
  const renderArrayField = (label: string, items: string[] | null | undefined) => {
    if (!items || items.length === 0) {
      return (
        <div className="flex items-start mb-2">
          <span className="font-semibold min-w-[140px] text-gray-700 dark:text-gray-300">{label}:</span>
          <span className="text-gray-500 dark:text-gray-400">N/A</span>
        </div>
      );
    }
    return (
      <div className="flex items-start mb-2">
        <span className="font-semibold min-w-[140px] text-gray-700 dark:text-gray-300">{label}:</span>
        <div className="flex flex-wrap gap-1">
          {items.map((item, index) => (
            <Badge key={index} color="blue" className="text-xs">{item}</Badge>
          ))}
        </div>
      </div>
    );
  };

  const hasWebsite = investorData?.website && investorData.website.trim() !== '';
  const hasLinkedin = investorData?.linkedin_profile && investorData.linkedin_profile.trim() !== '';

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 -mt-6 -mx-4 mb-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xl font-bold text-white">
              Investor Profile
            </h5>
            <Button size="xs" color="light" onClick={() => setShowProfileModal(true)}>
              <IconEdit size={14} className="mr-1" /> Profile
            </Button>
          </div>
        </div>
        
        {/* Profile content */}
        <div className="px-1 py-2">
          {!investorData ? (
            <div className="text-center p-4">
              <Avatar size="lg" rounded className="mb-3 mx-auto border-4 border-gray-100" />
              <p className="mb-2 font-medium">No profile data found</p>
              <p className="text-sm text-gray-500 mb-3">Please complete your investor profile.</p>
              {/* TODO: Implement navigation to profile creation/edit page */}
              <Button 
                size="xs" 
                color="blue" 
                onClick={() => console.log('TODO: Implement Create/Edit Profile navigation')}
              >
                Create Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Avatar and name section */}
              <div className="flex items-center mb-4">
                <Avatar 
                  placeholderInitials={(userName || userEmail || '?')[0].toUpperCase()}
                  alt={investorData.company_name || 'Investor'} 
                  size="lg" 
                  rounded 
                  className="mr-3 border-2 border-gray-100"
                />
                <div>
                  <h6 className="font-bold text-gray-800 dark:text-white">
                    {userName || userEmail?.split('@')[0] || 'Investor'}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {investorData.job_title || 'Investor'} at {investorData.company_name || 'N/A'}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {hasWebsite && (
                      <a 
                        href={investorData.website!.startsWith('http') ? investorData.website! : `https://${investorData.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <IconWorld size={16} />
                      </a>
                    )}
                    {hasLinkedin && (
                      <a 
                        href={investorData.linkedin_profile!} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <IconBrandLinkedin size={16} />
                      </a>
                    )}
                    <a 
                      href={`mailto:${userEmail}`} 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <IconMail size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="my-3 border-gray-200 dark:border-gray-700" />

              {/* Profile Details List */}
              <div className="space-y-2 text-sm">
                {renderArrayField('Preferred Industries', investorData.preferred_industries)}
                {renderArrayField('Preferred Geography', investorData.preferred_geography)}
                {renderArrayField('Preferred Stage', investorData.preferred_stage)}
                
                {investorData.company_description && (
                  <div className="mt-3">
                    <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">About:</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {investorData.company_description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Detailed Profile Modal */}
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
                {/* TODO: Implement Account Settings UI/Form */}
                <p>Account settings will be available here.</p>
                {/* TODO: Implement action for Edit Profile button (e.g., navigate, open form) */}
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