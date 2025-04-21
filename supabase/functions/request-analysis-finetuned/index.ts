// supabase/functions/request-analysis-finetuned/index.ts
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Request Analysis Function (Fine-Tuned)!")

// @ts-ignore Deno standard library
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore Google AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Shared utilities and types
import { corsHeaders } from '../_shared/cors.ts'; // Adjusted path for shared cors
import type { StartupRecord, AIAnalysisData } from '../_shared/types.ts'; // Adjusted path for shared types

// --- Environment Variables --- (Fetch once at top level)
// @ts-ignore Deno type checking issue
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
// @ts-ignore Deno type checking issue
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
// @ts-ignore Deno type checking issue
const GOOGLE_API_KEY_ENV = Deno.env.get("GOOGLE_API_KEY");

// --- Fine-Tuned Model Configuration --- !
// IMPORTANT: Replace this placeholder with your actual fine-tuned model ID from Vertex AI
const FINE_TUNED_MODEL_ID = "YOUR_FINE_TUNED_MODEL_ID_FROM_VERTEX_AI"; // e.g., "projects/your-project-id/locations/us-central1/endpoints/1234567890"
// OR potentially a tuned model name: "projects/your-project-id/locations/us-central1/publishers/google/models/your-tuned-model-name-123"

if (FINE_TUNED_MODEL_ID === "YOUR_FINE_TUNED_MODEL_ID_FROM_VERTEX_AI") {
  console.warn("WARNING: Fine-tuned model ID is not set. Using placeholder.");
}

// --- Helper function to build the analysis prompt --- (Keep consistent with training)
function buildAnalysisPrompt(startupData: StartupRecord): string {
  // This prompt MUST match the structure used in the `text_input` field
  // during the fine-tuning data generation (generate_training_data.ts).
  const prompt = `
You are an experienced Venture Capital analyst specializing in the Saudi Arabian market, evaluating early-stage startups for seed investment. Your analysis should be critical, insightful, and grounded *only* in the provided data, considering the KSA market context where applicable.

Analyze the provided startup profile thoroughly. Generate a structured JSON object containing the following detailed analysis components. Ensure the entire output is a single, valid JSON object with no surrounding text or markdown formatting. If data for a specific field or section is missing or insufficient ('N/A'), state that clearly within the relevant field or omit the field/section if assessment is impossible.

**JSON Structure Required:**
{
  "executive_summary": "(String: ...)", 
  "swot_analysis": { ... },
  "market_positioning": "(String: ...)",
  "scalability_assessment": { ... },
  "competitive_advantage_evaluation": { ... },
  "current_challenges": "(String Array: ...)",
  "key_risks": "(String Array: ...)",
  "strategic_recommendations": "(String Array: ...)",
  "suggested_kpis": [ { ... } ],
  "what_if_scenarios": [ { ... } ],
  "growth_plan_phases": [ { ... } ],
  "funding_outlook": "(String: ...)",
  "financial_assessment": { ... },
  "cash_burn_rate": { ... },
  "profitability_projection": { ... },
  "funding_readiness_score": "(Number: ...)",
  "funding_readiness_justification": "(String: ...)"
}

--- STARTUP PROFILE DATA ---
Name: ${startupData.name ?? 'N/A'}
Industry: ${startupData.industry ?? 'N/A'}
Sector: ${startupData.sector ?? 'N/A'}
Location: ${startupData.location_city ?? 'N/A'}, ${startupData.country_of_operation ?? 'N/A'}
Description: ${startupData.description ?? 'N/A'}
Operational Stage: ${startupData.operational_stage ?? 'N/A'}
Founding Date: ${startupData.founding_date ?? 'N/A'}
Team Size: ${startupData.team_size ?? 'N/A'} (Number of Employees: ${startupData.num_employees ?? 'N/A'})
Number of Customers: ${startupData.num_customers ?? 'N/A'}
Annual Revenue (Est.): ${startupData.annual_revenue ?? 'N/A'}
Annual Expenses (Est.): ${startupData.annual_expenses ?? 'N/A'}
Has Co-Founder: ${startupData.has_co_founder ? 'Yes' : 'No'}
Website: ${startupData.website ?? 'N/A'}
Pitch Deck Uploaded: ${startupData.pitch_deck_url ? 'Yes' : 'No'}

Founder Name: ${startupData.founder_name ?? 'N/A'}
Founder Title: ${startupData.founder_title ?? 'N/A'}
Founder Education: ${startupData.founder_education ?? 'N/A'}
Previous Startup Experience: ${startupData.previous_startup_experience ?? 'N/A'}
Founder Bio: ${startupData.founder_bio ?? 'N/A'}
Founder Tech Skills: ${JSON.stringify(startupData.tech_skills) ?? 'N/A'}

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
- Market Growth Rate: ${startupData.market_growth_rate ?? 'N/A'}
- Key Trends Mentioned: ${startupData.market_key_trends ?? 'N/A'}
- Target Customer Profile: ${startupData.target_customer_profile ?? 'N/A'}
- Customer Pain Points Addressed: ${startupData.customer_pain_points ?? 'N/A'}
- Market Barriers Mentioned: ${startupData.market_barriers ?? 'N/A'}
- Competitive Advantage Claimed: ${startupData.competitive_advantage ?? 'N/A'}

Competitor Info Provided:
- Competitor 1: ${startupData.competitor1_name ?? 'N/A'} (${startupData.competitor1_differentiator ?? 'N/A'})
- Competitor 2: ${startupData.competitor2_name ?? 'N/A'} (${startupData.competitor2_differentiator ?? 'N/A'})
- Competitor 3: ${startupData.competitor3_name ?? 'N/A'} (${startupData.competitor3_differentiator ?? 'N/A'})

Funding Status:
- Current Funding Level: ${startupData.current_funding ?? 'N/A'}
- Seeking Investment: ${startupData.seeking_investment ? 'Yes' : 'No'}
- Target Raise Amount: ${startupData.target_raise_amount ?? 'N/A'}
--- END STARTUP PROFILE DATA ---

Now, provide ONLY the valid JSON analysis object for the startup profile data above, adhering strictly to the specified JSON structure and instructions.
`;
  return prompt;
}

// --- Declare clients outside try block for broader scope ---
let supabaseAdminClient: any; // Use 'any' or import SupabaseClient type if available
let genAI: GoogleGenerativeAI;
let model: any; // Use 'any' or import GenerativeModel type

// --- Main Function --- (Adapted for Fine-Tuned Model)
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let startupRecord: StartupRecord | null = null;
  let startupIdForUpdate: string | null = null;
  const functionName = "request-analysis-finetuned"; // For logging

  try {
    // --- Initialize Clients (If not already initialized) ---
    if (!supabaseAdminClient) {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            console.error(`[${functionName}] Missing Supabase URL or Service Role Key env vars.`);
            return new Response(JSON.stringify({ error: "Server configuration error." }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        supabaseAdminClient = createClient(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
            { auth: { autoRefreshToken: false, persistSession: false } } // Use service key options
        );
        console.log(`[${functionName}] Supabase client initialized.`);
    }

    if (!genAI) {
        if (!GOOGLE_API_KEY_ENV) {
            console.error(`[${functionName}] Missing GOOGLE_API_KEY environment variable.`);
            return new Response(JSON.stringify({ error: "AI configuration error." }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        genAI = new GoogleGenerativeAI(GOOGLE_API_KEY_ENV);
        console.log(`[${functionName}] Google AI client initialized.`);

        // --- Use the Fine-Tuned Model ID --- !
        console.log(`[${functionName}] Initializing fine-tuned model: ${FINE_TUNED_MODEL_ID}`);
        model = genAI.getGenerativeModel({
            model: FINE_TUNED_MODEL_ID, // Use the specified fine-tuned model ID
            // Consider generationConfig if needed (e.g., temperature), but responseMimeType
            // might be less critical if the fine-tuning enforces JSON output well.
            // generationConfig: {
            //     responseMimeType: "application/json",
            // },
        });
        console.log(`[${functionName}] Fine-tuned model object created.`);
    }
    // --- End Client Initialization ---

    const { startup_id } = await req.json();
    if (!startup_id) {
      console.error(`[${functionName}] Missing startup_id in request body.`);
      throw new Error('Missing startup_id in request body');
    }
    startupIdForUpdate = startup_id;
    console.log(`[${functionName}] Request received for startup_id: ${startup_id}`);

    // --- 1. Fetch Startup Data ---
    console.log(`[${functionName}] Fetching startup data...`);
    const { data: fetchedData, error: fetchError } = await supabaseAdminClient
      .from('startups')
      .select('*') // Select all columns needed for the prompt
      .eq('id', startup_id)
      .single();

    if (fetchError) {
      console.error(`[${functionName}] Error fetching startup data:`, fetchError);
      throw new Error(`Failed to fetch startup data: ${fetchError.message}`);
    }
    if (!fetchedData) {
      throw new Error(`Startup with ID ${startup_id} not found.`);
    }
    startupRecord = fetchedData as StartupRecord;
    console.log(`[${functionName}] Startup data fetched successfully for: ${startupRecord.name}`);

    // --- 2. Update Status to 'processing' --- (Tagging which function ran)
    console.log(`[${functionName}] Updating analysis status to processing...`);
    const { error: updateStatusError } = await supabaseAdminClient
      .from('startups')
      .update({
          analysis_status: 'processing',
          analysis_timestamp: new Date().toISOString(),
          // Optional: Add a field to track which function ran last, e.g.,
          // last_analysis_source: functionName
      })
      .eq('id', startup_id);

    if (updateStatusError) {
      // Log error but proceed with analysis if possible
      console.error(`[${functionName}] Error updating status to processing:`, updateStatusError);
    }

    // --- 3. Build Prompt & Call Fine-Tuned AI Model ---
    console.log(`[${functionName}] Building analysis prompt...`);
    const analysisPrompt = buildAnalysisPrompt(startupRecord);

    console.log(`[${functionName}] Sending request to Google AI (Fine-Tuned Model)...`);
    const result = await model.generateContent(analysisPrompt);
    const response = result.response;
    const analysisJsonText = response.text();
    console.log(`[${functionName}] Received response from Google AI (Fine-Tuned Model).`);

    // --- 4. Parse AI Response --- (With detailed logging)
    let analysisResult: AIAnalysisData;
    try {
        console.log(`[${functionName}] Attempting to parse AI Response Text:\n---\n`, analysisJsonText, "\n---");
        // Trim whitespace before parsing as good practice
        analysisResult = JSON.parse(analysisJsonText.trim());
        console.log(`[${functionName}] Successfully parsed AI JSON response.`);
    } catch (parseError) {
        console.error(`[${functionName}] Failed to parse JSON response from AI:`, parseError);
        console.error(`[${functionName}] Raw AI Response Text (that failed parsing):`, analysisJsonText);
        // Store the raw text or error in the analysis field for debugging
        throw new Error("AI returned invalid JSON format."); // Trigger generic error handling below
    }

    // --- 5. Store Results & Update Status (Completed) ---
    console.log(`[${functionName}] Storing analysis results and updating status to completed...`);
    const { error: finalUpdateError } = await supabaseAdminClient
      .from('startups')
      .update({
        ai_analysis: analysisResult,
        analysis_status: 'completed',
        analysis_timestamp: new Date().toISOString(),
        // Optional: last_analysis_source: functionName
      })
      .eq('id', startup_id);

    if (finalUpdateError) {
      console.error(`[${functionName}] Error storing final analysis results:`, finalUpdateError);
      // Consider how to handle this - the analysis is done but not saved.
      // Maybe return a specific error message while logging internally.
    }

    console.log(`[${functionName}] Analysis completed successfully for startup: ${startup_id}`);
    // Return the analysis result along with the success message
    return new Response(JSON.stringify({ message: 'Analysis completed successfully', analysis: analysisResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(`[${functionName}] Error:`, error.message);
    console.error(`[${functionName}] Full Error Object:`, error); // Log the full error object for more details

    // --- Update Status to 'error' if possible --- (Include error message)
    if (startupIdForUpdate && supabaseAdminClient) {
      console.log(`[${functionName}] Attempting to update status to 'error' for startup: ${startupIdForUpdate}`);
      try {
        await supabaseAdminClient
          .from('startups')
          .update({
            analysis_status: 'error',
            analysis_timestamp: new Date().toISOString(),
            ai_analysis: { error: `[${functionName}] ${error.message}` } // Store specific error message
            // Optional: last_analysis_source: functionName
          })
          .eq('id', startupIdForUpdate);
          console.log(`[${functionName}] Status updated to 'error' in DB.`);
      } catch (statusUpdateError) {
        console.error(`[${functionName}] Failed to update status to 'error' after main error:`, statusUpdateError);
      }
    } else {
        console.warn(`[${functionName}] Cannot update status to error: Supabase client not initialized or startup ID missing.`);
    }

    // Return a generic error response to the client
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 