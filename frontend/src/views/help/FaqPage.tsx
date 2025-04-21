import React from 'react';
import { Card } from 'flowbite-react';

const FaqPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQ)</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will contain answers to frequently asked questions about using the RISE platform.
        </p>
        {/* Placeholder for Accordion/List of FAQs */}
      </Card>
    </div>
  );
};

export default FaqPage; 