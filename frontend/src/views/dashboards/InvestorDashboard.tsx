import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { InvestorProfile } from '../../types/database';
import { Spinner, Alert, Avatar, Button, Badge, Tabs, Dropdown, Timeline } from 'flowbite-react';
import { mockInvestorData, generateMockData } from '../../api/mocks/data/investorDashboardMockData';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconBell, 
  IconRefresh, 
  IconBuildingSkyscraper, 
  IconSettings,
  IconDots,
  IconUser,
  IconBriefcase,
  IconLayoutDashboard,
  IconSearch,
  IconChartPie,
  IconUsers
} from "@tabler/icons-react";

// Import the new investor dashboard components
import {
  InvestorProfileCard,
  DealFlowSection,
  AISuggestionsSection,
  WatchlistSection,
  MarketInsightsSection
} from '../../components/dashboards/investor';

const InvestorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [investorData, setInvestorData] = useState<InvestorProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(2);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  
  // Generate dynamic mock data based on the fetched investor profile
  const [mockData, setMockData] = useState(mockInvestorData);
  
  // Update mock data whenever investorData changes
  useEffect(() => {
    if (investorData) {
      setMockData(generateMockData(investorData));
    }
  }, [investorData]);

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'startup', message: 'New startup match: CloudScale', time: '10 minutes ago', read: false },
    { id: 2, type: 'deal', message: 'Deal status updated: Term Sheet sent to Quantum Analytics', time: '2 hours ago', read: false },
    { id: 3, type: 'system', message: 'Weekly market insights report is ready', time: '1 day ago', read: true },
  ];

  useEffect(() => {
    fetchInvestorData();
    
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

  const fetchInvestorData = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      const { data, error, status } = await supabase
        .from('investors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setInvestorData(data);
        
        // If this is a new user, show welcome message
        if (isNewUser) {
          toast.success("Welcome to your investor dashboard!", {
            icon: "🚀"
          });
        }
      } else {
        setInvestorData(null);
        if (isNewUser) {
          // Handle case where investor profile was created but not found
          toast.error("There was an issue loading your profile. Please contact support.");
        }
      }
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Error fetching investor data:", error.message);
      setDataError(error.message);
      setInvestorData(null);
      toast.error("Error loading dashboard data. Please try refreshing.");
    } finally {
      setDataLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    // Show loading toast
    toast.loading("Refreshing dashboard data...");
    
    try {
      await fetchInvestorData();
      // Regenerate mock data
      if (investorData) {
        setMockData(generateMockData(investorData));
      }
      toast.dismiss(); // Clear loading toast
      toast.success("Dashboard data refreshed!");
    } catch (error) {
      toast.dismiss(); // Clear loading toast
      toast.error("Failed to refresh data");
    }
  }, [investorData]);

  const markAllNotificationsAsRead = () => {
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  // Enhanced welcome message with notification center
  const renderWelcomeHeader = () => (
    <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 p-6 rounded-xl shadow-md">
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
              {user?.user_metadata?.full_name || user?.email || 'Investor Dashboard'}
              <Badge color="purple" className="ml-3">BETA</Badge>
            </h1>
            <p className="text-indigo-100 flex items-center">
              Welcome to your dashboard
              {!dataLoading && (
                <span className="text-xs text-indigo-200 ml-4 flex items-center">
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
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <span className="inline-block h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            size="xs" 
            color="light" 
            pill
            onClick={refreshData}
          >
            <IconRefresh size={16} />
          </Button>
          
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <Button size="xs" color="light" pill>
                <IconSettings size={16} />
              </Button>
            )}
          >
            <Dropdown.Item icon={IconUser}>Profile</Dropdown.Item>
            <Dropdown.Item icon={IconSettings}>Settings</Dropdown.Item>
            <Dropdown.Item icon={IconLayoutDashboard}>Preferences</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={IconBriefcase}>Switch to Startup</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  const renderStatusIndicators = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
          <Spinner aria-label="Loading investor data..." size="lg" />
          <span className="pl-3">Loading investor profile...</span>
        </div>
      );
    }
    if (dataError) {
      return (
        <Alert color="failure" className="mb-6">
          <span className="font-medium">Error!</span> Failed to load investor profile: {dataError}
          <Button color="failure" size="xs" className="ml-3" onClick={fetchInvestorData}>
            Retry
          </Button>
        </Alert>
      );
    }
    return null;
  };

  const renderDashboardTabs = () => (
    <div className="mb-6">
      <Tabs aria-label="Dashboard tabs" style="underline" onActiveTabChange={(tab) => {
        const tabId = tab === 0 ? 'overview' : tab === 1 ? 'deals' : tab === 2 ? 'suggestions' : tab === 3 ? 'watchlist' : 'insights';
        setActiveTab(tabId);
      }}>
        <Tabs.Item active={activeTab === 'overview'} title="Overview" icon={IconChartPie} />
        <Tabs.Item active={activeTab === 'deals'} title="Deal Flow" icon={IconBriefcase} />
        <Tabs.Item active={activeTab === 'suggestions'} title="AI Suggestions" icon={IconSearch} />
        <Tabs.Item active={activeTab === 'watchlist'} title="Watchlist" icon={IconUsers} />
      </Tabs>
    </div>
  );

  // Welcome modal for first-time users
  const WelcomeModal: React.FC<{
    show: boolean;
    onClose: () => void;
    userName?: string;
  }> = ({ show, onClose, userName }) => {
    const [step, setStep] = useState(1);
    const maxSteps = 3;
    
    const handleNext = () => {
      if (step < maxSteps) {
        setStep(step + 1);
      } else {
        onClose();
      }
    };
    
    return (
      <AnimatePresence>
        {show && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to RISE, {userName || 'Investor'}!
                </h3>
                
                {step === 1 && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      We're excited to have you join our platform. Let us show you around your new dashboard.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Your Dashboard at a Glance</h4>
                      <p className="text-blue-700 dark:text-blue-400 text-sm">
                        Your dashboard gives you a complete view of your investment opportunities, market insights, and startup matches.
                      </p>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Discover AI-powered startup recommendations based on your investment preferences.
                    </p>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">AI-Matched Startups</h4>
                      <p className="text-purple-700 dark:text-purple-400 text-sm">
                        Our AI analyzes thousands of startups to find the best matches for your investment strategy and preferences.
                      </p>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Track your deals and manage your startup portfolio all in one place.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Next Steps</h4>
                      <ul className="text-green-700 dark:text-green-400 text-sm list-disc list-inside space-y-1">
                        <li>Complete your investor profile to get better matches</li>
                        <li>Browse AI-suggested startups in your industries</li>
                        <li>Add promising startups to your watchlist</li>
                        <li>Explore market insights for investment opportunities</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-1">
                    {Array.from({ length: maxSteps }).map((_, i) => (
                      <div 
                        key={i}
                        className={`h-2 w-2 rounded-full ${i + 1 === step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button color="light" onClick={onClose}>
                      Skip
                    </Button>
                    <Button color="blue" onClick={handleNext}>
                      {step < maxSteps ? 'Next' : 'Get Started'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderDashboardContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <InvestorProfileCard 
              investorData={investorData} 
              isLoading={dataLoading} 
              error={dataError}
              userName={user?.user_metadata?.full_name}
              userEmail={user?.email}
            />
            
            <MarketInsightsSection 
              insightsData={mockData.marketInsights}
              isLoading={dataLoading}
              onRefresh={refreshData}
            />
          </div>
          
          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <DealFlowSection 
              dealFlowData={mockData.dealFlow}
              isLoading={dataLoading}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AISuggestionsSection 
                suggestions={mockData.aiSuggestions}
                isLoading={dataLoading}
                onRefresh={refreshData}
              />
              
              <WatchlistSection 
                watchlistData={mockData.watchlist}
                isLoading={dataLoading}
                onAddToWatchlist={() => toast.success("Watchlist feature coming soon!")}
              />
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'deals') {
      return (
        <DealFlowSection 
          dealFlowData={mockData.dealFlow}
          isLoading={dataLoading}
        />
      );
    }
    
    if (activeTab === 'suggestions') {
      return (
        <AISuggestionsSection 
          suggestions={mockData.aiSuggestions}
          isLoading={dataLoading}
          onRefresh={refreshData}
        />
      );
    }
    
    if (activeTab === 'watchlist') {
      return (
        <WatchlistSection 
          watchlistData={mockData.watchlist}
          isLoading={dataLoading}
          onAddToWatchlist={() => toast.success("Watchlist feature coming soon!")}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="p-6">
      {renderWelcomeHeader()}
      {renderStatusIndicators()}
      {renderDashboardTabs()}
      {renderDashboardContent()}
      
      <WelcomeModal 
        show={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        userName={user?.user_metadata?.full_name}
      />
    </div>
  );
};

export default InvestorDashboard; 