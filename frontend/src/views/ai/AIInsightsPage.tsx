import React, { useState, useEffect, useRef } from 'react';
import { Card, Spinner, Alert, Badge, Button, Tooltip, Tabs } from 'flowbite-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { StartupProfile } from '@/types/database';
import AIInsightsSection from '@/components/dashboards/startup/AIInsightsSection';
import {
  IconBrain,
  IconBulb,
  IconRobot,
  IconRefresh,
  IconArrowRight,
  IconReportAnalytics,
  IconScale,
  IconCurrencyDollar,
  IconDownload
} from "@tabler/icons-react";
import {
  KeyMetricsSection,
  FinancialPerformanceCard,
  GrowthPlanCard,
  ProjectionsRisksCard
} from "@/components/dashboards/startup";
import { toast } from 'react-hot-toast';
import ComingSoonPlaceholder from '@/components/placeholders/ComingSoonPlaceholder';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AnalysisReportDocument from '@/components/pdf/AnalysisReportDocument';

const AIInsightsPage: React.FC = () => {
  const { user, userRole } = useAuth();
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [parsedAnalysisData, setParsedAnalysisData] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const realtimeChannel = useRef<any>(null);

  // Fetch startup data if the user is a startup
  useEffect(() => {
    const fetchStartupData = async () => {
      if (!user || userRole !== 'startup') {
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      setDataError(null);

      try {
        const { data, error, status } = await supabase
          .from('startups')
          .select('*, ai_analysis, analysis_status, analysis_timestamp')
          .eq('user_id', user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setStartupData(data);
        } else {
          setStartupData(null);
          setDataError("Startup profile not found.");
        }
      } catch (error: any) {
        console.error("Error fetching startup data for AI page:", error.message);
        setDataError("Failed to load startup profile data. Please try again later.");
        setStartupData(null);
      } finally {
        setDataLoading(false);
      }
    };

    fetchStartupData();
  }, [user, userRole]);

  // ++ Add Realtime Subscription Effect ++
  useEffect(() => {
    const startupId = startupData?.id;

    // Ensure cleanup happens if previous channel exists
    if (realtimeChannel.current) {
      supabase.removeChannel(realtimeChannel.current);
      realtimeChannel.current = null;
      console.log(`Realtime: Removed previous channel.`);
    }

    if (startupId && userRole === 'startup') {
      console.log(`Realtime: Subscribing to updates for startup: ${startupId}`);
      const channel = supabase
        .channel(`ai_page_startup_${startupId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'startups', filter: `id=eq.${startupId}` },
          (payload) => {
            console.log('Realtime: Update Received on AI Page:', payload);
            const updatedRecord = payload.new as StartupProfile;
            // Update the main startupData state
            setStartupData(updatedRecord);
            // Toast notification for completion/failure can be added here if desired
            if (updatedRecord.analysis_status === 'completed') {
               toast.success('AI analysis updated.', { id: `analysis-update-${startupId}`, duration: 2500 });
            } else if (updatedRecord.analysis_status === 'failed') {
                toast.error('AI analysis failed to complete.', { id: `analysis-fail-${startupId}`, duration: 2500 });
            }
          }
        )
        .subscribe((status, err) => {
           if (status === 'SUBSCRIBED') {
              console.log(`Realtime: Successfully subscribed on AI Page for startup: ${startupId}`);
           } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
               console.error(`Realtime: Subscription error on AI Page for ${startupId}:`, status, err);
               toast.error(`Realtime connection issue: ${err?.message || status}. Analysis updates might be delayed.`);
           }
        });

      realtimeChannel.current = channel;

      // Cleanup function for this specific effect instance
      return () => {
        if (realtimeChannel.current) {
          console.log(`Realtime: Unsubscribing on AI Page for startup: ${startupId}`);
          supabase.removeChannel(realtimeChannel.current);
          realtimeChannel.current = null;
        }
      };
    } else {
        // console.log("Realtime: No startup ID or user not a startup, skipping subscription.");
    }

    // General cleanup if component unmounts or dependencies change causing removal
    return () => {
        if (realtimeChannel.current) {
           console.log(`Realtime: Cleaning up channel in AI Page main return.`);
           supabase.removeChannel(realtimeChannel.current);
           realtimeChannel.current = null;
        }
      }

  }, [startupData?.id, userRole]); // Depend on startupId and role

  // useEffect to parse analysis data when startupData changes (this will now run after Realtime update)
  useEffect(() => {
    if (startupData && startupData.ai_analysis) {
      try {
        if (typeof startupData.ai_analysis === 'object') {
          setParsedAnalysisData(startupData.ai_analysis);
        } else if (typeof startupData.ai_analysis === 'string') {
          const parsed = JSON.parse(startupData.ai_analysis);
          setParsedAnalysisData(parsed);
        } else {
          console.warn("ai_analysis is neither object nor string:", typeof startupData.ai_analysis);
          setParsedAnalysisData({ error: "Unexpected analysis data format." });
        }
      } catch (error) {
        console.error("Failed to parse ai_analysis JSON:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown parsing error";
        setParsedAnalysisData({ error: `Failed to parse analysis data. Details: ${errorMessage}` });
      }
    } else {
      setParsedAnalysisData(null);
    }
  }, [startupData]);

  // Add Analysis Refresh Handler
  const handleAnalysisRefresh = async () => {
    if (!startupData?.id) {
      toast.error("Cannot trigger analysis: Startup ID missing.");
      return;
    }

    setIsRefreshing(true);
    const toastId = toast.loading("Requesting new AI analysis...");

    try {
      const { error } = await supabase.functions.invoke('request-analysis', {
        body: { startup_id: startupData.id },
      });

      if (error) {
        throw error;
      }
      toast.success("Analysis request received! Processing in background...", { id: toastId });
      // Realtime listener in AIInsightsSection should handle updates

    } catch (error: any) {
      toast.error(`Failed to request analysis: ${error.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern page header with gradient */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
            <IconBrain size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              AI Insights
              <Badge color="purple" className="ml-3">BETA</Badge>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Powerful AI-driven analysis and personalized recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Moved Welcome Card Above the Main Grid */}
      <div className="mb-8">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-0.5 rounded-lg bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
                  <IconBulb size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">AI-Powered Insights</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our AI engine analyzes your data to provide valuable insights and recommendations tailored to your profile.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                    <IconRobot size={16} className="mr-2 text-purple-500" />
                    Personalized Analysis
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get deep insights into your business metrics and performance indicators.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                    <IconBrain size={16} className="mr-2 text-indigo-500" />
                    Smart Recommendations
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive AI-driven suggestions to improve your chances of success.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                  Learn more about our AI capabilities
                  <IconArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Content area - Centralized Loading/Error Handling */}
      {dataLoading && userRole === 'startup' ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="xl" color="purple" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your insights...</p>
        </div>
      ) : dataError && userRole === 'startup' ? (
        <Alert color="failure" className="mb-4">
          {`Error loading startup insights: ${dataError}`}
        </Alert>
      ) : (
        // Render role-specific content grid ONLY if not loading/erroring on initial fetch
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
          {/* Startup AI Insights Section */}
          {userRole === 'startup' && startupData && ( // Check for startupData exists
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <IconRobot size={20} className="mr-2" />
                      Startup Analytics
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      AI-powered analysis of your startup's data
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tooltip content="Request New AI Analysis">
                      <Button 
                        size="sm" 
                        color="light" 
                        className="bg-white/20 hover:bg-white/30 border-0 text-white"
                        onClick={handleAnalysisRefresh}
                        isProcessing={isRefreshing} 
                        disabled={isRefreshing}
                      >
                        <IconRefresh size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        <span className="ml-2 hidden sm:inline">Refresh</span>
                      </Button>
                    </Tooltip>
                    {parsedAnalysisData && startupData && (
                      <PDFDownloadLink
                        document={<AnalysisReportDocument startupData={startupData} analysisData={parsedAnalysisData} />}
                        fileName={`RISE-AI-Analysis-${startupData?.name || 'Startup'}.pdf`}
                       >
                         {({ loading, error }) => (
                           <Tooltip content={loading ? "Generating PDF..." : error ? "PDF Error!" : "Export as PDF"}>
                             <Button
                               size="sm"
                               color="light"
                               className="bg-white/20 hover:bg-white/30 border-0 text-white"
                               disabled={loading || isRefreshing} 
                             >
                               {loading ? <Spinner size="sm" /> : <IconDownload size={16} />}
                               <span className="ml-2 hidden sm:inline">
                                 {loading ? 'Generating...' : 'Export'}
                               </span>
                             </Button>
                           </Tooltip>
                         )}
                      </PDFDownloadLink>
                    )}
                    {!parsedAnalysisData && startupData && (
                         <Tooltip content="Analysis data needed to export PDF">
                             <Button
                               size="sm"
                               color="light"
                               className="bg-white/20 border-0 text-white opacity-50 cursor-not-allowed"
                               disabled={true}
                             >
                               <IconDownload size={16} />
                               <span className="ml-2 hidden sm:inline">Export</span>
                            </Button>
                        </Tooltip>
                    )}
                  </div>
                </div>
                <div className="p-4 md:p-6" id="ai-analysis-tabs-content"> 
                   <Tabs aria-label="AI Analysis Tabs" variant="underline">
                      {/* Tab 1: Analysis Overview */}
                      <Tabs.Item active title="Overview" icon={IconReportAnalytics}>
                         <div className="pt-4" id="ai-tab-content-overview">
                           <AIInsightsSection startupData={startupData} isLoading={dataLoading} />
                         </div>
                      </Tabs.Item>

                      {/* Tab 2: Readiness & KPIs */}
                      <Tabs.Item title="Readiness & KPIs" icon={IconScale}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4" id="ai-tab-content-readiness">
                           {/* Comment out FundingReadinessCard for this test */}
                           {/* <div className="lg:col-span-1">
                              <FundingReadinessCard
                                analysisData={parsedAnalysisData}
                                isLoading={dataLoading}
                              />
                            </div> */}
                            {/* Ensure KeyMetricsSection is active */}
                            <div className="lg:col-span-2">
                              <KeyMetricsSection 
                                analysisData={parsedAnalysisData} 
                                startupData={startupData}
                                isLoading={dataLoading} 
                              />
                            </div>
                         </div>
                      </Tabs.Item>

                      {/* Tab 3: Financials & Growth */}
                      <Tabs.Item title="Financials & Growth" icon={IconCurrencyDollar}> 
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4" id="ai-tab-content-financials">
                           <div className="lg:col-span-1">
                              <FinancialPerformanceCard
                                analysisData={parsedAnalysisData}
                                isLoading={dataLoading}
                              />
                            </div>
                            <div className="lg:col-span-1">
                              <GrowthPlanCard
                                analysisData={parsedAnalysisData}
                                isLoading={dataLoading}
                              />
                            </div>
                            <div className="lg:col-span-1">
                              <ProjectionsRisksCard
                                analysisData={parsedAnalysisData}
                                isLoading={dataLoading}
                              />
                            </div>
                        </div>
                      </Tabs.Item>
                   </Tabs>
                </div>
              </div>
            </div>
          )}

          {/* Investor AI Suggestions Section */}
          {userRole === 'investor' && (
            <div className="xl:col-span-1">
              <ComingSoonPlaceholder 
                featureName="AI-Powered Startup Suggestions"
                description="Our AI engine is learning! Soon, you'll find personalized startup recommendations matched to your investment criteria right here."
              />
            </div>
          )}

          {/* Placeholder if role is neither or loading role - Simplified */}
          {!userRole && (
            <div className="xl:col-span-1 flex items-center justify-center py-12 text-center">
               <Spinner size="lg" color="purple" />
               <p className="ml-3 text-gray-500 dark:text-gray-400">Determining your role...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsightsPage; 