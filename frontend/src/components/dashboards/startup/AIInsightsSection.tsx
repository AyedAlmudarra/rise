import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tabs, Badge, Button, Dropdown, Spinner, Alert, Textarea, Tooltip } from 'flowbite-react';
import { StartupProfile } from '../../../types/database';
import { supabase } from '../../../lib/supabaseClient'; // Import supabase client
import { toast } from 'react-hot-toast'; // Import toast
import {
  IconBulb,
  IconRobot,
  IconRefresh,
  IconShare,
  IconDotsVertical,
  IconInfoCircle,
  IconX,
  IconThumbUp,
  IconThumbDown,
  IconReportAnalytics,
  IconScale,
  IconTargetArrow,
  IconListCheck,
  IconTrendingUp,
  IconShieldCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

// --- Component Props Interface ---
interface AIInsightsSectionProps {
    startupData: StartupProfile | null;
    isLoading: boolean; // Receive overall loading state from parent
    onRefreshRequest?: () => void; // Optional: Allow triggering a data refresh in the parent
}

// --- Define the structure of the expected AI analysis JSON ---
// (Mirroring the structure from the Edge Function)
interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ScalabilityAssessment {
  level: 'Low' | 'Medium' | 'High';
  justification: string;
}

interface CompetitiveAdvantageEvaluation {
  assessment: string;
  suggestion: string;
}

interface AIAnalysisData {
  executive_summary: string;
  swot_analysis: SWOTAnalysis;
  // Note: funding_readiness is handled in FundingReadinessSection
  scalability_assessment: ScalabilityAssessment;
  competitive_advantage_evaluation: CompetitiveAdvantageEvaluation;
  strategic_recommendations: string[];
  suggested_kpis: string[];
  // Add potentially missing older fields for backward compatibility or if needed elsewhere
  key_strengths?: string[];
  key_risks?: string[];
  market_positioning_summary?: string;
}

// --- Helper function to get badge color for scalability ---
const getScalabilityColor = (level: 'Low' | 'Medium' | 'High'): "failure" | "warning" | "success" | "gray" => {
    switch (level) {
        case 'Low': return 'failure';
        case 'Medium': return 'warning';
        case 'High': return 'success';
        default: return 'gray'; // Fallback
    }
};

// --- Main AI Insights Section Component ---
const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ startupData, isLoading, onRefreshRequest }) => {
  const [isRefreshing, setIsRefreshing] = useState(false); // Keep for manual refresh UI

  const handleRefresh = async () => {
    if (!startupData?.id) {
      toast.error("Cannot trigger analysis: Startup ID missing.");
      return;
    }

    setIsRefreshing(true);
    toast.loading("Requesting new AI analysis...");

    try {
      const { error } = await supabase.functions.invoke('request-analysis', {
        body: { startup_id: startupData.id },
      });

      if (error) {
        throw error;
      }

      toast.dismiss();
      toast.success("Re-analysis requested! Status will update shortly.");

      // Optional: Trigger parent refresh AFTER a short delay
      if (onRefreshRequest) {
        setTimeout(() => {
          onRefreshRequest();
        }, 1500);
      }

    } catch (error: any) {
      toast.dismiss();
      console.error("Error requesting analysis:", error);
      toast.error(`Failed to request re-analysis: ${error.message || 'Unknown error'}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    // 1. Handle overall loading state from parent
    if (isLoading) {
      return (
          <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
      );
    }

    // 2. Handle no startup data
    if (!startupData) {
        return (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
             <IconInfoCircle size={32} className="mx-auto mb-2 text-gray-400" />
             <p className="text-sm font-medium">No Profile Data</p>
             <p className="text-xs">Cannot generate insights without startup profile information.</p>
          </div>
        );
    }

    // 3. Handle different analysis statuses
    switch (startupData.analysis_status) {
      case 'completed':
        const analysisData = startupData.ai_analysis as AIAnalysisData | null; // Type assertion

        if (analysisData) {
           // Check if there's any actual content to display using the new structure
           const hasContent = analysisData.executive_summary ||
                             analysisData.swot_analysis ||
                             analysisData.scalability_assessment ||
                             analysisData.competitive_advantage_evaluation ||
                             analysisData.strategic_recommendations?.length > 0 ||
                             analysisData.suggested_kpis?.length > 0;

          if (!hasContent) {
            return (
               <p className="text-center text-xs text-gray-500 italic py-4">AI analysis complete, but no specific insights were generated in the expected format.</p>
            )
          }

          // --- Render the structured analysis data ---
          return (
            <div className="space-y-6">

              {/* Executive Summary */}
              {analysisData.executive_summary && (
                <Alert color="info" icon={IconReportAnalytics} rounded className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                  <h6 className="font-semibold text-sm mb-1 text-blue-800 dark:text-blue-300">Executive Summary</h6>
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">{analysisData.executive_summary}</p>
                </Alert>
              )}

              {/* SWOT Analysis */}
              {analysisData.swot_analysis && (
                 <div>
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm flex items-center">
                        <IconListCheck size={16} className="mr-1.5 text-cyan-500" /> SWOT Analysis
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Strengths */}
                        {analysisData.swot_analysis.strengths?.length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                                <h5 className="font-medium text-green-700 dark:text-green-300 mb-1.5 flex items-center"><IconThumbUp size={14} className="mr-1" /> Strengths</h5>
                                <ul className="list-disc list-inside space-y-1 text-green-600 dark:text-green-400 pl-1">
                                    {analysisData.swot_analysis.strengths.map((s, i) => <li key={`swot-s-${i}`}>{s}</li>)}
                                </ul>
                            </div>
                        )}
                        {/* Weaknesses */}
                        {analysisData.swot_analysis.weaknesses?.length > 0 && (
                             <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
                                <h5 className="font-medium text-red-700 dark:text-red-300 mb-1.5 flex items-center"><IconThumbDown size={14} className="mr-1" /> Weaknesses</h5>
                                <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400 pl-1">
                                    {analysisData.swot_analysis.weaknesses.map((w, i) => <li key={`swot-w-${i}`}>{w}</li>)}
                                </ul>
                            </div>
                        )}
                        {/* Opportunities */}
                        {analysisData.swot_analysis.opportunities?.length > 0 && (
                             <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                                <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-1.5 flex items-center"><IconTrendingUp size={14} className="mr-1" /> Opportunities</h5>
                                <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400 pl-1">
                                    {analysisData.swot_analysis.opportunities.map((o, i) => <li key={`swot-o-${i}`}>{o}</li>)}
                                </ul>
                            </div>
                        )}
                         {/* Threats */}
                        {analysisData.swot_analysis.threats?.length > 0 && (
                             <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-300 dark:border-yellow-700">
                                <h5 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1.5 flex items-center"><IconAlertTriangle size={14} className="mr-1" /> Threats</h5>
                                <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-400 pl-1">
                                    {analysisData.swot_analysis.threats.map((t, i) => <li key={`swot-t-${i}`}>{t}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                 </div>
              )}

              {/* Scalability Assessment */}
              {analysisData.scalability_assessment && (
                 <div>
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm flex items-center">
                       <IconScale size={16} className="mr-1.5 text-purple-500" /> Scalability Assessment
                    </h6>
                    <div className="flex items-center space-x-2 mb-1">
                       <Badge color={getScalabilityColor(analysisData.scalability_assessment.level)} size="sm">{analysisData.scalability_assessment.level}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{analysisData.scalability_assessment.justification}</p>
                 </div>
              )}

              {/* Competitive Advantage Evaluation */}
              {analysisData.competitive_advantage_evaluation && (
                <div>
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm flex items-center">
                    <IconShieldCheck size={16} className="mr-1.5 text-teal-500" /> Competitive Advantage
                  </h6>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-1"><strong className="font-medium text-gray-700 dark:text-gray-300">Assessment:</strong> {analysisData.competitive_advantage_evaluation.assessment}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"><strong className="font-medium text-gray-700 dark:text-gray-300">Suggestion:</strong> {analysisData.competitive_advantage_evaluation.suggestion}</p>
                </div>
              )}

              {/* Strategic Recommendations */}
              {analysisData.strategic_recommendations?.length > 0 && (
                <div>
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm flex items-center">
                    <IconBulb size={16} className="mr-1.5 text-orange-500" /> Strategic Recommendations
                  </h6>
                  <ul className="list-decimal list-inside space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pl-2">
                    {analysisData.strategic_recommendations.map((rec, i) => <li key={`rec-${i}`}>{rec}</li>)}
                  </ul>
                </div>
              )}

              {/* Suggested KPIs */}
              {analysisData.suggested_kpis?.length > 0 && (
                <div>
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm flex items-center">
                    <IconTargetArrow size={16} className="mr-1.5 text-indigo-500" /> Suggested KPIs to Track
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.suggested_kpis.map((kpi, i) => (
                       <Badge key={`kpi-${i}`} color="indigo" size="xs" className="font-medium">{kpi}</Badge>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        } else {
          // Completed status but no analysis data - indicates an issue
          return (
            <div className="text-center text-orange-500 dark:text-orange-400 py-4">
              <IconInfoCircle size={32} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Analysis Data Missing</p>
              <p className="text-xs">Analysis was marked complete, but data is unavailable.</p>
            </div>
          );
        }
      case 'processing':
      case 'pending':
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              <Spinner aria-label="Analysis in progress" size="lg" className="mx-auto mb-3" />
              <p className="text-sm font-medium">AI Analysis in Progress</p>
              <p className="text-xs">Insights are being generated and will appear here shortly.</p>
              {onRefreshRequest && (
                  <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-3">
                      <IconRefresh size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`}/>
                      Check Status
                  </Button>
              )}
            </div>
        );
      case 'failed':
        return (
            <div className="text-center text-red-500 dark:text-red-400 py-4">
               <IconX size={32} className="mx-auto mb-2" />
               <p className="text-sm font-medium">AI Analysis Failed</p>
               <p className="text-xs">We encountered an error generating insights. Please try refreshing later or contact support.</p>
               {onRefreshRequest && (
                  <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-3">
                      <IconRefresh size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`}/>
                      Retry Analysis
                  </Button>
                )}
            </div>
        );
      default: // Includes null or unexpected status values
        return (
           <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              <IconRobot size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">AI Analysis Not Started</p>
              <p className="text-xs">Insights will be generated after profile creation.</p>
              {/* Optionally add a manual trigger button here if needed */} 
              {onRefreshRequest && (
                <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-3">
                  <IconRefresh size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`}/>
                  Check for Analysis
                </Button>
              )}
           </div>
        );
    }
  };

  return (
    <Card className="h-full flex flex-col"> {/* Ensure card takes full height */}
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex items-center">
            <IconBulb size={18} className="mr-2 text-yellow-400" />
            AI Insights & Recommendations
          </h5>
          <div className="flex items-center gap-2">
              {/* Keep Refresh button if parent provides handler */}
              {onRefreshRequest && (
                <Tooltip content="Refresh AI Insights">
                  <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing}>
                    <IconRefresh size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  </Button>
                </Tooltip>
              )}
              {/* Add other controls if needed later, e.g., share */}
              {/* <Button size="xs" color="light" onClick={() => console.log("Share action")}>
                  <IconShare size={14} />
              </Button> */}
              <Dropdown label="" dismissOnClick={false} renderTrigger={() => <Button size="xs" color="light" className="px-1.5"><IconDotsVertical size={16} /></Button>}>
                  <Dropdown.Item>View History (TBD)</Dropdown.Item>
                  <Dropdown.Item>Provide Feedback (TBD)</Dropdown.Item>
              </Dropdown>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
          {renderContent()}
      </div>
    </Card>
  );
};

export default AIInsightsSection;
