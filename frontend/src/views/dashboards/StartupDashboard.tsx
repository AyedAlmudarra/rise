import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile } from '../../types/database'; // Import the new type
import { Spinner, Alert, Card } from 'flowbite-react'; // Add Spinner, Alert, Card imports

// Keep Congratulations for now, remove others
import Congratulations from '../../components/dashboards/analytics/Congratulations';
// import Products from '../../components/dashboards/analytics/Products'; // REMOVED
// import Customer from '../../components/dashboards/analytics/Customer'; // REMOVED

const StartupDashboard = () => {
  const { user } = useAuth(); // Removed loading from here, handle data loading separately
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartupData = async () => {
      if (!user) {
        setDataLoading(false);
        return; // Exit if user is not available
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
          // 406 No Content means no row found, which is not necessarily an error here
          throw error;
        }

        if (data) {
          console.log("Fetched startup data:", data);
          setStartupData(data);
        } else {
          console.log("No startup profile found for user:", user.id);
          setStartupData(null); // Ensure state is null if no data
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
  }, [user]); // Dependency array includes user

  // Welcome message section (now always visible unless auth itself is loading)
  const renderWelcomeMessage = () => (
    <div className="mb-6">
       <h1 className="text-2xl font-bold mb-4">Startup Dashboard</h1>
       {user ? (
         <p className="mb-4">
           Welcome, {user.user_metadata?.full_name || user.email}!
           ({user.email})
         </p>
       ) : (
         <p className="mb-4">User information not yet available...</p> // Should be rare if protected route works
       )}
        {/* Display Congratulations card here? */} 
        {/* <Congratulations />  We might move this into the grid later */} 
    </div>
  );

  // Loading/Error/NoData section
  const renderStatusIndicators = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner aria-label="Loading startup data..." size="lg" />
          <span className="pl-3">Loading company profile...</span>
        </div>
      );
    }
    if (dataError) {
      return (
        <Alert color="failure" className="my-4">
          <span className="font-medium">Error!</span> Failed to load company profile: {dataError}
        </Alert>
      );
    }
     // This case handled within Company Overview Card now
    // if (!startupData) {
    //   return (
    //     <Alert color="info" className="my-4">
    //       No company profile data found. Please complete your profile.
    //     </Alert>
    //   );
    // }
    return null; // No indicators needed if loaded successfully
  };

  // Function to render the Company Overview Card
  const renderCompanyOverviewCard = () => {
    if (!startupData) {
      // Render this only if not loading and no error, but data is null
      if (!dataLoading && !dataError) {
        return (
           <Card className="lg:col-span-1">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Company Overview
              </h5>
              <Alert color="info">
                No company profile data found. Please complete your profile.
              </Alert>
           </Card>
        );
      }
      // Otherwise, if still loading or error occurred, this card won't render yet
      // because the main grid depends on !dataLoading
      return null; 
    }

    // If startupData exists, render the card with details
    return (
      <Card className="lg:col-span-1">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Company Overview
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400 text-sm space-y-2">
          <p><span className="font-semibold">Name:</span> {startupData.name || 'N/A'}</p>
          <p><span className="font-semibold">Industry:</span> {startupData.industry || 'N/A'}</p>
          <p><span className="font-semibold">Stage:</span> {startupData.operational_stage || 'N/A'}</p>
          <p><span className="font-semibold">Location:</span> {startupData.location_city || 'N/A'}</p>
          <div>
            <span className="font-semibold">Description:</span>
            <p className="mt-1 italic">{startupData.description || 'No description provided.'}</p>
          </div>
          {/* Add more fields here as needed later */}
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {renderWelcomeMessage()}
      {renderStatusIndicators()}

      {/* Main content grid - Render only when not loading and no error? 
          Or render placeholders even with error? For now, let's render placeholders always unless loading.
      */}
      {!dataLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
           {/* Render the Company Overview Card */}
           {renderCompanyOverviewCard()}

           {/* Placeholders for other cards - Step 4 */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Key Metrics
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                  Placeholder for Revenue, Burn Rate, MRR, Churn etc.
                </p>
              </Card>
              <Card>
                 <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                   AI Insights & Recommendations
                 </h5>
                 <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                   Placeholder for AI-driven analysis results and suggestions.
                 </p>
              </Card>
              <Card>
                 <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                   Funding Readiness Score
                 </h5>
                 <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                   Placeholder for calculated score based on profile completeness and metrics.
                 </p>
              </Card>
              <Card>
                 <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                   Investor Interest
                 </h5>
                 <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                   Placeholder for profile views, data room requests, connection requests.
                 </p>
             </Card>
           </div>

        </div>
      )}

    </div>
  );
};

export default StartupDashboard; 