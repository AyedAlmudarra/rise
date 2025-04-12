// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/core.ts'; // Corrected import path

// IMPORTANT: Replace with your actual OpenAI API endpoint if different
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface StartupRecord {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  sector: string | null;
  location_city: string | null;
  country_of_operation: string | null;
  operational_stage: string | null;
  founding_date: string | null; // Consider if date format needs handling
  num_employees: number | null;
  num_customers: number | null;
  annual_revenue: number | null;
  annual_expenses: number | null;
  team_size: number | null;
  has_co_founder: boolean | null;
  website: string | null;
  // Add relevant KPIs
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
  // Founder Background
  founder_name: string | null;
  founder_title: string | null;
  founder_education: string | null;
  previous_startup_experience: string | null;
  founder_bio: string | null;
  tech_skills: Record<string, boolean> | null;
  // Market Analysis
  market_growth_rate: string | null;
  market_key_trends: string | null;
  target_customer_profile: string | null;
  customer_pain_points: string | null;
  market_barriers: string | null;
  competitive_advantage: string | null;
  // Competitors (Example: just name)
  competitor1_name: string | null;
  competitor1_differentiator: string | null;
  // Funding
  current_funding: string | null;
  seeking_investment: boolean | null;
  target_raise_amount: number | null;
  // --- Ensure ALL relevant fields from database.ts StartupProfile are here ---
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: StartupRecord;
  schema: string;
  old_record: StartupRecord | null;
}

serve(async (req: Request) => {
  // Handle potential CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase Admin Client (uses service_role key)
    // Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Edge Function secrets
    const supabaseAdminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Get Startup Data from Webhook Payload
    const payload: WebhookPayload = await req.json();

    // Ensure it's an INSERT event for the 'startups' table
    if (payload.type !== 'INSERT' || payload.table !== 'startups') {
      console.log('Ignoring non-insert event or wrong table:', payload.type, payload.table);
      return new Response(JSON.stringify({ message: 'Ignoring event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const startupRecord = payload.record;
    const startupId = startupRecord.id;

    if (!startupId) {
      throw new Error('Startup ID missing from webhook payload');
    }

    console.log(`Processing startup ID: ${startupId}`);

    // 3. Update status to 'processing'
    await supabaseAdminClient
      .from('startups')
      .update({ analysis_status: 'processing', analysis_timestamp: new Date().toISOString() })
      .eq('id', startupId);

    // 4. Prepare Prompt for OpenAI
    const prompt = `
You are an experienced Venture Capital analyst evaluating early-stage startups for potential seed investment, specifically within the Saudi Arabian market context (consider Vision 2030 alignment where applicable).

Analyze the provided startup profile thoroughly. Based *only* on the information given, generate a structured JSON object containing the following detailed analysis components:

1.  **executive_summary**: A brief (2-3 sentences) paragraph summarizing the startup's core offering, target market, and overall potential from an investor's viewpoint.
2.  **swot_analysis**: A concise SWOT analysis:
    *   **strengths**: List 2-3 key strengths based on the profile.
    *   **weaknesses**: List 2-3 key weaknesses or areas needing development.
    *   **opportunities**: List 1-2 potential market or growth opportunities.
    *   **threats**: List 1-2 potential external threats or challenges.
3.  **funding_readiness**: An object assessing readiness for seed funding:
    *   **score**: An overall numerical score from 0 (Not Ready) to 10 (Highly Ready).
    *   **assessment**: A brief justification (1-2 sentences) for the score, highlighting key positive/negative factors.
4.  **scalability_assessment**: An object assessing potential scalability:
    *   **level**: Categorize potential as "Low", "Medium", or "High".
    *   **justification**: Briefly explain the reasoning based on market size, business model, or other provided data.
5.  **competitive_advantage_evaluation**: An object evaluating the competitive edge:
    *   **assessment**: Briefly evaluate the described competitive advantage. Is it unique? Defensible?
    *   **suggestion**: Offer one specific suggestion for strengthening or clarifying the competitive advantage.
6.  **strategic_recommendations**: A list of 2-3 actionable, strategic recommendations for the startup to focus on over the next 6 months to improve its business and investor appeal.
7.  **suggested_kpis**: A list of 2-3 specific, relevant Key Performance Indicators (KPIs) the startup should track closely at its current stage and industry, beyond any already listed.

**Output MUST be a valid JSON object adhering strictly to this structure. Do not include any explanatory text outside the JSON object.**

--- EXAMPLE START ---

**Input Profile (Example):**

Name: QuickBill SA
Industry: FinTech
Description: Mobile app for instant invoicing and payment collection for freelancers in Saudi Arabia.
Operational Stage: MVP Launched
Annual Revenue: 15000 SAR
Team Size: 3
Location: Riyadh, Saudi Arabia
Key Metrics: CAC: 50 SAR, CLV: 300 SAR
Founder Bio: Ex-banker with finance background.
Competitive Advantage: First-mover focused solely on Saudi freelancer market needs.
Funding Status: Bootstrapped (Seeking Investment: Yes)
Target Raise: 500,000 SAR

**Desired JSON Output (Example):**

\`\`\`json
{
  "executive_summary": "QuickBill SA is a promising FinTech targeting the underserved Saudi freelancer market with a mobile invoicing solution. While early-stage with low revenue, its focused niche and first-mover status present potential if scalability and customer acquisition can be proven.",
  "swot_analysis": {
    "strengths": ["First-mover advantage in Saudi freelancer niche", "Founder has relevant finance background", "Addresses a clear market need (invoicing/payments)"],
    "weaknesses": ["Very low current revenue", "Small team size", "Scalability beyond freelancers unclear"],
    "opportunities": ["Tap into growing Saudi gig economy", "Expand service offerings (e.g., expense tracking)", "Partnerships with freelance platforms"],
    "threats": ["Competition from larger invoicing platforms expanding locally", "Regulatory changes affecting freelancers", "Slow adoption rate"]
  },
  "funding_readiness": {
    "score": 4,
    "assessment": "Needs significant traction development. Low revenue and MVP stage indicate high risk, but clear market focus is a plus. Must demonstrate user growth and clearer financial projections."
  },
  "scalability_assessment": {
    "level": "Medium",
    "justification": "The Saudi freelancer market is growing, offering medium scalability. Long-term scalability depends on expanding the product offering or geographical reach beyond the initial niche."
  },
  "competitive_advantage_evaluation": {
    "assessment": "First-mover advantage is valuable but potentially short-lived. Needs clear differentiation beyond just being local.",
    "suggestion": "Focus on building specific features tailored to Saudi regulations or payment methods that larger players might overlook."
  },
  "strategic_recommendations": [
    "Focus intensely on user acquisition and demonstrating month-over-month growth in active users and transaction volume.",
    "Develop a clear roadmap outlining product expansion beyond basic invoicing to increase CLV.",
    "Gather detailed user feedback to validate product-market fit and identify key feature requests."
  ],
  "suggested_kpis": [
    "Monthly Active Users (MAU)",
    "Average Revenue Per User (ARPU)",
    "Payment Transaction Volume"
  ]
}
\`\`\`

--- EXAMPLE END ---

--- CURRENT STARTUP PROFILE START ---

**Input Profile (Actual):**

Name: ${startupRecord.name ?? 'N/A'}
Industry: ${startupRecord.industry ?? 'N/A'}
Sector: ${startupRecord.sector ?? 'N/A'}
Location: ${startupRecord.location_city ?? 'N/A'}, ${startupRecord.country_of_operation ?? 'N/A'}
Description: ${startupRecord.description ?? 'N/A'}
Operational Stage: ${startupRecord.operational_stage ?? 'N/A'}
Founding Date: ${startupRecord.founding_date ?? 'N/A'}
Team Size: ${startupRecord.team_size ?? 'N/A'}
Number of Employees: ${startupRecord.num_employees ?? 'N/A'}
Number of Customers: ${startupRecord.num_customers ?? 'N/A'}
Annual Revenue (SAR/USD Estimate): ${startupRecord.annual_revenue ?? 'N/A'}
Annual Expenses (SAR/USD Estimate): ${startupRecord.annual_expenses ?? 'N/A'}
Has Co-Founder: ${startupRecord.has_co_founder ? 'Yes' : 'No'}
Website: ${startupRecord.website ?? 'N/A'}

Founder Name: ${startupRecord.founder_name ?? 'N/A'}
Founder Title: ${startupRecord.founder_title ?? 'N/A'}
Founder Education: ${startupRecord.founder_education ?? 'N/A'}
Previous Startup Experience: ${startupRecord.previous_startup_experience ?? 'N/A'}
Founder Bio: ${startupRecord.founder_bio ?? 'N/A'}
Tech Skills Mentioned: ${JSON.stringify(startupRecord.tech_skills) ?? 'N/A'}

Key Metrics Provided:
  - CAC: ${startupRecord.kpi_cac ?? 'N/A'}
  - CLV: ${startupRecord.kpi_clv ?? 'N/A'}
  - Retention Rate: ${startupRecord.kpi_retention_rate ?? 'N/A'}%
  - Conversion Rate: ${startupRecord.kpi_conversion_rate ?? 'N/A'}%
  - Monthly Growth Rate: ${startupRecord.kpi_monthly_growth ?? 'N/A'}%
  - Payback Period (Months): ${startupRecord.kpi_payback_period ?? 'N/A'}
  - Churn Rate: ${startupRecord.kpi_churn_rate ?? 'N/A'}%
  - NPS: ${startupRecord.kpi_nps ?? 'N/A'}
  - TAM Size Estimate: ${startupRecord.kpi_tam_size ?? 'N/A'}
  - Avg. Order Value: ${startupRecord.kpi_avg_order_value ?? 'N/A'}
  - Market Share Estimate: ${startupRecord.kpi_market_share ?? 'N/A'}%
  - YoY Growth: ${startupRecord.kpi_yoy_growth ?? 'N/A'}%

Market Analysis:
  - Market Growth Rate: ${startupRecord.market_growth_rate ?? 'N/A'}
  - Key Trends: ${startupRecord.market_key_trends ?? 'N/A'}
  - Target Customer Profile: ${startupRecord.target_customer_profile ?? 'N/A'}
  - Customer Pain Points Addressed: ${startupRecord.customer_pain_points ?? 'N/A'}
  - Market Barriers: ${startupRecord.market_barriers ?? 'N/A'}
  - Competitive Advantage Claimed: ${startupRecord.competitive_advantage ?? 'N/A'}

Competitor Info (Partial):
  - Competitor 1 Name: ${startupRecord.competitor1_name ?? 'N/A'}
  - Competitor 1 Differentiator Claimed: ${startupRecord.competitor1_differentiator ?? 'N/A'}

Funding Status:
  - Current Funding Level: ${startupRecord.current_funding ?? 'N/A'}
  - Seeking Investment: ${startupRecord.seeking_investment ? 'Yes' : 'No'}
  - Target Raise Amount: ${startupRecord.target_raise_amount ?? 'N/A'}

--- CURRENT STARTUP PROFILE END ---

Now, provide the detailed JSON analysis object for the **CURRENT STARTUP PROFILE** above.
    `;

    // 5. Get OpenAI API Key (Set this in Edge Function Secrets)
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    // 6. Call OpenAI API
    const aiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or gpt-4 if available/preferred
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5, // Adjust creativity vs factualness
        response_format: { type: "json_object" }, // Request JSON output if using compatible models
      }),
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      throw new Error(`OpenAI API request failed: ${aiResponse.status} ${errorBody}`);
    }

    const aiResult = await aiResponse.json();
    const analysisContent = aiResult.choices?.[0]?.message?.content;

    if (!analysisContent) {
      throw new Error('No content received from OpenAI');
    }

    // 7. Parse AI Response (assuming it's valid JSON)
    let analysisJson;
    try {
      // Sometimes the response might have ```json blocks, try to extract
       const jsonMatch = analysisContent.match(/```json\n([\s\S]*?)\n```/);
       const jsonString = jsonMatch ? jsonMatch[1] : analysisContent;
      analysisJson = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', analysisContent);
      throw new Error('Failed to parse AI analysis JSON.');
    }

    // 8. Store Results in Supabase
    const { error: updateError } = await supabaseAdminClient
      .from('startups')
      .update({
        ai_analysis: analysisJson,
        analysis_status: 'completed',
        analysis_timestamp: new Date().toISOString(),
      })
      .eq('id', startupId);

    if (updateError) {
      throw updateError;
    }

    console.log(`Successfully analyzed and updated startup ID: ${startupId}`);

    // 9. Return Success Response
    return new Response(JSON.stringify({ message: 'Analysis complete', startupId: startupId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in analyze-startup function:', error);

    // Attempt to update status to 'failed' if possible
    const startupId = (await req.json().catch(() => ({})))?.record?.id;
    if (startupId) {
      try {
        const supabaseAdminClient = createClient( Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
        await supabaseAdminClient
          .from('startups')
          .update({ analysis_status: 'failed', analysis_timestamp: new Date().toISOString() })
          .eq('id', startupId);
      } catch (updateFailError) {
         console.error('Failed to update status to failed:', updateFailError);
      }
    }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-startup' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
