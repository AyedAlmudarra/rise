import React from 'react';
import { Card } from 'flowbite-react';

const DocsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Knowledge Base / Documentation</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This section will host detailed documentation, guides, and tutorials for using the platform features.
        </p>
        {/* Placeholder for documentation content/navigation */}
      </Card>
    </div>
  );
};

export default DocsPage; 