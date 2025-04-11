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

// Initialize Supabase Admin Client (use Service Role Key for backend operations)
const supabaseAdmin: SupabaseClient = createClient(
  getEnvVar('SUPABASE_URL'),
  getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
);

console.log("generate-ai-insights function initialized.");

serve(async (req) => {
  const functionName = "generate-ai-insights";
  try {
    // Ensure the request method is POST (standard for webhooks)
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    const payload = await req.json();
    // The hook payload structure nests the record under 'record' for INSERT/UPDATE
    const startupRecord = payload.record;

    if (!startupRecord?.id) {
        console.error(`[${functionName}] Invalid or missing startup record in payload:`, payload);
        throw new Error("Invalid startup record data received.");
    }
    const startupId = startupRecord.id;
    console.log(`[${functionName}] Processing startup ID: ${startupId}`);

    // Destructure necessary fields for the prompt
    const { name, description, industry, operational_stage, sector, location_city, num_employees, num_customers, annual_revenue } = startupRecord;

    // --- Start AI Prompt ---
    // (Critically important: Refine this prompt based on desired output quality and format)
    const prompt = `
      You are an AI assistant for RISE, a platform connecting startups and investors.
      Analyze the following startup profile data. Provide 3-5 concise bullet points highlighting key aspects an investor might consider. Focus ONLY on the provided data. Identify potential strengths, weaknesses, opportunities, or areas needing clarification. Keep insights factual and directly tied to the input.

      **Startup Profile Data:**
      - Name: ${name || 'Not Provided'}
      - Industry: ${industry || 'Not Provided'}
      - Sector: ${sector || 'Not Provided'}
      - Operational Stage: ${operational_stage || 'Not Provided'}
      - Location: ${location_city || 'Not Provided'}
      - Description: ${description || 'Not Provided'}
      - Team Size: ${num_employees ?? 'Not Provided'}
      - Customer Count: ${num_customers ?? 'Not Provided'}
      - Annual Revenue: ${annual_revenue ? `$${annual_revenue}` : 'Not Provided'}

      **Investor Considerations (3-5 Bullet Points):**
      *
    `;
    // --- End AI Prompt ---

    console.log(`[${functionName}] Sending prompt for startup ${startupId} to OpenAI...`);
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo', // Or 'gpt-4-turbo-preview' for better results
      max_tokens: 300, // Adjust based on expected length of insights
      temperature: 0.6, // Balance factualness and readability
      n: 1,
      stop: null, // Allow model to determine end
    });

    const insights = chatCompletion.choices[0]?.message?.content?.trim() || null;

    if (!insights) {
       console.warn(`[${functionName}] OpenAI did not return insights for startup ${startupId}.`);
       // Decide how to handle - update with specific message or leave null?
       // For now, we'll leave it null if OpenAI fails.
    } else {
        console.log(`[${functionName}] Received insights for startup ${startupId}.`);
    }

    // Update the 'startups' table with the generated insights
    console.log(`[${functionName}] Updating database for startup ${startupId}...`);
    const { error: updateError } = await supabaseAdmin
      .from('startups')
      .update({
          ai_insights: insights,
          updated_at: new Date().toISOString() // Also update the 'updated_at' timestamp
      })
      .eq('id', startupId); // Ensure we only update the correct row

    if (updateError) {
        console.error(`[${functionName}] Failed to update Supabase for startup ${startupId}:`, updateError);
        throw new Error(`Supabase DB update failed: ${updateError.message}`);
    }

    console.log(`[${functionName}] Successfully processed and updated insights for startup ID: ${startupId}`);
    return new Response(JSON.stringify({ success: true, message: `Insights generated for startup ${startupId}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(`[${functionName}] Uncaught error:`, error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: (error instanceof TypeError) ? 400 : 500, // Bad request for type errors
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-ai-insights' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
