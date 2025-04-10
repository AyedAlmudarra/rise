import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile } from '../../types/database';
import { Spinner, Alert } from 'flowbite-react'; // Reduced imports
import { mockStartupData } from '../../api/mocks/data/startupDashboardMockData'; // Only need mock data object

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

  useEffect(() => {
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
      } catch (error: any) {
        console.error("Error fetching startup data:", error.message);
        setDataError(error.message);
        setStartupData(null);
      } finally {
        setDataLoading(false);
      }
    };

    fetchStartupData();
  }, [user]);

  // Welcome message remains simple
  const renderWelcomeMessage = () => (
    <div className="mb-6">
       <h1 className="text-2xl font-bold mb-4">Startup Dashboard</h1>
       {user && (
         <p className="mb-4 text-gray-600 dark:text-gray-400">
           Welcome back, {user.user_metadata?.full_name || user.email}!
         </p>
       )}
    </div>
  );

  // Status indicators remain the same
  const renderStatusIndicators = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner aria-label="Loading startup data..." size="lg" />
          <span className="pl-3">Loading your profile...</span>
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

 // Remove old renderCompanyOverviewCard function (logic moved to component)
 // const renderCompanyOverviewCard = () => { ... }

  return (
    <div className="p-4 md:p-6">
      {renderWelcomeMessage()}

      {/* Show Loading/Error indicators OR the dashboard grid */}
      {dataLoading || dataError ? (
          renderStatusIndicators()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4"> {/* Reduced gap slightly */}
           {/* Company Overview Card (Uses real data passed as props) */}
           <CompanyOverviewCard startupData={startupData} loading={dataLoading} error={dataError} />

           {/* Container for the remaining sections (Using mock data) */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <KeyMetricsSection data={mockStartupData.keyMetrics} />
               <AIInsightsSection insights={mockStartupData.aiInsights} />
               <FundingReadinessSection data={mockStartupData.fundingReadiness} />
               <InvestorInterestSection data={mockStartupData.investorInterest} />
           </div>
        </div>
      )}
    </div>
  );
};

export default StartupDashboard; 