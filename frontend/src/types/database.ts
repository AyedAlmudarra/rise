export interface StartupProfile {
  // Core Fields
  id: number; 
  user_id: string;
  created_at: string;
  updated_at: string;

  // Basic Info
  name: string;
  industry: string;
  sector: string | null;
  location_city: string;
  country_of_operation: string;

  // Company Details
  description: string | null;
  operational_stage: string | null;
  num_employees: number | null;
  num_customers: number | null;
  annual_revenue: number | null; // Representing numeric as number
  annual_expenses: number | null; // Representing numeric as number
  founding_date: string | null; // Representing date as string

  // Key Metrics
  kpi_cac: number | null; // Representing numeric as number
  kpi_clv: number | null; // Representing numeric as number
  kpi_retention_rate: number | null; // Representing numeric as number
  kpi_conversion_rate: number | null; // Representing numeric as number
  kpi_monthly_growth: number | null; // Representing numeric as number
  kpi_payback_period: number | null; // Representing numeric as number
  kpi_churn_rate: number | null; // Representing numeric as number
  kpi_nps: number | null; // Representing numeric as number
  kpi_tam_size: string | null; // Representing text as string
  kpi_avg_order_value: number | null; // Representing numeric as number
  kpi_market_share: number | null; // Representing numeric as number
  kpi_yoy_growth: number | null; // Representing numeric as number

  // Team Information
  team_size: number | null;
  has_co_founder: boolean | null;

  // Market Analysis
  market_growth_rate: string | null;
  market_key_trends: string | null;
  target_customer_profile: string | null;
  customer_pain_points: string | null;
  market_barriers: string | null;
  competitive_advantage: string | null;
  competitor1_name: string | null;
  competitor1_size: string | null;
  competitor1_threat: string | null;
  competitor1_differentiator: string | null;
  competitor2_name: string | null;
  competitor2_size: string | null;
  competitor2_threat: string | null;
  competitor2_differentiator: string | null;
  competitor3_name: string | null;
  competitor3_size: string | null;
  competitor3_threat: string | null;
  competitor3_differentiator: string | null;

  // Documents & Links
  website: string | null;
  linkedin_profile: string | null;
  twitter_profile: string | null;
  logo_url: string | null;
  pitch_deck_url: string | null;

  // ADDED: Founder Background Fields (using snake_case)
  founder_name: string | null;
  founder_title: string | null;
  founder_education: string | null;
  previous_startup_experience: string | null;
  founder_bio: string | null;
  tech_skills: Record<string, boolean> | null; // Representing jsonb as object

  // Funding Status
  current_funding: string | null;
  seeking_investment: boolean | null;
  target_raise_amount: number | null; // Representing numeric as number

  // AI/Platform Generated Fields (Optional)
  // ai_insights?: string | null;
  // funding_readiness_score?: number | null;

  // --- NEW AI Analysis Fields ---
  ai_analysis: Record<string, any> | null; // Use Record<string, any> for flexible JSONB
  analysis_status: string | null;          // e.g., 'pending', 'processing', 'completed', 'failed'
  analysis_timestamp: string | null;       // ISO 8601 timestamp string
}

// Updated InvestorProfile interface to match the new SQL schema
export interface InvestorProfile {
  // Core Fields
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string; // Added required field

  // Profile Fields
  job_title: string | null;
  company_name: string | null;
  company_description: string | null;
  website: string | null;
  linkedin_profile: string | null;
  preferred_industries: string[] | null; // Match SQL (text[] null)
  preferred_geography: string[] | null;  // Match SQL (text[] null)
  preferred_stage: string[] | null;      // Match SQL (text[] null)
}

// --- AI Insights Type ---
// Matches the structure fetched/mocked in AIInsightsSection.tsx
export interface AIInsight { 
    id: string; // uuid
    startup_id: number; // fk to startups.id
    created_at: string; // timestampz
    title: string;
    summary: string;
    category: 'Recommendation' | 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
    severity?: 'High' | 'Medium' | 'Low';
}

// --- Interested Investor Type --- 
// Matches the structure fetched/mocked in InvestorInterestSection.tsx
// Represents combined Investor profile + interaction summary for a specific startup
export interface InterestedInvestor {
    // Investor Profile Fields
    id: number; // investor.id
    name: string | null;
    company: string | null;
    title: string | null;
    avatar_url: string | null; 
    // Interaction Summary Fields
    last_activity_at: string | null; 
    view_count: number; 
    interest_level: 'High' | 'Medium' | 'Low'; 
    has_viewed_deck: boolean;
    has_viewed_financials: boolean;
    profile_url?: string; 
} 