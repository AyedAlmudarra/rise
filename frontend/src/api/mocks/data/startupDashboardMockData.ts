import { StartupProfile } from 'src/types/database'; // Assuming path is correct

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
  // Data for charts (e.g., monthly revenue/expenses)
  monthlyRevenue?: { month: string; value: number }[];
  monthlyExpenses?: { month: string; value: number }[];
}

export interface MockAIInsight {
  id: string;
  title: string;
  summary: string;
  category: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat' | 'Recommendation';
  severity?: 'Low' | 'Medium' | 'High'; // Optional severity for recommendations/threats
  timestamp: string; // ISO 8601
}

export interface MockFundingReadiness {
  score: number; // Overall score (e.g., 0-100)
  profileCompleteness: number; // Percentage
  financialsScore: number; // Score based on metrics
  pitchDeckStatus: 'Missing' | 'Uploaded' | 'Needs Improvement';
  recommendations: string[]; // Actionable tips to improve score
}

export interface MockInvestorInterest {
  profileViews: number;
  dataRoomRequests: number;
  connectionRequests: number;
  lastInterestDate: string | null; // ISO 8601
}

// --- Combined Mock Data Structure ---

export interface MockStartupDashboardData {
  keyMetrics: MockKeyMetrics;
  aiInsights: MockAIInsight[];
  fundingReadiness: MockFundingReadiness;
  investorInterest: MockInvestorInterest;
}


// --- Sample Mock Data ---

const generateMonthlyData = (startValue: number, months: number, trend: 'up' | 'down' | 'stable'): { month: string; value: number }[] => {
    const data = [];
    let currentValue = startValue;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();

    for (let i = 0; i < months; i++) {
        const monthIndex = (currentMonthIndex - months + 1 + i + 12) % 12;
        const month = monthNames[monthIndex];
        let multiplier = 1;
        if (trend === 'up') {
            multiplier = 1 + (Math.random() * 0.1 + 0.05); // 5-15% increase
        } else if (trend === 'down') {
             multiplier = 1 - (Math.random() * 0.05 + 0.02); // 2-7% decrease
        }
        currentValue = Math.max(0, Math.round(currentValue * multiplier));
         data.push({ month, value: currentValue });
    }
    return data;
}


export const mockStartupData: MockStartupDashboardData = {
  keyMetrics: {
    annualRevenue: 120000,
    annualExpenses: 85000,
    revenueGrowthRate: 15, // percentage
    customerGrowthRate: 25, // percentage
    numCustomers: 55,
    numEmployees: 8,
    kpi_cac: 150,
    kpi_clv: 800,
    kpi_retention_rate: 75,
    kpi_conversion_rate: 5,
    monthlyRevenue: generateMonthlyData(8000, 6, 'up'),
    monthlyExpenses: generateMonthlyData(6000, 6, 'stable'),
  },
  aiInsights: [
    {
      id: 'ai1',
      title: 'Strong Customer Retention',
      summary: 'Your customer retention rate of 75% is significantly above the industry average for SaaS startups.',
      category: 'Strength',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
    {
      id: 'ai2',
      title: 'High Customer Acquisition Cost (CAC)',
      summary: 'Your CAC ($150) is trending higher than optimal. Consider exploring more cost-effective marketing channels.',
      category: 'Weakness',
      severity: 'Medium',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
        id: 'ai3',
        title: 'Explore Partnership Opportunities',
        summary: 'AI analysis suggests potential synergies with companies in the complementary [Related Sector] sector.',
        category: 'Opportunity',
        timestamp: new Date().toISOString(), // Today
    },
     {
        id: 'ai4',
        title: 'Improve Pitch Deck Clarity',
        summary: 'AI analysis of your pitch deck suggests clarifying the market size and go-to-market strategy sections.',
        category: 'Recommendation',
        severity: 'High',
        timestamp: new Date().toISOString(), // Today
    }
  ],
  fundingReadiness: {
    score: 68,
    profileCompleteness: 85,
    financialsScore: 60,
    pitchDeckStatus: 'Uploaded',
    recommendations: [
      'Detail your 3-year financial projections.',
      'Add profiles for key team members.',
      'Refine target market analysis in pitch deck.',
    ],
  },
  investorInterest: {
    profileViews: 120,
    dataRoomRequests: 5,
    connectionRequests: 2,
    lastInterestDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
}; 