import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tabs, Badge, Button, Dropdown, Spinner, Alert, Textarea, Tooltip } from 'flowbite-react';
import { StartupProfile, AIAnalysisData, SWOTAnalysis, ScalabilityAssessment, CompetitiveAdvantageEvaluation, WhatIfScenario, GrowthPlanPhase, SuggestedKpiItem } from '../../../types/database'; // Import all needed types
import { supabase } from '../../../lib/supabaseClient';
import { toast } from 'react-hot-toast';
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
  IconExclamationCircle,
  IconHelpCircle,
  IconMapPin,          // Added
  IconCurrencyDollar,  // Added
  IconCalendarEvent,     // Added
} from "@tabler/icons-react";

// --- Component Props Interface ---
interface AIInsightsSectionProps {
    startupData: StartupProfile | null;
    isLoading: boolean; // Parent loading state
    onRefreshRequest?: () => void;
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
const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ startupData, isLoading, onRefreshRequest }) => {
  const [isRefreshing, setIsRefreshing] = useState(false); // Internal state for refresh button UI

  // Consolidate handleRefresh logic here
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
      if (error) throw error;
      toast.dismiss();
      toast.success("Analysis requested! Check back shortly.");
      if (onRefreshRequest) setTimeout(onRefreshRequest, 1500); // Trigger parent refresh after delay
    } catch (error: any) {
      toast.dismiss();
      console.error("Error requesting analysis:", error);
      toast.error(`Failed to request analysis: ${error.message || 'Unknown error'}`);
      } finally {
        setIsRefreshing(false);
    }
  };

  // --- Main Rendering Logic --- 
  const renderContent = () => {
    // 1. Handle overall loading state from parent
    if (isLoading && !isRefreshing) { // Show skeleton only if parent is loading initially
      return (
          <div className="space-y-5 animate-pulse p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
          </div>
      );
    }

    // 2. Handle no startup data
    if (!startupData) {
        return (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
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

        if (!analysisData || typeof analysisData !== 'object') {
          return (
            <Alert color="warning" icon={IconInfoCircle}>
              AI analysis data is missing or has an invalid format.
            </Alert>
          );
        }

         // Check if there's *any* content to display
         const hasAnyContent = Object.values(analysisData).some(value => value !== null && value !== undefined && (!Array.isArray(value) || value.length > 0));

         if (!hasAnyContent) {
           return (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                <IconInfoCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">No Specific Insights Generated</p>
                <p className="text-xs">Analysis complete, but no detailed content found.</p>
              </div>
           )
         }

          // --- Render ALL structured analysis data within this component ---
          return (
            <div className="space-y-6 text-sm p-1">

              {/* Executive Summary */}
              {analysisData.executive_summary && typeof analysisData.executive_summary === 'string' ? (
                <Alert color="info" icon={IconReportAnalytics} rounded className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 shadow-sm">
                  <h6 className="font-semibold text-sm mb-1 text-blue-800 dark:text-blue-300">Executive Summary</h6>
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">{analysisData.executive_summary}</p>
                </Alert>
              ) : null}

              {/* --- Section Divider --- */}
              <hr className="my-6 border-gray-200 dark:border-gray-700" />

              {/* --- SWOT Analysis --- */}
              {analysisData.swot_analysis && typeof analysisData.swot_analysis === 'object' ? (
                 <div id="swot-section">
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-3 text-base flex items-center">
                        <IconListCheck size={18} className="mr-2 text-cyan-500" /> SWOT Analysis
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Strengths */}
                        {Array.isArray(analysisData.swot_analysis.strengths) && analysisData.swot_analysis.strengths.length > 0 ? (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700 min-h-[6rem]">
                                <h5 className="font-medium text-green-700 dark:text-green-300 mb-1.5 flex items-center"><IconThumbUp size={14} className="mr-1" /> Strengths</h5>
                                <ul className="list-disc list-inside space-y-1 text-green-600 dark:text-green-400 pl-1">
                                    {analysisData.swot_analysis.strengths.map((s, i) => renderListItem(s, `swot-s-${i}`))}
                                </ul>
                            </div>
                        ) : <div className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[6rem]">No strengths listed.</div>}
                        {/* Weaknesses */}
                        {Array.isArray(analysisData.swot_analysis.weaknesses) && analysisData.swot_analysis.weaknesses.length > 0 ? (
                             <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700 min-h-[6rem]">
                                <h5 className="font-medium text-red-700 dark:text-red-300 mb-1.5 flex items-center"><IconThumbDown size={14} className="mr-1" /> Weaknesses</h5>
                                <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400 pl-1">
                                    {analysisData.swot_analysis.weaknesses.map((w, i) => renderListItem(w, `swot-w-${i}`))}
                                </ul>
                            </div>
                        ) : <div className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[6rem]">No weaknesses listed.</div>}
                        {/* Opportunities */}
                        {Array.isArray(analysisData.swot_analysis.opportunities) && analysisData.swot_analysis.opportunities.length > 0 ? (
                             <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700 min-h-[6rem]">
                                <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-1.5 flex items-center"><IconTrendingUp size={14} className="mr-1" /> Opportunities</h5>
                                <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400 pl-1">
                                    {analysisData.swot_analysis.opportunities.map((o, i) => renderListItem(o, `swot-o-${i}`))}
                                </ul>
                            </div>
                        ) : <div className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[6rem]">No opportunities listed.</div>}
                         {/* Threats */}
                        {Array.isArray(analysisData.swot_analysis.threats) && analysisData.swot_analysis.threats.length > 0 ? (
                             <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-300 dark:border-yellow-700 min-h-[6rem]">
                                <h5 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1.5 flex items-center"><IconAlertTriangle size={14} className="mr-1" /> Threats</h5>
                                <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-400 pl-1">
                                     {analysisData.swot_analysis.threats.map((t, i) => renderListItem(t, `swot-t-${i}`))}
                                </ul>
                            </div>
                        ) : <div className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[6rem]">No threats listed.</div>}
                    </div>
                 </div>
              ) : (
                  <Alert color="gray" icon={IconInfoCircle} className="text-xs">
                    SWOT analysis data not found in analysis.
                  </Alert>
              )}

              {/* --- Section Divider --- */}
              <hr className="my-6 border-gray-200 dark:border-gray-700" />

             {/* --- Market Positioning --- */}
             {analysisData.market_positioning && typeof analysisData.market_positioning === 'string' ? (
               <div id="market-pos-section">
                 <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-base flex items-center">
                   <IconMapPin size={18} className="mr-2 text-lime-500" /> Market Positioning
                 </h6>
                 <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7 text-xs">
                   {analysisData.market_positioning}
                 </p>
               </div>
             ) : null}

              {/* --- Scalability Assessment --- */}
              {analysisData.scalability_assessment && typeof analysisData.scalability_assessment === 'object' ? (
                 <div id="scalability-section" className="mt-4">
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-base flex items-center">
                       <IconScale size={18} className="mr-2 text-purple-500" /> Scalability Assessment
                    </h6>
                    <div className="flex items-start space-x-3 mb-1 pl-7">
                       <Badge color={getScalabilityColor(analysisData.scalability_assessment.level)} size="sm" className="mt-0.5 flex-shrink-0">{analysisData.scalability_assessment.level}</Badge>
                       <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{analysisData.scalability_assessment.justification}</p>
                    </div>
                 </div>
              ) : null}

              {/* --- Competitive Advantage Evaluation --- */}
              {analysisData.competitive_advantage_evaluation && typeof analysisData.competitive_advantage_evaluation === 'object' ? (
                <div id="comp-adv-section" className="mt-4">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-base flex items-center">
                    <IconShieldCheck size={18} className="mr-2 text-teal-500" /> Competitive Advantage
                  </h6>
                  <div className="pl-7 space-y-1 text-xs">
                    {analysisData.competitive_advantage_evaluation.assessment && <p className="text-gray-600 dark:text-gray-400 leading-relaxed"><strong className="font-medium text-gray-700 dark:text-gray-300">Assessment:</strong> {analysisData.competitive_advantage_evaluation.assessment}</p>} 
                    {analysisData.competitive_advantage_evaluation.suggestion && <p className="text-gray-600 dark:text-gray-400 leading-relaxed"><strong className="font-medium text-gray-700 dark:text-gray-300">Suggestion:</strong> {analysisData.competitive_advantage_evaluation.suggestion}</p>}
                  </div>
                </div>
              ) : null}

             {/* --- Section Divider --- */}
             <hr className="my-6 border-gray-200 dark:border-gray-700" />

              {/* --- Current Challenges --- */}
              {Array.isArray(analysisData.current_challenges) && analysisData.current_challenges.length > 0 ? (
                <div id="challenges-section">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-base flex items-center">
                    <IconExclamationCircle size={18} className="mr-2 text-red-500" /> Key Challenges
                  </h6>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pl-9">
                    {analysisData.current_challenges.map((challenge, i) => renderListItem(challenge, `challenge-${i}`))}
                  </ul>
                </div>
              ) : null}

              {/* --- Key Risks --- */}
              {Array.isArray(analysisData.key_risks) && analysisData.key_risks.length > 0 ? (
                <div id="risks-section" className="mt-4">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-base flex items-center">
                    <IconAlertTriangle size={18} className="mr-2 text-orange-600" /> Key Risks
                  </h6>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pl-9">
                      {analysisData.key_risks.map((r, i) => renderListItem(r, `risk-${i}`))}
                  </ul>
                </div>
              ) : null}

             {/* --- Section Divider --- */}
             <hr className="my-6 border-gray-200 dark:border-gray-700" />

              {/* --- Strategic Recommendations --- */}
              {Array.isArray(analysisData.strategic_recommendations) && analysisData.strategic_recommendations.length > 0 ? (
                <div id="recommendations-section">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-base flex items-center">
                    <IconBulb size={18} className="mr-2 text-orange-500" /> Strategic Recommendations
                  </h6>
                  <ul className="list-decimal list-inside space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pl-9">
                    {analysisData.strategic_recommendations.map((rec, i) => renderListItem(rec, `rec-${i}`))}
                  </ul>
                </div>
              ) : null}

              {/* --- Suggested KPIs --- */}
              {Array.isArray(analysisData.suggested_kpis) && analysisData.suggested_kpis.length > 0 ? (
                <div id="kpis-section" className="mt-4">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-base flex items-center">
                    <IconTargetArrow size={18} className="mr-2 text-indigo-500" /> Suggested KPIs to Track
                  </h6>
                  <div className="space-y-2 pl-7">
                    {analysisData.suggested_kpis.map((item, i) => {
                       if (!item || typeof item.kpi !== 'string') return null;
                       const kpiName = item.kpi;
                       const justification = typeof item.justification === 'string' ? item.justification : null;
                       return (
                         <div key={`kpi-${i}`} className="text-xs">
                            <p className="font-medium text-gray-800 dark:text-white mb-0.5">{kpiName}</p>
                            {justification && <p className="text-gray-500 dark:text-gray-400 leading-snug">{justification}</p>}
                         </div>
                       );
                    })}
                  </div>
                </div>
              ) : null}

              {/* --- What If Scenarios --- */}
              {Array.isArray(analysisData.what_if_scenarios) && analysisData.what_if_scenarios.length > 0 ? (
                <div id="scenarios-section" className="mt-4">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-base flex items-center">
                    <IconHelpCircle size={18} className="mr-2 text-purple-500" /> "What If" Scenarios
                  </h6>
                  <div className="space-y-3 pl-7">
                    {analysisData.what_if_scenarios.map((item, i) => {
                       if (!item || typeof item.scenario !== 'string' || typeof item.outcome !== 'string') return null;
                       return (
                         <div key={`whatif-${i}`} className="p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-xs">
                           <p className="font-medium text-purple-700 dark:text-purple-300 mb-0.5">Scenario: <span className="font-normal text-gray-700 dark:text-gray-300">{item.scenario}</span></p>
                           <p className="font-medium text-purple-700 dark:text-purple-300">Potential Outcome: <span className="font-normal text-gray-700 dark:text-gray-300">{item.outcome}</span></p>
                         </div>
                       );
                    })}
                  </div>
                </div>
              ) : null}

             {/* --- Section Divider --- */}
             <hr className="my-6 border-gray-200 dark:border-gray-700" />

              {/* --- Growth Plan --- */}
              {Array.isArray(analysisData.growth_plan_phases) && analysisData.growth_plan_phases.length > 0 ? (
                <div id="growth-plan-section">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-2 text-base flex items-center">
                    <IconCalendarEvent size={18} className="mr-2 text-teal-500" /> AI Growth Plan Outline
                  </h6>
                  <div className="space-y-3 pl-7">
                    {analysisData.growth_plan_phases.map((phase, i) => {
                       if (!phase || typeof phase !== 'object') return null;
                       const period = typeof phase.period === 'string' ? phase.period : '[Missing Period]';
                       const focus = typeof phase.focus === 'string' ? phase.focus : '[Missing Focus]';
                       const description = typeof phase.description === 'string' ? phase.description : '[Missing Description]';
    return (
                         <div key={`growth-${i}`} className="text-xs border-l-2 border-teal-300 dark:border-teal-700 pl-3 py-1.5 space-y-0.5">
                           <p className="font-semibold text-teal-700 dark:text-teal-300">{period}: <span className="font-medium text-gray-800 dark:text-white">{focus}</span></p>
                           <p className="text-gray-600 dark:text-gray-400 leading-snug">{description}</p>
       </div>
    );
                    })}
                  </div>
                </div>
              ) : null}

              {/* --- Funding Outlook --- */}
              {analysisData.funding_outlook && typeof analysisData.funding_outlook === 'string' ? (
                <div id="funding-section" className="mt-4">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-base flex items-center">
                    <IconCurrencyDollar size={18} className="mr-2 text-green-500" /> Funding Outlook
                  </h6>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7 text-xs">
                    {analysisData.funding_outlook}
                  </p>
                </div>
              ) : null}

            </div> // End main space-y-6 container
          );
        // --- End Rendering of 'completed' status ---

      case 'processing':
      case 'pending':
  return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <Spinner aria-label="Analysis in progress" size="xl" className="mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">AI Analysis in Progress</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Insights are being generated and will appear here shortly.</p>
              {onRefreshRequest && (
                  <Button size="sm" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-4">
                      <IconRefresh size={15} className={`mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`}/>
                      Check Status
                  </Button>
              )}
            </div>
        );
      case 'failed':
        return (
            <div className="text-center text-red-600 dark:text-red-400 py-10">
               <IconX size={40} className="mx-auto mb-3" />
               <p className="text-lg font-semibold">AI Analysis Failed</p>
               <p className="text-sm text-red-500 dark:text-red-400">We encountered an error generating insights. Please try again later.</p>
               {onRefreshRequest && (
                  <Button size="sm" color="failure" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-4">
                      <IconRefresh size={15} className={`mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`}/>
                      Retry Analysis
                  </Button>
                )}
          </div>
        );
      default: // Includes null or unexpected status values
        return (
           <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <IconRobot size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">AI Analysis Not Started</p>
              <p className="text-sm">Click the refresh button to request an analysis.</p>
              {onRefreshRequest && (
                <Button size="sm" color="info" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-4">
                  <IconRefresh size={15} className={`mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`}/>
                  Request Analysis
                </Button>
              )}
      </div>
        );
    }
  };

  // --- Component Return --- 
  // Remove Card wrapper from here, it will be applied in the parent (StartupDashboard)
  return (
      <div className="flex-grow overflow-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
          {renderContent()}
      </div>
  );
};

export default AIInsightsSection;

