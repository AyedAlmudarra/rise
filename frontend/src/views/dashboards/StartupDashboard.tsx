import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { StartupProfile, AIAnalysisData } from '@/types/database';
import { Spinner, Alert, Badge, Card, Avatar, Button, Dropdown, Timeline, Tooltip, Tabs, Label } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  
  IconRefresh,
  
  IconBuilding,
  IconChartPie,
  IconRobot,
  IconUsers,
  IconBell,

  IconSettings,
  
  IconCalendar,
  IconMail,
  IconDownload,
  IconArrowRight,
  IconCheck,
  IconX,
  IconInfoCircle,
  
  IconTrendingUp,
  IconDotsVertical,
  
  IconListCheck,
  
  IconCurrencyDollar,
  IconTargetArrow,
  IconAlertTriangle,
  IconCalendarEvent,
  
  IconActivity,
  IconEdit,
  IconBuildingSkyscraper,
  IconUserCheck,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowsExchange,
  IconEye,
} from "@tabler/icons-react";

// Import the refactored section components
import {
  CompanyOverviewCard,
  KeyMetricsSection,
  AIInsightsSection,
  FundingReadinessCard,
  FinancialPerformanceCard,
  GrowthPlanCard,
  ProjectionsRisksCard
} from "@/components/dashboards/startup";
import ComingSoonPlaceholder from "@/components/placeholders/ComingSoonPlaceholder";
import UpdateMetricsModal from "@/components/modals/UpdateMetricsModal";


// Remove helper functions (moved to KeyMetricsSection)
// const formatCurrency = ...
// const formatPercentage = ...

// Remove old section component definitions
// const KeyMetricsSection = ...
// const AIInsightsSection = ...
// const FundingReadinessSection = ...
// const InvestorInterestSection = ...

// Removed unused CardBox component
// const CardBox: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
//     <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 h-full ${className}`}>
//         {children}
//     </div>
// );

// Removed unused DashboardCard component
// const DashboardCard: React.FC<{ ... }> = ({ ... }) => ( ... );

// --- Main StartupDashboard Component ---

const StartupDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Helper Functions (Defined inside component scope) ---
  const formatCurrency = (value: number | null | undefined): string => {
    if (value == null || isNaN(value)) return 'N/A';
    return `$${value.toLocaleString('en-US')}`;
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (value == null || isNaN(value)) return 'N/A';
    return value.toLocaleString('en-US');
  };

  const formatPercentage = (value: number | null | undefined): string => {
      if (value == null || isNaN(value)) return 'N/A';
      return `${value.toFixed(1)}%`;
  }

  // --- State Variables ---
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [parsedAnalysisData, setParsedAnalysisData] = useState<AIAnalysisData | null>(null);
  const [analysisParsingError, setAnalysisParsingError] = useState<string | null>(null);

  // Loading States
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshingAnalysis, setIsRefreshingAnalysis] = useState<boolean>(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState<boolean>(false);

  // Error States
  const [initialFetchError, setInitialFetchError] = useState<string | null>(null);
  const [analysisRequestError, setAnalysisRequestError] = useState<string | null>(null);

  // UI State
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationCount] = useState<number>(0); // Removed unused setter

  // Realtime subscription reference
  const realtimeChannel = useRef<any>(null);

  // --- Data Fetching and Realtime ---

  const fetchStartupData = useCallback(async (showLoadingIndicator = true) => {
    if (!user) {
      setIsInitialLoading(false);
      return;
    }
    if (showLoadingIndicator) {
        setIsInitialLoading(true);
    }
    setInitialFetchError(null);
    setAnalysisParsingError(null);

    try {
      const { data, error, status } = await supabase
        .from('startups')
        .select('*') 
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) { throw error; }

      if (data) {
        setStartupData(data);
        setLastUpdated(new Date());
      } else {
        setStartupData(null);
        setInitialFetchError("Startup profile not found. Please complete your registration or contact support.");
      }
    } catch (error: any) {
      console.error("Error fetching startup data:", error);
      setInitialFetchError(`Failed to load dashboard data: ${error.message}`);
      setStartupData(null);
      toast.error("Error loading dashboard data.");
    } finally {
       if (showLoadingIndicator) { setIsInitialLoading(false); }
    }
  }, [user]);

  useEffect(() => {
    fetchStartupData();
  }, [fetchStartupData]);

  useEffect(() => {
    const startupId = startupData?.id;
    if (realtimeChannel.current) {
      supabase.removeChannel(realtimeChannel.current);
      realtimeChannel.current = null;
    }
    if (startupId) {
      const channel = supabase
        .channel(`dashboard_startup_${startupId}`)
        .on<StartupProfile>(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'startups', filter: `id=eq.${startupId}` },
          (payload) => {
            const updatedRecord = payload.new;
            setStartupData(prevData => ({ ...prevData, ...updatedRecord }));
            if (payload.old?.analysis_status !== 'completed' && updatedRecord.analysis_status === 'completed') {
               toast.success('AI analysis completed!', { id: `analysis-complete-${startupId}`});
            } else if (payload.old?.analysis_status !== 'failed' && updatedRecord.analysis_status === 'failed') {
                toast.error('AI analysis failed.', { id: `analysis-fail-${startupId}`});
            }
            setLastUpdated(new Date());
          }
        )
        .subscribe((status, err) => {
           if (status !== 'SUBSCRIBED') {
              console.error(`Realtime: Subscription error for ${startupId}:`, status, err);
              toast.error(`Realtime connection issue: ${err?.message || status}. Live updates might be delayed.`, { id: `rt-error-${startupId}`});
           }
        });
      realtimeChannel.current = channel;
    }
    return () => {
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current).catch(console.error);
        realtimeChannel.current = null;
      }
    };
  }, [startupData?.id]);

  useEffect(() => {
    setAnalysisParsingError(null);
    if (startupData?.ai_analysis) {
      try {
        let parsed: any;
        if (typeof startupData.ai_analysis === 'object') {
          parsed = startupData.ai_analysis;
        } else if (typeof startupData.ai_analysis === 'string') {
          parsed = JSON.parse(startupData.ai_analysis);
        } else {
          throw new Error("Unexpected analysis data format.");
        }
        if (typeof parsed === 'object' && parsed !== null) {
            setParsedAnalysisData(parsed);
        } else {
             throw new Error("Parsed data is not a valid object.");
        }
      } catch (error) {
        console.error("Failed to parse ai_analysis JSON:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown parsing error";
        setAnalysisParsingError(`Failed to display analysis data. Details: ${errorMessage}`);
        setParsedAnalysisData(null);
      }
    } else {
      setParsedAnalysisData(null);
    }
  }, [startupData?.ai_analysis]);

  // --- Action Handlers (Defined before render functions) ---

  const handleRefreshDashboard = () => {
    toast.loading("Refreshing dashboard data...", { id: 'refresh-dashboard' });
    fetchStartupData(false).then(() => {
      toast.dismiss('refresh-dashboard');
      toast.success("Dashboard data refreshed!", { id: 'refresh-success' });
      setLastUpdated(new Date());
    }).catch(() => {
        toast.dismiss('refresh-dashboard');
    });
  };

  const handleAnalysisRefresh = async () => {
    if (!startupData?.id) {
      toast.error("Cannot trigger analysis: Startup ID missing.");
      return;
    }
    setIsRefreshingAnalysis(true);
    setAnalysisRequestError(null);
    const toastId = toast.loading("Requesting new AI analysis...");
    try {
      const { error } = await supabase.functions.invoke('request-analysis', {
        body: { startup_id: startupData.id },
      });
      if (error) { throw error; }
      toast.success("Analysis request received! Processing...", { id: toastId });
    } catch (error: any) {
      console.error("Error requesting analysis:", error);
      const errorMsg = `Failed to request analysis: ${error.message || 'Unknown error'}`;
      setAnalysisRequestError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsRefreshingAnalysis(false);
    }
  };

  const handleOpenMetricsModal = () => setIsMetricsModalOpen(true);
  const handleCloseMetricsModal = () => setIsMetricsModalOpen(false);

  const handleMetricsUpdateSuccess = () => {
      handleRefreshDashboard();
  };

  // --- Render Functions (Defined after helpers and handlers) ---

  const renderWelcomeHeader = () => (
    // Uses formatNumber, formatCurrency - defined above
    <div className="mb-6 rounded-xl overflow-hidden shadow-md">
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 py-6 px-6">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center z-10">
          {/* Left: Avatar & Welcome Text */}
          <div className="flex items-center mb-4 md:mb-0">
         <Avatar
              img={startupData?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(startupData?.name || 'S')}&background=random&color=fff`}
              rounded size="lg"
              className="ring-4 ring-white/30 shadow-lg flex-shrink-0"
            />
            <div className="ml-4">
              {/* ++ Personalized Greeting ++ */}
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || startupData?.name || 'Founder'}!
           </h1>
              <p className="text-sm text-blue-100 flex items-center flex-wrap">
                <span className="mr-3">{startupData?.name || 'Your Startup Dashboard'}</span>
                {lastUpdated && !isInitialLoading && (
                    <Tooltip content={`Last updated: ${lastUpdated.toLocaleString('en-US')}`}>
                        <span className="flex items-center text-blue-200/80 cursor-help">
                            <IconRefresh size={14} className="mr-1"/> {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                    </Tooltip>
             )}
                {isInitialLoading && <Spinner size="xs" color="white" className="ml-2" />}
           </p>
         </div>
       </div>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
            <Tooltip content="Refresh Dashboard Data">
                <Button size="sm" color="light" className="bg-white/10 hover:bg-white/20 border-0 text-white px-2" onClick={handleRefreshDashboard} disabled={isInitialLoading}>
                  <IconRefresh size={18} className={`${isInitialLoading ? 'animate-spin' : ''}`} />
                </Button>
            </Tooltip>
             <div className="relative">
                  <Tooltip content="Notifications">
                     <Button size="sm" className="bg-white/10 hover:bg-white/20 border-0 text-white px-2" onClick={() => setShowNotifications(!showNotifications)}>
                         <IconBell size={18} />
                         {notificationCount > 0 && (
                             <div className="absolute -top-1.5 -right-1.5 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-semibold border-2 border-indigo-700">{notificationCount}</div>
                         )}
                     </Button>
                 </Tooltip>
             </div>
             <Tooltip content="More Actions">
                <Dropdown label="" dismissOnClick={true} renderTrigger={() => (<Button size="sm" className="bg-white/10 hover:bg-white/20 border-0 text-white px-2"><IconDotsVertical size={18} /></Button>)}>
                  {/* ++ Use default toast() for placeholders ++ */}
                  <Dropdown.Item icon={IconSettings} onClick={() => toast('Settings page coming soon!')}>Account Settings</Dropdown.Item>
                  <Dropdown.Item icon={IconBuilding} onClick={() => toast('Public profile view coming soon!')}>View Public Profile</Dropdown.Item>
                  <Dropdown.Item icon={IconDownload} onClick={() => toast('Export functionality coming soon!')}>Export Dashboard Data</Dropdown.Item>
            </Dropdown>
            </Tooltip>
                           </div>
                         </div>
        
        {/* Enhanced Quick Stats Row */}
        {startupData && !isInitialLoading && (
          <div className="mt-6 pt-5 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat Card Helper */}
              {[{ 
                icon: IconBuildingSkyscraper, 
                label: "Stage", 
                value: startupData.operational_stage || 'N/A'
               },{
                icon: IconUsers, 
                label: "Team Size", 
                value: formatNumber(startupData.num_employees) ?? 'N/A'
               },{
                 icon: IconUserCheck, // Changed icon
                 label: "Customers", 
                 value: formatNumber(startupData.num_customers) ?? 'N/A'
               },{
                 icon: IconCurrencyDollar,
                 label: "Revenue (Ann.)",
                 value: formatCurrency(startupData.annual_revenue) ?? 'N/A'
               }].map((stat, index) => (
                  <div key={index} className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-3 shadow-sm">
                    <div className="flex-shrink-0 bg-white/10 rounded-full p-2">
                      <stat.icon size={20} className="text-white/80"/>
                       </div>
                    <div>
                       <p className="text-xs text-blue-100 font-medium uppercase tracking-wider">{stat.label}</p>
                       <p className="text-base md:text-lg text-white font-semibold truncate" title={stat.value}>{stat.value}</p>
                 </div>
                 </div>
               ))
              }
            </div>
          </div>
        )}
         </div>
    </div>
  );

  const renderDashboardContent = () => {
    // Uses formatNumber, formatCurrency, formatPercentage - defined above
    if (isInitialLoading) {
      return (
        // ++ Enhanced Loading Skeleton ++
        <div className="mt-6 space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-1/2"></div>
             <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      );
    }

    if (initialFetchError) {
      return (
        // ++ Centered Error Message ++
        <div className="mt-6 p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-700">
            <IconAlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="font-medium text-lg text-red-700 dark:text-red-400">Error Loading Dashboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{initialFetchError}</p>
            <Button color="failure" size="sm" onClick={() => fetchStartupData()} className="mx-auto">
                <IconRefresh size={16} className="mr-2" /> Try Again
            </Button>
        </div>
      );
    }

    if (!startupData) {
       return (
            // ++ Slightly Enhanced Not Found State ++
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl mt-6 shadow-sm border border-gray-200 dark:border-gray-700">
                 <IconBuilding size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                 <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Startup Profile Not Found</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">It seems your startup profile hasn't been created yet or couldn't be loaded. Please complete your registration if you haven't already.</p>
                 <Button color="primary" size="sm" onClick={() => navigate('/register/startup')} className="mt-5 bg-blue-600 hover:bg-blue-700">
                     Complete Profile Registration
                 </Button>
            </div>
       );
    }
    
    return (
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* @ts-ignore Flowbite uses 'style' prop for variants, potentially conflicting with standard HTML style prop type */}
        <Tabs aria-label="Startup Dashboard Tabs" >

          {/* --- Tab 1: Overview --- */}
          <Tabs.Item active title="Overview" icon={IconBuilding}>
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50/50 dark:bg-gray-800/20">
               <div className="lg:col-span-2">
                   {/* ++ Wrap component to apply hover effect ++ */}
                  <div className="transition-shadow hover:shadow-lg rounded-lg overflow-hidden">
                     <CompanyOverviewCard startupData={startupData} isLoading={false} error={null} />
        </div>
              </div>
               <div className="lg:col-span-1">
                  <ComingSoonPlaceholder featureName="Investor Interest" description="Track which investors are viewing your profile, save potential leads, and manage interactions right here." />
        </div>
      </div>
          </Tabs.Item>

          {/* --- Tab 2: AI Analysis --- */}
          <Tabs.Item title="AI Analysis" icon={IconRobot}>
             {/* ++ Add subtle background & consistent spacing ++ */}
            <div className="p-4 md:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-800/20">
               <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                       <h6 className="font-semibold text-gray-800 dark:text-white">AI Analysis Status</h6>
                       <div className="flex items-center mt-1">
                           <Badge color={startupData.analysis_status === 'completed' ? 'success' : startupData.analysis_status === 'processing' ? 'info' : startupData.analysis_status === 'failed' ? 'failure' : 'gray'} size="sm" icon={startupData.analysis_status === 'completed' ? IconCheck : startupData.analysis_status === 'processing' ? IconRefresh : startupData.analysis_status === 'failed' ? IconX : IconInfoCircle }>
                              {startupData.analysis_status ? startupData.analysis_status.charAt(0).toUpperCase() + startupData.analysis_status.slice(1) : 'Not Requested'}
                            </Badge>
                            {startupData.analysis_timestamp && startupData.analysis_status === 'completed' && (
                               <Tooltip content={`Analysis completed on ${new Date(startupData.analysis_timestamp).toLocaleString('en-US')}`}>
                                   <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 cursor-help">{new Date(startupData.analysis_timestamp).toLocaleDateString('en-US')}</span>
                               </Tooltip>
                            )}
        </div>
                </div>
                     <Button size="sm" onClick={handleAnalysisRefresh} isProcessing={isRefreshingAnalysis || startupData.analysis_status === 'processing'} disabled={isRefreshingAnalysis || startupData.analysis_status === 'processing'} color="secondary" className="dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white">
                        <IconRefresh size={16} className={`mr-2 ${startupData.analysis_status === 'processing' ? 'animate-spin' : ''}`} />
                        {startupData.analysis_status === 'processing' ? 'Processing...' : 'Request New Analysis'}
                     </Button>
                  </div>
                  {analysisRequestError && (<Alert color="failure" className="mt-3 text-xs">{analysisRequestError}</Alert>)}
            </Card>
            
                {analysisParsingError && (<Alert color="warning" icon={IconAlertTriangle} className="mt-4"><span className="font-medium">Could not display analysis:</span> {analysisParsingError}</Alert>)}

               {startupData.analysis_status === 'completed' && parsedAnalysisData && !analysisParsingError && (
                 <Card className="space-y-6 transition-shadow hover:shadow-lg border-gray-200 dark:border-gray-700">
                   <AIInsightsSection startupData={startupData} isLoading={false} />
                   <hr className="my-4 border-gray-200 dark:border-gray-600"/>
                   <h6 className="text-lg font-semibold text-gray-800 dark:text-white -mt-2">AI Suggested KPIs & Financials</h6>
                   <KeyMetricsSection
                       analysisData={parsedAnalysisData}
                       startupData={startupData}
                       isLoading={isInitialLoading || isRefreshingAnalysis}
                   />
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {/* ++ Wrap components to apply hover effect ++ */}
                       <div className="transition-shadow hover:shadow-md rounded-lg overflow-hidden"><FundingReadinessCard analysisData={parsedAnalysisData} isLoading={false} /></div>
                       <div className="transition-shadow hover:shadow-md rounded-lg overflow-hidden"><FinancialPerformanceCard analysisData={parsedAnalysisData} isLoading={false} /></div>
                       <div className="transition-shadow hover:shadow-md rounded-lg overflow-hidden"><GrowthPlanCard analysisData={parsedAnalysisData} isLoading={false} /></div>
                       <div className="transition-shadow hover:shadow-md rounded-lg overflow-hidden"><ProjectionsRisksCard analysisData={parsedAnalysisData} isLoading={false} /></div>
              </div>
            </Card>
               )}

               {(startupData.analysis_status !== 'completed' || !parsedAnalysisData) && !analysisParsingError && startupData.analysis_status !== 'processing' && (
                    <Card className="text-center py-10 text-gray-500 dark:text-gray-400 border-dashed border-gray-300 dark:border-gray-600 mt-4 bg-gray-50 dark:bg-gray-800/50">
                        <IconRobot size={40} className="mx-auto mb-3 text-gray-400"/>
                        {startupData.analysis_status === 'failed' ? <p>The previous AI analysis failed. You can request a new one.</p> : <p>AI analysis results will appear here once generated.</p> }
                   </Card>
               )}
            </div>
          </Tabs.Item>

          {/* --- Tab 3: Metrics & Performance --- */}
          <Tabs.Item title="Metrics & Performance" icon={IconChartPie}>
             {/* ++ Add subtle background & consistent spacing ++ */}
             <div className="p-4 md:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-800/20">
                 <div className="flex justify-between items-center">
                     <h5 className="text-xl font-bold text-gray-900 dark:text-white">Key Performance Indicators</h5>
                     <Button onClick={handleOpenMetricsModal} color="light" size="sm" className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                         <IconEdit size={16} className="mr-2" /> Update Metrics
                     </Button>
                 </div>

                 {/* ++ Add hover effect to card ++ */}
                 <Card className="border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {/* KPI Item Helper - already has hover styling implicitly via Card */} 
                         {[{ 
                             label: 'Annual Revenue', value: formatCurrency(startupData.annual_revenue), icon: IconTrendingUp
                            },{
                              label: 'Annual Expenses', value: formatCurrency(startupData.annual_expenses), icon: IconTrendingDown
                            },{
                              label: 'Employees', value: formatNumber(startupData.num_employees), icon: IconUsers 
                            },{
                              label: 'Customers', value: formatNumber(startupData.num_customers), icon: IconUserCheck 
                            },{
                              label: 'CAC', value: formatCurrency(startupData.kpi_cac), icon: IconTargetArrow
                            },{
                              label: 'CLV', value: formatCurrency(startupData.kpi_clv), icon: IconTargetArrow
                            },{
                               label: 'Retention Rate', value: formatPercentage(startupData.kpi_retention_rate), icon: IconArrowUpRight
                            },{
                                label: 'Conversion Rate', value: formatPercentage(startupData.kpi_conversion_rate), icon: IconArrowsExchange
                           }].map((kpi) => (
                                <div key={kpi.label} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-start gap-3 border border-gray-200 dark:border-gray-600 transform transition-transform hover:scale-[1.02]">
                                    <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
                                        <kpi.icon size={20} />
                </div>
                <div>
                                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{kpi.label}</Label>
                                        <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mt-1">{kpi.value ?? 'N/A'}</p>
                  </div>
                </div>
                           ))
                         }
              </div>
            </Card>
            
                 <Card className="border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                     <h5 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Performance Trends</h5>
                     <ComingSoonPlaceholder featureName="Metric Charts" description="Visualizations of your key metrics over time will be displayed here once historical data is available."/>
            </Card>
          </div>
          </Tabs.Item>

          {/* --- Tab 4: Activity & Tasks --- */}
          <Tabs.Item title="Activity & Tasks" icon={IconActivity}>
            <div className="p-4 md:p-6 bg-gray-50/50 dark:bg-gray-800/20 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Section 1: Upcoming Tasks/Events */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <IconCalendarEvent size={20} className="mr-2 text-blue-500" />
                    Upcoming Tasks & Events
                  </h5>
                  <Button size="xs" color="light" className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                    <IconCalendar size={14} className="mr-1.5" /> View Calendar
                  </Button>
          </div>
                {/* Placeholder for Task/Event fetching state */}
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pr-2">
                  {/* Mock Task/Event Data - Replace with fetched data later */}
                  {[ // Sample Mock Data
                    { id: 1, title: 'Investor Meeting: VentureX', date: 'Tomorrow, 2:00 PM', priority: 'high', type: 'meeting' },
                    { id: 2, title: 'Update Financial Projections', date: 'Next Monday', priority: 'medium', type: 'task' },
                    { id: 3, title: 'Pitch Deck Revisions Due', date: 'In 3 days', priority: 'high', type: 'deadline' },
                    { id: 4, title: 'Team Sync Call', date: 'Friday, 10:00 AM', priority: 'low', type: 'meeting' },
                    { id: 5, title: 'Submit Grant Application', date: 'Next Friday', priority: 'medium', type: 'deadline' },
                  ].map((task) => (
              <div 
                key={task.id} 
                      className={`p-3 rounded-lg border flex items-start gap-3 ${ 
                        task.priority === 'high' ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10' : 
                        task.priority === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10' : 
                        'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50' 
                      }`}
                    >
                       <div className={`mt-1 flex-shrink-0 ${ 
                          task.priority === 'high' ? 'text-red-500' : 
                          task.priority === 'medium' ? 'text-yellow-500' : 
                          'text-gray-500' 
                       }`}>
                          {task.type === 'meeting' ? <IconUsers size={18} /> : task.type === 'deadline' ? <IconBell size={18}/> : <IconListCheck size={18}/>}
                       </div>
                       <div className="flex-grow">
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.date}</p>
                  </div>
                       <div className="flex items-center gap-1 flex-shrink-0">
                    <Badge 
                      color={task.priority === 'high' ? 'failure' : task.priority === 'medium' ? 'warning' : 'info'} 
                      size="xs"
                            className="capitalize"
                    >
                      {task.priority}
                    </Badge>
                         <Tooltip content="Mark as complete">
                             <button className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1">
                      <IconCheck size={16} />
                    </button>
                          </Tooltip>
                          <Tooltip content="View details">
                            <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1">
                                <IconArrowRight size={16} />
                            </button>
                           </Tooltip>
                </div>
              </div>
            ))}
                   {/* Add empty state here later */}
                </div>
                 <Button size="xs" color="light" className="w-full mt-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                    <IconListCheck size={14} className="mr-1.5"/> Add New Task
                 </Button>
              </Card>

              {/* Section 2: Recent Activity */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                       <IconActivity size={20} className="mr-2 text-purple-500" />
                       Recent Activity
                    </h5>
                    <Button size="xs" color="light" className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                       View Full Log
                    </Button>
              </div>
                 {/* Placeholder for Activity fetching state */}
                  <Timeline className="border-l-0 pl-0">
                    {/* Mock Activity Data - Replace with fetched data later */}
                     {[ // Sample Mock Data
                       { id: 1, action: 'Updated financial metrics (Annual Revenue, CAC)', timestamp: '2 hours ago', user: 'You', icon: IconChartPie },
                       { id: 2, action: 'Alpha Ventures viewed your pitch deck', timestamp: '1 day ago', user: 'System', icon: IconEye },
                       { id: 3, action: 'Added Sarah Chen to Team Members', timestamp: '3 days ago', user: 'You', icon: IconUserCheck },
                       { id: 4, action: 'AI analysis request completed', timestamp: '4 days ago', user: 'System', icon: IconRobot },
                       { id: 5, action: 'Opened connection request from Horizon Capital', timestamp: '1 week ago', user: 'System', icon: IconMail },
                     ].map((activity) => (
                       <Timeline.Item key={activity.id} className="mb-4">
                         <Timeline.Point icon={() => <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full ring-4 ring-white dark:ring-gray-800 dark:bg-gray-700"><activity.icon size={12} className="text-gray-600 dark:text-gray-400"/></div>} />
                         <Timeline.Content className="ml-3">
                           <Timeline.Time className="text-xs font-normal text-gray-500 dark:text-gray-400">
                               {activity.timestamp}
                           </Timeline.Time>
                           <Timeline.Title className="text-sm font-semibold text-gray-800 dark:text-white">
                               {activity.action}
                           </Timeline.Title>
                           <Timeline.Body className="text-xs text-gray-600 dark:text-gray-400">
                              {activity.user !== 'System' ? `Performed by ${activity.user}` : 'System Event'}
                           </Timeline.Body>
                         </Timeline.Content>
                       </Timeline.Item>
                     ))}
                      {/* Add empty state here later */}
                 </Timeline>
              </Card>

              </div>
            </Tabs.Item>

          </Tabs>
        </div>
    );
  };

  // --- Main Component Return ---
  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {renderWelcomeHeader()}

      {/* Removed Notifications Dropdown - Keep simple for now */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed right-6 top-32 md:absolute md:right-0 md:top-auto mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                 <h3 className="font-semibold text-gray-900 dark:text-white flex items-center"><IconBell size={16} className="mr-2 text-blue-500" /> Notifications {notificationCount > 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 py-0.5 px-2 rounded-full">{notificationCount} new</span>}</h3>
                 {notificationCount > 0 && (<Button size="xs" color="light" onClick={() => {}} className="text-xs">Mark all read</Button>)}
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                 {/* Placeholder */} <div className="text-center p-8 text-sm text-gray-500">Notification feed coming soon...</div>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
                 <Button size="xs" color="light" href="#" className="w-full text-xs">View all notifications <IconArrowRight size={12} className="ml-1 inline" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderDashboardContent()}

      <UpdateMetricsModal isOpen={isMetricsModalOpen} onClose={handleCloseMetricsModal} startupData={startupData} onUpdateSuccess={handleMetricsUpdateSuccess}/>

    </div>
  );
};

export default StartupDashboard; 