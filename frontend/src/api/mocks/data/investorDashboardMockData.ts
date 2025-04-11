import { InvestorProfile } from 'src/types/database';

// Helper functions for generating realistic mock data
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomChoice = <T,>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Industry focus specific templates
const industryFocusTemplates = {
  'SaaS': {
    startupMatches: { min: 15, max: 35 },
    insights: [
      'SaaS markets show continued growth despite economic uncertainty',
      'Enterprise SaaS solutions are outperforming SMB-focused products',
      'Consider verticalized SaaS solutions with industry-specific features',
      'The average SaaS exit multiple dropped to 6.8x revenue in the past quarter'
    ]
  },
  'E-commerce': {
    startupMatches: { min: 20, max: 45 },
    insights: [
      'Direct-to-consumer brands face increasing CAC challenges',
      'Cross-border e-commerce platforms show promising growth in emerging markets',
      'Marketplaces with unique inventory are outperforming generic platforms',
      'Sustainable and ethical e-commerce businesses show higher customer loyalty metrics'
    ]
  },
  'Fintech': {
    startupMatches: { min: 10, max: 30 },
    insights: [
      'Embedded finance solutions continue to gain traction across industries',
      'Regulatory changes in payment processing are creating new opportunities',
      'B2B fintech solutions show lower CAC and higher retention than B2C',
      'Consider startups leveraging blockchain for real business applications beyond cryptocurrencies'
    ]
  },
  'Healthcare': {
    startupMatches: { min: 8, max: 25 },
    insights: [
      'Digital health startups with proven ROI models are raising larger rounds',
      'Remote patient monitoring solutions show strong adoption trends',
      'Healthcare data analytics companies are increasingly attractive acquisition targets',
      'Consider telemedicine platforms targeting underserved specialties'
    ]
  }
};

// Default template for any industry not specifically defined
const defaultTemplate = {
  startupMatches: { min: 12, max: 30 },
  insights: [
    'Early-stage valuations have decreased 15-20% in the last year',
    'Startups demonstrating clear unit economics are raising at better terms',
    'Consider portfolio companies with complementary offerings',
    'Founders with domain expertise continue to outperform first-time entrepreneurs'
  ]
};

// --- Interfaces for Mock Data Sections ---

export interface MockDealFlow {
  activeDeals: number;
  pipelineValue: number;
  totalStartupsEvaluated: number;
  dealsByStage: {
    stage: string;
    count: number;
  }[];
  recentDeals: {
    id: string;
    startupName: string;
    industry: string;
    amount: number;
    stage: string;
    status: 'Evaluating' | 'Due Diligence' | 'Term Sheet' | 'Negotiating' | 'Closed';
    lastActivity: string;
  }[];
  dealsByIndustry: {
    industry: string;
    percentage: number;
  }[];
}

export interface MockAISuggestion {
  id: string;
  startupName: string;
  industry: string;
  stage: string;
  matchScore: number; // 0-100
  description: string;
  highlights: string[];
  logoUrl?: string;
  fundingNeeded?: number;
  teamSize?: number;
  location?: string;
  matchReason: string;
}

export interface MockWatchlist {
  totalWatched: number;
  recentlyAdded: number;
  watchedByStage: {
    stage: string;
    count: number;
  }[];
  watchedByIndustry: {
    industry: string;
    count: number;
  }[];
  topWatched: {
    id: string;
    startupName: string;
    industry: string;
    stage: string;
    dateAdded: string;
    lastUpdate: string;
    status: 'Active' | 'Fundraising' | 'Acquired' | 'Closed';
    notes?: string;
  }[];
}

export interface MockMarketInsights {
  trendingIndustries: {
    industry: string;
    trend: 'Up' | 'Down' | 'Stable';
    changePercentage: number;
  }[];
  fundingTrends: {
    quarter: string;
    earlyStage: number;
    growthStage: number;
    lateStage: number;
  }[];
  insights: string[];
  recentExits: {
    company: string;
    acquirer: string;
    amount: number;
    multiple?: number;
    date: string;
  }[];
}

// --- Combined Mock Data Structure ---

export interface MockInvestorDashboardData {
  dealFlow: MockDealFlow;
  aiSuggestions: MockAISuggestion[];
  watchlist: MockWatchlist;
  marketInsights: MockMarketInsights;
}

// Dynamic mock data generation based on investor preferences
export const generateMockData = (investorProfile?: InvestorProfile | null): MockInvestorDashboardData => {
  // Use default values if no investor profile is provided
  const preferredIndustries = investorProfile?.preferred_industries || ['SaaS', 'Fintech'];
  const preferredStages = investorProfile?.preferred_stage || ['Seed', 'Series A'];
  
  // Pick one industry to focus most insights on
  const primaryIndustry = preferredIndustries.length > 0 
    ? randomChoice(preferredIndustries) 
    : randomChoice(['SaaS', 'E-commerce', 'Fintech', 'Healthcare']);
  
  // Get industry-specific template or default
  const template = industryFocusTemplates[primaryIndustry as keyof typeof industryFocusTemplates] || defaultTemplate;
  
  // Generate deal flow data
  const totalDeals = randomInRange(8, 25);
  const dealsByStage = preferredStages.map(stage => ({
    stage,
    count: randomInRange(1, 8)
  }));
  
  // Ensure total matches sum of stages
  let stageSum = dealsByStage.reduce((sum, item) => sum + item.count, 0);
  if (stageSum < totalDeals) {
    dealsByStage.push({
      stage: 'Other',
      count: totalDeals - stageSum
    });
  }
  
  // Generate deal flow mock data
  const dealFlow: MockDealFlow = {
    activeDeals: totalDeals,
    pipelineValue: randomInRange(2, 15) * 1000000, // $2M - $15M
    totalStartupsEvaluated: totalDeals + randomInRange(20, 100),
    dealsByStage,
    recentDeals: generateRecentDeals(preferredIndustries, preferredStages, 5),
    dealsByIndustry: generateIndustryBreakdown(preferredIndustries)
  };
  
  // Generate AI suggestions
  const aiSuggestions = generateStartupSuggestions(
    preferredIndustries, 
    preferredStages,
    template.startupMatches.min,
    template.startupMatches.max
  );
  
  // Generate watchlist data
  const watchlist: MockWatchlist = {
    totalWatched: randomInRange(10, 50),
    recentlyAdded: randomInRange(2, 8),
    watchedByStage: preferredStages.map(stage => ({
      stage,
      count: randomInRange(2, 15)
    })),
    watchedByIndustry: preferredIndustries.map(industry => ({
      industry,
      count: randomInRange(3, 20)
    })),
    topWatched: generateTopWatchedStartups(preferredIndustries, preferredStages, 5)
  };
  
  // Generate market insights
  const marketInsights: MockMarketInsights = {
    trendingIndustries: generateTrendingIndustries(preferredIndustries),
    fundingTrends: generateFundingTrends(),
    insights: template.insights,
    recentExits: generateRecentExits(preferredIndustries)
  };
  
  return {
    dealFlow,
    aiSuggestions,
    watchlist,
    marketInsights
  };
};

// Helper function to generate recent deals
const generateRecentDeals = (
  industries: string[], 
  stages: string[], 
  count: number
): MockDealFlow['recentDeals'] => {
  const deals = [];
  const statuses: MockDealFlow['recentDeals'][0]['status'][] = [
    'Evaluating', 'Due Diligence', 'Term Sheet', 'Negotiating', 'Closed'
  ];
  
  const startupNames = [
    'Quantum Analytics', 'NexaHealth', 'EcoLogistics', 'CyberGuardian', 
    'FinEdge', 'RetailGenius', 'CloudScale', 'DataMind', 'SmartFabric',
    'Urban Mobility', 'FoodChain', 'MedSync', 'EdTech Pioneers', 'WorkFlow'
  ];
  
  for (let i = 0; i < count; i++) {
    deals.push({
      id: `deal-${i + 1}`,
      startupName: randomChoice(startupNames),
      industry: randomChoice(industries),
      amount: (randomInRange(5, 50) * 100000), // $500K - $5M
      stage: randomChoice(stages),
      status: randomChoice(statuses),
      lastActivity: `${randomInRange(1, 30)} days ago`
    });
  }
  
  return deals;
};

// Helper function to generate industry breakdown
const generateIndustryBreakdown = (industries: string[]): MockDealFlow['dealsByIndustry'] => {
  let remaining = 100;
  const result: MockDealFlow['dealsByIndustry'] = [];
  
  // Allocate to preferred industries first
  for (let i = 0; i < industries.length; i++) {
    const isLast = i === industries.length - 1;
    const percentage = isLast ? remaining : randomInRange(10, Math.min(40, remaining - (industries.length - i - 1) * 10));
    
    result.push({
      industry: industries[i],
      percentage
    });
    
    remaining -= percentage;
  }
  
  // Add "Other" if there's any percentage left
  if (remaining > 0) {
    result.push({
      industry: 'Other',
      percentage: remaining
    });
  }
  
  return result;
};

// Helper function to generate startup suggestions
const generateStartupSuggestions = (
  industries: string[], 
  stages: string[],
  minCount: number,
  maxCount: number
): MockAISuggestion[] => {
  const count = randomInRange(minCount, maxCount);
  const suggestions: MockAISuggestion[] = [];
  
  const startupNames = [
    'Lumina AI', 'Horizon Health', 'GreenRoute', 'SecurityFirst', 
    'PayFlow', 'RetailIQ', 'ServerLess', 'Cortex Analytics', 'Fabric OS',
    'Metro Connect', 'FarmTech', 'MediPulse', 'LearnX', 'TaskMaster'
  ];
  
  const matchReasons = [
    'Aligns with your investment focus in [industry]',
    'Matches your preferred stage and sector',
    'Similar to your previous investments',
    'Growing rapidly in your target market',
    'Strong founding team with domain expertise',
    'Innovative approach in [industry]',
    'Demonstrated product-market fit'
  ];
  
  const highlights = [
    'Strong founding team with previous exits',
    'Growing 20% MoM with positive unit economics',
    '90% customer retention rate',
    'Proprietary technology with pending patents',
    'Strategic partnerships with industry leaders',
    'Clear path to profitability within 18 months',
    'Expanding internationally with minimal capital'
  ];
  
  for (let i = 0; i < count; i++) {
    const industry = randomChoice(industries);
    const stage = randomChoice(stages);
    
    suggestions.push({
      id: `sugg-${i + 1}`,
      startupName: randomChoice(startupNames),
      industry,
      stage,
      matchScore: randomInRange(75, 98),
      description: `A ${stage.toLowerCase()} ${industry} startup focused on [specific problem] with a unique approach to [solution].`,
      highlights: [
        randomChoice(highlights),
        randomChoice(highlights),
        randomChoice(highlights)
      ],
      fundingNeeded: randomInRange(5, 50) * 100000,
      teamSize: randomInRange(3, 30),
      location: randomChoice(['Saudi Arabia', 'UAE', 'Egypt', 'Jordan', 'Qatar']),
      matchReason: randomChoice(matchReasons).replace('[industry]', industry.toLowerCase())
    });
  }
  
  return suggestions;
};

// Helper function to generate top watched startups
const generateTopWatchedStartups = (
  industries: string[], 
  stages: string[],
  count: number
): MockWatchlist['topWatched'] => {
  const startups = [];
  const statuses: MockWatchlist['topWatched'][0]['status'][] = [
    'Active', 'Fundraising', 'Acquired', 'Closed'
  ];
  
  const startupNames = [
    'Athena Tech', 'Wellspring Health', 'Eco Logistics', 'Shield Security', 
    'Cashflow', 'Commerce IQ', 'Cloud Native', 'Neural Systems', 'Smart Fabric',
    'Urban Transit', 'AgriTech', 'Health Pulse', 'EduMatrix', 'Flow Systems'
  ];
  
  for (let i = 0; i < count; i++) {
    startups.push({
      id: `watch-${i + 1}`,
      startupName: randomChoice(startupNames),
      industry: randomChoice(industries),
      stage: randomChoice(stages),
      dateAdded: `${randomInRange(1, 12)} months ago`,
      lastUpdate: `${randomInRange(1, 30)} days ago`,
      status: randomChoice(statuses),
      notes: Math.random() > 0.3 ? 'Meeting scheduled for end of quarter' : undefined
    });
  }
  
  return startups;
};

// Helper function to generate trending industries
const generateTrendingIndustries = (
  preferredIndustries: string[]
): MockMarketInsights['trendingIndustries'] => {
  return [
    ...preferredIndustries.map(industry => ({
      industry,
      trend: randomChoice(['Up', 'Stable', 'Down']) as 'Up' | 'Down' | 'Stable',
      changePercentage: randomInRange(5, 30)
    })),
    {
      industry: 'Climate Tech',
      trend: 'Up' as const,
      changePercentage: randomInRange(15, 40)
    },
    {
      industry: 'AI & Machine Learning',
      trend: 'Up' as const,
      changePercentage: randomInRange(20, 45)
    }
  ];
};

// Helper function to generate funding trends
const generateFundingTrends = (): MockMarketInsights['fundingTrends'] => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const currentQuarter = Math.floor((new Date().getMonth() / 3));
  
  return Array.from({ length: 4 }).map((_, index) => {
    const quarterIndex = (currentQuarter - 3 + index + 4) % 4;
    const year = new Date().getFullYear() - (quarterIndex > currentQuarter ? 1 : 0);
    
    return {
      quarter: `${quarters[quarterIndex]} ${year}`,
      earlyStage: randomInRange(500, 2000), // $500K - $2M average
      growthStage: randomInRange(2000, 8000), // $2M - $8M average
      lateStage: randomInRange(8000, 25000) // $8M - $25M average
    };
  });
};

// Helper function to generate recent exits
const generateRecentExits = (
  industries: string[]
): MockMarketInsights['recentExits'] => {
  const startupNames = [
    'Innovate AI', 'MedTech Solutions', 'GreenEnergy', 'CyberDefense', 
    'PaymentHub', 'RetailSmart', 'CloudServices', 'DataLake', 'IoT Connect',
    'UrbanMobility', 'AgriSolutions', 'HealthTech', 'EdTech Pro', 'WorkSolutions'
  ];
  
  const acquirers = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Oracle', 'Salesforce',
    'IBM', 'Samsung', 'Saudi Aramco', 'STC', 'Careem', 'Noon', 'Talabat'
  ];
  
  return Array.from({ length: 5 }).map((_, i) => ({
    company: randomChoice(startupNames),
    acquirer: randomChoice(acquirers),
    amount: randomInRange(5, 500) * 1000000, // $5M - $500M
    multiple: Math.random() > 0.3 ? randomInRange(3, 12) : undefined,
    date: `${randomInRange(1, 12)} months ago`
  }));
};

// Default mock data if no profile is provided
export const mockInvestorData: MockInvestorDashboardData = generateMockData(); 