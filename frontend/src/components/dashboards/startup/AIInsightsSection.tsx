import React, { useState } from 'react';
import { CardBox } from 'src/components/shared';
import { MockAIInsight } from 'src/api/mocks/data/startupDashboardMockData';
import { 
  IconBulb, 
  IconThumbUp, 
  IconThumbDown, 
  IconZoomQuestion, 
  IconAlertTriangle, 
  IconListCheck, 
  IconRobot, 
  IconRefresh, 
  IconPin, 
  IconShare, 
  IconArrowsRightLeft,
  IconDotsVertical,
  IconChevronRight,
  IconPencil
} from "@tabler/icons-react";
import { Tabs, Badge, Button, Dropdown } from 'flowbite-react';

const insightCategories: MockAIInsight['category'][] = ['Recommendation', 'Strength', 'Weakness', 'Opportunity', 'Threat'];

const getCategoryDetails = (category: MockAIInsight['category']) => {
    switch (category) {
        case 'Strength': return { 
          icon: IconThumbUp, 
          style: 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200', 
          title: 'Strengths',
          color: 'success',
          gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
        };
        case 'Weakness': return { 
          icon: IconThumbDown, 
          style: 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200', 
          title: 'Weaknesses',
          color: 'failure',
          gradient: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
        };
        case 'Opportunity': return { 
          icon: IconZoomQuestion, 
          style: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200', 
          title: 'Opportunities',
          color: 'info',
          gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
        };
        case 'Threat': return { 
          icon: IconAlertTriangle, 
          style: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200', 
          title: 'Threats',
          color: 'warning',
          gradient: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
        };
        case 'Recommendation': return { 
          icon: IconListCheck, 
          style: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200', 
          title: 'Recommendations',
          color: 'purple',
          gradient: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20'
        };
        default: return { 
          icon: IconBulb, 
          style: 'border-gray-500 bg-gray-50 dark:bg-gray-700', 
          title: 'General',
          color: 'gray',
          gradient: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20'
        };
    }
};

const getSeverityBadge = (severity?: MockAIInsight['severity']) => {
    if (!severity) return null;
    
    const badgeMap = {
        'High': { color: 'failure', text: 'High Priority' },
        'Medium': { color: 'warning', text: 'Medium Priority' },
        'Low': { color: 'success', text: 'Low Priority' }
    };
    
    const badgeInfo = badgeMap[severity as keyof typeof badgeMap] || { color: 'gray', text: severity };
    
    return (
        <Badge color={badgeInfo.color as any} className="ml-auto px-2 py-1 text-xs">
            {badgeInfo.text}
        </Badge>
    );
};

const InsightItem: React.FC<{ 
  insight: MockAIInsight; 
  expandable?: boolean; 
  isPinned?: boolean;
  onPin?: (id: string) => void;
}> = ({ 
  insight, 
  expandable = true, 
  isPinned = false,
  onPin
}) => {
    const [expanded, setExpanded] = useState(false);
    const categoryDetails = getCategoryDetails(insight.category);
    const severityBadge = getSeverityBadge(insight.severity);
    const Icon = categoryDetails.icon;
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handlePin = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPin) onPin(insight.id);
    };

    return (
        <div 
            className={`border-l-4 rounded-md shadow-sm overflow-hidden mb-3 ${categoryDetails.style} transition-all duration-200 ${expanded ? 'shadow-md' : 'hover:shadow-md'}`}
            onClick={() => expandable && setExpanded(!expanded)}
        >
            <div className="bg-white dark:bg-gray-800 p-3">
                <div className="flex items-center mb-2">
                    <Icon size={18} className="mr-2 flex-shrink-0" />
                    <span className="font-medium text-sm flex-grow mr-2 line-clamp-1">{insight.title}</span>
                    {severityBadge}
                </div>
                
                <div className={`text-xs text-gray-600 dark:text-gray-400 ${expanded ? '' : 'line-clamp-2'}`}>
                    {insight.summary}
                </div>
                
                {expanded && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                      <IconPencil size={14} className="mr-1" />
                      Take Notes
                    </button>
                    <button className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                      <IconShare size={14} className="mr-1" />
                      Share
                    </button>
                    <button className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                      <IconArrowsRightLeft size={14} className="mr-1" />
                      Request Alternative
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2 pt-1 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                    <span>{formatDate(insight.timestamp)}</span>
                    <div className="flex items-center gap-2">
                      {expandable && (
                        <button 
                          className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                          }}
                        >
                          {expanded ? 'Less' : 'More'}
                        </button>
                      )}
                      <button
                        className={`focus:outline-none ${isPinned ? 'text-amber-500 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400'}`}
                        onClick={handlePin}
                        title={isPinned ? "Unpin" : "Pin for later"}
                      >
                        <IconPin size={14} />
                      </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIInsightsSection: React.FC<{ insights: MockAIInsight[] }> = ({ insights }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'pinned'>('all');
  const [pinnedInsights, setPinnedInsights] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'priority'>('newest');
  
  const togglePinInsight = (id: string) => {
    setPinnedInsights(current => 
      current.includes(id) ? current.filter(pinId => pinId !== id) : [...current, id]
    );
  };

  const refreshInsights = () => {
    setIsRefreshing(true);
    // Mock refresh - in real app would fetch new insights
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Sort and filter insights based on current settings
  const getProcessedInsights = () => {
    let filtered = insights;
    
    // Filter by pinned status if needed
    if (viewMode === 'pinned') {
      filtered = insights.filter(insight => pinnedInsights.includes(insight.id));
    }
    
    // Sort based on selected order
    return [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortOrder === 'priority') {
        // Sort by severity (High > Medium > Low > undefined)
        const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1, undefined: 0 };
        return (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
               (severityOrder[a.severity as keyof typeof severityOrder] || 0);
      }
      return 0;
    });
  };

  const insightsByCategory = getProcessedInsights().reduce((acc, insight) => {
    (acc[insight.category] = acc[insight.category] || []).push(insight);
    return acc;
  }, {} as Record<MockAIInsight['category'], MockAIInsight[]>);
  
  // Get recommended action from insights
  const getRecommendedAction = () => {
    const recommendations = insights.filter(insight => 
      insight.category === 'Recommendation' && insight.severity === 'High'
    );
    
    if (recommendations.length > 0) {
      return recommendations[0];
    }
    
    // If no high priority recommendations, return any recommendation
    const anyRecommendation = insights.filter(insight => insight.category === 'Recommendation');
    return anyRecommendation.length > 0 ? anyRecommendation[0] : null;
  };
  
  const recommendedAction = getRecommendedAction();

  return (
    <CardBox className="h-full flex flex-col">
      {/* Enhanced header with more options */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <IconRobot size={20} className="mr-2 text-indigo-500" />
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            AI Insights
          </h5>
          <Badge className="ml-2" color="purple" size="sm">
            {insights.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button.Group>
            <Button 
              color={viewMode === 'all' ? 'light' : 'gray'} 
              size="xs" 
              onClick={() => setViewMode('all')}
            >
              All
            </Button>
            <Button 
              color={viewMode === 'pinned' ? 'light' : 'gray'} 
              size="xs" 
              onClick={() => setViewMode('pinned')}
            >
              <IconPin size={14} className="mr-1" />
              Pinned ({pinnedInsights.length})
            </Button>
          </Button.Group>
          
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <IconDotsVertical size={16} />
              </button>
            )}
          >
            <Dropdown.Header>
              <span className="block text-sm">Sort By</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setSortOrder('newest')}>
              {sortOrder === 'newest' && "✓ "}Newest First
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOrder('oldest')}>
              {sortOrder === 'oldest' && "✓ "}Oldest First
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOrder('priority')}>
              {sortOrder === 'priority' && "✓ "}Priority
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={refreshInsights}>
              <IconRefresh size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Insights
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      
      {/* Priority recommendation highlight with enhanced UI */}
      {recommendedAction && (
        <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Badge color="purple" size="sm" className="px-3">Top Priority Action</Badge>
            <Button size="xs" color="light" className="text-xs px-2 py-1 flex items-center gap-1">
              Take Action <IconChevronRight size={14} />
            </Button>
          </div>
          <InsightItem 
            insight={recommendedAction} 
            expandable={false}
            isPinned={pinnedInsights.includes(recommendedAction.id)}
            onPin={togglePinInsight}
          />
        </div>
      )}
      
      {/* Tabbed insights with enhanced styling and interactions */}
      {getProcessedInsights().length > 0 ? (
        <div className="flex-grow overflow-hidden border border-gray-100 dark:border-gray-700 rounded-lg">
          <Tabs aria-label="AI Insight Categories" className="custom-tabs">
            {insightCategories.map(category => {
              const categoryInsights = insightsByCategory[category] || [];
              if (categoryInsights.length === 0) return null;
              
              const categoryDetails = getCategoryDetails(category);
              const Icon = categoryDetails.icon;

              return (
                <Tabs.Item 
                  key={category} 
                  title={
                    <div className="flex items-center">
                      <Icon size={16} className="mr-1" />
                      <span>{categoryDetails.title}</span>
                      <Badge 
                        color={categoryDetails.color as any} 
                        className="ml-2 px-1.5" 
                        size="xs"
                      >
                        {categoryInsights.length}
                      </Badge>
                    </div>
                  }
                >
                  <div className={`p-4 bg-gradient-to-br ${categoryDetails.gradient} border-t border-gray-100 dark:border-gray-700`}>
                    <div className="max-h-[26rem] overflow-y-auto custom-scrollbar pr-1">
                      {categoryInsights.map(insight => (
                        <InsightItem 
                          key={insight.id} 
                          insight={insight} 
                          isPinned={pinnedInsights.includes(insight.id)}
                          onPin={togglePinInsight}
                        />
                      ))}
                    </div>
                  </div>
                </Tabs.Item>
              );
            })}
          </Tabs>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <IconBulb size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">No AI insights available yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Submit your data to generate personalized insights
            </p>
            <Button size="sm" gradientDuoTone="purpleToPink">
              Generate Insights
            </Button>
          </div>
        </div>
      )}
    </CardBox>
  );
};

export default AIInsightsSection;
