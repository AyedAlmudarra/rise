import React, { useState } from 'react';
import { Badge, Button, Progress, Avatar, Modal, Tabs, Tooltip, Card as CardBox } from 'flowbite-react';
import { 
  IconUsers, IconArrowsRightLeft,
  IconClipboard, IconInfoCircle, IconBrandLinkedin, 
  IconWorld, IconCategory, IconChartBar, IconMapPin, IconBuildingStore, 
  IconChartPie, IconCalendarEvent,
  IconBuildingSkyscraper, IconDeviceAnalytics,
  IconDeviceFloppy,
  
} from '@tabler/icons-react';
import { StartupProfile } from '@/types/database';

interface CompanyOverviewCardProps {
  startupData: StartupProfile | null;
  isLoading: boolean;
  error: string | null;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({ startupData, isLoading, error }) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [saved, setSaved] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  if (isLoading) {
    return (
      <CardBox className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-16 w-16"></div>
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
        </div>
      </CardBox>
    );
  }

  if (error) {
    return <CardBox><div className="p-4 text-center text-red-500">Error loading data: {error}</div></CardBox>;
  }

  if (!startupData) {
    return (
      <CardBox>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <IconInfoCircle size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Company overview details are not available.
          </p>
        </div>
      </CardBox>
    );
  }

  const { name, industry, sector, operational_stage, location_city, description, logo_url, website, linkedin_profile } = startupData;

  const logoUrlActual = logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Company')}&background=random&color=fff`;
  
  const safeDescription = description ?? '';
  const descriptionTooLong = safeDescription.length > 120;
  const truncatedDescription = descriptionTooLong && !showMore 
    ? `${safeDescription.substring(0, 120)}...` 
    : safeDescription;

  const requiredFields: (keyof StartupProfile)[] = [
    'name', 'description', 'industry', 'sector', 'location_city', 
    'operational_stage', 'num_employees', 'annual_revenue'
  ];
  
  const filledFields = requiredFields.filter(field => 
    startupData[field]
  );
  
  // TODO: Review and refine profile completion logic based on actual requirements
  const completionPercentage = Math.round((filledFields.length / requiredFields.length) * 100);

  return (
    <>
      <CardBox className="overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute top-2 right-2 z-10">
               {/* TODO: Implement Star Button backend logic and onClick handler */}
               {/* 
               <button 
                 onClick={handleToggleStar} // Add handler here
                 className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
               >
                 <IconStar size={18} className="text-white" />
               </button> 
               */}
            </div>
          </div>
          
          <div className="px-4 pb-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
              <Avatar
                img={logoUrlActual}
                alt={`${name || 'Company'} logo`}
                size="xl"
                rounded
                className="border-4 border-white dark:border-gray-800 shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {name || 'Unnamed Company'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {industry ? `${industry} company` : 'Technology startup'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {/* TODO: Implement Full Profile modal display/logic if needed beyond the basic modal toggle */}
                    <Button size="xs" color="blue" onClick={() => setShowProfileModal(true)}>
                      <IconDeviceAnalytics size={14} className="mr-1" />
                      Full Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {operational_stage && (
                <Badge color="indigo" size="sm" icon={IconBuildingSkyscraper}>
                  {operational_stage}
                </Badge>
              )}
              {sector && (
                <Badge color="purple" size="sm" icon={IconCategory}>
                  {sector}
                </Badge>
              )}
              {location_city && (
                <Badge color="warning" size="sm" icon={IconMapPin}>
                  {location_city}
                </Badge>
              )}
              {/* TODO: Replace hardcoded funding target with dynamic data if available */}
              {/* 
              <Badge color="info" size="sm" icon={IconTargetArrow}>
                 Funding Target: $2.5M 
              </Badge> 
              */}
            </div>
            
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <p>{truncatedDescription || 'No description provided.'}</p>
              {descriptionTooLong && (
                <button 
                  onClick={() => setShowMore(!showMore)} 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium mt-1"
                >
                  {showMore ? 'Show less' : 'Show more'}
                </button>
              )}
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
                {/* TODO: Verify this text or make it dynamic */} 
                Complete your profile to attract more investors
              </div>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconCategory size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Industry:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{industry || 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconChartBar size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Stage:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {operational_stage || 'N/A'}
                  {operational_stage === 'Seed' && (
                    <Badge color="purple" size="xs" className="ml-2">Early</Badge>
                  )}
                  {operational_stage === 'Series A' && (
                    <Badge color="indigo" size="xs" className="ml-2">Growing</Badge>
                  )}
                </span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconMapPin size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Location:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{location_city || 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconBuildingStore size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Sector:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{sector || 'N/A'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
               {/* TODO: Implement Contact button functionality (handler/modal/etc) */}
               {/* 
               <Button size="sm" color="light" className="w-full relative group overflow-hidden" onClick={() => {}}> 
                 <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                 <IconMail size={16} className="mr-1.5" />
                 Contact
               </Button> 
               */}
               {/* Website button - Opens link if available */}
               <Button 
                 size="sm" 
                 color="light" 
                 className="w-full relative group overflow-hidden" 
                 onClick={() => website ? window.open(website.startsWith('http') ? website : `https://${website}`, '_blank') : alert('Website not provided')}
                 disabled={!website}
               >
                 <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                 <IconWorld size={16} className="mr-1.5" />
                 Website
               </Button>
            </div>
            
            {/* Adjust grid, Jobs button removed */} 
            <div className="grid grid-cols-2 gap-2 mt-2"> 
               {/* TODO: Implement Report button functionality */}
               {/* 
               <Button size="xs" color="light" className="w-full" onClick={() => {}}> 
                 <IconFileAnalytics size={14} className="mr-1" />
                 Report
               </Button> 
               */}
               {/* Copy Link button */} 
               <Button size="xs" color="light" className="w-full" onClick={() => {
                 const link = `https://rise.io/company/${startupData.id}`; // Example link
                 navigator.clipboard.writeText(link).then(() => {
                   console.log("Link copied to clipboard (or would be)", link);
                   setSaved(true);
                   setTimeout(() => setSaved(false), 2000);
                 }).catch(err => {
                   console.error('Failed to copy link: ', err);
                   alert('Failed to copy link.');
                 });
               }}>
                 <IconClipboard size={14} className="mr-1" />
                 {saved ? 'Copied!' : 'Copy Link'}
               </Button>
            </div>
            
            <div className="flex justify-center gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
              <Tooltip content="LinkedIn Profile">
                 {/* LinkedIn button - Opens link if available */}
                 <button 
                   onClick={() => linkedin_profile ? window.open(linkedin_profile.startsWith('http') ? linkedin_profile : `https://${linkedin_profile}`, '_blank') : alert('LinkedIn profile not provided')}
                   disabled={!linkedin_profile}
                   className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                 >
                   <IconBrandLinkedin size={20} />
                 </button>
              </Tooltip>
              <Tooltip content="Twitter Profile">
                 {/* TODO: Implement Twitter button functionality (link or action) */}
                 {/* 
                 <button 
                   onClick={() => {}} 
                   className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                 >
                   <IconBrandTwitter size={20} />
                 </button> 
                 */}
              </Tooltip>
              <Tooltip content="Company Website">
                  {/* Website icon button - Opens link if available */}
                  <button 
                    onClick={() => website ? window.open(website.startsWith('http') ? website : `https://${website}`, '_blank') : alert('Website not provided')}
                    disabled={!website}
                    className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 disabled:opacity-50 disabled:hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <IconWorld size={20} />
                  </button>
              </Tooltip>
            </div>
            
            {/* TODO: Implement Premium Upgrade functionality */}
            {/* 
            <div className="mt-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-2 rounded-lg border border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center text-xs text-amber-800 dark:text-amber-300">
                <IconBell size={14} className="mr-1.5 flex-shrink-0" />
                <span>Get <span className="font-semibold">5x more investor views</span> with Premium</span>
                <Button size="xs" color="warning" className="ml-auto" pill onClick={() => {}}>
                  Upgrade
                </Button>
              </div>
            </div> 
            */}
          </div>
        </div>
        
        <Modal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          size="lg"
        >
          <Modal.Header>
            {name || 'Company'} Profile
          </Modal.Header>
          <Modal.Body>
            <Tabs
              aria-label="Company profile tabs" 
              onActiveTabChange={(tab: number) => setActiveTab(tab === 0 ? 'profile' : tab === 1 ? 'insights' : tab === 2 ? 'milestones' : 'share')}
            >
              <Tabs.Item 
                title="Profile Details" 
                icon={IconUsers}
                active={activeTab === 'profile'}
              >
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <Avatar 
                      img={logoUrlActual} 
                      alt={`${name || 'Company'} logo`}
                      size="lg" 
                      rounded
                    />
                    <div className="ml-4">
                      <h5 className="text-lg font-bold">{name || 'Unnamed Company'}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {industry ? `${industry} company` : 'Technology startup'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-semibold mb-2">About</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {description || 'No description available.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-semibold mb-2">Company Details</h6>
                      <ul className="space-y-2 text-sm">
                        <li className="flex">
                          <span className="font-medium w-24">Industry:</span>
                          <span className="text-gray-600 dark:text-gray-400">{industry || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Stage:</span>
                          <span className="text-gray-600 dark:text-gray-400">{operational_stage || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Location:</span>
                          <span className="text-gray-600 dark:text-gray-400">{location_city || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Sector:</span>
                          <span className="text-gray-600 dark:text-gray-400">{sector || 'N/A'}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="text-sm font-semibold mb-2">Business Information</h6>
                      <ul className="space-y-2 text-sm">
                        <li className="flex">
                          <span className="font-medium w-24">Founded:</span>
                          <span className="text-gray-600 dark:text-gray-400">{startupData.founding_date || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Team size:</span>
                          <span className="text-gray-600 dark:text-gray-400">{startupData.num_employees || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Revenue:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {startupData.annual_revenue ? `$${startupData.annual_revenue.toLocaleString()}` : 'N/A'}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Growth rate:</span>
                          <span className="text-green-600 dark:text-green-400">
                             {startupData.kpi_yoy_growth ? `${startupData.kpi_yoy_growth}% YoY` : 'N/A'}
                           </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title="Insights & Analytics" 
                icon={IconChartPie}
                active={activeTab === 'insights'}
              >
                <div className="p-4 text-center text-gray-500">
                  {/* TODO: Implement Insights/Analytics view */}
                   Insights data will be displayed here.
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title="Milestones" 
                icon={IconCalendarEvent}
                active={activeTab === 'milestones'}
              >
                <div className="p-4 text-center text-gray-500">
                  {/* TODO: Implement Milestones view */}
                   Company milestones will be displayed here.
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title="Share & Export" 
                icon={IconArrowsRightLeft}
                active={activeTab === 'share'}
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h6 className="text-sm font-semibold mb-3">Share Profile</h6>
                    <div className="flex items-center space-x-2 mb-4">
                      <input 
                        type="text" 
                        value={`https://rise.io/company/${startupData.id}`}
                        readOnly
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <Button color="blue" onClick={() => {
                        const link = `https://rise.io/company/${startupData.id}`;
                        navigator.clipboard.writeText(link).then(() => {
                          console.log("Link copied to clipboard (or would be)", link);
                          setSaved(true);
                          setTimeout(() => setSaved(false), 2000);
                        }).catch(err => {
                          console.error('Failed to copy link: ', err);
                          alert('Failed to copy link.');
                        });
                      }}>
                        {saved ? (
                          <IconDeviceFloppy size={16} className="mr-2" />
                        ) : (
                          <IconClipboard size={16} className="mr-2" />
                        )}
                        {saved ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    
                    <h6 className="text-sm font-semibold mb-3">Export Options</h6>
                    <div className="grid grid-cols-2 gap-3">
                       {/* TODO: Implement Export as PDF functionality */}
                       {/* 
                       <Button outline gradientDuoTone="purpleToBlue" onClick={() => {}}> 
                         <IconFileAnalytics size={16} className="mr-2" />
                         Export as PDF
                       </Button> 
                       */}
                       {/* TODO: Implement Download Data functionality */}
                       {/* 
                       <Button outline gradientDuoTone="cyanToBlue" onClick={() => {}}> 
                         <IconDownload size={16} className="mr-2" />
                         Download Data
                       </Button> 
                       */}
                    </div>
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowProfileModal(false)}>Close</Button>
             {/* TODO: Implement modal profile view tracking/action */}
             {/* 
             <Button color="blue" onClick={handleTrackView}> 
               View Full Profile
             </Button> 
             */}
          </Modal.Footer>
        </Modal>
      </CardBox>
    </>
  );
};

export { CompanyOverviewCard }; 