// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://deno.land/x/openai@v4.24.1/mod.ts';

// Helper function to safely get environment variables
function getEnvVar(key: string): string {
    const value = Deno.env.get(key);
    if (!value) throw new Error(`Environment variable ${key} is not set.`);
    return value;
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: getEnvVar('OPENAI_API_KEY') });

// Initialize Supabase Admin Client
const supabaseAdmin: SupabaseClient = createClient(
  getEnvVar('SUPABASE_URL'),
  getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
);

console.log("calculate-readiness-score function initialized.");

serve(async (req) => {
  const functionName = "calculate-readiness-score";
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    const payload = await req.json();
    const startupRecord = payload.record;

    if (!startupRecord?.id) {
       console.error(`[${functionName}] Invalid or missing startup record in payload:`, payload);
       throw new Error("Invalid startup record data received.");
    }
    const startupId = startupRecord.id;
     console.log(`[${functionName}] Processing startup ID: ${startupId}`);

    // Destructure fields relevant to scoring
    const { description, industry, operational_stage, num_employees, num_customers, annual_revenue, kpi_clv, kpi_cac, pitch_deck_url } = startupRecord;

    // --- Start AI Prompt ---
    // (Critically important: Refine this prompt. Instructing AI for ONLY a number can be tricky)
    const prompt = `
      You are an AI assistant calculating a 'Funding Readiness Score' (0-100).
      Based *only* on the provided startup data, estimate this score. Consider factors like:
      - Profile Completeness (Are description, industry, stage present?)
      - Traction Signals (Revenue, Customers, Employee count, relevant KPIs like CLV/CAC ratio)
      - Pitch Readiness (Is a pitch deck URL provided?)

      Higher scores indicate better readiness based on these factors.

      **Input Data:**
      - Description Provided: ${!!description} (${description?.length || 0} chars)
      - Industry / Stage Provided: ${!!industry} / ${!!operational_stage}
      - Team Size: ${num_employees ?? 'N/A'}
      - Customers: ${num_customers ?? 'N/A'}
      - Revenue: ${annual_revenue ?? 'N/A'}
      - CLV / CAC Ratio: ${(kpi_clv && kpi_cac && kpi_cac > 0) ? (kpi_clv / kpi_cac).toFixed(1) : 'N/A'}
      - Pitch Deck Uploaded: ${!!pitch_deck_url}

      **Output ONLY the integer score between 0 and 100. Do not include any other text, symbols, or explanation.**

      Score:
    `;
    // --- End AI Prompt ---

     console.log(`[${functionName}] Sending prompt for startup ${startupId} to OpenAI...`);
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo', // A cheaper model might be sufficient for scoring
      max_tokens: 15,        // Allow a bit extra in case of stray characters
      temperature: 0.1,      // Very low temperature for deterministic numeric output
      n: 1,
    });

    const scoreText = chatCompletion.choices[0]?.message?.content?.trim();
    let score: number | null = null;

    // Try to extract a number robustly
    if (scoreText) {
        const match = scoreText.match(/\d+/); // Find the first sequence of digits
        if (match) {
            const parsedScore = parseInt(match[0], 10);
            if (!isNaN(parsedScore)) {
                 // Clamp the score to the 0-100 range
                score = Math.max(0, Math.min(100, parsedScore));
                console.log(`[${functionName}] Received and parsed score for startup ${startupId}: ${score}`);
            }
        }
    }

    if (score === null) {
         console.warn(`[${functionName}] Failed to parse a valid score (0-100) from OpenAI response for startup ${startupId}. Response: "${scoreText}"`);
         // Leave score as null in the database if parsing fails
    }

    // Update the 'startups' table
    console.log(`[${functionName}] Updating database for startup ${startupId}...`);
    const { error: updateError } = await supabaseAdmin
      .from('startups')
      .update({
          funding_readiness_score: score,
          updated_at: new Date().toISOString() // Update timestamp
      })
      .eq('id', startupId);

    if (updateError) {
       console.error(`[${functionName}] Failed to update Supabase for startup ${startupId}:`, updateError);
       throw new Error(`Supabase DB update failed: ${updateError.message}`);
    }

    console.log(`[${functionName}] Successfully processed and updated score for startup ID: ${startupId}`);
    return new Response(JSON.stringify({ success: true, message: `Score calculated for startup ${startupId}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
     console.error(`[${functionName}] Uncaught error:`, error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: (error instanceof TypeError) ? 400 : 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/calculate-readiness-score' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
