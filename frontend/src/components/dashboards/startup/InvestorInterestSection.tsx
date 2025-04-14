import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tooltip, Badge, Button, Avatar, Progress, Table, Tabs, Spinner, Alert } from 'flowbite-react';
import { StartupProfile, InterestedInvestor } from '../../../types/database'; // Adjust path if necessary
import { supabase } from '../../../lib/supabaseClient'; // Added supabase import
import { toast } from 'react-hot-toast'; // Added toast for feedback
import { 
  IconEye, 
  IconScale, 
  IconUsers, 
  IconClock, 
  IconArrowUpRight, 
  IconHeart, 
  IconMessage,
  IconBuildingSkyscraper,
  IconMapPin,
  IconUserCheck,
  IconChevronRight,
  IconSearch,
  IconFilter,
  IconDownload,
  IconStar,
  IconBell,
  IconSend,
  IconSettings,
  IconInfoCircle, // Added for loading/info state
  IconExternalLink, // Added for links
  IconRefresh // Added for refresh button
} from "@tabler/icons-react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

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
    startupData: StartupProfile | null;
    isLoading: boolean; 
}

// --- Helper Functions ---
const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
  
const getInterestColor = (level: string | null): "success" | "warning" | "gray" => {
    switch(level) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'gray';
      default: return 'gray';
    }
};

// --- Main Component ---
const InvestorInterestSection: React.FC<InvestorInterestSectionProps> = ({ startupData, isLoading }) => {
  
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