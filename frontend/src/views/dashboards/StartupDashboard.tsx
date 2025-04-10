import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile } from '../../types/database';
import { Spinner, Alert, Badge, Tabs, Card } from 'flowbite-react';
import { mockStartupData } from '../../api/mocks/data/startupDashboardMockData';
import { 
  IconBulb, 
  IconRefresh, 
  IconChartBar, 
  IconBuilding, 
  IconChartPie, 
  IconRobot, 
  IconFocus, 
  IconUsers 
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
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    fetchStartupData();
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
      } else {
        setStartupData(null);
      }
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Error fetching startup data:", error.message);
      setDataError(error.message);
      setStartupData(null);
    } finally {
      setDataLoading(false);
    }
  };

  // Enhanced welcome message with more dynamic content
  const renderWelcomeMessage = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Startup Dashboard
          <Badge color="indigo" className="ml-3">BETA</Badge>
        </h1>
        {user && (
          <p className="text-gray-600 dark:text-gray-300 flex items-center">
            Welcome back, <span className="font-semibold ml-1">{user.user_metadata?.full_name || user.email}</span>
            {!dataLoading && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-4 flex items-center">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        )}
      </div>
      <button 
        onClick={fetchStartupData}
        disabled={dataLoading}
        className="mt-3 md:mt-0 flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md shadow-sm transition-colors disabled:opacity-60"
      >
        <IconRefresh size={16} className={`mr-1 ${dataLoading ? 'animate-spin' : ''}`} />
        Refresh Data
      </button>
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

  // Quick actions section
  const renderQuickActions = () => {
    if (dataLoading || dataError) return null;
    
    return (
      <div className="flex overflow-x-auto gap-4 py-2 mb-6 no-scrollbar">
        <button className="flex-shrink-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <IconChartBar size={18} className="text-blue-500 mr-2" />
          <span className="whitespace-nowrap text-sm font-medium">Update Metrics</span>
        </button>
        <button className="flex-shrink-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <IconBulb size={18} className="text-amber-500 mr-2" />
          <span className="whitespace-nowrap text-sm font-medium">Get AI Insights</span>
        </button>
        <button className="flex-shrink-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <IconUsers size={18} className="text-purple-500 mr-2" />
          <span className="whitespace-nowrap text-sm font-medium">Connect with Investors</span>
        </button>
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
              <CompanyOverviewCard startupData={startupData} loading={false} error={null} />
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
              <KeyMetricsSection data={mockStartupData.keyMetrics} />
            </div>
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 'insights'} 
            title={
              <div className="flex items-center">
                <IconRobot size={18} className="mr-2 text-purple-500" />
                <span>AI Insights</span>
              </div>
            }
          >
            <div className="p-4">
              <AIInsightsSection insights={mockStartupData.aiInsights} />
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
              <FundingReadinessSection data={mockStartupData.fundingReadiness} />
            </div>
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 'investors'} 
            title={
              <div className="flex items-center">
                <IconUsers size={18} className="mr-2 text-red-500" />
                <span>Investor Interest</span>
              </div>
            }
          >
            <div className="p-4">
              <InvestorInterestSection data={mockStartupData.investorInterest} />
            </div>
          </Tabs.Item>
        </Tabs>
      </Card>
    );
  };
  
  // Render dashboard summary cards for the overview screen
  const renderDashboardSummary = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mr-4">
              <IconChartPie size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                ${mockStartupData.keyMetrics.annualRevenue?.toLocaleString() || 'N/A'}
              </p>
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
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {mockStartupData.keyMetrics.numCustomers?.toLocaleString() || 'N/A'}
              </p>
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
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {mockStartupData.aiInsights.length}
              </p>
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
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {mockStartupData.fundingReadiness.score}/100
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {renderWelcomeMessage()}
      {renderQuickActions()}

      {/* Show Loading/Error indicators OR the dashboard content */}
      {dataLoading || dataError ? (
        renderStatusIndicators()
      ) : (
        <>
          {renderDashboardSummary()}
          {renderDashboardTabs()}
        </>
      )}
    </div>
  );
};

export default StartupDashboard; 