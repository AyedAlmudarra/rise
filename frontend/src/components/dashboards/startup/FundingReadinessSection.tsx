import React from 'react';
import CardBox from 'src/components/shared/CardBox';
import { MockFundingReadiness } from 'src/api/mocks/data/startupDashboardMockData';
import { Progress, Label, List } from 'flowbite-react';
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";

const FundingReadinessSection: React.FC<{ data: MockFundingReadiness }> = ({ data }) => {
  return (
    <CardBox className="h-full">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        Funding Readiness Score
      </h5>
      <div className="text-center mb-4">
          {/* Consider adding a gauge chart here later */}
          <span className="text-4xl font-bold text-primary dark:text-cyan-400">{data.score}</span>
          <span className="text-gray-500 dark:text-gray-400"> / 100</span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
            {/* Overall Score Progress */}
            <div>
                <div className="mb-1 flex justify-between">
                    <Label value="Overall Score" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                    <span className="text-sm font-medium text-primary dark:text-cyan-500">{data.score}%</span>
                </div>
                <Progress progress={data.score} size="lg" labelProgress />
            </div>

            {/* Profile Completeness Progress */}
            <div>
                <div className="mb-1 flex justify-between">
                    <Label value="Profile Completeness" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-500">{data.profileCompleteness}%</span>
                </div>
                <Progress progress={data.profileCompleteness} size="sm" labelProgress color="blue" />
            </div>

            {/* Financials Score Progress */}
            <div>
                <div className="mb-1 flex justify-between">
                    <Label value="Financials Score" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                    <span className="text-sm font-medium text-green-700 dark:text-green-500">{data.financialsScore}%</span>
                </div>
                <Progress progress={data.financialsScore} size="sm" labelProgress color="green" />
            </div>
      </div>

       {/* Pitch Deck Status */}
       <div className="text-sm mt-5 mb-3">
           <span className="font-semibold">Pitch Deck: </span>
            <span className={`font-medium ${data.pitchDeckStatus === 'Uploaded' ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                 {data.pitchDeckStatus}
            </span>
       </div>

       {/* Recommendations */}
       {data.recommendations && data.recommendations.length > 0 && (
           <div>
               <h6 className="font-semibold text-sm mb-2 flex items-center">
                   <IconInfoCircle size={16} className="text-gray-500 mr-1"/>
                   Recommendations to Improve Score:
               </h6>
                <List unstyled className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pl-1">
                    {data.recommendations.map((rec, index) => (
                        <List.Item key={index} icon={() => <IconCheck size={14} className="text-primary mr-1.5 mt-0.5"/>}>
                            {rec}
                        </List.Item>
                    ))}
                </List>
           </div>
        )}
    </CardBox>
  );
};

export default FundingReadinessSection; 