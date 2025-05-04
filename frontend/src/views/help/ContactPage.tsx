import React from 'react';
import ContactForm from '@/components/front-pages/contactus/ContactForm';
import { IconMail } from '@tabler/icons-react'; // Optional: for title

const ContactPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header styled like ConnectionsPage */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {/* Icon with gradient */}
          <div className="mr-4 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
            <IconMail size={28} className="text-white" />
          </div>
          {/* Title and Subtitle */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Contact Support</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Get in touch with the RISE support team.</p>
          </div>
        </div>
      </div>
      
      {/* Render the Contact Form Component */}
      {/* Note: The ContactForm component itself has internal padding/margins, 
          so we might not need extra wrappers unless further layout is needed. */}
      <ContactForm />
    </div>
  );
};

export default ContactPage; 