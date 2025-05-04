import React from 'react';
import GuideCard, { Guide } from '@/components/resources/GuideCard';
import { IconBriefcase } from '@tabler/icons-react';

// Mock data for Investor Guides
const mockInvestorGuides: Guide[] = [
  {
    id: 'guide_inv_001',
    title: "Structuring Your Seed Investment Thesis",
    summary: "Define key criteria for your seed-stage investments, including target industries, geographies (focus on KSA), team characteristics, and desired deal structure.",
    category: "Strategy",
    content_type: 'internal', 
    content: "A clear investment thesis helps filter deals efficiently. Define: 1. Industry Focus: What sectors do you understand best? 2. Stage: Pre-seed, Seed, early Series A? 3. Geography: KSA only, MENA, global? 4. Team Criteria: What founder traits are crucial? 5. Market Size: Minimum addressable market? 6. Check Size: Your typical investment amount. 7. Added Value: How do you help portfolio companies beyond capital?",
    icon_name: 'IconTargetArrow'
  },
  {
    id: 'guide_inv_002',
    title: "Effective Startup Due Diligence: Beyond the Pitch",
    summary: "Learn key areas to investigate during due diligence, including validating the market, assessing the team, analyzing financials, and reviewing legal aspects.",
    category: "Due Diligence",
    content_type: 'internal',
    content: "Go beyond the pitch deck. Key DD areas: 1. Team: Reference checks, assess founder dynamic and coachability. 2. Market: Validate market size claims, understand competition. 3. Product/Tech: Assess scalability, defensibility, IP. 4. Financials: Review historicals (if any), scrutinize projections, unit economics (CAC, LTV). 5. Legal: Check cap table, incorporation docs, key contracts. 6. Customer Calls: Talk to actual users/customers if possible.",
    icon_name: 'IconSearch'
  },
  {
    id: 'guide_inv_003',
    title: "Understanding Common Seed Stage Deal Terms in KSA",
    summary: "A brief overview of typical valuation ranges, investment instruments (e.g., SAFE notes vs. equity), and common investor rights seen in Saudi seed rounds.",
    category: "Deal Terms",
    content_type: 'internal',
    content: "Seed deals in KSA often use convertible instruments (like SAFEs or convertible notes) or priced equity rounds. Valuations vary greatly but research recent comparable deals. Common terms to understand: 1. Valuation Cap & Discount (for convertibles). 2. Pre/Post-Money Valuation (for equity). 3. Liquidation Preference (often 1x non-participating). 4. Pro-rata Rights. 5. Information Rights. 6. Board Seats (less common at seed).",
    icon_name: 'IconGavel'
  },
];

const InvestorGuidesPage: React.FC = () => {
  // Mock states - Replace with actual data fetching later
  const guides = mockInvestorGuides;
  const isLoading = false;
  const error = null;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {/* Changed gradient and icon */}
          <div className="mr-4 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
            <IconBriefcase size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Investor Guides</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Insights and best practices for investing in startups.</p>
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
              No investor guides available at this time.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestorGuidesPage; 