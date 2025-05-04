/**
 * Represents the structure of a startup record fetched from the database.
 * Ensure this matches the 'startups' table schema and includes all fields
 * needed for the analysis prompt.
 */
export interface StartupRecord {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    industry: string | null;
    sector: string | null;
    location_city: string | null;
    country_of_operation: string | null;
    operational_stage: string | null;
    founding_date: string | null;
    num_employees: number | null;
    num_customers: number | null;
    annual_revenue: number | null;
    annual_expenses: number | null;
    team_size: number | null; // Consider if this duplicates num_employees
    has_co_founder: boolean | null;
    website: string | null;
    pitch_deck_url: string | null;
    kpi_cac: number | null;
    kpi_clv: number | null;
    kpi_retention_rate: number | null;
    kpi_monthly_growth: number | null;
    kpi_conversion_rate: number | null;
    kpi_payback_period: number | null;
    kpi_churn_rate: number | null;
    kpi_nps: number | null;
    kpi_tam_size: string | null;
    kpi_avg_order_value: number | null;
    kpi_market_share: number | null;
    kpi_yoy_growth: number | null;
    founder_name: string | null;
    founder_title: string | null;
    founder_education: string | null;
    previous_startup_experience: string | null;
    founder_bio: string | null;
    tech_skills: Record<string, boolean> | null;
    market_growth_rate: string | null;
    market_key_trends: string | null;
    target_customer_profile: string | null;
    customer_pain_points: string | null;
    market_barriers: string | null;
    competitive_advantage: string | null;
    competitor1_name: string | null;
    competitor1_differentiator: string | null;
    competitor2_name?: string | null;
    competitor2_differentiator?: string | null;
    competitor3_name?: string | null;
    competitor3_differentiator?: string | null;
    current_funding: string | null;
    seeking_investment: boolean | null;
    target_raise_amount: number | null;
    // Add Supabase-managed fields if needed for logic, though typically not for the prompt
    // created_at?: string;
    // analysis_status?: 'pending' | 'processing' | 'completed' | 'error' | null;
    // analysis_timestamp?: string | null;
    // ai_analysis?: AIAnalysisData | null;
}

/**
 * Defines the structured JSON output expected from the AI analysis.
 * This structure must be consistently produced by the fine-tuned model
 * and was defined by the prompt used during training.
 */
export interface AIAnalysisData {
  executive_summary?: string;
  swot_analysis?: { // Renamed from 'swot' for clarity
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };
  market_positioning?: string;
  scalability_assessment?: {
    level?: 'Low' | 'Medium' | 'High' | 'N/A'; // Use specific values
    justification?: string;
  };
  competitive_advantage_evaluation?: {
    assessment?: string;
    suggestion?: string;
  };
  current_challenges?: string[];
  key_risks?: string[];
  strategic_recommendations?: string[];
  suggested_kpis?: {
      kpi: string;
      justification: string;
  }[];
  what_if_scenarios?: {
      scenario: string;
      outcome: string;
  }[];
  growth_plan_phases?: {
      period: string; // e.g., "Months 1-3"
      focus: string;
      description: string;
  }[]; // Expecting 4 phases
  funding_outlook?: string;
  financial_assessment?: {
      strengths?: string[];
      weaknesses?: string[];
      recommendations?: string[];
  };
  cash_burn_rate?: {
      monthly_rate?: number | null; // Ensure number or null
      runway_months?: number | null; // Ensure number or null
      assessment?: string;
  };
  profitability_projection?: {
      estimated_timeframe?: string; // e.g., "6-12 months", "12+ months", "Unclear"
      key_factors?: string[];
  };
  funding_readiness_score?: number | null; // Ensure number (1-100) or null
  funding_readiness_justification?: string;
  // Include an error field for storing errors during generation or update
  error?: string;
} 