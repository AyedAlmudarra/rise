import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { InvestorProfile } from '@/types/database';
import { Spinner, Alert, Avatar, Button, Tabs, Tooltip } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconRefresh, 
  IconSearch,
  IconChartPie,
  IconBuildingSkyscraper,
  IconLocation,
  IconHierarchy,
  IconLicense,
} from "@tabler/icons-react";

// Import the investor dashboard components directly from their files
import InvestorProfileCard from '@/components/dashboards/investor/InvestorProfileCard';
// Comment out problematic imports until components are verified/created
// import DealFlowSection from '../../components/dashboards/investor/DealFlowSection';
// import WatchlistSection from '../../components/dashboards/investor/WatchlistSection';
// import MarketInsightsSection from '../../components/dashboards/investor/MarketInsightsSection';

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [investorData, setInvestorData] = useState<InvestorProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  
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
      toast.dismiss(); // Clear loading toast
      toast.success("Dashboard data refreshed!");
    } catch (error) {
      toast.dismiss(); // Clear loading toast
      toast.error("Failed to refresh data");
    }
  }, [investorData]);

  // Helper function to format array count for stats
  const formatArrayCount = (items: string[] | null | undefined): string => {
    if (!items || items.length === 0) return '0';
    return items.length.toString();
  };

  // Updated renderWelcomeHeader based on StartupDashboard style
  const renderWelcomeHeader = () => (
    <div className="mb-6 rounded-xl overflow-hidden shadow-md">
      {/* Use the same blue/indigo gradient as StartupDashboard */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 py-6 px-6">
        {/* Subtle pattern - optional, keep if desired */}
        <div className="absolute inset-0 opacity-[.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center z-10">
          {/* Left: Avatar & Welcome Text */}
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar
              img={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name?.[0] || '?')}&background=random&color=fff`}
              rounded
              size="lg"
              className="ring-4 ring-white/30 shadow-lg flex-shrink-0" // Style from StartupDashboard
            />
            <div className="ml-4">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {/* Personalized Greeting */}
                Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'Investor'}!
              </h1>
              <div className="text-sm text-blue-100 flex items-center flex-wrap">
                <span className="mr-3">Investor Dashboard</span>
                {/* Last Updated display from StartupDashboard */}
                {!dataLoading && lastUpdated && (
                  <Tooltip content={`Last updated: ${lastUpdated.toLocaleString('en-US')}`}>
                    <span className="flex items-center text-blue-200/80 cursor-help">
                      <IconRefresh size={14} className="mr-1" /> {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </Tooltip>
                )}
                {dataLoading && <Spinner size="xs" color="white" className="ml-2" />}
              </div>
            </div>
          </div>

          {/* Right: Actions - styled like StartupDashboard */}
          <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
            <Tooltip content="Refresh Dashboard Data">
              <Button size="sm" color="light" className="bg-white/10 hover:bg-white/20 border-0 text-white px-2" onClick={refreshData} disabled={dataLoading}>
                <IconRefresh size={18} className={`${dataLoading ? 'animate-spin' : ''}`} />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Investor Quick Stats Row */}
        {investorData && !dataLoading && (
          <div className="mt-6 pt-5 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat Card Helper for Investor Data */}
              {[ 
                {
                  icon: IconLicense,
                  label: "Fund/Company",
                  value: investorData.company_name || 'N/A'
                },
                {
                  icon: IconBuildingSkyscraper,
                  label: "Industries",
                  value: formatArrayCount(investorData.preferred_industries)
                },
                {
                  icon: IconHierarchy,
                  label: "Stages",
                  value: formatArrayCount(investorData.preferred_stage)
                },
                {
                  icon: IconLocation,
                  label: "Geography",
                  value: formatArrayCount(investorData.preferred_geography)
                }
              ].map((stat, index) => (
                <div key={index} className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-3 shadow-sm">
                  <div className="flex-shrink-0 bg-white/10 rounded-full p-2">
                    <stat.icon size={20} className="text-white/80" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-100 font-medium uppercase tracking-wider">{stat.label}</p>
                    <p className="text-base md:text-lg text-white font-semibold truncate" title={stat.value}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
          <Button color="failure" size="sm" className="ml-3" onClick={fetchInvestorData}> 
            <IconRefresh size={16} className="mr-2"/> Retry
          </Button>
        </Alert>
      );
    }
    return null;
  };

  const renderDashboardTabs = () => (
    <div className="mb-6">
      <Tabs aria-label="Dashboard tabs" onActiveTabChange={(tab) => {
        // Simplify tab logic for remaining tabs
        const tabId = tab === 0 ? 'overview' : 'suggestions';
        setActiveTab(tabId);
      }}>
        {/* Keep only Overview and AI Suggestions tabs */}
        <Tabs.Item active={activeTab === 'overview'} title="Overview" icon={IconChartPie} />
        <Tabs.Item active={activeTab === 'suggestions'} title="AI Suggestions" icon={IconSearch} />
        {/* Remove Deal Flow and Watchlist tabs
        <Tabs.Item active={activeTab === 'deals'} title="Deal Flow" icon={IconBriefcase} />
        <Tabs.Item active={activeTab === 'watchlist'} title="Watchlist" icon={IconUsers} />
        */}
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
                      i + 1 === step ? (
                        <div key={i} className="h-2 w-2 rounded-full bg-blue-600" />
                      ) : (
                        <div key={i} className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                      )
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
    // Render content based ONLY on the activeTab
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6"> 
              <InvestorProfileCard
                investorData={investorData}
                isLoading={dataLoading}
                error={dataError}
                userName={user?.user_metadata?.full_name}
                userEmail={user?.email}
                avatar_url={user?.user_metadata?.avatar_url}
              />
            </div>
            {/* Remove placeholder columns */}
            {/*
            <div className="lg:col-span-2 space-y-6">
              <Card><div className="p-4 text-gray-500">Market Insights Section (Placeholder)</div></Card>
               <Card><div className="p-4 text-gray-500">Watchlist Section (Placeholder)</div></Card>
            </div>
            */}
          </div>
        );
      case 'suggestions':
         return (
           <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <Alert color="info">AI Suggestions have moved to the dedicated <a href="/ai-insights" className="font-medium underline hover:text-blue-700">AI Insights page</a>.</Alert>
           </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {renderWelcomeHeader()}
      {renderStatusIndicators()}
      {renderDashboardTabs()}
      <div> 
        {renderDashboardContent()}
      </div>
      
      <WelcomeModal 
        show={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        userName={user?.user_metadata?.full_name}
      />
    </div>
  );
};

export default InvestorDashboard; 