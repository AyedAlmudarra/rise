import React from 'react';
import { Card } from 'flowbite-react';

const DataRoomsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Data Rooms</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will provide access to secure data rooms shared by startups during due diligence.
        </p>
        {/* Placeholder for data room access/list UI */}
      </Card>
    </div>
  );
};

export default DataRoomsPage; 