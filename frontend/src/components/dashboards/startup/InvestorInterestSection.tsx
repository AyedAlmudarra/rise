import React from 'react';
import { Spinner } from 'flowbite-react';

import { 
  IconEye, 
} from "@tabler/icons-react";

// --- Mock Data (Keep for MSW) ---
// Removed - now defined in MSW handler
/*
interface MockInvestor {
    id: number;
    name: string;
    company: string;
    title: string;
    avatar: string;
    location: string;
    lastActivity: string; // ISO Date string
    interest: 'High' | 'Medium' | 'Low';
    investmentFocus: string[];
    viewCount: number;
    hasViewed: {
      profile: boolean;
      financials: boolean;
      pitchDeck: boolean;
    };
    profileUrl?: string; // Optional link to investor profile
}

const mockInvestorDataForMSW: MockInvestor[] = [
  {
    id: 1,
    name: 'Sarah Johnson (Mock)',
    company: 'Horizon Ventures (Mock)',
    title: 'Principal',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    location: 'San Francisco, CA',
    lastActivity: new Date(Date.now() - 86400000 * 2).toISOString(),
    interest: 'High',
    investmentFocus: ['SaaS', 'FinTech'],
    viewCount: 5,
    hasViewed: { profile: true, financials: true, pitchDeck: true },
    profileUrl: '#'
  },
  {
    id: 2,
    name: 'Michael Chen (Mock)',
    company: 'Blue Ocean Capital (Mock)',
    title: 'Managing Partner',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    location: 'New York, NY',
    lastActivity: new Date(Date.now() - 86400000 * 7).toISOString(),
    interest: 'Medium',
    investmentFocus: ['Healthcare', 'AI'],
    viewCount: 3,
    hasViewed: { profile: true, financials: false, pitchDeck: true },
    profileUrl: '#'
  },
];
*/

// --- Component Props Interface ---
interface InvestorInterestSectionProps {
    // startupData: StartupProfile | null; // Removed unused prop
    isLoading: boolean; 
}

// --- Helper Functions ---


// --- Main Component ---
const InvestorInterestSection: React.FC<InvestorInterestSectionProps> = ({ isLoading }) => { // Removed startupData from props
  
  if (isLoading) {
    // Keep a simple loading state if needed
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner size="lg" />
      </div>
    );
  }

  // Placeholder Content
  return (
    <div className="text-center py-10">
      <IconEye size={40} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
      <h6 className="font-semibold text-gray-700 dark:text-white mb-1">Investor Interest Data</h6>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Insights on which investors are viewing your profile will appear here soon.
      </p>
      {/* Optionally add a link or button 
      <Button size="xs" color="light" className="mt-4">
        Learn More
      </Button> */}
    </div>
  );
};

export default InvestorInterestSection; 