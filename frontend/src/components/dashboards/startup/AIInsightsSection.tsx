import React from 'react';
import { Badge, Spinner, Alert } from 'flowbite-react';
import { StartupProfile, AIAnalysisData } from '../../../types/database'; // Import all needed types
import {
  
  IconInfoCircle,
  IconReportAnalytics,
  IconScale,
  IconTargetArrow,
  IconListCheck,
  IconShieldCheck,
  IconExclamationCircle,
  IconMapPin,          // Added
  IconCurrencyDollar,  // Added
  IconChartBar,
  IconPlayerPlay, // Added for initial state
} from "@tabler/icons-react";

// --- Component Props Interface ---
interface AIInsightsSectionProps {
    startupData: StartupProfile | null;
    isLoading: boolean; // Parent loading state
}

// --- Helper function to get badge color for scalability ---
const getScalabilityColor = (level: 'Low' | 'Medium' | 'High'): "failure" | "warning" | "success" => {
    switch (level) {
        case 'Low': return 'failure';
        case 'Medium': return 'warning';
        case 'High': return 'success';
        default: return 'warning'; // Fallback
    }
};

// Helper to render list items robustly
const renderListItem = (item: any, key: string) => (
  <li key={key}>
    {typeof item === 'string' ? item : JSON.stringify(item)}
  </li>
);

// --- Main AI Insights Section Component ---
const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ startupData, isLoading }) => {
  // const [activeSection, setActiveSection] = useState<string>('insights');

  // --- Main Rendering Logic --- 
  const renderContent = () => {
    const currentAnalysisStatus = startupData?.analysis_status;
    const analysisData = startupData?.ai_analysis as AIAnalysisData | null;

    // 1. Handle overall parent loading state (initial load)
    if (isLoading && !currentAnalysisStatus) {
      return (
        <div className="space-y-5 animate-pulse p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
          </div>
      );
    }

    // 2. Handle no startup data prop provided
    if (!startupData) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6">
          <IconInfoCircle size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium">No Startup Profile Loaded</p>
          <p className="text-xs">Cannot display or request insights.</p>
        </div>
      );
    }

    // 3. Handle different analysis statuses based on PROPS
    switch (currentAnalysisStatus) {
      case 'processing':
       return (
          <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500 dark:text-gray-400">
            <Spinner aria-label="Processing analysis" size="lg" />
            <p className="mt-3 text-sm font-medium">Analysis in Progress...</p>
            <p className="text-xs">The AI is working. Results will appear here automatically.</p>
           </div>
        );

      case 'failed':
        const errorMsg = (analysisData as any)?.error || 'An unknown error occurred during analysis.';
        return (
          <Alert color="failure" icon={IconExclamationCircle} className="m-2">
            <h6 className="font-semibold text-sm mb-1">Analysis Failed</h6>
            <p className="text-xs">{errorMsg}</p>
             <p className="text-xs mt-2">You can try requesting a new analysis using the main refresh button above.</p>
          </Alert>
        );

      case 'completed':
        if (!analysisData || typeof analysisData !== 'object' || (analysisData as any)?.error) {
          return (
            <Alert color="warning" icon={IconInfoCircle} className="m-2">
              AI analysis data is missing, invalid, or contains an error flag despite 'completed' status.
            </Alert>
          );
        }

        // --- Render the actual analysis data ---
        return (
          <div className="flex flex-col h-full space-y-4">
            {/* Analysis Timestamp */}
            {startupData?.analysis_timestamp && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    Last analyzed: {new Date(startupData.analysis_timestamp).toLocaleString('en-US')}
                </p>
            )}
            
            {/* Executive Summary */}
            {analysisData.executive_summary && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h6 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white flex items-center"><IconReportAnalytics size={16} className="mr-2 text-indigo-500"/> Executive Summary</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisData.executive_summary}</p>
                </div>
            )}
            
            {/* SWOT Analysis */}
            {analysisData.swot_analysis && (
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h6 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white flex items-center"><IconChartBar size={16} className="mr-2 text-blue-500"/> SWOT Analysis</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Strengths */}
                        <div>
                            <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Strengths</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                {analysisData.swot_analysis.strengths?.map((item, i) => renderListItem(item, `swot-s-${i}`)) ?? <li>N/A</li>}
                            </ul>
                        </div>
                        {/* Weaknesses */}
                        <div>
                            <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Weaknesses</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                {analysisData.swot_analysis.weaknesses?.map((item, i) => renderListItem(item, `swot-w-${i}`)) ?? <li>N/A</li>}
                            </ul>
                        </div>
                        {/* Opportunities */}
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Opportunities</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                {analysisData.swot_analysis.opportunities?.map((item, i) => renderListItem(item, `swot-o-${i}`)) ?? <li>N/A</li>}
                            </ul>
                        </div>
                        {/* Threats */}
                        <div>
                            <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">Threats</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                {analysisData.swot_analysis.threats?.map((item, i) => renderListItem(item, `swot-t-${i}`)) ?? <li>N/A</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Market Positioning */} 
            {analysisData.market_positioning && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <h6 className="text-sm font-semibold mb-1 text-gray-800 dark:text-white flex items-center"><IconMapPin size={16} className="mr-2 text-purple-500"/> Market Positioning</h6>
                   <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisData.market_positioning}</p>
                </div>
            )}

            {/* Scalability Assessment */} 
            {analysisData.scalability_assessment && (
                 <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h6 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white flex items-center"><IconScale size={16} className="mr-2 text-cyan-500"/> Scalability Assessment</h6>
                     <div className="flex items-center mb-1">
                        <span className="text-xs font-medium mr-2">Potential:</span>
                        <Badge color={getScalabilityColor(analysisData.scalability_assessment.level as 'Low' | 'Medium' | 'High')} size="sm">
                            {analysisData.scalability_assessment.level || 'N/A'}
                        </Badge>
                     </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisData.scalability_assessment.justification || 'No justification provided.'}</p>
                </div>
            )}

            {/* Competitive Advantage */}
            {analysisData.competitive_advantage_evaluation && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <h6 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white flex items-center"><IconShieldCheck size={16} className="mr-2 text-green-500"/> Competitive Advantage</h6>
                   <p className="text-xs font-medium mb-1">Assessment:</p>
                   <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">{analysisData.competitive_advantage_evaluation.assessment || 'N/A'}</p>
                   <p className="text-xs font-medium mb-1">Suggestion:</p>
                   <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisData.competitive_advantage_evaluation.suggestion || 'N/A'}</p>
                </div>
            )}

            {/* Current Challenges */}
            {analysisData.current_challenges && Array.isArray(analysisData.current_challenges) && analysisData.current_challenges.length > 0 && (
                 <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h6 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white flex items-center"><IconExclamationCircle size={16} className="mr-2 text-yellow-500"/> Current Challenges</h6>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {analysisData.current_challenges.map((item, i) => renderListItem(item, `cc-${i}`))}
                    </ul>
                </div>
            )}
            
             {/* Suggested KPIs */}
            {analysisData.suggested_kpis && Array.isArray(analysisData.suggested_kpis) && analysisData.suggested_kpis.length > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h6 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white flex items-center"><IconListCheck size={16} className="mr-2 text-lime-500"/> Suggested KPIs</h6>
                    <div className="space-y-2">
                        {analysisData.suggested_kpis.map((kpiItem, i) => (
                            <div key={`kpi-${i}" className="text-sm`}>
                                <p className="font-medium text-gray-700 dark:text-gray-300">• {kpiItem.kpi || 'N/A'}</p>
                                <p className="pl-4 text-xs text-gray-500 dark:text-gray-400">{kpiItem.justification || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Strategic Recommendations */}
            {analysisData.strategic_recommendations && Array.isArray(analysisData.strategic_recommendations) && analysisData.strategic_recommendations.length > 0 && (
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h6 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white flex items-center"><IconTargetArrow size={16} className="mr-2 text-red-500"/> Strategic Recommendations (Next 6 Months)</h6>
                     <ul className="list-decimal pl-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {analysisData.strategic_recommendations.map((item, i) => renderListItem(item, `sr-${i}`))}
                    </ul>
                </div>
            )}

            {/* Funding Outlook */} 
            {analysisData.funding_outlook && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <h6 className="text-sm font-semibold mb-1 text-gray-800 dark:text-white flex items-center"><IconCurrencyDollar size={16} className="mr-2 text-yellow-500"/> Funding Outlook</h6>
                   <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysisData.funding_outlook}</p>
                </div>
            )}
            
            {/* Add Feedback section if needed */}
            {/* <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center space-x-4">
                <span className="text-xs text-gray-500">Was this analysis helpful?</span>
                <Button size="xs" color="light"><IconThumbUp size={14} className="mr-1"/> Yes</Button>
                <Button size="xs" color="light"><IconThumbDown size={14} className="mr-1"/> No</Button>
            </div> */}
            
          </div>
        );

      case null:
      case undefined:
      default:
        return (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            <IconPlayerPlay size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">AI Analysis Not Started</p>
            <p className="text-xs">Request an analysis using the main refresh button above.</p>
          </div>
        );
    }
  };

  // --- Main Component Return ---
  return (
    <div>
       <div className="flex-grow overflow-hidden">
          {renderContent()}
      </div>
    </div>
  );
};

export default AIInsightsSection;

