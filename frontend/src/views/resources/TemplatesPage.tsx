import React from 'react';
import { Card } from 'flowbite-react';

const TemplatesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Templates</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will provide access to downloadable templates (e.g., pitch decks, financial models, legal documents).
        </p>
        {/* Placeholder for template list/download links */}
      </Card>
    </div>
  );
};

export default TemplatesPage; 