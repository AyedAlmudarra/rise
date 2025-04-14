import React from 'react';
import CalendarApp from '../../components/apps/calendar';
// Remove Breadcrumb import for now as it's causing errors and not used
// import Breadcrumb from '../../components/shadcn-ui/Breadcrumb';
import { IconCalendarEvent } from '@tabler/icons-react'; // Import calendar icon

const CalendarPage: React.FC = () => {
  return (
    // Add padding and background like AIInsightsPage
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mimic header from AIInsightsPage */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
            <IconCalendarEvent size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              My Calendar
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your events and schedule
            </p>
          </div>
        </div>
      </div>

      {/* Render the Calendar Application Component directly */}
      <CalendarApp />
    </div>
  );
};

export default CalendarPage; 