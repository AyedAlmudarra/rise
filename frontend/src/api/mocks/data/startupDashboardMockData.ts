import { StartupProfile } from '@/types/database'; // Assuming path is correct

// Helper functions for generating realistic mock data
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomChoice = <T,>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Industry-specific metrics templates
const industryTemplates = {
  'SaaS': {
    metrics: {
      kpi_cac: { min: 800, max: 1500 },
      kpi_clv: { min: 3000, max: 12000 },
      kpi_retention_rate: { min: 70, max: 95 },
      kpi_conversion_rate: { min: 2, max: 8 },
      revenueMultiplier: { min: 4, max: 8 },
      userGrowth: { min: 10, max: 30 },
    },
    insights: [
      'Improve onboarding workflow to increase trial-to-paid conversion rate',
      'Consider introducing annual billing options to improve cash flow',
      'Analyze churn patterns to identify at-risk customer segments',
      'Implement customer success programs to improve retention'
    ]
  },
  'E-commerce': {
    metrics: {
      kpi_cac: { min: 20, max: 150 },
      kpi_clv: { min: 100, max: 500 },
      kpi_retention_rate: { min: 25, max: 60 },
      kpi_conversion_rate: { min: 1, max: 4 },
      revenueMultiplier: { min: 2, max: 5 },
      userGrowth: { min: 15, max: 40 },
    },
    insights: [
      'Optimize product pages to increase conversion rates',
      'Implement abandoned cart recovery campaigns',
      'Diversify product catalog based on seasonal trends',
      'Focus on repeat purchase rate through loyalty programs'
    ]
  },
  'Fintech': {
    metrics: {
      kpi_cac: { min: 200, max: 1000 },
      kpi_clv: { min: 2000, max: 10000 },
      kpi_retention_rate: { min: 60, max: 90 },
      kpi_conversion_rate: { min: 1, max: 5 },
      revenueMultiplier: { min: 6, max: 12 },
      userGrowth: { min: 8, max: 25 },
    },
    insights: [
      'Enhance security features to build trust with customers',
      'Simplify onboarding process to reduce abandonment',
      'Consider strategic partnerships with established financial institutions',
      'Focus on regulatory compliance as a competitive advantage'
    ]
  },
  'Healthcare': {
    metrics: {
      kpi_cac: { min: 500, max: 2000 },
      kpi_clv: { min: 5000, max: 20000 },
      kpi_retention_rate: { min: 80, max: 95 },
      kpi_conversion_rate: { min: 0.5, max: 3 },
      revenueMultiplier: { min: 3, max: 7 },
      userGrowth: { min: 5, max: 20 },
    },
    insights: [
      'Focus on HIPAA compliance and data security',
      'Build relationships with healthcare providers for distribution',
      'Invest in clinical validation studies to demonstrate efficacy',
      'Consider reimbursement strategies for long-term growth'
    ]
  }
};

// Default template for any industry not specifically defined
const defaultTemplate = {
  metrics: {
    kpi_cac: { min: 300, max: 1200 },
    kpi_clv: { min: 1000, max: 8000 },
    kpi_retention_rate: { min: 50, max: 80 },
    kpi_conversion_rate: { min: 1, max: 5 },
    revenueMultiplier: { min: 3, max: 6 },
    userGrowth: { min: 10, max: 25 },
  },
  insights: [
    'Focus on core value proposition to differentiate from competitors',
    'Optimize customer acquisition channels to reduce CAC',
    'Analyze customer feedback to guide product development',
    'Consider strategic partnerships to accelerate growth'
  ]
};

// --- Interfaces for Mock Data Sections ---

export interface MockKeyMetrics {
  // Direct from StartupProfile (or derived)
  annualRevenue: number | null;
  annualExpenses: number | null;
  revenueGrowthRate?: number; // Example derived metric (percentage)
  customerGrowthRate?: number; // Example derived metric (percentage)
  numCustomers: number | null;
  numEmployees: number | null;
  kpi_cac: number | null; // Customer Acquisition Cost
  kpi_clv: number | null; // Customer Lifetime Value
  kpi_retention_rate: number | null; // Percentage
  kpi_conversion_rate: number | null; // Percentage
  kpi_monthly_growth?: number | null; // Monthly growth rate
  kpi_burn_rate?: number | null; // Monthly cash burn
  kpi_runway?: number | null; // Months of runway left
  kpi_ltv_cac_ratio?: number | null; // LTV/CAC ratio
  // Data for charts (e.g., monthly revenue/expenses)
  monthlyRevenue?: { month: string; value: number }[];
  monthlyExpenses?: { month: string; value: number }[];
  monthlyUsers?: { month: string; value: number }[];
  quarterlyMetrics?: { quarter: string; revenue: number; expenses: number; newCustomers: number }[];
}

export interface MockAIInsight {
  id: string;
  title: string;
  summary: string;
  category: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat' | 'Recommendation';
  severity?: 'Low' | 'Medium' | 'High'; // Optional severity for recommendations/threats
  timestamp: string; // ISO 8601
  industry_specific?: boolean; // Flag for industry-specific insights
  action_items?: string[]; // Suggested next steps
}

export interface MockFundingReadiness {
  score: number; // Overall score (e.g., 0-100)
  profileCompleteness: number; // Percentage
  financialsScore: number; // Score based on metrics
  marketFitScore?: number; // Score based on market fit
  pitchDeckStatus: 'Missing' | 'Uploaded' | 'Needs Improvement';
  recommendations: string[]; // Actionable tips to improve score
  investorTypeMatch?: { 
    angelInvestors: number; // Percentage match
    ventureCap: number; 
    strategicInvestors: number;
    accelerators: number;
  }; // Match percentage with different investor types
}

export interface MockInvestorInterest {
  profileViews: number;
  dataRoomRequests: number;
  connectionRequests: number;
  savedToWatchlist?: number;
  meetingRequests?: number;
  averageTimeOnProfile?: number; // Average time spent on profile (seconds)
  topInvestors?: {
    name: string;
    company: string;
    interest: 'High' | 'Medium' | 'Low';
    lastViewed: string; // ISO 8601
  }[];
  lastInterestDate: string | null; // ISO 8601
  interestTrend?: 'increasing' | 'stable' | 'decreasing';
  interestTimeline?: { 
    week: string; 
    views: number;
  }[];
}

// --- Combined Mock Data Structure ---

export interface MockStartupDashboardData {
  keyMetrics: MockKeyMetrics;
  aiInsights: MockAIInsight[];
  fundingReadiness: MockFundingReadiness;
  investorInterest: MockInvestorInterest;
}


// --- Sample Mock Data Generation ---

const generateMonthlyData = (startValue: number, months: number, trend: 'up' | 'down' | 'stable', volatility: 'low' | 'medium' | 'high' = 'medium'): { month: string; value: number }[] => {
    const data = [];
    let currentValue = startValue;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    
    const volatilityFactors = {
      low: 0.05,
      medium: 0.1,
      high: 0.2
    };
    
    const volatilityFactor = volatilityFactors[volatility];
    
    // Base multipliers for different trends
    const trendMultipliers = {
      up: 1.08, // 8% average increase
      stable: 1.01, // 1% average increase
      down: 0.96 // 4% average decrease
    };
    
    const baseMultiplier = trendMultipliers[trend];

    for (let i = 0; i < months; i++) {
        const monthIndex = (currentMonthIndex - months + 1 + i + 12) % 12;
        const month = monthNames[monthIndex];
        
        // Random fluctuation based on volatility
        const randomFactor = 1 + (Math.random() * 2 - 1) * volatilityFactor;
        
        // Apply trend with random fluctuation
        const multiplier = baseMultiplier * randomFactor;
        
        currentValue = Math.max(0, Math.round(currentValue * multiplier));
        data.push({ month, value: currentValue });
    }
    return data;
}

// Dynamic mock data generation based on industry and stage
export const generateMockData = (startupProfile?: StartupProfile | null): MockStartupDashboardData => {
  // Use default values if no startup profile is provided
  const industry = startupProfile?.industry || randomChoice(['SaaS', 'E-commerce', 'Fintech', 'Healthcare']);
  const stage = startupProfile?.operational_stage || randomChoice(['Pre-seed', 'Seed', 'Series A']);
  const numEmployees = startupProfile?.num_employees || randomInRange(3, 20);
  
  // Get industry-specific template or default
  const template = industryTemplates[industry as keyof typeof industryTemplates] || defaultTemplate;
  
  // Adjust metrics based on stage
  const stageMultiplier = {
    'Pre-seed': 0.6,
    'Seed': 1.0,
    'Series A': 1.8,
    'Series B': 3.0,
    'Growth': 5.0
  }[stage] || 1.0;
  
  // Generate key metrics
  const metricsTemplate = template.metrics;
  const kpi_cac = Math.round(randomInRange(
    metricsTemplate.kpi_cac.min, 
    metricsTemplate.kpi_cac.max
  ) * stageMultiplier);
  
  const kpi_clv = Math.round(randomInRange(
    metricsTemplate.kpi_clv.min, 
    metricsTemplate.kpi_clv.max
  ) * stageMultiplier);
  
  const kpi_retention_rate = randomInRange(
    metricsTemplate.kpi_retention_rate.min,
    metricsTemplate.kpi_retention_rate.max
  );
  
  const kpi_conversion_rate = randomInRange(
    metricsTemplate.kpi_conversion_rate.min,
    metricsTemplate.kpi_conversion_rate.max
  );
  
  const revenueGrowthRate = randomInRange(
    metricsTemplate.userGrowth.min,
    metricsTemplate.userGrowth.max
  );
  
  const customerGrowthRate = randomInRange(
    metricsTemplate.userGrowth.min + 5,
    metricsTemplate.userGrowth.max + 5
  );
  
  // Derive other metrics
  const numCustomers = startupProfile?.num_customers || Math.round(randomInRange(10, 50) * stageMultiplier);
  const annualRevenue = startupProfile?.annual_revenue || Math.round(numCustomers * kpi_clv / 3);
  const annualExpenses = startupProfile?.annual_expenses || Math.round(annualRevenue * 0.8 + (kpi_cac * numCustomers * 0.4));
  const kpi_burn_rate = Math.round((annualExpenses - annualRevenue) / 12);
  const kpi_runway = annualRevenue > annualExpenses ? 100 : Math.round(annualRevenue / kpi_burn_rate);
  const kpi_ltv_cac_ratio = parseFloat((kpi_clv / kpi_cac).toFixed(1));
  
  // Generate time series data
  const monthlyRevenue = generateMonthlyData(
    Math.round(annualRevenue / 12), 
    12, 
    revenueGrowthRate > 15 ? 'up' : revenueGrowthRate < 5 ? 'down' : 'stable'
  );
  
  const monthlyExpenses = generateMonthlyData(
    Math.round(annualExpenses / 12), 
    12, 
    'stable',
    'low'
  );
  
  const monthlyUsers = generateMonthlyData(
    Math.round(numCustomers / 2), 
    12, 
    customerGrowthRate > 20 ? 'up' : customerGrowthRate < 10 ? 'stable' : 'up',
    'medium'
  );
  
  // Generate industry-specific insights
  const generalInsights: MockAIInsight[] = [
    {
      id: 'ai1',
      title: `Strong ${kpi_retention_rate}% Customer Retention`,
      summary: `Your customer retention rate of ${kpi_retention_rate}% is ${kpi_retention_rate > 70 ? 'significantly above' : 'close to'} the industry average for ${industry} startups.`,
      category: kpi_retention_rate > 65 ? 'Strength' : 'Opportunity',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
    {
      id: 'ai2',
      title: kpi_cac > 500 ? 'High Customer Acquisition Cost (CAC)' : 'Competitive Customer Acquisition Cost',
      summary: `Your CAC ($${kpi_cac}) is ${kpi_cac > 1000 ? 'significantly higher than' : kpi_cac > 500 ? 'higher than' : 'in line with'} industry benchmarks. ${kpi_cac > 500 ? 'Consider exploring more cost-effective marketing channels.' : 'Continue optimizing your marketing efforts to maintain this advantage.'}`,
      category: kpi_cac > 800 ? 'Weakness' : kpi_cac > 500 ? 'Threat' : 'Strength',
      severity: kpi_cac > 800 ? 'High' : kpi_cac > 500 ? 'Medium' : undefined,
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 'ai3',
      title: 'Market Expansion Opportunity',
      summary: `Analysis of your customer data suggests potential for geographic expansion to ${randomChoice(['European', 'Asian', 'Latin American', 'Middle Eastern'])} markets with minimal localization requirements.`,
      category: 'Opportunity',
      timestamp: new Date().toISOString(), // Today
    },
    {
      id: 'ai4',
      title: kpi_ltv_cac_ratio < 3 ? 'Improve LTV/CAC Ratio' : 'Strong LTV/CAC Ratio',
      summary: `Your LTV/CAC ratio of ${kpi_ltv_cac_ratio}x is ${kpi_ltv_cac_ratio < 3 ? 'below the recommended minimum of 3x' : 'above the recommended minimum of 3x'}. ${kpi_ltv_cac_ratio < 3 ? 'Focus on increasing customer lifetime value or reducing acquisition costs.' : 'This indicates a healthy business model with good returns on customer acquisition spend.'}`,
      category: kpi_ltv_cac_ratio < 3 ? 'Recommendation' : 'Strength',
      severity: kpi_ltv_cac_ratio < 2 ? 'High' : kpi_ltv_cac_ratio < 3 ? 'Medium' : undefined,
      timestamp: new Date().toISOString(), // Today
      action_items: kpi_ltv_cac_ratio < 3 ? [
        'Implement upselling/cross-selling strategies to increase LTV',
        'Optimize marketing channels to reduce CAC',
        'Improve onboarding to extend customer lifetime'
      ] : undefined
    }
  ];
  
  // Industry-specific insights
  const industryInsights: MockAIInsight[] = template.insights.map((insight, index) => ({
    id: `ind${index + 1}`,
    title: insight.split(' ').slice(0, 3).join(' ') + '...',
    summary: insight,
    category: randomChoice(['Recommendation', 'Opportunity']),
    severity: randomChoice(['Medium', 'Low']),
    timestamp: new Date(Date.now() - randomInRange(1, 7) * 86400000).toISOString(),
    industry_specific: true
  }));
  
  // Combine insights
  const aiInsights = [...generalInsights, ...industryInsights.slice(0, 2)];
  
  // Generate funding readiness data
  const profileCompleteness = startupProfile ? 
    Object.entries(startupProfile).filter(([_, value]) => value !== null && value !== undefined).length / 
    Object.keys(startupProfile).length * 100 : 
    randomInRange(60, 95);
  
  const financialsScore = kpi_ltv_cac_ratio > 3 ? randomInRange(70, 90) : randomInRange(40, 65);
  const marketFitScore = revenueGrowthRate > 15 ? randomInRange(65, 90) : randomInRange(40, 65);
  
  const fundingReadinessScore = Math.round(
    (profileCompleteness * 0.3) + 
    (financialsScore * 0.4) + 
    (marketFitScore * 0.3)
  );
  
  // Investor interest based on metrics
  const interestMultiplier = (
    (kpi_ltv_cac_ratio > 3 ? 1.5 : 1) * 
    (revenueGrowthRate > 15 ? 1.3 : 1) * 
    (stage === 'Series A' ? 1.4 : stage === 'Seed' ? 1.2 : 1) *
    (fundingReadinessScore > 70 ? 1.3 : 1)
  );
  
  const profileViews = Math.round(randomInRange(50, 150) * interestMultiplier);
  const dataRoomRequests = Math.round(randomInRange(2, 10) * interestMultiplier);
  const connectionRequests = Math.round(randomInRange(1, 5) * interestMultiplier);
  const savedToWatchlist = Math.round(randomInRange(5, 15) * interestMultiplier);
  const meetingRequests = Math.round(randomInRange(0, 3) * interestMultiplier);
  
  // Create complete mock data object
  return {
    keyMetrics: {
      annualRevenue,
      annualExpenses,
      revenueGrowthRate,
      customerGrowthRate,
      numCustomers,
      numEmployees,
      kpi_cac,
      kpi_clv,
      kpi_retention_rate,
      kpi_conversion_rate,
      kpi_monthly_growth: revenueGrowthRate / 12,
      kpi_burn_rate,
      kpi_runway,
      kpi_ltv_cac_ratio,
      monthlyRevenue,
      monthlyExpenses,
      monthlyUsers
    },
    aiInsights,
    fundingReadiness: {
      score: fundingReadinessScore,
      profileCompleteness,
      financialsScore,
      marketFitScore,
      pitchDeckStatus: startupProfile?.pitch_deck_url ? 'Uploaded' : 'Missing',
      recommendations: [
        profileCompleteness < 90 ? 'Complete your startup profile to improve visibility' : 'Your profile is well-completed, consider adding team member details',
        kpi_ltv_cac_ratio < 3 ? 'Improve your LTV/CAC ratio to attract investor interest' : 'Your metrics show strong unit economics',
        financialsScore < 70 ? 'Add detailed financial projections for the next 2-3 years' : 'Your financial data is strong',
        !startupProfile?.pitch_deck_url ? 'Upload your pitch deck to improve your funding readiness score' : 'Your pitch deck is available to interested investors'
      ].filter(Boolean),
      investorTypeMatch: {
        angelInvestors: stage === 'Pre-seed' ? 85 : stage === 'Seed' ? 70 : 40,
        ventureCap: stage === 'Series A' ? 80 : stage === 'Seed' ? 65 : 30,
        strategicInvestors: industry === 'Healthcare' || industry === 'Fintech' ? 75 : 45,
        accelerators: stage === 'Pre-seed' || stage === 'Seed' ? 80 : 25
      }
    },
    investorInterest: {
      profileViews,
      dataRoomRequests,
      connectionRequests,
      savedToWatchlist,
      meetingRequests,
      averageTimeOnProfile: randomInRange(60, 300),
      topInvestors: [
        {
          name: 'Sarah Chen',
          company: 'Blue Capital Ventures',
          interest: interestMultiplier > 1.5 ? 'High' : 'Medium',
          lastViewed: new Date(Date.now() - 86400000 * randomInRange(1, 5)).toISOString()
        },
        {
          name: 'Mohammad Al-Farsi',
          company: 'MENA Tech Fund',
          interest: interestMultiplier > 1.7 ? 'High' : interestMultiplier > 1.3 ? 'Medium' : 'Low',
          lastViewed: new Date(Date.now() - 86400000 * randomInRange(3, 10)).toISOString()
        },
        {
          name: 'David Wong',
          company: 'Horizon Partners',
          interest: interestMultiplier > 1.2 ? 'Medium' : 'Low',
          lastViewed: new Date(Date.now() - 86400000 * randomInRange(1, 7)).toISOString()
        }
      ],
      lastInterestDate: new Date(Date.now() - 86400000 * randomInRange(1, 3)).toISOString(),
      interestTrend: interestMultiplier > 1.5 ? 'increasing' : interestMultiplier > 1 ? 'stable' : 'decreasing',
      interestTimeline: Array.from({ length: 10 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - ((9 - i) * 7));
        const weekStr = `Week ${i + 1}`;
        const baseViews = Math.round(profileViews / 10);
        const trend = interestMultiplier > 1.5 ? 'up' : interestMultiplier > 1 ? 'stable' : 'down';
        const multiplier = trend === 'up' ? (1 + i * 0.1) : 
                          trend === 'down' ? (1 - i * 0.05) : 
                          1;
        return {
          week: weekStr,
          views: Math.max(1, Math.round(baseViews * multiplier * (0.8 + Math.random() * 0.4)))
        };
      })
    }
  };
};

// Export a static mock data object for default usage
export const mockStartupData: MockStartupDashboardData = generateMockData(); 