import React from 'react';
import { Card, Progress, Tooltip } from 'flowbite-react';
import { IconScale, IconRobot } from '@tabler/icons-react';
import { AIAnalysisData } from '../../../types/database';

interface FundingReadinessCardProps {
  analysisData: AIAnalysisData | null;
  isLoading: boolean;
}

// Helper to determine color based on score
const getScoreColor = (score: number | null | undefined): "red" | "yellow" | "green" | "gray" => {
  if (score == null) return "gray";
  if (score < 40) return "red";
  if (score < 70) return "yellow";
  return "green";
};

const FundingReadinessCard: React.FC<FundingReadinessCardProps> = ({ 
  analysisData, 
  isLoading, 
}) => {

  const score = analysisData?.funding_readiness_score;
  const justification = analysisData?.funding_readiness_justification;
  // Check if score is explicitly not null/undefined AND justification is not null/undefined/empty string
  const hasData = score != null && justification != null && justification !== ''; 

  if (isLoading) {
    return (
      <Card className="animate-pulse h-full">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
          <IconScale className="mr-2 text-orange-500" size={20} />
          Funding Readiness
        </h5>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        {!analysisData || !hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <IconRobot size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No Readiness Score Available</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Request an AI analysis using the main refresh button to generate a score.
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            {/* Score Display */}
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {score ?? 'N/A'}
                <span className="text-2xl font-normal text-gray-500 dark:text-gray-400"> / 100</span>
              </p>
              {/* Restore Progress Bar */}
              <Progress 
                progress={score ?? 0} 
                color={getScoreColor(score)} 
                size="lg"
                className="[&>div]:rounded-full pdf-ignore"
              />
            </div>

            {/* Justification */}
            <div className="mt-auto">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">AI Justification:</p>
              {/* Restore Tooltip Wrapper */}
              <Tooltip 
                content={justification}
                placement="top"
                style="light"
                className="max-w-xs text-xs"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 hover:line-clamp-none cursor-help">
                  {justification || 'No justification provided.'}
                </p>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FundingReadinessCard; 