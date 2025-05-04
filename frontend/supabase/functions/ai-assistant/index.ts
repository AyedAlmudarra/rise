// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

// Import required dependencies
// @ts-ignore Cannot find module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore Cannot find module
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from '../_shared/core.ts';
// import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1"; // REMOVE OpenAI import

// Define the interface for a message (compatible with both)
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

// Define the Gemini API request/response parts (simplified)
interface GeminiContent {
  parts: { text: string }[];
  role: "user" | "model"; // Gemini uses "model" for assistant role
}

// REMOVE OpenAI configuration
// const configuration = new Configuration({
//   apiKey: Deno.env.get("OPENAI_API_KEY"),
// });
// const openai = new OpenAIApi(configuration);

// System prompt that guides the AI's behavior (KEEP)
const SYSTEM_PROMPT: Message = {
  role: "system",
  content: `You are RISE AI, an expert assistant integrated into the RISE platform, designed to support and empower startup founders and investors within the Saudi Arabian ecosystem. Your primary goal is to provide insightful, actionable, and contextually relevant guidance.\n\n**Your Knowledge Base:**\n1.  **User Context:** Detailed information about the user you are interacting with (Startup profile including metrics and full AI Analysis OR Investor profile including focus areas) is provided at the start of these instructions. **Continuously reference this context.**\n2.  **RISE Platform:** Core features include Startup Profiles, Investor Matching, Deal Flow Management, AI Analysis generation, Resource Hub, Direct Messaging. *(Add/refine specific RISE features here)*\n3.  **Saudi Ecosystem:** Key aspects like Vision 2030, prominent funding bodies (VCs, SVC), regulatory nuances (FinTech sandbox), major hubs (Riyadh, Jeddah, Dammam). *(Add/refine specific KSA context here)*\n4.  **General Startup/VC Knowledge:** Your extensive training data on business strategy, finance, market analysis, etc.\n5.  **Date/Time:** The current date and time are provided for temporal context.\n\n**Core Responsibilities & Interaction Protocol:**\n\n1.  **Leverage Full Context:** **Proactively synthesize** information from the User Context, RISE Platform features, Saudi Ecosystem knowledge, and your general training to deliver tailored responses. **Do not ask for information readily available in the provided context.**\n2.  **Platform Guidance:** Explain RISE features clearly. Provide step-by-step instructions on how users can perform actions within the platform (e.g., "To update your financials, navigate to Your Profile > Financials section and click Edit."). **Never claim you can perform actions yourself.**\n3.  **Analysis Interpretation:** Help users understand their AI Analysis results. Explain specific sections (SWOT, Scalability, Financials, Risks, etc.), clarify terms, and discuss the implications based on their overall profile.\n4.  **Strategic Advice:** Offer general startup or investment advice (fundraising strategies, growth tactics, market entry, deal evaluation) grounded in the user\'s specific context (stage, industry, funding status, investment thesis) and relevant Saudi market factors.\n5.  **Professional Tone:** Maintain a professional, objective, supportive, and data-driven tone. Avoid overly casual language, speculation, or definitive predictions. Focus on providing balanced perspectives and actionable insights.\n6.  **Structured Communication:** Use clear language. Employ bullet points, numbered lists, or summaries for complex information or instructions. Provide concise answers but elaborate with details when necessary for clarity.\n7.  **Clarification:** If a user\'s request is ambiguous or requires information *not* present in the context, ask specific, targeted clarifying questions.\n8.  **Formatting:** Use Markdown for formatting your responses. Utilize **bold text** for emphasis on key terms, company names, or actions. Employ bullet points (\`*\`) or numbered lists (\`1.\`) for structured information like steps or options.\n\n**Limitations:**\n*   You **cannot** access live, real-time external data (current news, stock prices, live market changes, web searches). State this limitation clearly if asked for such information.\n*   You **cannot** perform actions on the RISE platform for the user.\n*   Your general knowledge has a cutoff date; mention this possibility if discussing rapidly evolving external topics.\n*   Acknowledge when you genuinely lack the knowledge or specific context to provide a reliable answer.\n\n**Primary Directive:** Be the most helpful, context-aware, and professional AI assistant possible for RISE users in the Saudi ecosystem.`,
};

// Handle incoming requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get Supabase client (KEEP)
    // @ts-ignore Deno types not recognized locally
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    // @ts-ignore Deno types not recognized locally
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get user ID (KEEP)
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = authHeader.substring(7); // Extract the token string after "Bearer "
      try {
         // Use the main client (admin or user-context doesn't matter here)
         // Pass the JWT directly to getUser() for validation
         const { data: { user }, error } = await supabaseClient.auth.getUser(jwt);

         if (!error && user) {
           userId = user.id;
         } else if (error) {
            console.warn("Failed to validate JWT:", error.message);
         }
      } catch (authError) {
         console.error("Error during auth processing:", authError.message);
      }
    } else if (authHeader) {
        console.warn("Authorization header received but not in 'Bearer ' format.");
    }

    if (!userId) {
        console.log("No valid userId obtained, proceeding without user context.");
    }

    // Parse request body (KEEP)
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request. 'messages' array with at least one message is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- SWITCH TO GOOGLE GEMINI --- 
    // @ts-ignore Deno types not recognized locally
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY environment variable not set.');
    }
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`;

    // Prepare conversation history for Gemini format
    const geminiHistory: GeminiContent[] = [];

    // Add System Prompts (Needs special handling if multiple system messages used)
    let systemInstruction = SYSTEM_PROMPT.content;

    // Add user context if available
    let userContext = "";
    if (userId) {
      console.log(`Fetching context for userId: ${userId}`);
      // Try fetching Startup Profile first
      const { data: startupData, error: startupError } = await supabaseClient
        .from("startups")
        // Fetch comprehensive fields including AI analysis
        .select("*, ai_analysis") // Fetch all startup fields and the analysis
        .eq("user_id", userId)
        .maybeSingle(); 

      if (startupError) console.error("Error fetching startup context:", startupError.message);
      console.log("Startup fetch result:", startupData ? `Found: ${startupData.name}` : "Not found or error");

      if (startupData) {
        userContext = `Context: The user asking is a Startup Founder.\n--- Startup Profile Summary ---\n`;
        userContext += `- Name: ${startupData.name || 'N/A'}\n`;
        userContext += `- Industry/Sector: ${startupData.industry || 'N/A'} / ${startupData.sector || 'N/A'}\n`;
        userContext += `- Stage: ${startupData.operational_stage || 'N/A'}\n`;
        userContext += `- Location: ${startupData.location_city || 'N/A'}\n`;
        userContext += `- Employees: ${startupData.num_employees ?? 'N/A'}\n`;
        userContext += `- Revenue (Annual): ${startupData.annual_revenue ?? 'N/A'}\n`;
        userContext += `- Seeking Raise: ${startupData.target_raise_amount ? `$${startupData.target_raise_amount.toLocaleString()}` : 'No/N/A'}\n`;
        userContext += `- Description: ${startupData.description?.substring(0, 150) || 'N/A'}...\n`;
        
        // Add AI Analysis data if available and analysis is complete
        if (startupData.ai_analysis && typeof startupData.ai_analysis === 'object' && startupData.analysis_status === 'completed') {
            const analysis = startupData.ai_analysis as any; 
            userContext += `--- Full AI Analysis Data ---\n`;
            try {
                // Stringify the JSON object for inclusion in the context
                userContext += JSON.stringify(analysis, null, 2); // Use null, 2 for pretty-printing (adds tokens but improves readability for the model potentially)
            } catch (stringifyError) {
                console.error("Error stringifying AI analysis:", stringifyError);
                userContext += "(Error processing analysis data)";
            }
             userContext += `\n--- End AI Analysis Data ---\n`;
        } else if (startupData.analysis_status === 'processing') {
             userContext += `--- AI Analysis Status: Processing ---\n`;
        } else if (startupData.analysis_status === 'failed') {
             userContext += `--- AI Analysis Status: Failed ---\n`;
        } else {
            userContext += `--- AI Analysis Status: Not run or outdated ---\n`;
        }
         userContext += `-----------------------------\n`;

      } else {
        // If not a startup, check if user is an Investor
        const { data: investorData, error: investorError } = await supabaseClient
          .from("investors")
          // Fetch comprehensive investor fields
          .select("*") 
          .eq("user_id", userId)
          .maybeSingle(); 

        if (investorError) console.error("Error fetching investor context:", investorError.message);
        console.log("Investor fetch result:", investorData ? `Found: ${investorData.company_name}` : "Not found or error");

        if (investorData) {
          userContext = `Context: The user asking is an Investor.\n--- Investor Profile Summary ---\n`;
          userContext += `- Company: ${investorData.company_name || 'N/A'}\n`;
          userContext += `- Job Title: ${investorData.job_title || 'N/A'}\n`;
          userContext += `- Focus Industries: ${investorData.preferred_industries?.join(', ') || 'N/A'}\n`;
          userContext += `- Focus Stage: ${investorData.preferred_stage || 'N/A'}\n`;
          userContext += `- Focus Geography: ${investorData.preferred_geography?.join(', ') || 'N/A'}\n`;
          userContext += `- Check Size: ${investorData.typical_check_size || 'N/A'}\n`; // Assuming field exists
           userContext += `-----------------------------\n`;
        }
      }
       console.log("Constructed userContext:", userContext ? userContext.substring(0, 300) + '...' : "EMPTY");
       if (userContext) {
          // Prepend context to the main system instruction
          systemInstruction = userContext + "\n" + systemInstruction; // Keep newline separator
       }
    }

    // --- ADD CURRENT DATE/TIME CONTEXT ---
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: 'numeric', minute: 'numeric', timeZoneName: 'short' 
    }); // Example format: "Thursday, July 4, 2024, 2:30 PM PDT"
    systemInstruction += `\n\nCurrent date/time for context: ${formattedDate}`;
    // --- END DATE/TIME CONTEXT ---

    // Format messages for Gemini
    messages.forEach((msg: Message) => {
      // Skip system messages from input, they are handled separately
      if (msg.role === 'user' || msg.role === 'assistant') {
        geminiHistory.push({
          parts: [{ text: msg.content }],
          role: msg.role === 'user' ? 'user' : 'model' // Map assistant to model
        });
      }
    });

    // Construct final request body
    console.log("--- FINAL SYSTEM INSTRUCTION (Truncated) ---\n", systemInstruction.substring(0, 500) + "...\n-----------------------------------");
    const requestBody = {
      contents: geminiHistory,
       systemInstruction: {
          parts: [{ text: systemInstruction }]
       },
      generationConfig: {
        temperature: 0.7,
      }
    };

    // Call Google Gemini API
    console.log('Calling Google Gemini API...');
    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google API Error:', errorBody);
      throw new Error(`Google Gemini API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const aiMessage = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    // --- END SWITCH --- 

    // Log interaction (KEEP)
    if (userId) {
      const { error: logError } = await supabaseClient
        .from("ai_assistant_logs") // Ensure this table exists
        .insert({
          user_id: userId,
          user_message: messages[messages.length - 1]?.content || "",
          assistant_message: aiMessage,
          user_type: userContext.includes("startup") ? "startup" : userContext.includes("investor") ? "investor" : "unknown"
        });
      if (logError) {
        console.error("Error logging AI interaction:", logError);
      }
    }

    // Return the response (KEEP)
    return new Response(
      JSON.stringify({ message: aiMessage }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in AI assistant function:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request.",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
}); 