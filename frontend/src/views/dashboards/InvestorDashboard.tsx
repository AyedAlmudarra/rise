import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { InvestorProfile } from '../../types/database'; // Import the new type
import { Spinner, Alert, Card } from 'flowbite-react'; // Add Spinner, Alert, Card imports

// Keep Congratulations for now, remove others
import Congratulations from '../../components/dashboards/analytics/Congratulations';
// import LatestDeal from '../../components/dashboards/analytics/LatestDeal'; // REMOVED
// import PopularProducts from '../../components/dashboards/analytics/PopularProducts'; // REMOVED

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [investorData, setInvestorData] = useState<InvestorProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestorData = async () => {
      if (!user) {
        setDataLoading(false);
        return;
      }
      setDataLoading(true);
      setDataError(null);
      try {
        const { data, error, status } = await supabase
          .from('investors') // Query the 'investors' table
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          console.log("Fetched investor data:", data);
          setInvestorData(data);
        } else {
          console.log("No investor profile found for user:", user.id);
          setInvestorData(null);
        }
      } catch (error: any) {
        console.error("Error fetching investor data:", error.message);
        setDataError(error.message);
        setInvestorData(null);
      } finally {
        setDataLoading(false);
      }
    };
    fetchInvestorData();
  }, [user]);

  const renderWelcomeMessage = () => (
     <div className="mb-6">
       <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>
       {user ? (
         <p className="mb-4">
           Welcome, {user.user_metadata?.full_name || user.email}!
           ({user.email})
         </p>
       ) : (
         <p className="mb-4">User information not yet available...</p>
       )}
       {/* <Congratulations /> Maybe move into grid later */}
     </div>
  );

  const renderStatusIndicators = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner aria-label="Loading investor data..." size="lg" />
          <span className="pl-3">Loading investor profile...</span>
        </div>
      );
    }
    if (dataError) {
      return (
        <Alert color="failure" className="my-4">
          <span className="font-medium">Error!</span> Failed to load investor profile: {dataError}
        </Alert>
      );
    }
    return null;
  };

  // Function to render the Investor Overview Card
  const renderInvestorOverviewCard = () => {
    if (!investorData) {
      if (!dataLoading && !dataError) {
        return (
          <Card className="lg:col-span-1">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Investor Profile Summary
            </h5>
            <Alert color="info">
              No investor profile data found. Please complete your profile.
            </Alert>
          </Card>
        );
      }
      return null;
    }

    // Helper to display array data nicely
    const renderArrayField = (label: string, items: string[] | null | undefined) => {
      if (!items || items.length === 0) {
        return <p><span className="font-semibold">{label}:</span> N/A</p>;
      }
      return (
        <div>
          <span className="font-semibold">{label}:</span>
          <ul className="list-disc list-inside ml-4">
            {items.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      );
    };

    return (
      <Card className="lg:col-span-1">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Investor Profile Summary
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400 text-sm space-y-2">
          <p><span className="font-semibold">Job Title:</span> {investorData.job_title || 'N/A'}</p>
          <p><span className="font-semibold">Company:</span> {investorData.company_name || 'N/A'}</p>
          <p><span className="font-semibold">Website:</span> {investorData.website ? <a href={investorData.website} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">{investorData.website}</a> : 'N/A'}</p>
          <p><span className="font-semibold">LinkedIn:</span> {investorData.linkedin_profile ? <a href={investorData.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">Profile Link</a> : 'N/A'}</p>
          {renderArrayField('Preferred Industries', investorData.preferred_industries)}
          {renderArrayField('Preferred Geography', investorData.preferred_geography)}
          {renderArrayField('Preferred Stage', investorData.preferred_stage)}
          {/* Add description if needed */}
          {/* <p><span className="font-semibold">Company Desc:</span> {investorData.company_description || 'N/A'}</p> */}
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {renderWelcomeMessage()}
      {renderStatusIndicators()}

      {!dataLoading && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
           {/* Render the Investor Overview Card */}
           {renderInvestorOverviewCard()}

           {/* Placeholders for other cards - Step 4 */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
               <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                 Deal Flow
               </h5>
               <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                 Placeholder for incoming/managed deals.
               </p>
             </Card>
             <Card>
               <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                 AI-Suggested Startups
               </h5>
               <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                 Placeholder for startups matching investment profile.
               </p>
             </Card>
             <Card className="md:col-span-2"> {/* Make watchlist span full width in its column */} 
               <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                 Watchlist Summary
               </h5>
               <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
                 Placeholder for saved/tracked startups.
               </p>
             </Card>
           </div>
        </div>
      )}

    </div>
  );
};

export default InvestorDashboard; 