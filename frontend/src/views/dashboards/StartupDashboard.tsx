import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile } from '../../types/database';
import { Spinner, Alert, Badge, Tabs, Card, Avatar, Button, Dropdown, Timeline } from 'flowbite-react';
import { mockStartupData, generateMockData } from '../../api/mocks/data/startupDashboardMockData';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconBulb, 
  IconRefresh, 
  IconChartBar, 
  IconBuilding, 
  IconChartPie, 
  IconRobot, 
  IconFocus, 
  IconUsers,
  IconBell,
  IconDots,
  IconArrowUp,
  IconSettings,
  IconSearch,
  IconCalendar,
  IconClipboard,
  IconStar,
  IconMail,
  IconDownload,
  IconArrowRight,
  IconChevronUp,
  IconChevronDown,
  IconCheck
} from "@tabler/icons-react";

// Import the refactored section components
import {
    CompanyOverviewCard,
    KeyMetricsSection,
    AIInsightsSection,
    FundingReadinessSection,
    InvestorInterestSection
} from '../../components/dashboards/startup';

// Remove Congratulations import for now unless we decide to use it
// import Congratulations from '../../components/dashboards/analytics/Congratulations';

// Remove helper functions (moved to KeyMetricsSection)
// const formatCurrency = ...
// const formatPercentage = ...

// Remove old section component definitions
// const KeyMetricsSection = ...
// const AIInsightsSection = ...
// const FundingReadinessSection = ...
// const InvestorInterestSection = ...


// --- Main StartupDashboard Component ---

const StartupDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [showMetricsSummary, setShowMetricsSummary] = useState<boolean>(true);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  
  // Generate dynamic mock data based on the fetched startup profile
  const [mockData, setMockData] = useState(mockStartupData);
  
  // Update mock data whenever startupData changes
  useEffect(() => {
    if (startupData) {
      setMockData(generateMockData(startupData));
    }
  }, [startupData]);

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'investor', message: 'New investor viewed your profile', time: '10 minutes ago', read: false },
    { id: 2, type: 'insight', message: 'New AI insight available about your customer retention', time: '2 hours ago', read: false },
    { id: 3, type: 'funding', message: 'Your funding readiness score increased by 5 points', time: '1 day ago', read: false },
    { id: 4, type: 'system', message: 'Weekly analytics report is ready', time: '2 days ago', read: true },
  ];

  // Recent activities mock data
  const recentActivities = [
    { id: 1, action: 'Updated financial metrics', timestamp: '2 hours ago', user: 'You' },
    { id: 2, action: 'Investor from Blue Capital viewed your pitch deck', timestamp: '1 day ago', user: 'Sarah Chen' },
    { id: 3, action: 'Added team member profile', timestamp: '3 days ago', user: 'You' },
    { id: 4, action: 'Received new funding match', timestamp: '1 week ago', user: 'System' },
  ];

  // Upcoming tasks mock data
  const upcomingTasks = [
    { id: 1, title: 'Investor meeting with VentureX', date: 'Tomorrow, 2:00 PM', priority: 'high' },
    { id: 2, title: 'Update financial projections', date: 'Next Monday', priority: 'medium' },
    { id: 3, title: 'Complete pitch deck revisions', date: 'In 3 days', priority: 'high' },
  ];

  useEffect(() => {
    fetchStartupData();
    
    // Check if user was recently registered (within last 5 minutes)
    const registrationTime = localStorage.getItem('registration_timestamp');
    if (registrationTime) {
      const timeDiff = Date.now() - parseInt(registrationTime);
      if (timeDiff < 5 * 60 * 1000) { // 5 minutes
        setIsNewUser(true);
        setShowWelcomeModal(true);
        // Clear the registration timestamp
        localStorage.removeItem('registration_timestamp');
      }
    }
  }, [user]);

  const fetchStartupData = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      const { data, error, status } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setStartupData(data);
        // If this is the first time fetching data after registration
        // Set isNewUser flag for welcome experience
        if (isNewUser) {
          toast.success("Welcome to your startup dashboard!", {
            icon: "🚀"
          });
        }
      } else {
        setStartupData(null);
        if (isNewUser) {
          // Handle case where startup profile was created but not found
          toast.error("There was an issue loading your profile. Please contact support.");
        }
      }
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Error fetching startup data:", error.message);
      setDataError(error.message);
      setStartupData(null);
      toast.error("Error loading dashboard data. Please try refreshing.");
    } finally {
      setDataLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    // Show loading toast
    toast.loading("Refreshing dashboard data...");
    
    try {
      await fetchStartupData();
      toast.dismiss(); // Clear loading toast
      toast.success("Dashboard data refreshed!");
    } catch (error) {
      toast.dismiss(); // Clear loading toast
      toast.error("Failed to refresh data");
    }
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  // Enhanced welcome message with notification center
  const renderWelcomeHeader = () => (
    <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-start mb-4 md:mb-0">
          <div className="mr-4">
            <Avatar 
              size="lg" 
              rounded 
              img={user?.user_metadata?.avatar_url || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
              bordered 
              color="success" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1 text-white">
              {user?.user_metadata?.full_name || user?.email || 'Startup Dashboard'}
              <Badge color="indigo" className="ml-3">BETA</Badge>
            </h1>
            <p className="text-blue-100 flex items-center">
              Welcome to your dashboard
              {!dataLoading && (
                <span className="text-xs text-blue-200 ml-4 flex items-center">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors relative"
            >
              <IconBell size={22} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  {notificationCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${notification.type === 'investor' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-500' : notification.type === 'insight' ? 'bg-green-100 dark:bg-green-900/30 text-green-500' : notification.type === 'funding' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                            {notification.type === 'investor' ? (
                              <IconUsers size={16} />
                            ) : notification.type === 'insight' ? (
                              <IconBulb size={16} />
                            ) : notification.type === 'funding' ? (
                              <IconChartBar size={16} />
                            ) : (
                              <IconBell size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Dropdown 
              label="" 
              dismissOnClick={true} 
              renderTrigger={() => (
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <IconSettings size={22} />
                </button>
              )}
            >
              <Dropdown.Item icon={IconSettings}>Account Settings</Dropdown.Item>
              <Dropdown.Item icon={IconBell}>Notification Preferences</Dropdown.Item>
              <Dropdown.Item icon={IconDownload}>Export Data</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={IconStar}>Feature Requests</Dropdown.Item>
              <Dropdown.Item icon={IconMail}>Help Center</Dropdown.Item>
            </Dropdown>
          </div>
          
          <button 
            onClick={refreshData}
            disabled={dataLoading}
            className="flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-md shadow-sm text-blue-700 dark:text-white transition-colors disabled:opacity-60 ml-2"
          >
            <IconRefresh size={16} className={`mr-1 ${dataLoading ? 'animate-spin text-blue-500' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Search bar (optional) */}
      <div className="mt-4 relative max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IconSearch className="w-5 h-5 text-blue-200" />
        </div>
        <input
          type="search"
          className="block w-full p-2 pl-10 text-sm border border-blue-400/30 rounded-lg bg-blue-500/20 placeholder-blue-200 text-white focus:ring-blue-300 focus:border-blue-400"
          placeholder="Search dashboard..."
        />
      </div>
    </div>
  );

  // Status indicators with better visual feedback
  const renderStatusIndicators = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <Spinner aria-label="Loading startup data..." size="lg" color="purple" />
          <span className="pl-3 text-gray-700 dark:text-gray-300">Loading your dashboard data...</span>
        </div>
      );
    }
    if (dataError) {
      return (
        <Alert color="failure" className="my-4">
          <span className="font-medium">Error!</span> Failed to load profile: {dataError}
        </Alert>
      );
    }
    return null;
  };

  // Quick actions section with enhanced styling and tracking
  const renderQuickActions = () => {
    if (dataLoading || dataError) return null;
    
    const quickActions = [
      { id: 'metrics', icon: <IconChartBar size={18} className="text-blue-500" />, label: 'Update Metrics' },
      { id: 'insights', icon: <IconBulb size={18} className="text-amber-500" />, label: 'Get AI Insights' },
      { id: 'investors', icon: <IconUsers size={18} className="text-purple-500" />, label: 'Connect with Investors' },
      { id: 'calendar', icon: <IconCalendar size={18} className="text-green-500" />, label: 'Schedule Meeting' },
      { id: 'pitch', icon: <IconClipboard size={18} className="text-red-500" />, label: 'Edit Pitch Deck' },
    ];
    
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            Customize <IconSettings size={14} className="ml-1" />
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 py-2 no-scrollbar">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => setActiveQuickAction(action.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg shadow-sm flex items-center transition-all transform hover:scale-105 ${
                activeQuickAction === action.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`mr-3 ${activeQuickAction === action.id ? 'text-white' : ''}`}>
                {action.icon}
              </div>
              <span className="whitespace-nowrap text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render dashboard summary cards with enhanced styling and toggle option
  const renderDashboardSummary = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard Overview</h2>
          <button 
            onClick={() => setShowMetricsSummary(!showMetricsSummary)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            {showMetricsSummary ? (
              <>Hide <IconChevronUp size={14} className="ml-1" /></>
            ) : (
              <>Show <IconChevronDown size={14} className="ml-1" /></>
            )}
          </button>
        </div>
        
        {showMetricsSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconChartPie size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      ${mockData.keyMetrics.annualRevenue?.toLocaleString() || 'N/A'}
                    </p>
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                      <IconArrowUp size={12} className="mr-0.5" /> 15%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconUsers size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {mockData.keyMetrics.numCustomers?.toLocaleString() || 'N/A'}
                    </p>
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                      <IconArrowUp size={12} className="mr-0.5" /> 25%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconRobot size={24} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI Insights</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {mockData.aiInsights.length}
                    </p>
                    <Badge color="purple" className="ml-2">NEW</Badge>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-none hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
                  <IconFocus size={24} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Funding Score</p>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {mockData.fundingReadiness.score}/100
                    </p>
                    <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                      <IconArrowUp size={12} className="mr-0.5" /> 5pts
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Render recent activity and upcoming tasks
  const renderActivitySection = () => {
    if (dataLoading || dataError) return null;
    
    return (
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity Timeline */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View all <IconArrowRight size={14} className="ml-1" />
            </button>
          </div>
          
          <Timeline>
            {recentActivities.map((activity) => (
              <Timeline.Item key={activity.id}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{activity.timestamp}</Timeline.Time>
                  <Timeline.Title>{activity.action}</Timeline.Title>
                  <Timeline.Body>
                    <span className="text-sm text-gray-500 dark:text-gray-400">By {activity.user}</span>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Tasks</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View calendar <IconCalendar size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 rounded-lg border ${
                  task.priority === 'high' 
                    ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10' 
                    : task.priority === 'medium'
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.date}</p>
                  </div>
                  <div className="flex items-start">
                    <Badge 
                      color={task.priority === 'high' ? 'failure' : task.priority === 'medium' ? 'warning' : 'info'} 
                      size="xs"
                    >
                      {task.priority}
                    </Badge>
                    <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <IconCheck size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center mt-2">
              <IconArrowRight size={14} className="mr-1" /> Add new task
            </button>
          </div>
        </Card>
      </div>
    );
  };

  // Render the dashboard content with tabs
  const renderDashboardTabs = () => {
    const tabIds = ['overview', 'metrics', 'insights', 'funding', 'investors'];
    
    return (
      <Card className="p-0 overflow-hidden">
        <Tabs aria-label="Dashboard tabs" className="mb-0" onActiveTabChange={(index: number) => {
          setActiveTab(tabIds[index]);
        }}>
          <Tabs.Item 
            active={activeTab === 'overview'} 
            title={
              <div className="flex items-center">
                <IconBuilding size={18} className="mr-2 text-blue-500" />
                <span>Overview</span>
              </div>
            }
          >
            <div className="p-4">
              <CompanyOverviewCard 
                startupData={startupData}
                isLoading={dataLoading}
                error={dataError}
              />
            </div>
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 'metrics'} 
            title={
              <div className="flex items-center">
                <IconChartPie size={18} className="mr-2 text-green-500" />
                <span>Key Metrics</span>
              </div>
            }
          >
            <div className="p-4">
              <KeyMetricsSection data={mockData.keyMetrics} />
            </div>
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 'insights'} 
            title={
              <div className="flex items-center">
                <IconRobot size={18} className="mr-2 text-purple-500" />
                <span>AI Insights</span>
                <Badge color="purple" size="xs" className="ml-2">{mockData.aiInsights.length}</Badge>
              </div>
            }
          >
            <div className="p-4">
              <AIInsightsSection insights={mockData.aiInsights} />
            </div>
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 'funding'} 
            title={
              <div className="flex items-center">
                <IconFocus size={18} className="mr-2 text-amber-500" />
                <span>Funding Readiness</span>
              </div>
            }
          >
            <div className="p-4">
              <FundingReadinessSection data={mockData.fundingReadiness} />
            </div>
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 'investors'} 
            title={
              <div className="flex items-center">
                <IconUsers size={18} className="mr-2 text-red-500" />
                <span>Investor Interest</span>
                <Badge color="gray" size="xs" className="ml-2">{mockData.investorInterest.profileViews}</Badge>
              </div>
            }
          >
            <div className="p-4">
              <InvestorInterestSection data={mockData.investorInterest} />
            </div>
          </Tabs.Item>
        </Tabs>
      </Card>
    );
  };

  // Create a WelcomeModal component
  const WelcomeModal: React.FC<{
    show: boolean;
    onClose: () => void;
    userName?: string;
  }> = ({ show, onClose, userName }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
      {
        title: "Welcome to Your Startup Dashboard",
        description: "We're excited to have you on board! Let's get you started with a quick tour of your new dashboard.",
        icon: <IconBulb size={40} className="text-yellow-500" />
      },
      {
        title: "Your Company Profile",
        description: "View and update your startup information. A complete profile attracts more investor interest.",
        icon: <IconBuilding size={40} className="text-blue-500" />
      },
      {
        title: "Performance Metrics",
        description: "Track your key business metrics and visualize your growth over time.",
        icon: <IconChartPie size={40} className="text-green-500" />
      },
      {
        title: "AI Insights & Recommendations",
        description: "Get personalized AI-powered insights to help grow your business.",
        icon: <IconRobot size={40} className="text-purple-500" />
      },
      {
        title: "Ready to Go!",
        description: "Your dashboard is all set up. Explore and make the most of the RISE platform!",
        icon: <IconArrowUp size={40} className="text-indigo-500" />
      }
    ];

    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onClose();
      }
    };

    if (!show) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative h-1.5 bg-gray-100 dark:bg-gray-700">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="px-6 pt-8 pb-6">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                  {steps[currentStep].icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {steps[currentStep].description.replace('{userName}', userName || 'there')}
                </p>
                
                <div className="flex gap-3 w-full">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200 font-medium transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={`${currentStep > 0 ? 'flex-1' : 'w-full'} px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg`}
                  >
                    {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full ${currentStep === index ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              <button
                onClick={onClose}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Skip tour
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {renderWelcomeHeader()}
      {renderQuickActions()}

      {/* Show Loading/Error indicators OR the dashboard content */}
      {dataLoading || dataError ? (
        renderStatusIndicators()
      ) : (
        <>
          {renderDashboardSummary()}
          {renderActivitySection()}
          {renderDashboardTabs()}
        </>
      )}

      {showWelcomeModal && (
        <WelcomeModal
          show={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          userName={user?.user_metadata?.full_name || user?.email || 'Startup Dashboard'}
        />
      )}
    </div>
  );
};

export default StartupDashboard; 