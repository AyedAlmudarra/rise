import React from 'react';
import CardBox from 'src/components/shared/CardBox';
import { MockInvestorInterest } from 'src/api/mocks/data/startupDashboardMockData';
import { IconEye, IconScale, IconUsers } from "@tabler/icons-react";

const InvestorInterestSection: React.FC<{ data: MockInvestorInterest }> = ({ data }) => {
  return (
    <CardBox className="h-full">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        Investor Interest
      </h5>
      <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-600 dark:text-gray-400"><IconEye size={16} className="mr-1.5 text-gray-500"/> Profile Views</span>
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{data.profileViews}</span>
          </div>
           <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-600 dark:text-gray-400"><IconScale size={16} className="mr-1.5 text-gray-500"/> Data Room Requests</span>
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{data.dataRoomRequests}</span>
          </div>
           <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-600 dark:text-gray-400"><IconUsers size={16} className="mr-1.5 text-gray-500"/> Connection Requests</span>
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{data.connectionRequests}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
              Last Interest Activity: {data.lastInterestDate ? new Date(data.lastInterestDate).toLocaleDateString() : 'N/A'}
          </div>
      </div>
    </CardBox>
  );
};

export default InvestorInterestSection; 