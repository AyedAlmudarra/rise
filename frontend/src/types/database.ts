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

  // Add any other fields expected in the 'startups' table
  // updated_at?: string; // Supabase might add this automatically
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