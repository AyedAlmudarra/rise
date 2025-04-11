export interface StartupProfile {
  // From Supabase (auto-generated)
  id: number; // Assuming integer primary key
  user_id: string; // Foreign key to auth.users.id (UUID)
  created_at: string; // ISO 8601 timestamp string

  // From AuthRegisterStartup form
  name: string;
  description: string;
  industry: string;
  sector: string | null; // Optional field
  operational_stage: string;
  location_city: string;
  num_customers: number | null; // Stored as number, but can be null
  num_employees: number | null;
  annual_revenue: number | null;
  annual_expenses: number | null;
  kpi_cac: number | null; // Customer Acquisition Cost
  kpi_clv: number | null; // Customer Lifetime Value
  kpi_retention_rate: number | null; // Percentage (0-100 or 0-1)
  kpi_conversion_rate: number | null; // Percentage (0-100 or 0-1)
  logo_url: string | null; // URL to Supabase Storage
  pitch_deck_url: string | null; // URL to Supabase Storage
  website: string | null; // Added
  linkedin_profile: string | null; // Added

  // Add any other fields expected in the 'startups' table
  // updated_at?: string; // Supabase might add this automatically

  // Fields populated by AI backend functions
  ai_insights?: string | null; // Textual insights from OpenAI
  funding_readiness_score?: number | null; // Calculated score (0-100)
}

// You can add interfaces for other tables here as needed, e.g.:
export interface InvestorProfile {
  // From Supabase (auto-generated)
  id: number; // Assuming integer primary key
  user_id: string; // Foreign key to auth.users.id (UUID)
  created_at: string; // ISO 8601 timestamp string

  // From AuthRegisterInvestor form
  job_title: string | null;
  company_name: string | null;
  preferred_industries: string[]; // Array of strings
  preferred_geography: string[]; // Array of strings
  preferred_stage: string[]; // Array of strings
  website: string | null;
  linkedin_profile: string | null;
  company_description: string | null; // Added from form

  // Add any other fields expected in the 'investors' table
  // updated_at?: string;
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