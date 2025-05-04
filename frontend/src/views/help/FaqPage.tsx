import React from 'react';
import { FaqComponent } from '@/components/front-pages/homepage/FAQ';
import { IconHelpCircle } from '@tabler/icons-react';

const FaqPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6">
      {/* Header styled like ConnectionsPage/ContactPage */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {/* Icon with gradient */}
          <div className="mr-4 p-3 bg-gradient-to-br from-green-500 to-cyan-600 rounded-lg shadow-lg">
            <IconHelpCircle size={28} className="text-white" />
          </div>
          {/* Title and Subtitle */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Find answers to common questions about RISE.</p>
          </div>
        </div>
      </div>

      {/* Render the FAQ component - Added some top margin */}
      <div className="mt-6">
        <FaqComponent />
      </div>
    </div>
  );
};

export default FaqPage; 