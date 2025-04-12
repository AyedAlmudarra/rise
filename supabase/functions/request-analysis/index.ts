// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Request Analysis Function!")

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/core.ts';

// --- Reuse relevant interfaces and constants ---
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

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
}

// --- Helper to build the detailed analysis prompt ---
function buildAnalysisPrompt(startupRecord: StartupRecord): string {
    // --- This is the DETAILED prompt from analyze-startup ---
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
    return prompt;
}

serve(async (req: Request) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Create Supabase client AUTHENTICATED AS THE CALLING USER
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '', // Use anon key
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        // 2. Get user details from the JWT
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Invalid user' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 3. Get startup_id from request body
        const { startup_id } = await req.json();
        if (!startup_id) {
            throw new Error('Missing startup_id in request body');
        }

        // 4. Fetch startup data AND verify ownership/permission
        const supabaseAdminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { data: startupRecord, error: fetchError } = await supabaseAdminClient
            .from('startups')
            .select('*') // Ensure this selects all fields needed by the prompt
            .eq('id', startup_id)
            .single();

        if (fetchError) throw fetchError;
        if (!startupRecord) throw new Error(`Startup not found: ${startup_id}`);

        // *** PERMISSION CHECK: Ensure the calling user owns this startup ***
        if (startupRecord.user_id !== user.id) {
             return new Response(JSON.stringify({ error: 'Forbidden: You do not own this startup profile' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        console.log(`Request received to re-analyze startup ID: ${startup_id} by user ${user.id}`);

        // --- Start Analysis Logic ---

        // 5. Update status to 'processing' (using admin client)
        await supabaseAdminClient
            .from('startups')
            .update({ analysis_status: 'processing', analysis_timestamp: new Date().toISOString() })
            .eq('id', startup_id);

        // 6. Prepare Prompt
        const prompt = buildAnalysisPrompt(startupRecord as StartupRecord);

        // 7. Get OpenAI API Key
        const openAIKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAIKey) throw new Error('OPENAI_API_KEY not set');

        // 8. Call OpenAI API
        const aiResponse = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAIKey}` },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Or your preferred model
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                response_format: { type: "json_object" },
            }),
        });

        if (!aiResponse.ok) {
            const errorBody = await aiResponse.text();
            throw new Error(`OpenAI API request failed: ${aiResponse.status} ${errorBody}`);
        }
        const aiResult = await aiResponse.json();
        const analysisContent = aiResult.choices?.[0]?.message?.content;
        if (!analysisContent) throw new Error('No content received from OpenAI');

        // 9. Parse AI Response
        let analysisJson;
        try {
            const jsonMatch = analysisContent.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : analysisContent;
            analysisJson = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse OpenAI JSON:', analysisContent);
            throw new Error('Failed to parse AI analysis JSON.');
        }

        // 10. Store Results in Supabase (using admin client)
        const { error: updateError } = await supabaseAdminClient
            .from('startups')
            .update({
                ai_analysis: analysisJson,
                analysis_status: 'completed',
                analysis_timestamp: new Date().toISOString(),
            })
            .eq('id', startup_id);

        if (updateError) throw updateError;

        console.log(`Successfully re-analyzed and updated startup ID: ${startup_id}`);

        // 11. Return Success Response
        return new Response(JSON.stringify({ message: 'Re-analysis complete', startupId: startup_id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
         console.error('Error in request-analysis function:', error);
         const startupIdFromBody = (await req.json().catch(() => ({})))?.startup_id;
         if (startupIdFromBody) {
             try {
                 const supabaseAdminClient = createClient( Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
                 await supabaseAdminClient
                     .from('startups')
                     .update({ analysis_status: 'failed', analysis_timestamp: new Date().toISOString() })
                     .eq('id', startupIdFromBody);
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/request-analysis' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
