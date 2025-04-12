import React, { useState, useEffect } from 'react';
import { Card, Tooltip, Badge, Progress, Button, Accordion, Spinner, Alert } from 'flowbite-react';
import { StartupProfile } from '../../../types/database'; // Adjust path if necessary
import { supabase } from '../../../lib/supabaseClient'; // Import supabase client
import { toast } from 'react-hot-toast'; // Import toast
import {
  IconInfoCircle,
  IconFileReport,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBulb,
  IconCheck,
  IconX,
  IconExclamationCircle,
  IconChevronRight,
  IconChevronDown,
  IconRefresh,
  IconFileUpload,
  IconDownload,
  IconEdit,
  IconListCheck,
  IconScale
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface FundingReadinessSectionProps {
    startupData: StartupProfile | null;
    isLoading: boolean;
    onRefreshRequest?: () => void; // Optional: Allow triggering a data refresh in the parent
}

// Helper function to get readiness summary text
const getReadinessSummary = (score: number): string => {
    if (score < 40) {
      return "Needs significant improvement across several areas. Focus on the checklist below.";
    } else if (score < 70) {
      return "Making good progress! Address the remaining checklist items to become investor-ready.";
    } else {
      return "Looking strong! You meet many key criteria. Minor refinements may still be beneficial.";
    }
};

const FundingReadinessSection: React.FC<FundingReadinessSectionProps> = ({ startupData, isLoading, onRefreshRequest }) => {
    // Use state for the score to handle updates and default value
    const [readinessScore, setReadinessScore] = useState<number>(0);
    const [isRefreshing, setIsRefreshing] = useState(false); // Renamed from isRecomputing

    // --- Moved helper functions/objects INSIDE the component --- 

    // Define colors for the gauge chart
    const gaugeColors = ["#EF4444", "#F59E0B", "#10B981"]; // Red, Amber, Green
    const getGaugeColor = (value: number) => {
        if (value < 40) return gaugeColors[0];
        if (value < 70) return gaugeColors[1];
        return gaugeColors[2];
    };

    // Updated gauge chart configuration (defined inside component)
    const gaugeOptions: ApexOptions = {
        chart: {
            type: 'radialBar',
            height: 200,
            offsetY: -10,
            sparkline: { enabled: true },
            animations: { enabled: true, speed: 800 },
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: { size: '65%' },
                track: { background: "#e7e7e7", strokeWidth: '97%', margin: 5 },
                dataLabels: {
                    name: { show: false },
                    value: {
                        offsetY: 5,
                        fontSize: '22px',
                        fontWeight: 600,
                        // Handle null/pending score case in formatter - use ai_analysis
                        formatter: (val) => {
                            const score = startupData?.ai_analysis?.funding_readiness_score;
                            if (startupData?.analysis_status === 'completed' && typeof score === 'number') {
                                return `${Math.round(val)}%`; // val should be the score here
                            } 
                            return '--%'; // Show placeholder if not completed or no score
                        }
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                gradientToColors: [getGaugeColor(readinessScore)], // Accesses readinessScore from state
                stops: [0, 100]
            }
        },
        stroke: { lineCap: 'round' },
        labels: ['Readiness'],
        colors: [getGaugeColor(readinessScore)], // Accesses readinessScore from state
    };

    // Gauge series now uses state
    const gaugeSeries = [readinessScore]; 

    // Function to get explanatory text for readiness score level
    const getReadinessLevel = (score: number): { level: string; color: "failure" | "warning" | "success"; icon: React.FC<React.SVGProps<SVGSVGElement>> } => {
        if (score < 40) return { level: 'Low', color: 'failure', icon: () => <IconX className="mr-1" size={14}/> };
        if (score < 70) return { level: 'Medium', color: 'warning', icon: () => <IconExclamationCircle className="mr-1" size={14}/> };
        return { level: 'High', color: 'success', icon: () => <IconCheck className="mr-1" size={14}/> };
    };

    // Get title and description for pitch deck status based on URL presence
    const getPitchDeckStatus = (pitchDeckUrl: string | null | undefined): { title: string; description: string; color: "failure" | "success"; icon: JSX.Element } => {
        if (!pitchDeckUrl) {
            return { 
                title: 'Not Uploaded', 
                description: 'Upload a pitch deck to significantly improve your funding readiness.',
                color: 'failure',
                icon: <IconX className="w-4 h-4 text-red-500" />
            };
        } else {
            return { 
                title: 'Uploaded', 
                description: 'Your pitch deck is uploaded. Ensure it is up-to-date and compelling.',
                color: 'success',
                icon: <IconCheck className="w-4 h-4 text-green-500" />
            };
        }
    };

    const pitchDeckStatusDetails = getPitchDeckStatus(startupData?.pitch_deck_url);

    // Keep progress color logic
    const getProgressColor = (value: number): "failure" | "warning" | "success" => {
        if (value < 40) return 'failure';
        if (value < 70) return 'warning';
        return 'success';
    };
    
    // --- End of moved functions/objects ---

    // Updated refresh handler to use parent function
    const handleRefresh = async () => {
        if (!startupData?.id) {
            toast.error("Cannot trigger analysis: Startup ID missing.");
            return;
        }

        setIsRefreshing(true); 
        toast.loading("Requesting new analysis & score..."); 

        try {
            const { error } = await supabase.functions.invoke('request-analysis', {
                body: { startup_id: startupData.id },
            });

            if (error) {
                throw error;
            }

            toast.dismiss();
            toast.success("Re-analysis requested! Score will update shortly.");

            // Optional: Trigger parent refresh AFTER a short delay 
            if (onRefreshRequest) {
                setTimeout(() => {
                    onRefreshRequest();
                }, 1500); 
            }

        } catch (error: any) {
            toast.dismiss();
            console.error("Error requesting analysis:", error);
            toast.error(`Failed to request score re-calculation: ${error.message || 'Unknown error'}`);
        } finally {
            setIsRefreshing(false); 
        }
    };

    // Recommendations can still be derived from profile data
    const recommendations = [
        { id: 1, title: "Refine Company Description", area: "Profile", completed: !!startupData?.description && startupData.description.length > 100, priority: 'High', link: '#' },
        { id: 2, title: "Upload Pitch Deck", area: "Documents", completed: !!startupData?.pitch_deck_url, priority: 'High', link: '#' },
        { id: 3, title: "Add Annual Revenue", area: "Financials", completed: !!startupData?.annual_revenue && startupData.annual_revenue > 0, priority: 'High', link: '#' },
        { id: 4, title: "Detail Key Metrics (CAC/CLV)", area: "Metrics", completed: !!startupData?.kpi_cac && startupData.kpi_cac > 0 && !!startupData?.kpi_clv && startupData.kpi_clv > 0, priority: 'Medium', link: '#' },
        { id: 5, title: "Add Team Information", area: "Team", completed: !!startupData?.num_employees && startupData.num_employees > 1, priority: 'Low', link: '#' },
    ].sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0)); // Show incomplete first

    // Render Loading state (keep this)
    if (isLoading) {
        return (
            <Card className="animate-pulse h-full">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                <div className="flex justify-center items-center mb-4">
                    <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            </Card>
        );
    }

    const renderScoreDisplay = () => {
        // Handle overall loading first
        if (isLoading) {
            return (
                <div className="text-center py-8 animate-pulse">
                    <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
                </div>
            );
        }
        
        // Handle no startup data
        if (!startupData) {
             return (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <IconInfoCircle size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">No Profile Data</p>
                </div>
            );
        }

        // Handle analysis status
        switch (startupData.analysis_status) {
            case 'completed':
                const score = startupData.ai_analysis?.funding_readiness_score;
                if (typeof score === 'number') {
                    // Recalculate gauge options/series based on the score from ai_analysis
                    const currentReadinessScore = Math.max(0, Math.min(100, score)); // Clamp score 0-100
                    const { level, color, icon: ReadinessIcon } = getReadinessLevel(currentReadinessScore);
                    const currentGaugeOptions: ApexOptions = {
                        ...gaugeOptions, // Spread base options
                        fill: { ...gaugeOptions.fill, gradient: { ...gaugeOptions.fill?.gradient, gradientToColors: [getGaugeColor(currentReadinessScore)] } },
                        colors: [getGaugeColor(currentReadinessScore)]
                    };
                    const currentGaugeSeries = [currentReadinessScore];

                    return (
                        <div className="relative flex flex-col items-center justify-center mb-1">
                            <Chart options={currentGaugeOptions} series={currentGaugeSeries} type="radialBar" height={180} />
                            <div className="absolute bottom-4 text-center">
                                <Badge color={color} icon={ReadinessIcon} size="sm" className="inline-flex items-center">
                                    {level} Readiness
                                </Badge>
                            </div>
                        </div>
                    );
                } else {
                    // Completed but score missing in analysis data
                    return (
                        <div className="text-center py-8 text-orange-500 dark:text-orange-400">
                            <IconInfoCircle size={32} className="mx-auto mb-2" />
                            <p className="text-sm font-medium">Score Data Missing</p>
                            <p className="text-xs">Analysis complete, but score is unavailable.</p>
                        </div>
                    );
                }
            case 'processing':
            case 'pending':
                return (
                    <div className="text-center py-8">
                        <Spinner size="md" color="info" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Calculating Score...</p>
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
                    <div className="text-center py-8 text-red-500 dark:text-red-400">
                        <IconX size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Score Calculation Failed</p>
                        {onRefreshRequest && (
                            <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-3">
                                <IconRefresh size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`}/>
                                Retry Calculation
                            </Button>
                        )}
                    </div>
                 );
            default: // Includes null or unexpected status values
                return (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <IconScale size={32} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Score Not Calculated</p>
                        <p className="text-xs">Score will be generated after initial analysis.</p>
                        {onRefreshRequest && (
                          <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-3">
                            <IconRefresh size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`}/>
                            Check for Score
                          </Button>
                        )}
                    </div>
                 );
        }
    }

    // Update Summary Text logic
    const renderSummaryText = () => {
        if (isLoading || !startupData) return null; // Don't show text if loading or no data

        switch (startupData.analysis_status) {
            case 'completed':
                const score = startupData.ai_analysis?.funding_readiness_score;
                if (typeof score === 'number') {
                    return (
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4 px-2">
                           {getReadinessSummary(Math.max(0, Math.min(100, score)))}
                        </p>
                    );
                } else {
                     return (
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4 px-2 italic">
                           Score data missing from analysis.
                        </p>
                    );
                }
            case 'processing':
            case 'pending':
                 return (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4 px-2">
                       Score analysis is in progress...
                    </p>
                );
             case 'failed':
                  return (
                    <p className="text-center text-sm text-red-500 dark:text-red-400 mb-4 px-2">
                       Failed to calculate score.
                    </p>
                );
            default:
                 return (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4 px-2">
                       Readiness score will be calculated soon.
                    </p>
                );
        }
    };

    return (
        <Card className="h-full flex flex-col">
            {/* Header - Update refresh button */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex items-center">
                  <IconScale size={18} className="mr-2 text-indigo-500" /> Funding Readiness
                </h5>
                {onRefreshRequest && (
                    <Tooltip content="Request New Analysis & Score">
                        <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing || isLoading}>
                            <IconRefresh size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            <span className="ml-1 hidden sm:inline">{isRefreshing ? 'Requesting...' : 'Re-Analyze'}</span>
                        </Button>
                    </Tooltip>
                )}
            </div>

            {/* Main Content Area */} 
            <div className="flex-grow flex flex-col justify-between">
                
                {/* Score Display */} 
                {renderScoreDisplay()}

                {/* Summary Text - Use the new render function */}
                {renderSummaryText()}

                {/* Readiness Checklist/Recommendations */} 
                <div className="mt-auto">
                    <Accordion collapseAll flush>
                        <Accordion.Panel>
                            <Accordion.Title className="text-sm font-medium">
                                Readiness Checklist & Factors
                            </Accordion.Title>
                            <Accordion.Content className="pt-2 pb-0 px-2">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                    {recommendations.map((item) => (
                                        <li key={item.id} className="py-2.5 flex items-center justify-between">
                                            <div className="flex items-center">
                                                {item.completed ? 
                                                    <IconCheck size={16} className="text-green-500 mr-2 flex-shrink-0" /> : 
                                                    <IconListCheck size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                                                }
                                                <span className={`text-xs ${item.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{item.title}</span>
                                            </div>
                                            <Badge color={item.priority === 'High' ? 'failure' : item.priority === 'Medium' ? 'warning' : 'gray'} size="xs">{item.priority}</Badge>
                                        </li>
                                    ))}
                                </ul>
                                {/* Commenting out Radar Chart for now */}
                                {/* 
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h6 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 text-center">Factor Analysis</h6>
                                    <Chart options={radarOptions} series={radarSeries} type="radar" height={220} />
                                </div>
                                */}
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion>
                </div>

            </div>
        </Card>
    );
};

export default FundingReadinessSection; 