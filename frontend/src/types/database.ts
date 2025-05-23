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
  country_of_operation: string | null;
  founding_date: string | null;

  // Company Details
  description: string | null;
  operational_stage: string | null;
  num_employees: number | null;
  num_customers: number | null;
  annual_revenue: number | null;
  annual_expenses: number | null;
  website: string | null;
  linkedin_profile: string | null;
  twitter_profile: string | null;
  logo_url: string | null;
  pitch_deck_url: string | null;

  // Key Metrics
  kpi_cac: number | null;
  kpi_clv: number | null;
  kpi_retention_rate: number | null;
  kpi_conversion_rate: number | null;
  kpi_monthly_growth: number | null;
  kpi_payback_period: number | null;
  kpi_churn_rate: number | null;
  kpi_nps: number | null;
  kpi_tam_size: string | null;
  kpi_avg_order_value: number | null;
  kpi_market_share: number | null;
  kpi_yoy_growth: number | null;

  // Team Information
  team_size: number | null;
  has_co_founder: boolean | null;
  founder_name: string | null;
  founder_title: string | null;
  founder_education: string | null;
  previous_startup_experience: string | null;
  founder_bio: string | null;

  // Market Analysis
  market_growth_rate: string | null;
  market_key_trends: string | null;
  target_customer_profile: string | null;
  customer_pain_points: string | null;
  market_barriers: string | null;
  competitive_advantage: string | null;

  // Competition
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

  // Funding Status
  current_funding: string | null;
  seeking_investment: boolean | null;
  target_raise_amount: number | null;

  // AI/Platform Generated Fields
  ai_analysis: AIAnalysisData | null;
  analysis_status: AnalysisStatus | null;
  analysis_timestamp: string | null;

  // New fields from the code block
  competitive_advantage_evaluation: CompetitiveAdvantageEvaluation;
  strategic_recommendations: string[];
  suggested_kpis: string[];
  current_challenges?: string[];
  what_if_scenarios?: WhatIfScenario[];
  key_risks?: string[];
}

// Updated InvestorProfile interface to match the new SQL schema
export interface InvestorProfile {
  // Core Fields (Matching SQL)
  id: number;                       // bigint -> number
  user_id: string;                  // uuid -> string (FK to auth.users)
  created_at: string;               // timestamp with time zone -> string (ISO 8601)
  updated_at: string;               // timestamp with time zone -> string (ISO 8601)

  // Profile Fields (Matching SQL)
  full_name: string;                // text -> string (Not Null in SQL)
  job_title: string | null;         // text -> string | null
  company_name: string | null;      // text -> string | null
  investor_type: 'Personal' | 'Angel' | 'VC' | null; // text CHECK constraint -> specific string literal union | null
  website: string | null;           // text -> string | null (URL validation in SQL)
  linkedin_profile: string | null;  // text -> string | null (URL validation in SQL)
  company_description: string | null; // text -> string | null

  // Preferences (Matching SQL)
  preferred_industries: string[] | null; // text[] -> string[] | null
  preferred_geography: string[] | null;  // text[] -> string[] | null
  preferred_stage: string[] | null;      // text[] -> string[] | null
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

// +++ ADDED: Minimal types for Messages feature +++
export interface Conversation {
  id: number; 
  participant1_user_id: string; 
  participant2_user_id: string; 
  created_at: string; 
  last_message_at: string | null; 
}

export interface Message {
  id: number; 
  conversation_id: number; 
  sender_user_id: string; 
  content: string; 
  created_at: string; 
  read_at: string | null; 
}
// +++ END ADDED +++

// --- Connection & Notification System Structures (Frontend Types) ---

// Structure for `connection_requests` table (Assumed based on usage)
export interface ConnectionRequest {
  id: number;                  // Database primary key (e.g., bigint)
  created_at: string;          // timestamp with time zone
  requester_user_id: string;   // uuid, FK to auth.users.id
  recipient_user_id: string;   // uuid, FK to auth.users.id
  requester_role: 'startup' | 'investor'; // Role of the user sending the request
  recipient_role: 'startup' | 'investor'; // Role of the user receiving the request
  status: 'pending' | 'accepted' | 'declined'; // Status of the request
  request_message?: string | null; // Optional message added in profile pages
}

// Interface matching the refined `notifications` table schema (v1.4)
export interface AppNotification {
  id: string;                   // Database primary key (e.g., uuid)
  created_at: string;           // timestamp with time zone
  user_id: string;              // uuid, FK to auth.users.id (The user who receives the notification)
  type: 'connection_request' | 'message' | 'system' | 'ai_insight' | string; // Type of notification
  title: string;                // Short title/summary
  body: string;                 // Detailed message content (maps to subtitle in frontend)
  link: string | null;          // Optional deep link into the app
  is_read: boolean;             // Whether the user has marked it as read
  reference_id?: string | null; // Optional reference to related entity (e.g., request ID, message ID)
  // Optional frontend styling fields (populated by backend logic)
  icon?: string | null;         // Iconify icon name (e.g., 'solar:user-plus-line-duotone')
  icon_bg_color?: string | null;// Tailwind CSS class (e.g., 'bg-blue-100')
  icon_color?: string | null;   // Tailwind CSS class (e.g., 'text-blue-500')
}

// TODO: Define structure for `investor_outreach` table if manual logging is kept
export interface InvestorOutreachLog {
  id: number;
  created_at: string;
  startup_user_id: string;       // uuid, FK to auth.users.id
  investor_id: number;           // bigint, FK to investors.id
  // Optional: Store investor name/company redundantly or join?
  // investor_name?: string;
  // investor_company?: string;
  contact_method: 'Email' | 'Call' | 'LinkedIn' | 'Meeting' | 'Other';
  contact_date: string;          // date or timestampz
  status: string;                // Free text or predefined ('Contacted', 'Responded', etc.)
  notes: string | null;
}

// TODO: Define structure for `startup_engagement` table (investor equivalent)
export interface StartupEngagementLog {
   id: number;
   created_at: string;
   investor_user_id: string;      // uuid, FK to auth.users.id
   startup_id: number;            // bigint, FK to startups.id
   // Optional: Store startup name redundantly or join?
   // startup_name?: string;
   contact_method: 'Email' | 'Call' | 'LinkedIn' | 'Meeting' | 'Platform Message' | 'Other';
   contact_date: string;          // date or timestampz
   status: string;                // Free text or predefined ('Reviewed', 'Contacted', 'Meeting', 'Watching', 'Passed', etc.)
   notes: string | null;
} 