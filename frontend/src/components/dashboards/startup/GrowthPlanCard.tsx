import React from 'react';
import { Card, Button } from 'flowbite-react';
import { IconCalendarEvent, IconCircleCheck, IconRobot } from '@tabler/icons-react';
import { AIAnalysisData } from '../../../types/database';

interface GrowthPlanCardProps {
  analysisData: AIAnalysisData | null;
  isLoading: boolean;
}

const GrowthPlanCard: React.FC<GrowthPlanCardProps> = ({ 
  analysisData, 
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full my-2.5"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 my-2.5"></div>
      </Card>
    );
  }

  // Get growth plan phases from AI analysis
  const growthPlanPhases = analysisData?.growth_plan_phases || [];
  const hasGrowthPlan = Array.isArray(growthPlanPhases) && growthPlanPhases.length > 0;

  return (
    <Card>
      <div className="flex items-center mb-4">
        <IconCalendarEvent className="mr-2 text-teal-500" size={20} />
        <h5 className="text-base font-semibold text-gray-900 dark:text-white">
          12-Month Growth Plan
        </h5>
      </div>

      {hasGrowthPlan ? (
        <div className="space-y-4">
          {growthPlanPhases.map((phase, index) => (
            <div key={`phase-${index}`} className="border-l-2 border-teal-300 dark:border-teal-700 pl-4 py-2">
              <div className="flex items-center mb-1">
                <IconCircleCheck size={16} className="text-teal-500 mr-2 flex-shrink-0" />
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  <span className="text-teal-600 dark:text-teal-400">{phase.period}:</span> {phase.focus}
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <IconRobot size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No Growth Plan Data Available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Request an AI analysis using the main refresh button to generate a customized growth plan.
          </p>
        </div>
      )}
    </Card>
  );
};

export default GrowthPlanCard; 