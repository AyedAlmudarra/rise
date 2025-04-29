// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Invoking get-investor-suggestions function!")

// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/core.ts';
// @ts-ignore
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// --- Environment Variables ---
// @ts-ignore Deno type checking issue
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
// @ts-ignore Deno type checking issue
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
// @ts-ignore Deno type checking issue
const GOOGLE_API_KEY_ENV = Deno.env.get("GOOGLE_API_KEY");

// --- Interfaces (Adapt as needed) ---
// TODO: Ensure these interfaces accurately reflect your DB schema and frontend needs
interface InvestorPreferences {
  id: number;
  user_id: string;
  full_name: string;
  preferred_industries: string[] | null;
  preferred_geography: string[] | null;
  preferred_stage: string[] | null;
  // Add other relevant fields like investor_type, maybe min/max check size if available
}

// Keep this minimal - only fields relevant for matching & display
interface StartupForMatching {
  id: string; // Use Supabase ID (number) or user_id (string)? Ensure consistency. Using string to match frontend placeholder.
  name: string;
  description: string | null;
  industry: string | null;
  sector: string | null;
  location_city: string | null;
  country_of_operation: string | null;
  operational_stage: string | null;
  annual_revenue: number | null; // Example metric
  team_size: number | null; // Example metric
  seeking_investment: boolean | null;
  target_raise_amount: number | null;
  highlights_summary?: string | null; // Added field for potential pre-existing highlights
  logo_url?: string | null; // For frontend display
}

// Output format expected by the frontend
interface StartupSuggestion {
  id: string; // Match StartupForMatching ID type
  startupName: string;
  logoUrl?: string;
  industry: string;
  stage: string;
  matchScore: number; // AI-generated score (e.g., 1-100)
  description: string;
  location?: string;
  teamSize?: number | string; // Allow string for flexibility
  fundingNeeded?: number;
  highlights: string[]; // AI might generate these based on full data
  matchReason: string; // AI-generated justification
}

// --- Helper to build the Gemini Prompt ---
function buildSuggestionPrompt(investor: InvestorPreferences, startups: StartupForMatching[]): string {
  // TODO: Iterate on this prompt based on the quality of AI suggestions received.
  const investorPrefsString = `
    Investor: ${investor.full_name}
    Preferences:
    - Industries: ${investor.preferred_industries?.join(', ') || 'Any'}
    - Geography: ${investor.preferred_geography?.join(', ') || 'Any'}
    - Stage: ${investor.preferred_stage?.join(', ') || 'Any'}
    // Add other preferences here
  `;

  const startupsString = startups.map((s, index) => `
    Startup ${index + 1}:
    - ID: ${s.id}
    - Name: ${s.name}
    - Industry: ${s.industry || 'N/A'}
    - Stage: ${s.operational_stage || 'N/A'}
    - Location: ${s.location_city || 'N/A'}, ${s.country_of_operation || 'N/A'}
    - Description: ${s.description || 'N/A'}
    - Seeking Investment: ${s.seeking_investment ? 'Yes' : 'No'} (Target: ${s.target_raise_amount || 'N/A'})
    - Revenue (Annual): ${s.annual_revenue || 'N/A'}
    - Team Size: ${s.team_size || 'N/A'}
    - Summary/Highlights: ${s.highlights_summary || '(Not provided, please generate based on description)'} 
    `).join('\n'); // Use \n for literal newline in prompt string

  const prompt = `
You are an AI matchmaking engine for Venture Capital investors and startups in the Saudi Arabian market.
Your task is to analyze the following investor profile and list of startups. Based *only* on the provided data, identify the top 5-10 best matches for the investor.

**Investor Profile:**
${investorPrefsString}

**Available Startups:**
${startupsString}

---
**Instructions:**
1. Evaluate each startup against the investor's preferences (Industry, Geography, Stage, etc.).
2. Consider factors like market fit (implied by description/industry), traction (implied by revenue/stage), and funding needs relative to typical stage investments.
3. Generate a JSON array containing suggested startups. Each object in the array should strictly follow this format:
   {
     "id": "(String: The Startup ID from the input list)",
     "startupName": "(String: The Startup Name)",
     "logoUrl": "(String | null: The logo_url if provided, otherwise null)",
     "industry": "(String: The Startup Industry)",
     "stage": "(String: The Startup Stage)",
     "matchScore": "(Number: A score from 1 to 100 indicating the strength of the match based on your analysis)",
     "description": "(String: The Startup Description)",
     "location": "(String: City, Country or null)",
     "teamSize": "(Number | String: Team size or null)",
     "fundingNeeded": "(Number: Funding amount or null)",
     "highlights": "(String Array: ${startups[0]?.highlights_summary ? 'Use the provided Summary/Highlights field or if not provided, generate' : 'Generate'} 2-3 concise bullet points highlighting why this startup is relevant, based on its profile.)",
     "matchReason": "(String: A 1-2 sentence justification explaining *why* this startup is a good match for *this specific investor* based on their preferences and the startup's profile.)"
   }
4. Rank the suggestions from highest matchScore to lowest. Limit the output to a maximum of 10 suggestions.
5. Ensure the entire output is **only** the valid JSON array, with no surrounding text, explanations, or markdown formatting.

Provide the JSON array of the top matching startups now.
`;
  return prompt;
}


// --- Initialize outside handler (optional, depends on cold starts) ---
let supabaseAdminClient: SupabaseClient | null = null;
let genAI: GoogleGenerativeAI | null = null;
let model: any | null = null; // Use 'any' or import GenerativeModel type

// --- Main Function Logic ---
serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Initialize Clients (if not already done)
     if (!supabaseAdminClient) {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Supabase credentials.");
        supabaseAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                // Get the Authorization header to identify the user
                detectSessionInUrl: false,
                persistSession: false,
                autoRefreshToken: false
            }
        });
    }
     if (!genAI || !model) {
         if (!GOOGLE_API_KEY_ENV) throw new Error("Missing Google API Key.");
         genAI = new GoogleGenerativeAI(GOOGLE_API_KEY_ENV);
         model = genAI.getGenerativeModel({
             model: "gemini-1.5-flash-latest", // Or another suitable model
             generationConfig: { responseMimeType: "application/json" },
             // Safety settings might be needed depending on content
             // safetySettings: [
             //   { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
             //   // ... other categories
             // ]
         });
     }

    // 3. Get Investor User ID from Auth Header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error('Authentication failed');
    }
    const investorUserId = user.id;
    console.log(`Request initiated by investor user_id: ${investorUserId}`);

    // 4. Fetch Investor Preferences
    console.log("Fetching investor preferences...");
    const { data: investorData, error: investorError } = await supabaseAdminClient
      .from('investors') // Assuming your table is named 'investors'
      .select('id, user_id, full_name, preferred_industries, preferred_geography, preferred_stage') // Select needed fields
      .eq('user_id', investorUserId)
      .single();

    if (investorError) throw new Error(`Failed to fetch investor profile: ${investorError.message}`);
    if (!investorData) throw new Error('Investor profile not found.');
    const investorPrefs = investorData as InvestorPreferences;
    console.log(`Preferences fetched for: ${investorPrefs.full_name}`);

    // 5. Fetch Startup Data (with basic pre-filtering)
    console.log("Fetching potentially matching startups...");
    // **Important:** Fetch only necessary fields for the prompt.
    // Add pre-filtering based on investor prefs to reduce data volume.
    // Example: Filter by stage if the investor has specific stage preferences.
    let query = supabaseAdminClient
      .from('startups')
      .select(`
        id, user_id, name, description, industry, sector, 
        location_city, country_of_operation, operational_stage, 
        annual_revenue, team_size, seeking_investment, target_raise_amount,
        highlights_summary, logo_url 
      `) // Select fields matching StartupForMatching + user_id
      .limit(100); // Limit the number of startups sent to AI (adjust as needed)

    // Example pre-filtering (add more based on your data and prefs)
    if (investorPrefs.preferred_stage && investorPrefs.preferred_stage.length > 0) {
        query = query.in('operational_stage', investorPrefs.preferred_stage);
    }
     if (investorPrefs.preferred_industries && investorPrefs.preferred_industries.length > 0) {
         query = query.in('industry', investorPrefs.preferred_industries);
     }
     // Add geography filtering (Example: Assumes preferred_geography contains country names)
     if (investorPrefs.preferred_geography && investorPrefs.preferred_geography.length > 0) {
         // Use 'or' condition if matching any country is desired
         // Or adapt based on how specific your geography data is (city, region, country)
         const geoFilters = investorPrefs.preferred_geography.map(geo => `country_of_operation.eq.${geo}`).join(',');
         query = query.or(geoFilters);
     }

    const { data: startupData, error: startupError } = await query;

    if (startupError) throw new Error(`Failed to fetch startups: ${startupError.message}`);
    if (!startupData || startupData.length === 0) {
        console.log("No potentially matching startups found after pre-filtering.");
        // Return empty array if no startups to analyze
         return new Response(JSON.stringify([]), {
             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
             status: 200,
         });
    }

    // Map to ensure consistency with StartupForMatching, especially ID type if needed
     const startupsForMatching: StartupForMatching[] = startupData.map(s => ({
         ...s,
         id: String(s.id) // Example: Convert bigint ID to string if needed by frontend/interface
     }));
    console.log(`Fetched ${startupsForMatching.length} startups for AI matching.`);


    // 6. Build Prompt and Call Gemini
    console.log("Building suggestion prompt...");
    const suggestionPrompt = buildSuggestionPrompt(investorPrefs, startupsForMatching);

    console.log("Sending request to Google AI for suggestions...");
    const result = await model.generateContent(suggestionPrompt);
    const response = result.response;
    const suggestionsJsonText = response.text();
    console.log("Received suggestions response from Google AI.");

    // 7. Parse Response
    let suggestionsResult: StartupSuggestion[];
    try {
        console.log("Attempting to parse AI Suggestions JSON:\n---\n", suggestionsJsonText, "\n---");
        suggestionsResult = JSON.parse(suggestionsJsonText.trim());
        console.log(`Successfully parsed ${suggestionsResult.length} suggestions.`);
    } catch (parseError) {
      console.error("Failed to parse JSON suggestions from AI:", parseError);
      console.error("Raw AI Response Text (that failed parsing):", suggestionsJsonText);
      throw new Error("AI returned invalid JSON format for suggestions.");
    }

    // 8. Return Suggestions
    return new Response(JSON.stringify(suggestionsResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Get Investor Suggestions function error:', error.message);
    // Log detailed error for debugging
    console.error(error); 
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* Example Invocation (requires valid JWT for an investor):

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/get-investor-suggestions' \
    --header 'Authorization: Bearer YOUR_INVESTOR_JWT' \
    --header 'Content-Type: application/json' 

*/ 