import React from 'react';
import { Card } from 'flowbite-react';

const ManageCompaniesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Portfolio Companies</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will list the companies the investor has invested in and allow management of related information and updates.
        </p>
        {/* Placeholder for portfolio company list/management UI */}
      </Card>
    </div>
  );
};

export default ManageCompaniesPage; 