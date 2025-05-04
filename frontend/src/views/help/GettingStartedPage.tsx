import React from 'react';
import { Button, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom'; // For navigation links
import { useAuth } from '@/context/AuthContext'; // To potentially tailor content later if needed
import {
  IconRocket,
  
  IconBuilding,
  IconBrain,
  IconFileText,
  IconTargetArrow,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconHelpCircle,
  IconMail,
  IconLayoutDashboard
} from '@tabler/icons-react';

const GettingStartedPage: React.FC = () => {
  const { userRole } = useAuth(); // Get user role

  // Define steps for each role
  const startupSteps = [
    { 
      title: "Complete Your Profile", 
      description: "Provide details about your company, team, and traction. This is crucial for AI analysis and attracting investors.", 
      link: "/app/settings/account", 
      buttonText: "Go to Settings",
      icon: IconBuilding 
    },
    { 
      title: "Understand Your Dashboard", 
      description: "Familiarize yourself with the key sections: Overview, AI Insights, and Investor Relations tools.", 
      link: "/app/startup/dashboard", 
      buttonText: "View Dashboard",
      icon: IconLayoutDashboard
    },
    { 
      title: "Request AI Analysis", 
      description: "Submit your profile for AI analysis to get insights on funding readiness, KPIs, and potential risks/opportunities.", 
      link: "/app/ai-insights", 
      buttonText: "Go to AI Insights",
      icon: IconBrain 
    },
    { 
      title: "Explore Resources", 
      description: "Find helpful templates (Pitch Deck, Financials) and guides to aid your fundraising journey.", 
      link: "/app/resources/templates", // First link goes to templates
      buttonText: "View Templates & Guides",
      icon: IconFileText 
    },
  ];

  const investorSteps = [
    { 
      title: "Complete Your Profile & Thesis", 
      description: "Essential for defining your investment thesis and enabling accurate AI startup matching.", 
      link: "/app/settings/account", 
      buttonText: "Go to Settings",
      icon: IconTargetArrow 
    },
    { 
      title: "Understand Your Dashboard", 
      description: "Learn where to find AI-suggested startups, manage your deal flow, and track connections.", 
      link: "/app/investor/dashboard", 
      buttonText: "View Dashboard",
      icon: IconLayoutDashboard 
    },
    { 
      title: "Discover Startups", 
      description: "Browse potential investment opportunities matched to your profile.", 
      link: "/app/investor/browse-startups", // Link might need adjustment
      buttonText: "Find Startups",
      icon: IconBuildingSkyscraper 
    },
    { 
      title: "Explore Resources", 
      description: "Find helpful templates (Due Diligence) and guides.", 
      link: "/app/resources/templates", // First link goes to templates
      buttonText: "View Templates & Guides",
      icon: IconBriefcase 
    },
  ];

  // Helper to render a single step with enhanced UI
  const renderStep = (step: { title: string; description: string; link: string; buttonText: string; icon: React.ElementType }, index: number) => (
    <div key={step.title} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Icon and Number */}
      <div className="flex-shrink-0 flex flex-col items-center">
         <div className="mb-1.5 p-2 bg-primary-100 dark:bg-primary-900/30 text-primary dark:text-primary-300 rounded-full">
            <step.icon size={24} />
         </div>
         <Badge color="gray" size="sm">Step {index + 1}</Badge>
      </div>
      {/* Content and Action */}
      <div className="flex-grow">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {step.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {step.description}
        </p>
        <Button as={Link} to={step.link} size="xs" color="light">
          {step.buttonText}
        </Button>
      </div>
    </div>
  );

  // Function to render the content based on role
  const renderRoleBasedContent = () => {
    if (!userRole) {
      // Role not yet determined or user not logged in
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">Loading user information...</p>
          {/* Consider adding a Spinner here */}
        </div>
      );
    }

    if (userRole === 'startup') {
      return (
        <div className="max-w-3xl mx-auto space-y-5"> {/* Use div + space-y */}
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">Startup Checklist</h3>
          {startupSteps.map((step, index) => renderStep(step, index))} 
        </div>
      );
    }

    if (userRole === 'investor') {
      return (
        <div className="max-w-3xl mx-auto space-y-5"> {/* Use div + space-y */}
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">Investor Checklist</h3>
          {investorSteps.map((step, index) => renderStep(step, index))} 
        </div>
      );
    }

    // Fallback if role is something else unexpected
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Getting started information for your role is not available.</p>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
            <IconRocket size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Getting Started on RISE</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Welcome! Let's get you set up to connect and grow.
            </p>
          </div>
        </div>
      </div>

      {/* Intro Text */}
      <p className="text-lg text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        RISE connects innovative <span className="font-semibold text-primary">Startups</span> with relevant <span className="font-semibold text-secondary">Investors</span> using AI-powered analysis and matchmaking. Follow the steps below for your role to get started.
      </p>

      {/* Conditionally Rendered Role-Based Content */}
      <div>
        {renderRoleBasedContent()}
      </div>

      {/* Further Help Section */}
      <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
         <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Still Have Questions?</h4>
         <div className="flex justify-center gap-4">
           <Button as={Link} to="/app/help/faq" color="light" size="sm">
              <IconHelpCircle size={16} className="mr-2"/>
              Read FAQ
           </Button>
           <Button as={Link} to="/app/help/contact" color="light" size="sm">
             <IconMail size={16} className="mr-2"/>
             Contact Support
           </Button>
         </div>
      </div>

    </div>
  );
};

export default GettingStartedPage; 