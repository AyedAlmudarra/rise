import React from 'react';
import { Card } from 'flowbite-react';

const AIRecommendationsPage: React.FC = () => {
  // Note: This might be similar or identical to AISuggestionsPage, potentially consolidate later.
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Recommendations</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will display AI-driven startup recommendations based on investor criteria.
          (Consider merging with AI Suggestions page if functionality overlaps significantly).
        </p>
        {/* Placeholder for recommendation list/cards */}
      </Card>
    </div>
  );
};

export default AIRecommendationsPage; 