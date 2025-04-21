import React from 'react';
import { Card } from 'flowbite-react';

const AISuggestionsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Suggestions (Investor)</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will display AI-driven startup suggestions tailored to the investor's preferences and investment thesis.
        </p>
        {/* Placeholder for suggestion list/cards */}
      </Card>
    </div>
  );
};

export default AISuggestionsPage; 