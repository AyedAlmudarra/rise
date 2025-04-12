import React from 'react';
import { StartupProfile, AIAnalysisData, GrowthPlanPhase } from '../../../types/database';
import { Spinner, Alert } from 'flowbite-react';
import { IconCalendarEvent, IconRocket, IconInfoCircle } from '@tabler/icons-react';

interface GrowthPlanCardProps {
  startupData: StartupProfile | null;
  isLoading: boolean;
}

const GrowthPlanCard: React.FC<GrowthPlanCardProps> = ({ startupData, isLoading }) => {

  if (isLoading) {
    return <Spinner aria-label="Loading growth plan..." />;
  }

  // Check for startup data first
  if (!startupData) {
    return <Alert color="info" icon={IconInfoCircle}>Growth plan requires startup profile data.</Alert>;
  }

  // Get growth plan data from AI analysis
  const aiAnalysis = startupData.ai_analysis as AIAnalysisData | null;
  const growthPlanPhases = aiAnalysis?.growth_plan_phases;

  // Handle cases where AI data or the specific field is missing or not an array
  if (!Array.isArray(growthPlanPhases) || growthPlanPhases.length === 0) {
    return (
      <Alert color="gray" icon={IconInfoCircle}>
        AI-generated growth plan details are not available.
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {growthPlanPhases.map((phase: GrowthPlanPhase | null, index: number) => {
        // Validate each phase object
        if (!phase || typeof phase !== 'object') {
          console.warn(`Invalid growth plan phase structure at index ${index}:`, phase);
          return (
              <div key={`invalid-${index}`} className="p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                 <p className="text-xs text-gray-500 italic">Invalid phase data received from analysis.</p>
             </div>
          ); 
        }

        const period = typeof phase.period === 'string' ? phase.period : '[Missing Period]';
        const focus = typeof phase.focus === 'string' ? phase.focus : '[Missing Focus]';
        const description = typeof phase.description === 'string' ? phase.description : '[Missing Description]';

        return (
          <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center mb-1">
              <IconCalendarEvent size={15} className="mr-1.5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 mr-2">{period}:</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white truncate" title={focus}>{focus}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 pl-[21px] leading-relaxed">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default GrowthPlanCard; 