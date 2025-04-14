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

  // AI/Platform Generated Fields
  ai_analysis: AIAnalysisData | null;        // Defined below
  analysis_status: AnalysisStatus | null;    // Defined below
  analysis_timestamp: string | null;       // ISO 8601 timestamp string

  // New fields from the code block
  competitive_advantage_evaluation: CompetitiveAdvantageEvaluation;
  strategic_recommendations: string[];
  suggested_kpis: string[];
  current_challenges?: string[];            // Added: Key challenges identified
  what_if_scenarios?: WhatIfScenario[];   // Added: Hypothetical scenarios
  key_risks?: string[];                    // Added: Specific risks identified
  // Keep potentially missing older fields for backward compatibility if needed
  // key_strengths?: string[]; // Example: Redundant if covered by SWOT
  // market_positioning_summary?: string; // Example: Redundant if covered elsewhere
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

// --- AI Analysis Structure Definitions ---

// Enum for Analysis Status
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed' | null;

// Structure for SWOT Analysis
export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// Structure for Growth Plan Phase (New)
export interface GrowthPlanPhase {
  period: string; // e.g., "Month 1-3"
  focus: string; // e.g., "MVP Development & User Testing"
  description: string; // Brief description of activities
}

// Structure for Scalability Assessment
export interface ScalabilityAssessment {
  level: 'Low' | 'Medium' | 'High';
  justification: string;
}

// Structure for Competitive Advantage Evaluation
export interface CompetitiveAdvantageEvaluation {
  assessment: string;
  suggestion: string;
}

// Structure for What If Scenario
export interface WhatIfScenario {
  scenario: string;
  outcome: string;
}

// Structure for Suggested KPI Item (New)
export interface SuggestedKpiItem {
  kpi: string;
  justification: string;
}

// Main AI Analysis Data structure (stored in startups.ai_analysis JSONB)
export interface AIAnalysisData {
  executive_summary?: string;
  swot_analysis?: SWOTAnalysis;
  growth_plan_phases?: GrowthPlanPhase[];
  scalability_assessment?: ScalabilityAssessment;
  competitive_advantage_evaluation?: CompetitiveAdvantageEvaluation;
  market_positioning?: string;             // Assessment of market fit/positioning
  current_challenges?: string[];
  strategic_recommendations?: string[];
  suggested_kpis?: SuggestedKpiItem[];     // Array of objects with justification
  key_risks?: string[];                    // Risk indicators identified by AI
  what_if_scenarios?: WhatIfScenario[];    // "Potential Scenarios" section
  funding_outlook?: string;                // Commentary on funding readiness/needs
  
  // New fields for Financial Performance section
  financial_assessment?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  cash_burn_rate?: {
    monthly_rate: number;
    runway_months: number;
    assessment: string;
  };
  profitability_projection?: {
    estimated_timeframe: string;
    key_factors: string[];
  };
  
  // Allow for other potential fields
  [key: string]: any;
}

// --- Other Interface Definitions ---

// AI Insight Type (Potentially for a separate insights table/view)
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

// Combined Startup Profile (Database + potentially calculated/joined fields)
// ... rest of the file ... 

// --- Calendar Event Structure --- 

export interface CalendarEvent {
  id: string;                   // uuid, Primary Key
  created_at: string;           // timestamp with time zone
  user_id: string;              // uuid, Foreign Key to auth.users.id
  title: string;                // text, Not null
  start_time: string | null;    // timestamp with time zone, Not null (will be Date or null in component state)
  end_time: string | null;      // timestamp with time zone, Not null (will be Date or null in component state)
  all_day: boolean;             // boolean, Default false
  color: string | null;         // text, e.g., 'primary', 'green'
} 