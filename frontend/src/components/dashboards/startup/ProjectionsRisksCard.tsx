import React from 'react';
import { StartupProfile, AIAnalysisData } from '../../../types/database'; // Assuming AIAnalysisData is in database types
import { Spinner, Alert, Badge, Tooltip } from 'flowbite-react';
import { IconTrendingUp, IconAlertTriangle, IconCalendarDue, IconCashBanknote, IconInfoCircle } from '@tabler/icons-react';

interface ProjectionsRisksCardProps {
  startupData: StartupProfile | null;
  isLoading: boolean;
}

const ProjectionsRisksCard: React.FC<ProjectionsRisksCardProps> = ({ startupData, isLoading }) => {

  if (isLoading) {
    return <Spinner aria-label="Loading projections and risks..." />;
  }

  if (!startupData) {
    return <Alert color="info">Projections & risks data requires startup profile.</Alert>;
  }

  // Attempt to get AI analysis data, specifically key risks
  const aiAnalysis = startupData.ai_analysis as AIAnalysisData | null;
  const keyRisks = aiAnalysis?.key_risks ?? []; // Use optional key_risks if defined in AIAnalysisData

  return (
    <div className="space-y-5">
      {/* Expected Milestones (Placeholder) */}
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          <IconCalendarDue size={16} className="mr-1.5 text-blue-500" />
          Expected Milestones (Next 6-12 Months)
           <Tooltip content="Placeholder: Future milestones like product launches, user targets, funding rounds." className="ml-1">
              <IconInfoCircle size={14} className="text-gray-400 dark:text-gray-500 cursor-help" />
           </Tooltip>
        </div>
        {/* Replace with dynamic data when available */}
        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400 pl-2">
            <li>Secure Seed Funding Round</li>
            <li>Achieve 10,000 Active Users</li>
            <li>Launch Version 2.0 of Platform</li>
        </ul>
      </div>

      {/* Cash Flow Outlook (Placeholder) */}
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          <IconCashBanknote size={16} className="mr-1.5 text-green-500" />
          Cash Flow Outlook
           <Tooltip content="Placeholder: Brief summary of expected cash flow status (e.g., runway months, profitability timeline)." className="ml-1">
              <IconInfoCircle size={14} className="text-gray-400 dark:text-gray-500 cursor-help" />
           </Tooltip>
        </div>
        {/* Replace with dynamic data/AI insight */}
        <p className="text-xs text-gray-600 dark:text-gray-400">
            Projected runway of 9-12 months based on current burn rate and expected revenue. Aiming for profitability by Q4.
        </p>
      </div>

      {/* Risk Indicators (From AI Analysis or Placeholder) */}
      <div className="p-3 border border-dashed border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center text-sm font-medium text-red-800 dark:text-red-300 mb-2">
          <IconAlertTriangle size={16} className="mr-1.5" />
          Key Risk Indicators
        </div>
        {keyRisks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keyRisks.map((risk, index) => (
              <Badge key={index} color="failure" size="xs" className="font-medium">
                {risk}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-red-700 dark:text-red-400">
            {aiAnalysis ? "No specific key risks identified in the latest AI analysis." : "Risk analysis pending or unavailable."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectionsRisksCard; 