import React, { useState } from 'react';
import { Card, Avatar, Button, Badge, Progress, Tooltip } from 'flowbite-react';
import { 
  IconBrain, IconRefresh, IconArrowRight, IconChevronLeft, 
  IconChevronRight, IconStarFilled, IconMapPin, IconUsers, 
  IconCurrencyDollar, IconHeartFilled, IconShare3, IconPlus,
  IconInfoCircle, IconFilter, IconStar, IconMessageCircle
} from '@tabler/icons-react';
import { MockAISuggestion } from 'src/api/mocks/data/investorDashboardMockData';

interface AISuggestionsSectionProps {
  suggestions: MockAISuggestion[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AISuggestionsSection: React.FC<AISuggestionsSectionProps> = ({ 
  suggestions, 
  isLoading = false,
  onRefresh
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  
  // Get unique industries and stages for filters
  const uniqueIndustries = [...new Set(suggestions.map(item => item.industry))];
  const uniqueStages = [...new Set(suggestions.map(item => item.stage))];
  
  // Apply filters
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (industryFilter && suggestion.industry !== industryFilter) return false;
    if (stageFilter && suggestion.stage !== stageFilter) return false;
    return true;
  });
  
  const hasNext = currentIndex < filteredSuggestions.length - 1;
  const hasPrev = currentIndex > 0;
  
  const goToNext = () => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const goToPrev = () => {
    if (hasPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const toggleFavorite = (id: string) => {
    setFavorited(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Format currency
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };
  
  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'dark';
  };
  
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded-md"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-8 bg-gray-200 rounded-md w-20"></div>
            <div className="h-8 bg-gray-200 rounded-md w-20"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  if (filteredSuggestions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <IconBrain size={40} className="mx-auto mb-3 text-gray-400" />
          <h5 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No Matching Startups
          </h5>
          {(industryFilter || stageFilter) ? (
            <>
              <p className="text-gray-500 mb-4">No startups match your current filters.</p>
              <Button 
                color="light" 
                size="sm"
                onClick={() => {
                  setIndustryFilter(null);
                  setStageFilter(null);
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-4">We're still analyzing startups for you.</p>
              <Button 
                color="blue" 
                size="sm"
                onClick={onRefresh}
              >
                <IconRefresh size={16} className="mr-1" />
                Refresh Suggestions
              </Button>
            </>
          )}
        </div>
      </Card>
    );
  }
  
  const currentSuggestion = filteredSuggestions[currentIndex];
  
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 -mt-6 -mx-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconBrain size={20} className="text-white mr-2" />
            <h5 className="text-xl font-bold text-white">
              AI-Suggested Startups
            </h5>
          </div>
          <div className="flex space-x-2">
            <Button size="xs" color="light" onClick={() => {
              setIndustryFilter(null);
              setStageFilter(null);
            }}>
              <IconFilter size={14} className="mr-1" /> Filters
            </Button>
            <Button size="xs" color="light" onClick={onRefresh}>
              <IconRefresh size={14} className="mr-1" /> Refresh
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Industry:</span>
          <div className="inline-flex flex-wrap gap-1">
            <Button 
              size="xs"
              color={industryFilter === null ? "blue" : "light"}
              onClick={() => setIndustryFilter(null)}
            >
              All
            </Button>
            {uniqueIndustries.map(industry => (
              <Button
                key={industry}
                size="xs"
                color={industryFilter === industry ? "blue" : "light"}
                onClick={() => setIndustryFilter(industry)}
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Stage:</span>
          <div className="inline-flex flex-wrap gap-1">
            <Button 
              size="xs"
              color={stageFilter === null ? "purple" : "light"}
              onClick={() => setStageFilter(null)}
            >
              All
            </Button>
            {uniqueStages.map(stage => (
              <Button
                key={stage}
                size="xs"
                color={stageFilter === stage ? "purple" : "light"}
                onClick={() => setStageFilter(stage)}
              >
                {stage}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative">
        <div className="text-sm text-gray-500 mb-2">
          Showing {currentIndex + 1} of {filteredSuggestions.length} matches
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
          {/* Startup header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar 
                img={currentSuggestion.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSuggestion.startupName)}&background=random`}
                size="md" 
                rounded 
              />
              <div>
                <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentSuggestion.startupName}
                </h5>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Badge color="indigo" className="mr-2">{currentSuggestion.industry}</Badge>
                  <Badge color="purple">{currentSuggestion.stage}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Match Score</div>
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  {currentSuggestion.matchScore}%
                </div>
              </div>
              <Progress
                color={getMatchScoreColor(currentSuggestion.matchScore)}
                progress={currentSuggestion.matchScore}
                size="sm"
                className="w-16"
              />
            </div>
          </div>
          
          {/* Startup details */}
          <div className="p-4">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {currentSuggestion.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {currentSuggestion.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IconMapPin size={16} className="mr-1 text-gray-500" />
                    {currentSuggestion.location}
                  </div>
                )}
                
                {currentSuggestion.teamSize && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IconUsers size={16} className="mr-1 text-gray-500" />
                    {currentSuggestion.teamSize} team members
                  </div>
                )}
                
                {currentSuggestion.fundingNeeded && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IconCurrencyDollar size={16} className="mr-1 text-gray-500" />
                    Seeking {formatCurrency(currentSuggestion.fundingNeeded)}
                  </div>
                )}
              </div>
              
              <div>
                <div className="font-medium mb-2">Key Highlights</div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {currentSuggestion.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-md border-l-4 border-blue-500 mt-4">
                <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">Why We Think It's a Match</div>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  {currentSuggestion.matchReason}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                size="xs" 
                color={favorited[currentSuggestion.id] ? "failure" : "light"}
                onClick={() => toggleFavorite(currentSuggestion.id)}
              >
                {favorited[currentSuggestion.id] ? (
                  <><IconHeartFilled size={14} className="mr-1" /> Saved</>
                ) : (
                  <><IconHeartFilled size={14} className="mr-1" /> Save</>
                )}
              </Button>
              <Button size="xs" color="light">
                <IconMessageCircle size={14} className="mr-1" /> Contact
              </Button>
              <Button size="xs" color="light">
                <IconShare3 size={14} className="mr-1" /> Share
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="xs" 
                color="light" 
                disabled={!hasPrev}
                onClick={goToPrev}
              >
                <IconChevronLeft size={14} />
              </Button>
              <Button 
                size="xs" 
                color="success"
                onClick={goToNext}
                disabled={!hasNext}
              >
                {hasNext ? 'Next Suggestion' : 'Last Suggestion'}
                <IconChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Page indicator */}
        <div className="flex justify-center">
          {filteredSuggestions.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to suggestion ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AISuggestionsSection;