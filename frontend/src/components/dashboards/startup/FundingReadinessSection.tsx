import React, { useState, useEffect } from 'react';
import { Card, Tooltip, Badge, Progress, Button, Accordion, Spinner, Alert } from 'flowbite-react';
import { StartupProfile } from '../../../types/database'; // Adjust path if necessary
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

    // Update the score when startupData changes
    useEffect(() => {
      // Use funding_readiness_score if available, otherwise default to 0 or indicate pending
      const score = startupData?.funding_readiness_score ?? null; // Use null to differentiate between 0 and not-yet-calculated
      setReadinessScore(score === null ? 0 : score); // Use 0 for display if null, but logic can check for null
    }, [startupData?.funding_readiness_score]);

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
                        // Handle null score case in formatter
                        formatter: (val) => startupData?.funding_readiness_score === null ? '--' : `${Math.round(val)}%` 
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

    // Use state for readiness level details
    const { level: readinessLevel, color: readinessColor, icon: ReadinessIcon } = getReadinessLevel(readinessScore);

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
        if (onRefreshRequest) {
            setIsRefreshing(true);
            try {
                await onRefreshRequest();
            } finally {
                setIsRefreshing(false);
            }
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
        if (startupData?.funding_readiness_score === null) {
            return (
                <div className="text-center py-8">
                    <Spinner size="md" color="info" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Calculating Score...</p>
                </div>
            );
        }
        return (
            <div className="relative flex flex-col items-center justify-center mb-1">
                <Chart options={gaugeOptions} series={gaugeSeries} type="radialBar" height={180} />
                <div className="absolute bottom-4 text-center">
                    <Badge 
                        color={readinessColor} 
                        icon={ReadinessIcon}
                        size="sm"
                        className="inline-flex items-center"
                    >
                        {readinessLevel} Readiness
                    </Badge>
                </div>
            </div>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            {/* Header - Update refresh button */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex items-center">
                  <IconScale size={18} className="mr-2 text-indigo-500" /> Funding Readiness
                </h5>
                {onRefreshRequest && (
                    <Tooltip content="Refresh Score and Data">
                        <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing}>
                            <IconRefresh size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            <span className="ml-1 hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </Button>
                    </Tooltip>
                )}
            </div>

            {/* Main Content Area */} 
            <div className="flex-grow flex flex-col justify-between">
                
                {/* Score Display */} 
                {renderScoreDisplay()}

                {/* Summary Text */} 
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4 px-2">
                    {startupData?.funding_readiness_score === null 
                        ? "Score analysis is in progress based on your profile data."
                        : getReadinessSummary(readinessScore)
                    }
                </p>

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
                                        <li key={item.id} className="py-2 flex justify-between items-center">
                                            <div className="flex items-center">
                                                {item.completed ? 
                                                    <IconCheck size={16} className="text-green-500 mr-2" /> : 
                                                    <IconX size={16} className="text-red-500 mr-2" />
                                                }
                                                <span className={`text-xs ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-300'}`}>{item.title}</span>
                                            </div>
                                            {/* Optionally add links/buttons later */} 
                                            {/* <Button size="xs" color="light" href={item.link} target="_blank" rel="noopener noreferrer">View</Button> */} 
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