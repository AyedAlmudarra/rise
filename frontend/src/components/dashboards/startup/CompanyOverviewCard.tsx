import React, { useState, useEffect } from 'react';
import { Badge, Button, Progress, Avatar, Modal, Tabs, Tooltip, Card as CardBox } from 'flowbite-react';
import { 
  IconStar, IconStarFilled, IconUsers, IconBriefcase, IconArrowsRightLeft,
  IconFileAnalytics, IconClipboard, IconInfoCircle, IconBrandLinkedin, IconBrandTwitter,
  IconWorld, IconCategory, IconChartBar, IconMapPin, IconBuildingStore, IconCoin,
  IconMail, IconBell, IconChartPie, IconArrowNarrowUp, IconDeviceFloppy, IconDownload,
  IconCalendarEvent, IconCurrencyDollar, IconBooks, IconTrendingUp, IconUserCheck,
  IconTargetArrow, IconAward, IconBuildingSkyscraper, IconBrandGithub, IconDeviceAnalytics
} from '@tabler/icons-react';
import { MockStartupData } from '../../../api/mocks/data/startupDashboardMockData';

interface CompanyOverviewCardProps {
  startupData: MockStartupData;
  isLoading: boolean;
  error: string | null;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({ startupData, isLoading, error }) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profileViews, setProfileViews] = useState<number>(124);
  const [saved, setSaved] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showTeam, setShowTeam] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
      linkedin: '#',
      github: '#',
      twitter: '#',
      bio: 'Former Google product lead with 12+ years of experience in tech.'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'CTO & Co-Founder',
      avatar: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
      linkedin: '#',
      github: '#',
      twitter: '#',
      bio: 'MIT graduate with background in AI and machine learning.'
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Head of Product',
      avatar: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
      linkedin: '#',
      github: '#',
      twitter: '#',
      bio: 'Product strategist with experience at multiple successful startups.'
    }
  ]);

  const logoUrl = startupData.logo_url || 'https://flowbite.com/docs/images/logo.svg';
  const description = startupData.description || 'No company description available.';
  
  const truncatedDescription = description.length > 120 && !showMore 
    ? `${description.substring(0, 120)}...` 
    : description;

  // Calculate profile completeness based on filled fields
  const requiredFields = [
    'name', 'description', 'industry', 'sector', 'location_city', 
    'operational_stage', 'num_employees', 'annual_revenue'
  ];
  
  const filledFields = requiredFields.filter(field => 
    field in startupData && startupData[field as keyof MockStartupData]
  );
  
  const completionPercentage = Math.round((filledFields.length / requiredFields.length) * 100);

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleCopyLink = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTrackView = () => {
    setProfileViews(prev => prev + 1);
    setShowProfileModal(false);
  };

  // Enhanced company milestones
  const companyMilestones = [
    { date: 'Jan 2020', title: 'Company Founded', description: 'Started operations with seed funding' },
    { date: 'Jun 2020', title: 'MVP Launch', description: 'First product version released to beta users' },
    { date: 'Mar 2021', title: 'First 100 Customers', description: 'Reached 100 paying customers milestone' },
    { date: 'Nov 2021', title: 'Seed Round Closed', description: '$2.5M raised from venture investors' },
    { date: 'Apr 2022', title: 'Team Expansion', description: 'Grew to 15 full-time employees' }
  ];

  // Enhanced company metrics
  const companyMetrics = [
    { label: 'Revenue Growth', value: '+42%', trend: 'up', color: 'green' },
    { label: 'Customer Retention', value: '87%', trend: 'up', color: 'blue' },
    { label: 'Market Share', value: '12%', trend: 'up', color: 'purple' },
    { label: 'Burn Rate', value: '$75K/mo', trend: 'down', color: 'amber' }
  ];

  return (
    <>
      <CardBox className="overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800">
        <div className="relative">
          {/* Cover image and avatar */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute top-2 right-2 z-10">
              <button 
                onClick={handleToggleStar}
                className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                {isStarred ? (
                  <IconStarFilled size={18} className="text-amber-400" />
                ) : (
                  <IconStar size={18} className="text-white" />
                )}
              </button>
            </div>
          </div>
          
          <div className="px-4 pb-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
              <Avatar
                img={logoUrl}
                alt={`${startupData.name || 'Company'} logo`}
                size="xl"
                rounded
                className="border-4 border-white dark:border-gray-800 shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {startupData.name || 'Unnamed Company'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {startupData.tagline || (startupData.industry ? `${startupData.industry} company` : 'Technology startup')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="xs" color="blue" onClick={() => setShowProfileModal(true)}>
                      <IconDeviceAnalytics size={14} className="mr-1" />
                      Full Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status badges row */}
            <div className="flex flex-wrap gap-2 mb-3">
              {startupData.operational_stage && (
                <Badge color="indigo" size="sm" icon={IconBuildingSkyscraper}>
                  {startupData.operational_stage}
                </Badge>
              )}
              {startupData.sector && (
                <Badge color="purple" size="sm" icon={IconCategory}>
                  {startupData.sector}
                </Badge>
              )}
              {startupData.num_employees && (
                <Badge color="success" size="sm" icon={IconUsers}>
                  {startupData.num_employees}+ team members
                </Badge>
              )}
              <Badge color="info" size="sm" icon={IconTargetArrow}>
                Funding Target: $2.5M
              </Badge>
            </div>
            
            {/* Company description */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <p>{truncatedDescription}</p>
              {description.length > 120 && (
                <button 
                  onClick={() => setShowMore(!showMore)} 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium mt-1"
                >
                  {showMore ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            
            {/* Profile completion */}
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
                Complete your profile to attract more investors
              </div>
            </div>
            
            {/* Key company info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconCategory size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Industry:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.industry || 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconChartBar size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Stage:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {startupData.operational_stage || 'N/A'}
                  {startupData.operational_stage === 'Seed' && (
                    <Badge color="purple" size="xs" className="ml-2">Early</Badge>
                  )}
                  {startupData.operational_stage === 'Series A' && (
                    <Badge color="indigo" size="xs" className="ml-2">Growing</Badge>
                  )}
                </span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconMapPin size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Location:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.location_city || 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconBuildingStore size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Sector:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.sector || 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconUsers size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Team size:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {startupData.num_employees || 'N/A'}
                  {startupData.num_employees && startupData.num_employees > 10 && (
                    <Badge color="green" size="xs" className="ml-2">Growing</Badge>
                  )}
                </span>
                <Button 
                  size="xs" 
                  color="light" 
                  className="ml-2" 
                  onClick={() => setShowTeam(!showTeam)}
                >
                  {showTeam ? 'Hide team' : 'View team'}
                </Button>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <IconCoin size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Revenue:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {startupData.annual_revenue ? `$${startupData.annual_revenue.toLocaleString()}` : 'N/A'}
                </span>
                <Tooltip content="Annual revenue from the most recent fiscal year">
                  <IconInfoCircle size={14} className="ml-1 text-gray-400" />
                </Tooltip>
              </div>
            </div>
            
            {/* Team members section - conditionally shown */}
            {showTeam && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <IconUserCheck size={16} className="mr-1.5 text-blue-500" />
                  Leadership Team
                </h4>
                <div className="space-y-3">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar img={member.avatar} size="sm" rounded />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {member.role}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Tooltip content="LinkedIn Profile">
                          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <IconBrandLinkedin size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip content="GitHub Profile">
                          <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <IconBrandGithub size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  <Button size="xs" color="light" className="w-full">
                    View All Team Members
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button size="sm" color="light" className="w-full relative group overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <IconMail size={16} className="mr-1.5" />
                Contact
              </Button>
              <Button size="sm" color="light" className="w-full relative group overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <IconWorld size={16} className="mr-1.5" />
                Website
              </Button>
            </div>
            
            {/* Additional quick actions */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button size="xs" color="light" className="w-full">
                <IconBriefcase size={14} className="mr-1" />
                Jobs
              </Button>
              <Button size="xs" color="light" className="w-full">
                <IconFileAnalytics size={14} className="mr-1" />
                Report
              </Button>
              <Button size="xs" color="light" className="w-full" onClick={handleCopyLink}>
                <IconClipboard size={14} className="mr-1" />
                {saved ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
            
            {/* Social media links */}
            <div className="flex justify-center gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
              <Tooltip content="LinkedIn Profile">
                <button className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <IconBrandLinkedin size={20} />
                </button>
              </Tooltip>
              <Tooltip content="Twitter Profile">
                <button className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <IconBrandTwitter size={20} />
                </button>
              </Tooltip>
              <Tooltip content="Company Website">
                <button className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <IconWorld size={20} />
                </button>
              </Tooltip>
            </div>
            
            {/* Premium alert */}
            <div className="mt-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-2 rounded-lg border border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center text-xs text-amber-800 dark:text-amber-300">
                <IconBell size={14} className="mr-1.5 flex-shrink-0" />
                <span>Get <span className="font-semibold">5x more investor views</span> with Premium</span>
                <Button size="xs" color="warning" className="ml-auto" pill>
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Modal */}
        <Modal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          size="lg"
        >
          <Modal.Header>
            {startupData.name || 'Company'} Profile
          </Modal.Header>
          <Modal.Body>
            <Tabs
              aria-label="Company profile tabs" 
              style="underline"
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
                      img={logoUrl} 
                      alt={`${startupData.name || 'Company'} logo`}
                      size="lg" 
                      rounded
                    />
                    <div className="ml-4">
                      <h5 className="text-lg font-bold">{startupData.name || 'Unnamed Company'}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {startupData.industry ? `${startupData.industry} company` : 'Technology startup'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-semibold mb-2">About</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-semibold mb-2">Company Details</h6>
                      <ul className="space-y-2 text-sm">
                        <li className="flex">
                          <span className="font-medium w-24">Industry:</span>
                          <span className="text-gray-600 dark:text-gray-400">{startupData.industry || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Stage:</span>
                          <span className="text-gray-600 dark:text-gray-400">{startupData.operational_stage || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Location:</span>
                          <span className="text-gray-600 dark:text-gray-400">{startupData.location_city || 'N/A'}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-24">Sector:</span>
                          <span className="text-gray-600 dark:text-gray-400">{startupData.sector || 'N/A'}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="text-sm font-semibold mb-2">Business Information</h6>
                      <ul className="space-y-2 text-sm">
                        <li className="flex">
                          <span className="font-medium w-24">Founded:</span>
                          <span className="text-gray-600 dark:text-gray-400">2020</span>
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
                          <span className="text-green-600 dark:text-green-400">+32% YoY</span>
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
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h6 className="text-sm font-semibold mb-3">Profile Performance</h6>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileViews}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Profile Views</div>
                        <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                          <IconArrowNarrowUp size={12} className="mr-1" />
                          23% 
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">48</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Investor Views</div>
                        <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                          <IconArrowNarrowUp size={12} className="mr-1" />
                          12% 
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">8</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Connection Requests</div>
                        <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                          <IconArrowNarrowUp size={12} className="mr-1" />
                          50% 
                        </div>
                      </div>
                    </div>
                    
                    {/* Company Key Metrics */}
                    <h6 className="text-sm font-semibold mb-2">Key Performance Metrics</h6>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {companyMetrics.map((metric, index) => (
                        <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</div>
                          </div>
                          <div className={`text-${metric.color}-500 flex items-center text-sm`}>
                            {metric.trend === 'up' ? (
                              <IconTrendingUp size={18} />
                            ) : (
                              <IconArrowNarrowUp size={18} className="transform rotate-180" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <h6 className="text-sm font-semibold mb-2">Profile Completeness Impact</h6>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      Profiles with 100% completion receive up to 5x more investor views
                    </div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded-lg relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                        {completionPercentage}% Complete
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title="Milestones" 
                icon={IconCalendarEvent}
                active={activeTab === 'milestones'}
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h6 className="text-sm font-semibold mb-3 flex items-center">
                      <IconAward size={16} className="mr-2 text-amber-500" />
                      Company Milestones & Achievements
                    </h6>
                    
                    <div className="relative border-l-2 border-blue-500 ml-2 pl-6 pb-2">
                      {companyMilestones.map((milestone, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></div>
                          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                            {milestone.date}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {milestone.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {milestone.description}
                          </div>
                        </div>
                      ))}
                      
                      <Button size="xs" color="light" className="ml-1 mt-2">
                        <IconCalendarEvent size={14} className="mr-1.5" />
                        Add Milestone
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h6 className="text-sm font-semibold mb-3 flex items-center">
                      <IconBooks size={16} className="mr-2 text-purple-500" />
                      Documents & Resources
                    </h6>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <IconFileAnalytics size={16} className="mr-2 text-blue-500" />
                          <span>Pitch Deck 2023</span>
                        </div>
                        <Button size="xs" color="light">
                          View
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <IconCurrencyDollar size={16} className="mr-2 text-green-500" />
                          <span>Financial Projections</span>
                        </div>
                        <Button size="xs" color="light">
                          View
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <IconBriefcase size={16} className="mr-2 text-amber-500" />
                          <span>Business Plan</span>
                        </div>
                        <Button size="xs" color="light">
                          View
                        </Button>
                      </div>
                      
                      <Button size="xs" color="light" className="w-full mt-2">
                        <IconUpload size={14} className="mr-1.5" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
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
                      <Button color="blue" onClick={handleCopyLink}>
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
                      <Button outline gradientDuoTone="purpleToBlue">
                        <IconFileAnalytics size={16} className="mr-2" />
                        Export as PDF
                      </Button>
                      <Button outline gradientDuoTone="cyanToBlue">
                        <IconDownload size={16} className="mr-2" />
                        Download Data
                      </Button>
                    </div>
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowProfileModal(false)}>Close</Button>
            <Button color="blue" onClick={handleTrackView}>
              View Full Profile
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

export default CompanyOverviewCard; 