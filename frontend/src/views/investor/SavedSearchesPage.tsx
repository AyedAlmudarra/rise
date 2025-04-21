import React from 'react';
import { Card } from 'flowbite-react';

const SavedSearchesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Saved Searches</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          Investors will be able to manage their saved search criteria for startups here.
        </p>
        {/* Placeholder for saved search list management UI */}
      </Card>
    </div>
  );
};

export default SavedSearchesPage; 