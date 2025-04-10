import React, { useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { MockFundingReadiness } from 'src/api/mocks/data/startupDashboardMockData';
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
  IconListCheck
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Tooltip, Badge, Progress, Button, Accordion } from 'flowbite-react';

const FundingReadinessSection: React.FC<{ data: MockFundingReadiness }> = ({ data }) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [activeRecommendation, setActiveRecommendation] = useState<number | null>(null);
  const [isRecomputing, setIsRecomputing] = useState(false);

  // Define colors for the gauge chart
  const gaugeColors = ["#EF4444", "#F59E0B", "#10B981"];
  const getGaugeColor = (value: number) => {
    if (value < 40) return gaugeColors[0]; // Red
    if (value < 70) return gaugeColors[1]; // Amber
    return gaugeColors[2]; // Green
  };

  const handleRecompute = () => {
    setIsRecomputing(true);
    // Simulate recomputation
    setTimeout(() => {
      setIsRecomputing(false);
    }, 2000);
  };

  // Updated gauge chart configuration
  const gaugeOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 250,
      offsetY: -10,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        speed: 1000,
        easing: 'easeinout',
        animateGradually: {
          enabled: true,
          delay: 150
        }
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.15,
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '65%',
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.05
          }
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
            fontWeight: 600,
            formatter: function(val) {
              return val + '%';
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
        gradientToColors: [getGaugeColor(data.score)],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Readiness'],
    colors: [getGaugeColor(data.score)],
  };

  // Radar/Spider chart for industry comparison
  const radarOptions: ApexOptions = {
    chart: {
      type: 'radar',
      height: 260,
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
        opacity: 0.1
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    colors: ['#3B82F6', '#9CA3AF'],
    stroke: {
      width: 2
    },
    fill: {
      opacity: 0.2
    },
    markers: {
      size: 3,
      hover: {
        size: 5
      }
    },
    xaxis: {
      categories: ['Team', 'Market', 'Product', 'Traction', 'Financials', 'Documentation']
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + '%';
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    }
  };

  // Mock data for radar chart (comparing your startup to industry)
  const radarSeries = [
    {
      name: "Your Startup",
      data: [65, 80, 70, 50, 60, data.profileCompleteness]
    },
    {
      name: "Industry Average",
      data: [60, 65, 60, 55, 55, 75]
    }
  ];

  // Function to determine color of the progress bar based on the value
  const getProgressColor = (value: number) => {
    if (value < 40) return 'failure';
    if (value < 70) return 'warning';
    return 'success';
  };

  // Function to get explanatory text for readiness score
  const getReadinessSummary = (score: number) => {
    if (score < 40) {
      return "Your funding readiness is low. Focus on the recommendations below to improve your score.";
    } else if (score < 70) {
      return "You're on the right track! Address the recommendations to reach funding readiness.";
    } else {
      return "You're well-positioned for funding discussions! Still, check the remaining recommendations.";
    }
  };

  // Get title and description for pitch deck status
  const getPitchDeckStatus = (status: string) => {
    switch(status) {
      case 'Missing':
        return { 
          title: 'Not Uploaded', 
          description: 'You need to upload a pitch deck to improve your funding readiness score.',
          color: 'failure',
          icon: <IconX className="w-4 h-4 text-red-500" />
        };
      case 'Uploaded':
        return { 
          title: 'Basic Deck Uploaded', 
          description: 'Your pitch deck has been uploaded. Consider getting feedback to refine it.',
          color: 'success',
          icon: <IconCheck className="w-4 h-4 text-green-500" />
        };
      case 'Needs Improvement':
        return { 
          title: 'Needs Improvement', 
          description: 'Your pitch deck needs some improvements. See recommendations for details.',
          color: 'warning',
          icon: <IconExclamationCircle className="w-4 h-4 text-yellow-500" />
        };
      default:
        return { 
          title: 'Unknown', 
          description: 'Status unknown',
          color: 'gray',
          icon: <IconInfoCircle className="w-4 h-4 text-gray-500" />
        };
    }
  };

  // Get the pitch deck status details
  const pitchDeckStatusDetails = getPitchDeckStatus(data.pitchDeckStatus);

  return (
    <CardBox className="h-full flex flex-col">
      {/* Header with Title and Description */}
      <div className="mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <IconFileReport size={20} className="text-blue-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Funding Readiness</h3>
          </div>
          <Button 
            size="xs" 
            color="light" 
            onClick={handleRecompute}
            disabled={isRecomputing}
            className="text-xs flex items-center"
          >
            <IconRefresh size={14} className={`mr-1 ${isRecomputing ? 'animate-spin' : ''}`} /> 
            Recompute
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getReadinessSummary(data.score)}
        </p>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Gauge chart column */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Readiness</h4>
            <Badge 
              color={getProgressColor(data.score) as "success" | "warning" | "failure" | "gray"} 
              className="px-2.5 py-1"
            >
              {data.score < 40 ? 'Not Ready' : data.score < 70 ? 'Getting Close' : 'Ready'}
            </Badge>
          </div>

          <div className="flex flex-col items-center">
            <Chart 
              options={gaugeOptions}
              series={[data.score]}
              type="radialBar"
              height={250}
            />
            
            <div className="text-center -mt-4">
              <Button.Group>
                <Button 
                  size="xs" 
                  color={!showDetailedAnalysis ? "info" : "gray"}
                  onClick={() => setShowDetailedAnalysis(false)}
                >
                  Overview
                </Button>
                <Button 
                  size="xs" 
                  color={showDetailedAnalysis ? "info" : "gray"}
                  onClick={() => setShowDetailedAnalysis(true)}
                >
                  Detailed
                </Button>
              </Button.Group>
            </div>
          </div>
        </div>

        {/* Radar chart / Industry comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Industry Comparison</h4>
            <Tooltip content="How your startup compares to industry averages across key dimensions">
              <IconInfoCircle size={16} className="text-gray-400" />
            </Tooltip>
          </div>
          
          <Chart 
            options={radarOptions}
            series={radarSeries}
            type="radar"
            height={260}
          />
        </div>
      </div>

      {/* Detailed readiness factors section */}
      {showDetailedAnalysis ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Readiness Factors</h4>
            <Badge color="gray" className="px-2 py-0.5 text-xs">Detailed Analysis</Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Profile Completeness</span>
                  <Tooltip content="How complete your startup profile information is">
                    <IconInfoCircle size={14} className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{data.profileCompleteness}%</span>
              </div>
              <Progress 
                progress={data.profileCompleteness} 
                color={getProgressColor(data.profileCompleteness) as "success" | "warning" | "failure" | "blue" | "gray" | "dark" | "indigo" | "purple" | "green" | "yellow" | "cyan" | "lime" | "pink" | "red"} 
                size="sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Financial Documentation</span>
                  <Tooltip content="Quality and completeness of your financial projections and reports">
                    <IconInfoCircle size={14} className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{data.financialsScore}%</span>
              </div>
              <Progress 
                progress={data.financialsScore} 
                color={getProgressColor(data.financialsScore) as "success" | "warning" | "failure" | "blue" | "gray" | "dark" | "indigo" | "purple" | "green" | "yellow" | "cyan" | "lime" | "pink" | "red"} 
                size="sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Market Analysis</span>
                  <Tooltip content="How well you've defined your target market and competitive analysis">
                    <IconInfoCircle size={14} className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">70%</span>
              </div>
              <Progress 
                progress={70} 
                color={getProgressColor(70) as "success" | "warning" | "failure" | "blue" | "gray" | "dark" | "indigo" | "purple" | "green" | "yellow" | "cyan" | "lime" | "pink" | "red"} 
                size="sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Team Composition</span>
                  <Tooltip content="How well your team is structured and documented">
                    <IconInfoCircle size={14} className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">65%</span>
              </div>
              <Progress 
                progress={65} 
                color={getProgressColor(65) as "success" | "warning" | "failure" | "blue" | "gray" | "dark" | "indigo" | "purple" | "green" | "yellow" | "cyan" | "lime" | "pink" | "red"} 
                size="sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Business Model</span>
                  <Tooltip content="Clarity and viability of your business model">
                    <IconInfoCircle size={14} className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">80%</span>
              </div>
              <Progress 
                progress={80} 
                color={getProgressColor(80) as "success" | "warning" | "failure" | "blue" | "gray" | "dark" | "indigo" | "purple" | "green" | "yellow" | "cyan" | "lime" | "pink" | "red"} 
                size="sm"
              />
            </div>
          </div>
        </div>
      ) : (
        // Pitch deck status card
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pitch Deck Status</h4>
            <Badge 
              color={pitchDeckStatusDetails.color as "success" | "warning" | "failure" | "gray"} 
              className="px-2.5 py-0.5"
            >
              <div className="flex items-center">
                {pitchDeckStatusDetails.icon}
                <span className="ml-1">{pitchDeckStatusDetails.title}</span>
              </div>
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {pitchDeckStatusDetails.description}
          </p>
          
          <div className="flex gap-2">
            {data.pitchDeckStatus === 'Missing' ? (
              <Button size="xs" gradientDuoTone="cyanToBlue" className="flex items-center">
                <IconFileUpload size={14} className="mr-1" />
                Upload Pitch Deck
              </Button>
            ) : (
              <>
                <Button size="xs" color="light" className="flex items-center">
                  <IconEdit size={14} className="mr-1" />
                  Update Deck
                </Button>
                <Button size="xs" color="gray" className="flex items-center">
                  <IconDownload size={14} className="mr-1" />
                  Download
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recommendations section with accordion */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-auto">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IconBulb size={18} className="text-amber-500 mr-2" />
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recommendations</h4>
            </div>
            <Badge color="gray" className="px-2 py-0.5">{data.recommendations.length}</Badge>
          </div>
        </div>
        
        <Accordion>
          {data.recommendations.map((recommendation, idx) => (
            <Accordion.Panel key={idx}>
              <Accordion.Title>
                <div className="flex items-center">
                  <IconListCheck size={16} className="mr-2 text-blue-500" />
                  <span>{recommendation.split('.')[0]}</span>
                </div>
              </Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-600 dark:text-gray-400">
                  {recommendation}
                </p>
                <Button size="xs" color="light" className="flex items-center mt-2">
                  <span>Take Action</span>
                  <IconChevronRight size={14} className="ml-1" />
                </Button>
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
    </CardBox>
  );
};

export default FundingReadinessSection; 