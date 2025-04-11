import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tabs, Badge, Button, Dropdown, Spinner, Alert, Textarea, Tooltip } from 'flowbite-react';
import { StartupProfile } from '../../../types/database';
import {
  IconBulb,
  IconRobot,
  IconRefresh,
  IconShare,
  IconDotsVertical,
  IconInfoCircle,
} from "@tabler/icons-react";

// --- Component Props Interface ---
interface AIInsightsSectionProps {
    startupData: StartupProfile | null;
    isLoading: boolean; // Receive overall loading state from parent
    onRefreshRequest?: () => void; // Optional: Allow triggering a data refresh in the parent
}

// --- Main AI Insights Section Component ---
const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ startupData, isLoading, onRefreshRequest }) => {
  const [isRefreshing, setIsRefreshing] = useState(false); // Keep for manual refresh UI

  const handleRefresh = async () => {
    if (onRefreshRequest) {
      setIsRefreshing(true);
      try {
        await onRefreshRequest(); // Call parent's refresh function
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
      );
    }

    // Check if startupData exists and has the ai_insights field
    if (startupData && typeof startupData.ai_insights === 'string' && startupData.ai_insights.trim() !== '') {
      return (
        <Textarea
          id="ai-insights-display"
          value={startupData.ai_insights}
          readOnly
          rows={8} // Adjust rows as needed
          className="text-sm border-none read-only:bg-transparent read-only:ring-0 dark:read-only:bg-transparent dark:text-gray-300 focus:ring-0 p-0"
        />
      );
    }

    // Handle case where AI insights haven't been generated yet or are empty
    if (startupData && startupData.ai_insights === null) {
       return (
           <div className="text-center text-gray-500 dark:text-gray-400 py-4">
             <IconRobot size={32} className="mx-auto mb-2 text-gray-400" />
             <p className="text-sm font-medium">AI Analysis Pending</p>
             <p className="text-xs">Insights will appear here once the initial analysis is complete.</p>
             {onRefreshRequest && (
                <Button size="xs" color="light" onClick={handleRefresh} isProcessing={isRefreshing} disabled={isRefreshing} className="mt-3">
                    <IconRefresh size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`}/>
                    Check for Updates
                </Button>
             )}
           </div>
       );
    }

    // Handle case where there's no startup data at all
    if (!startupData) {
        return (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
             <IconInfoCircle size={32} className="mx-auto mb-2 text-gray-400" />
             <p className="text-sm font-medium">No Profile Data</p>
             <p className="text-xs">Cannot generate insights without startup profile information.</p>
          </div>
        );
    }

    // Fallback for unexpected state (e.g., ai_insights is undefined)
    return (
       <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          <p className="text-sm">AI Insights not available.</p>
       </div>
    );
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
