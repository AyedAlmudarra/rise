import React from 'react';
import { StartupProfile } from 'src/types/database';
import CardBox from 'src/components/shared/CardBox';
import { Alert } from 'flowbite-react';

interface CompanyOverviewCardProps {
  startupData: StartupProfile | null;
  loading: boolean;
  error: string | null;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({ startupData, loading, error }) => {

    // If loading or error occurred, don't render anything (handled by main dashboard loading indicator)
    if (loading || error) {
        return null;
    }

    // If not loading, no error, but no data -> show prompt to complete profile
    if (!startupData) {
      return (
         <CardBox className="lg:col-span-1 h-full">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Company Overview
            </h5>
            <Alert color="info" className="mt-4">
              No company profile data found. Please complete your profile.
            </Alert>
         </CardBox>
      );
    }

    // If startupData exists, render the card with details
    return (
      <CardBox className="lg:col-span-1 h-full">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          Company Overview
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400 text-sm space-y-3">
          <div><span className="font-semibold text-gray-800 dark:text-gray-200">Name:</span> {startupData.name || 'N/A'}</div>
          <div><span className="font-semibold text-gray-800 dark:text-gray-200">Industry:</span> {startupData.industry || 'N/A'}</div>
          <div><span className="font-semibold text-gray-800 dark:text-gray-200">Stage:</span> {startupData.operational_stage || 'N/A'}</div>
          <div><span className="font-semibold text-gray-800 dark:text-gray-200">Location:</span> {startupData.location_city || 'N/A'}</div>
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Description:</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{startupData.description || 'No description provided.'}</p>
          </div>
          {/* Add more fields here as needed later */}
        </div>
      </CardBox>
    );
  };

export default CompanyOverviewCard; 