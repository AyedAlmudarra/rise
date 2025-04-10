import React from 'react';
import { CardBox } from 'src/components/shared';
import { MockAIInsight } from 'src/api/mocks/data/startupDashboardMockData';
import { IconBulb, IconThumbUp, IconThumbDown, IconZoomQuestion, IconAlertTriangle, IconListCheck } from "@tabler/icons-react";
import { Tabs } from 'flowbite-react';

const insightCategories: MockAIInsight['category'][] = ['Recommendation', 'Strength', 'Weakness', 'Opportunity', 'Threat'];

const getCategoryDetails = (category: MockAIInsight['category']) => {
    switch (category) {
        case 'Strength': return { icon: IconThumbUp, style: 'border-green-500 bg-green-50 dark:bg-green-900/30', title: 'Strengths' };
        case 'Weakness': return { icon: IconThumbDown, style: 'border-red-500 bg-red-50 dark:bg-red-900/30', title: 'Weaknesses' };
        case 'Opportunity': return { icon: IconZoomQuestion, style: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30', title: 'Opportunities' };
        case 'Threat': return { icon: IconAlertTriangle, style: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30', title: 'Threats' };
        case 'Recommendation': return { icon: IconListCheck, style: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30', title: 'Recommendations' };
        default: return { icon: IconBulb, style: 'border-gray-500 bg-gray-50 dark:bg-gray-700', title: 'General' };
    }
};

const getSeverityBadge = (severity?: MockAIInsight['severity']) => {
      if (!severity) return null;
      let badgeColor = 'bg-gray-200 text-gray-800';
      if (severity === 'High') badgeColor = 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200';
      else if (severity === 'Medium') badgeColor = 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200';
      return <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${badgeColor}`}>{severity}</span>
};

const InsightItem: React.FC<{ insight: MockAIInsight }> = ({ insight }) => {
    const categoryDetails = getCategoryDetails(insight.category);
    const severityBadge = getSeverityBadge(insight.severity);
    const Icon = categoryDetails.icon;

    return (
        <div className={`border-l-4 p-3 mb-3 rounded-r-md ${categoryDetails.style}`}>
            <div className="flex items-center mb-1">
                <Icon size={20} className="mr-2 flex-shrink-0" />
                <span className="font-semibold text-sm flex-grow mr-2">{insight.title}</span>
                {severityBadge}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 ml-7">{insight.summary}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{new Date(insight.timestamp).toLocaleDateString()}</p>
        </div>
    );
};

const AIInsightsSection: React.FC<{ insights: MockAIInsight[] }> = ({ insights }) => {

  const insightsByCategory = insights.reduce((acc, insight) => {
    (acc[insight.category] = acc[insight.category] || []).push(insight);
    return acc;
  }, {} as Record<MockAIInsight['category'], MockAIInsight[]>);

  return (
    <CardBox className="h-full flex flex-col">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 flex-shrink-0">
        AI Insights & Recommendations
      </h5>
       {insights.length > 0 ? (
            <div className="flex-grow overflow-hidden">
                 <Tabs aria-label="AI Insight Categories" variant="underline" className="-mb-px custom-tabs">
                     {insightCategories.map(category => {
                         const categoryInsights = insightsByCategory[category];
                         const categoryDetails = getCategoryDetails(category);
                         const Icon = categoryDetails.icon;

                         if (!categoryInsights || categoryInsights.length === 0) {
                             return null;
                         }

                         return (
                             <Tabs.Item key={category} title={categoryDetails.title} icon={Icon}>
                                 <div className="pt-4 pb-1 max-h-[17rem] overflow-y-auto custom-scrollbar">
                                     {categoryInsights.map(insight => (
                                         <InsightItem key={insight.id} insight={insight} />
                                     ))}
                                 </div>
                             </Tabs.Item>
                         );
                     })}
                 </Tabs>
            </div>
        ) : (
             <p className="font-normal text-gray-700 dark:text-gray-400 text-sm mt-4 flex-grow flex items-center justify-center">
                No AI insights available yet.
             </p>
        )}
    </CardBox>
  );
};

export default AIInsightsSection;
