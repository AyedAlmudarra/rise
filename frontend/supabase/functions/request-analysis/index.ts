// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// Revert to original jsr import
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

console.log("Hello from Request Analysis Function!")

// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/core.ts';
// @ts-ignore
// import OpenAI from 'https://esm.sh/openai@4.33.0'; // REMOVE OpenAI import

// +++ Import OpenAI SDK +++
// @ts-ignore Make sure openai is added to import_map.json
import OpenAI from 'https://esm.sh/openai@4.33.0'; 

// +++ Get Environment Variables at Top Level +++
// @ts-ignore Deno type checking issue
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
// @ts-ignore Deno type checking issue
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
// +++ Add OpenAI API Key Env Var +++
// @ts-ignore Deno type checking issue
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY"); 

// --- Reuse relevant interfaces and constants ---
// const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'; // REMOVE OpenAI URL

// Ensure this interface matches the one in analyze-startup and includes all fields used in the prompt
interface StartupRecord {
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
    team_size: number | null;
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
    ai_analysis?: any; // Keep existing fields for updates
    analysis_status?: string;
    analysis_timestamp?: string;
}

interface AIAnalysisData {
  // Define the expected structure of your successful AI analysis JSON
  executive_summary?: string;
  swot?: {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };
  market_positioning?: string;
  scalability_assessment?: {
    level?: string; // e.g., 'High', 'Medium', 'Low'
    justification?: string;
  };
  competitive_advantage_evaluation?: {
    assessment?: string;
    suggestion?: string;
  };
  current_challenges?: string[];
  key_risks?: string[];
  strategic_recommendations?: string[];
  suggested_kpis?: string[];
  what_if_scenarios?: {
    scenario: string;
    outcome: string;
  }[];
  growth_plan_phases?: {
    period: string;
    focus: string;
    description: string;
  }[];
  funding_outlook?: string;
  financial_assessment?: {
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
  };
  cash_burn_rate?: {
    monthly_rate?: number | null;
    runway_months?: number | null;
    assessment?: string;
  };
  profitability_projection?: {
    estimated_timeframe?: string;
    key_factors?: string[];
  };
  funding_readiness_score?: number | null;
  funding_readiness_justification?: string;
  error?: string;
}

// --- Helper function to build the detailed analysis prompt --- 
function buildAnalysisPrompt(startupData: StartupRecord): string {
  // --- Reverted Prompt - Including Explicit JSON Structure --- 
  // Include the data fields specified by the user, but also the full JSON structure request.
  const prompt = `
You are an experienced Venture Capital analyst specializing in the Saudi Arabian market, evaluating early-stage startups for seed investment. Your analysis should be critical, insightful, and grounded *only* in the provided data, considering the KSA market context where applicable.

Analyze the provided startup profile thoroughly. Generate a structured JSON object containing the following detailed analysis components. Ensure the entire output is a single, valid JSON object with no surrounding text or markdown formatting. If data for a specific field or section is missing or insufficient ('N/A'), state that clearly within the relevant field or omit the field/section if assessment is impossible.

**JSON Structure Required:**
{
  "executive_summary": "(String: 3-5 concise sentences summarizing the core business, target market (KSA focus), key strengths/weaknesses, and overall investment potential based on the data provided.)",
  "swot_analysis": {
    "strengths": "(String Array: List 2-4 specific internal strengths based *only* on the profile data.)",
    "weaknesses": "(String Array: List 2-4 specific internal weaknesses or significant gaps based *only* on the profile data.)",
    "opportunities": "(String Array: List 2-3 specific, external market or strategic opportunities relevant to the KSA market, inferred from the data.)",
    "threats": "(String Array: List 2-3 specific, external threats or significant challenges relevant to KSA, inferred from the data.)"
  },
  "market_positioning": "(String: 2-4 sentences assessing current positioning in KSA market, target audience fit, and competitive standing based *only* on provided data. Include brief comment on differentiation.)",
  "scalability_assessment": {
    "level": "(String: Categorize potential as 'Low', 'Medium', or 'High' based on the data.)",
    "justification": "(String: 2-4 sentences explaining the scalability level reasoning, referencing factors like market size (if provided), business model, operational complexity, etc.)"
  },
  "competitive_advantage_evaluation": {
    "assessment": "(String: 2-4 sentences critically evaluating the uniqueness, defensibility, and sustainability of the competitive advantage claimed in the profile, considering the KSA context.)",
    "suggestion": "(String: Offer one concrete, actionable suggestion for strengthening the competitive advantage based on the analysis.)"
  },
  "current_challenges": "(String Array: List 2-4 specific, pressing challenges the startup likely faces *now* or in the *next 6 months*, based on the analysis.)",
  "key_risks": "(String Array: List 3 specific, significant risks (e.g., Market, Financial, Operational, Team, Competitive) identified from the analysis.)",
  "strategic_recommendations": "(String Array: List 3 highly actionable, prioritized strategic recommendations for the *next 6 months* based *only* on the analysis.)",
  "suggested_kpis": [
    {
      "kpi": "(String: Name of a suggested KPI)",
      "justification": "(String: 1-2 sentences why this KPI is critical for *this* startup at its current stage.)"
    }
    // Include 2-3 suggested KPIs in the array
  ],
  "what_if_scenarios": [
      {
          "scenario": "(String: A plausible, impactful event relevant to the near-term future.)",
          "outcome": "(String: The likely positive or negative consequence of the scenario.)"
      }
      // Include 1-2 scenarios in the array
  ],
  "growth_plan_phases": [
      {
          "period": "(String: Time period, e.g., 'Months 1-3')",
          "focus": "(String: Primary strategic theme for the period)",
          "description": "(String: Brief key activities/goals for the period, 1-2 sentences)"
      }
      // Include 4 phases: Months 1-3, 4-6, 7-9, 10-12
  ],
  "funding_outlook": "(String: 2-3 sentences commentary on the startup's funding situation and outlook based on its profile, traction (if any), and stated needs. Comment on readiness or key milestones needed for the target raise.)",
  "financial_assessment": { // For FinancialPerformanceCard
      "strengths": "(String Array: List 1-2 positive financial aspects observed from the data.)",
      "weaknesses": "(String Array: List 1-2 financial concerns or red flags observed from the data.)",
      "recommendations": "(String Array: List 1-2 suggestions for improving financial position based on the data.)"
  },
  "cash_burn_rate": { // For FinancialPerformanceCard
      "monthly_rate": "(Number: Estimated monthly burn rate in the currency specified (USD/SAR), or state null if impossible to estimate.)",
      "runway_months": "(Number: Estimated remaining runway in months based on burn and funding status, or state null if impossible to estimate.)",
      "assessment": "(String: Brief evaluation of burn rate sustainability based on estimate and context.)"
  },
  "profitability_projection": { // For FinancialPerformanceCard
      "estimated_timeframe": "(String: Probable timeframe to reach profitability based on data, e.g., '6-12 months', '12+ months', 'Unclear')",
      "key_factors": "(String Array: List 2-3 factors that will most influence profitability timing.)"
  },
  "funding_readiness_score": "(Number: An overall score from 1 to 100 indicating the startup's readiness for its target funding round, considering its stage, traction, team, market fit, financials, and AI analysis. 1=Not Ready, 100=Very Ready. Provide null if assessment is impossible.)",
  "funding_readiness_justification": "(String: 2-4 concise sentences explaining the score, highlighting key supporting factors or areas needing improvement based on the overall analysis.)"
}


--- STARTUP PROFILE DATA ---
Name: ${startupData.name ?? 'N/A'}
Industry: ${startupData.industry ?? 'N/A'}
Sector: ${startupData.sector ?? 'N/A'}
Location: ${startupData.location_city ?? 'N/A'} 
Operational Stage: ${startupData.operational_stage ?? 'N/A'}
Founding Date: ${startupData.founding_date ?? 'N/A'}
Number of Employees: ${startupData.num_employees ?? 'N/A'}
Number of Customers: ${startupData.num_customers ?? 'N/A'}
Annual Revenue (Est.): ${startupData.annual_revenue ?? 'N/A'}
Annual Expenses (Est.): ${startupData.annual_expenses ?? 'N/A'}

Key Metrics Provided:
- CAC: ${startupData.kpi_cac ?? 'N/A'}
- CLV: ${startupData.kpi_clv ?? 'N/A'}
- Retention Rate: ${startupData.kpi_retention_rate ? startupData.kpi_retention_rate + '%' : 'N/A'}
- Conversion Rate: ${startupData.kpi_conversion_rate ? startupData.kpi_conversion_rate + '%' : 'N/A'}
- Monthly Growth Rate: ${startupData.kpi_monthly_growth ? startupData.kpi_monthly_growth + '%' : 'N/A'}
- Payback Period (Months): ${startupData.kpi_payback_period ?? 'N/A'}
- Churn Rate: ${startupData.kpi_churn_rate ? startupData.kpi_churn_rate + '%' : 'N/A'}
- NPS: ${startupData.kpi_nps ?? 'N/A'}
- TAM Size Estimate: ${startupData.kpi_tam_size ?? 'N/A'}
- Avg. Order Value: ${startupData.kpi_avg_order_value ?? 'N/A'}
- Market Share Estimate: ${startupData.kpi_market_share ? startupData.kpi_market_share + '%' : 'N/A'}
- YoY Growth: ${startupData.kpi_yoy_growth ? startupData.kpi_yoy_growth + '%' : 'N/A'}

Market Analysis Info:
- Target Customer Profile: ${startupData.target_customer_profile ?? 'N/A'}
- Customer Pain Points Addressed: ${startupData.customer_pain_points ?? 'N/A'}
- Competitive Advantage Claimed: ${startupData.competitive_advantage ?? 'N/A'}

Competitor Info Provided:
- Competitor 1: ${startupData.competitor1_name ?? 'N/A'} (${startupData.competitor1_differentiator ?? 'N/A'})

Funding Status:
- Current Funding Level: ${startupData.current_funding ?? 'N/A'}
- Seeking Investment: ${startupData.seeking_investment ? 'Yes' : 'No'}
--- END STARTUP PROFILE DATA ---

Now, provide ONLY the valid JSON analysis object for the startup profile data above, adhering strictly to the specified JSON structure and instructions.
`; // Reverted to detailed final instruction
  return prompt;
}

// --- Declare clients outside try block for broader scope ---
let supabaseAdminClient: any; // Use 'any' or import SupabaseClient type if available
let openaiClient: OpenAI;

// --- Main Function ---
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let startupRecord: StartupRecord | null = null;
  let startupIdForUpdate: string | null = null;

  try {
    // --- Initialize Supabase Client --- 
    if (!supabaseAdminClient) { // Initialize only once
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Missing Supabase URL or Service Role Key environment variables.");
            return new Response(JSON.stringify({ error: "Server configuration error." }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        supabaseAdminClient = createClient(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );
    }
    // --- Initialize OpenAI Client --- 
    if (!openaiClient) { // Initialize only once
        if (!OPENAI_API_KEY) {
            console.error("Missing OPENAI_API_KEY environment variable.");
            return new Response(JSON.stringify({ error: "AI configuration error." }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
    }
    // --- End Client Initialization ---

    const { startup_id } = await req.json();
    if (!startup_id) {
      throw new Error('Missing startup_id in request body');
    }
    startupIdForUpdate = startup_id;

    console.log(`Request received for startup_id: ${startup_id}`);

    // --- 1. Fetch Startup Data ---
    console.log('Fetching startup data...');
    // Define required fields based on the simplified prompt
    // const requiredFields = '
    //   id, user_id, name, industry, sector, location_city, operational_stage, founding_date, 
    //   num_employees, num_customers, annual_revenue, annual_expenses, 
    //   kpi_cac, kpi_clv, kpi_retention_rate, kpi_conversion_rate, kpi_monthly_growth, 
    //   kpi_payback_period, kpi_churn_rate, kpi_nps, kpi_tam_size, kpi_avg_order_value, 
    //   kpi_market_share, kpi_yoy_growth, 
    //   target_customer_profile, customer_pain_points, competitive_advantage, 
    //   competitor1_name, competitor1_differentiator, 
    //   current_funding, seeking_investment
    // '; // Removed problematic multiline definition
    // Corrected requiredFields definition to be a single-line string
    const correctedRequiredFields = 'id,user_id,name,industry,sector,location_city,operational_stage,founding_date,num_employees,num_customers,annual_revenue,annual_expenses,kpi_cac,kpi_clv,kpi_retention_rate,kpi_conversion_rate,kpi_monthly_growth,kpi_payback_period,kpi_churn_rate,kpi_nps,kpi_tam_size,kpi_avg_order_value,kpi_market_share,kpi_yoy_growth,target_customer_profile,customer_pain_points,competitive_advantage,competitor1_name,competitor1_differentiator,current_funding,seeking_investment';
    const { data: fetchedData, error: fetchError } = await supabaseAdminClient
      .from('startups')
      .select(correctedRequiredFields) // Select only necessary columns using corrected string
      .eq('id', startup_id)
      .single();

    if (fetchError) {
      console.error('Error fetching startup data:', fetchError);
      throw new Error(`Failed to fetch startup data: ${fetchError.message}`);
    }
    if (!fetchedData) {
      throw new Error(`Startup with ID ${startup_id} not found.`);
    }
    startupRecord = fetchedData as StartupRecord;
    console.log(`Startup data fetched successfully for: ${startupRecord.name}`);

    // --- 2. Update Status to 'processing' ---
    console.log('Updating analysis status to processing...');
    const { error: updateStatusError } = await supabaseAdminClient
      .from('startups')
      .update({ analysis_status: 'processing', analysis_timestamp: new Date().toISOString() })
      .eq('id', startup_id);

    if (updateStatusError) {
      // Log error but proceed with analysis if possible
      console.error('Error updating status to processing:', updateStatusError);
    }

    // --- 3. Build Prompt & Call AI Model (OpenAI) ---
    console.log('Building analysis prompt for OpenAI...');
    const userPromptContent = buildAnalysisPrompt(startupRecord);
    
    // Define the system prompt (can be simpler now, but keeping original instructions in user prompt)
    const systemPrompt = "You are an expert Venture Capital analyst specializing in the Saudi Arabian market."; // System prompt can be simpler

    console.log('Sending request to OpenAI Fine-Tuned Model...');
    const completion = await openaiClient.chat.completions.create({
        model: "ft:gpt-3.5-turbo-0125:rise:rise-v1:BSvw6pY0", // Use the NEW fine-tuned model ID
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPromptContent } // userPromptContent now contains the detailed structure request
        ],
        temperature: 0.3, // Adjust temperature if needed
        // response_format: { type: "json_object" }, // Less likely needed now prompt specifies JSON output explicitly
    });

    // --- Extract response from OpenAI --- 
    const analysisJsonText = completion.choices[0]?.message?.content;
    console.log('Received response from OpenAI.');

    if (!analysisJsonText) {
      console.error("OpenAI response content is missing or empty.");
      throw new Error("AI response was empty.");
    }
    
    // --- 4. Parse AI Response --- 
    let analysisResult: AIAnalysisData;
    try {
        console.log("Attempting to parse AI Response Text:\n---\n", analysisJsonText, "\n---");
        analysisResult = JSON.parse(analysisJsonText.trim());
        console.log('Successfully parsed AI JSON response.');
    } catch (parseError) {
        console.error("Failed to parse JSON response from AI:", parseError);
        console.error("Raw AI Response Text (that failed parsing):", analysisJsonText);
        throw new Error("AI returned invalid JSON format.");
    }

    // --- 5. Store Results & Update Status (Completed) ---
    console.log('Storing analysis results and updating status to completed...');
    const { error: finalUpdateError } = await supabaseAdminClient
      .from('startups')
      .update({
        ai_analysis: analysisResult,
        analysis_status: 'completed',
        analysis_timestamp: new Date().toISOString(),
      })
      .eq('id', startup_id);

    if (finalUpdateError) {
      console.error('Error storing final analysis results:', finalUpdateError);
      // Don't throw here, as the analysis might be done, but log it
    }

    console.log(`Analysis completed successfully for startup: ${startup_id}`);
    return new Response(JSON.stringify({ message: 'Analysis completed successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Analysis function error:', error.message);

    // --- Update Status to 'error' if possible ---
    if (startupIdForUpdate && supabaseAdminClient) {
      console.log(`Attempting to update status to 'error' for startup: ${startupIdForUpdate}`);
      try {
        await supabaseAdminClient
          .from('startups')
          .update({
            analysis_status: 'error',
            analysis_timestamp: new Date().toISOString(),
            ai_analysis: { error: error.message } 
          })
          .eq('id', startupIdForUpdate);
      } catch (statusUpdateError) {
        console.error("Failed to update status to 'error' after main error:", statusUpdateError);
      }
    } else {
        console.warn("Cannot update status to error: Supabase client not initialized or startup ID missing.");
    }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* 
NOTE: Ensure the 'openai' package is added to your supabase/functions/import_map.json: 
  "imports": {
    ...
    "openai": "https://esm.sh/openai@4.33.0",
    ...
  }

ALSO NOTE: Set the OPENAI_API_KEY environment variable in your Supabase project secrets.
*/
