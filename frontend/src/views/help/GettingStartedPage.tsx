import React from 'react';
import { Card } from 'flowbite-react';

const GettingStartedPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will provide a quick start guide or onboarding information for new users.
        </p>
        {/* Placeholder for onboarding steps/video */}
      </Card>
    </div>
  );
};

export default GettingStartedPage; 