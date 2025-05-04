import React from 'react';
import GuideCard, { Guide } from '@/components/resources/GuideCard';
import { IconNotebook } from '@tabler/icons-react';

// Mock data with 'real' short content
const mockGuides: Guide[] = [
  {
    id: 'guide_001',
    title: "Crafting Your Pitch Deck Narrative",
    summary: "Learn how to structure your pitch deck to tell a compelling story that resonates with investors. Focus on the flow from problem to solution to market opportunity.",
    category: "Pitching",
    content_type: 'internal', 
    content: "Focus on a clear narrative: 1. Problem: Define the pain point clearly. 2. Solution: Explain your unique fix. 3. Market: Show the size and potential. 4. Business Model: How do you make money? 5. Team: Why are you the right people? 6. Financials: Show traction and projections. 7. Ask: Be clear about funding needs and use.",
    icon_name: 'IconPresentationAnalytics'
  },
   {
    id: 'guide_002',
    title: "Key Metrics Investors Look For (Seed Stage)",
    summary: "Understand the essential KPIs investors focus on for seed-stage startups, such as MRR/ARR, customer acquisition cost (CAC), and user engagement.",
    category: "Metrics",
    content_type: 'internal',
    content: "Seed investors look for signs of product-market fit and potential scalability. Key metrics include: Monthly Recurring Revenue (MRR) / Annual Recurring Revenue (ARR) growth rate, Customer Acquisition Cost (CAC), Customer Lifetime Value (CLTV) (and the LTV:CAC ratio), Churn Rate (for SaaS), and Active Users/Engagement metrics relevant to your model. Be ready to explain how you track these and what they mean for your growth.",
    icon_name: 'IconCalculator'
  },
  {
    id: 'guide_003',
    title: "Approaching Investors in KSA: Best Practices",
    summary: "Tips for identifying and connecting with the right investors in the Saudi Arabian market. Focus on research, warm introductions, and concise communication.",
    category: "Fundraising",
    content_type: 'internal',
    content: "1. Research: Identify investors whose thesis aligns with your stage, industry, and geography (KSA focus). Use RISE, LinkedIn, and VC websites. 2. Warm Intros: Leverage your network for introductions; they are significantly more effective than cold outreach. 3. Cold Outreach (If Necessary): Keep it concise, personalized, and highlight key traction points. Attach a one-pager, not the full deck initially. 4. Follow Up Professionally: Don't hound, but follow up politely after a reasonable period.",
    icon_name: 'IconUsersGroup'
  },
   {
    id: 'guide_004',
    title: "Understanding Term Sheets (External Link Example)",
    summary: "An external article explaining common clauses found in venture capital term sheets.",
    category: "Legal",
    content_type: 'external',
    content: "https://www.investopedia.com/terms/t/termsheet.asp", // Example external link
    icon_name: 'IconFileInfo'
  },
];

const StartupGuidesPage: React.FC = () => {
  // Mock states - Replace with actual data fetching later
  const guides = mockGuides;
  const isLoading = false;
  const error = null;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
            <IconNotebook size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Startup Guides</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Actionable advice and insights for building and funding your startup.</p>
          </div>
        </div>
      </div>

      {/* Loading State Placeholder */}
      {isLoading && (
        <div className="text-center py-10">Loading guides...</div> 
      )}

      {/* Error State Placeholder */}
      {!isLoading && error && (
         <div className="text-center py-10 text-red-500">Error loading guides: {error}</div>
      )}

      {/* Content Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.length > 0 ? (
            guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 md:col-span-2 lg:col-span-3 text-center py-10">
              No guides available at this time.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StartupGuidesPage; 