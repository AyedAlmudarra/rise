import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { IconAlertTriangle, IconCalendarStats, IconChartBar, IconRobot } from '@tabler/icons-react';
import { AIAnalysisData } from '@/types/database';

interface ProjectionsRisksCardProps {
  analysisData: AIAnalysisData | null;
  isLoading: boolean;
}

const ProjectionsRisksCard: React.FC<ProjectionsRisksCardProps> = ({ 
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

  // Extract data from AI analysis if available
  const keyRisks = Array.isArray(analysisData?.key_risks) ? analysisData.key_risks : [];
  const whatIfScenarios = Array.isArray(analysisData?.what_if_scenarios) ? analysisData.what_if_scenarios : [];
  const fundingOutlook = typeof analysisData?.funding_outlook === 'string' ? analysisData.funding_outlook : null;
  
  // Check if any projection data is available
  const hasProjectionData = keyRisks.length > 0 || whatIfScenarios.length > 0 || fundingOutlook;

  // Determine cash outlook status based on AI assessment
  const getCashOutlookStatus = (): { label: string; color: "success" | "warning" | "failure" } => {
    if (!fundingOutlook) {
      return { label: "Unknown", color: "warning" };
    }
    
    // Look for keywords in the funding outlook to determine status
    const lowerFundingOutlook = fundingOutlook.toLowerCase();
    
    if (lowerFundingOutlook.includes('strong') || 
        lowerFundingOutlook.includes('excellent') || 
        lowerFundingOutlook.includes('healthy')) {
      return { label: "Strong", color: "success" };
    } else if (lowerFundingOutlook.includes('stable') || 
               lowerFundingOutlook.includes('good') || 
               lowerFundingOutlook.includes('positive')) {
      return { label: "Stable", color: "success" }; 
    } else if (lowerFundingOutlook.includes('concern') || 
               lowerFundingOutlook.includes('limited') || 
               lowerFundingOutlook.includes('challenges')) {
      return { label: "Concerning", color: "warning" };
    } else if (lowerFundingOutlook.includes('critical') || 
               lowerFundingOutlook.includes('risky') || 
               lowerFundingOutlook.includes('uncertain')) {
      return { label: "Critical", color: "failure" };
    }
    
    return { label: "Moderate", color: "warning" };
  };

  if (!hasProjectionData) {
    return (
      <Card>
        <div className="flex items-center mb-4">
          <IconChartBar className="mr-2 text-purple-500" size={20} />
          <h5 className="text-base font-semibold text-gray-900 dark:text-white">
            Future Projections & Risks
          </h5>
        </div>

        <div className="text-center py-6">
          <IconRobot size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No Projections & Risks Data Available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Request an AI analysis using the main refresh button to get detailed projections and risks.
          </p>
        </div>
      </Card>
    );
  }

  const cashOutlook = getCashOutlookStatus();

  return (
    <Card>
      <div className="flex items-center mb-4">
        <IconChartBar className="mr-2 text-purple-500" size={20} />
        <h5 className="text-base font-semibold text-gray-900 dark:text-white">
          Future Projections & Risks
        </h5>
      </div>

      {/* Cash Flow Outlook */}
      {fundingOutlook && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cash Flow Outlook</p>
            <Badge color={cashOutlook.color} size="sm">{cashOutlook.label}</Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{fundingOutlook}</p>
        </div>
      )}

      {/* What-If Scenarios */}
      {whatIfScenarios.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Potential Scenarios</p>
          <div className="space-y-2">
            {whatIfScenarios.map((scenario, index) => (
              <div key={`scenario-${index}`} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-start">
                  <IconCalendarStats size={14} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {scenario.scenario}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {scenario.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Indicators */}
      {keyRisks.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Indicators</p>
          <div className="space-y-2">
            {keyRisks.map((risk, index) => (
              <div key={`risk-${index}`} className="flex items-start">
                <IconAlertTriangle size={14} className="text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-xs text-gray-600 dark:text-gray-400">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProjectionsRisksCard; 