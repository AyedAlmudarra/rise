import React from 'react';
import { Card } from 'flowbite-react';

const ContactPage: React.FC = () => {
  // Note: Distinguish from the public ContactPage if necessary
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          This page will provide ways for authenticated users to contact the RISE support team (e.g., contact form, email, chat).
        </p>
        {/* Placeholder for contact form/details */}
      </Card>
    </div>
  );
};

export default ContactPage; 