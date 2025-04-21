import React from 'react';
import { Card } from 'flowbite-react';

const StartupGuidesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Startup Guides</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will contain helpful guides and articles specifically for startups.
        </p>
        {/* Placeholder for guide content/list */}
      </Card>
    </div>
  );
};

export default StartupGuidesPage; 