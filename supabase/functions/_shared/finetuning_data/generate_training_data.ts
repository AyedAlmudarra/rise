// supabase/functions/_shared/finetuning_data/generate_training_data.ts
// NOTE: Run this script LOCALLY using Deno (e.g., `deno run --allow-read --allow-write generate_training_data.ts`)
// AFTER fully populating mock_startup_profiles.ts and ideal_analysis_outputs.ts

import { mockStartupProfilesForTuning } from "./mock_startup_profiles.ts";
import { idealAnalysisOutputsForTuning } from "./ideal_analysis_outputs.ts";
import type { StartupRecord, AIAnalysisData } from "../types.ts";

const TRAIN_RATIO = 0.8; // Use 80% for training, 20% for validation

// --- Reusable Prompt Building Logic (Adapted from edge function) ---
// IMPORTANT: This MUST match the structure expected by the model during fine-tuning
//            and ideally resemble the prompt used during inference.
function buildFineTuningInputPrompt(startupData: StartupRecord): string {
  // This prompt structure forms the core "instruction" part of the input
  const instructionPrompt = `
You are an experienced Venture Capital analyst specializing in the Saudi Arabian market, evaluating early-stage startups for seed investment. Your analysis should be critical, insightful, and grounded *only* in the provided data, considering the KSA market context where applicable.

Analyze the provided startup profile thoroughly. Generate a structured JSON object containing the following detailed analysis components. Ensure the entire output is a single, valid JSON object with no surrounding text or markdown formatting. If data for a specific field or section is missing or insufficient ('N/A'), state that clearly within the relevant field or omit the field/section if assessment is impossible.

**JSON Structure Required:**
{
  "executive_summary": "(String: ...)", // Keep structure brief for brevity here
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
  return instructionPrompt;
}


// --- Main Script Logic ---
async function generateJsonlFiles() {
  console.log("Starting generation of fine-tuning JSONL files...");

  if (mockStartupProfilesForTuning.length !== idealAnalysisOutputsForTuning.length) {
    console.error("ERROR: Mismatch between number of mock profiles and ideal outputs.");
    console.error(`Profiles: ${mockStartupProfilesForTuning.length}, Outputs: ${idealAnalysisOutputsForTuning.length}`);
    return;
  }

  if (mockStartupProfilesForTuning.length === 0) {
      console.error("ERROR: No mock data found. Populate the data files first.");
      return;
  }

  // Ensure the mock data arrays have enough elements before proceeding
  // This check is mainly relevant if the placeholder files haven't been populated
  const expectedMinimum = 3; // Based on the examples provided
  if (mockStartupProfilesForTuning.length < expectedMinimum) {
      console.warn(`WARNING: Only found ${mockStartupProfilesForTuning.length} examples. Ensure data files are fully populated.`);
      // Proceeding with the few examples found for testing the script itself
  }

  const combinedData: { input: StartupRecord; output: AIAnalysisData }[] = mockStartupProfilesForTuning.map((profile, index) => ({
    input: profile,
    output: idealAnalysisOutputsForTuning[index],
  }));

  // Shuffle data before splitting
  for (let i = combinedData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedData[i], combinedData[j]] = [combinedData[j], combinedData[i]];
  }

  const splitIndex = Math.floor(combinedData.length * TRAIN_RATIO);
  const trainingData = combinedData.slice(0, splitIndex);
  const validationData = combinedData.slice(splitIndex);

  console.log(`Total examples: ${combinedData.length}`);
  console.log(`Training examples: ${trainingData.length}`);
  console.log(`Validation examples: ${validationData.length}`);

  // --- Generate train_data.jsonl ---
  try {
    let trainJsonlContent = "";
    for (const item of trainingData) {
      const promptText = buildFineTuningInputPrompt(item.input);
      // Ensure the output is stringified JSON
      const outputText = JSON.stringify(item.output);

      // Format according to Vertex AI text prompt/output requirements
      // See: https://cloud.google.com/vertex-ai/docs/generative-ai/models/tune-models#prepare-data
      const jsonlLine = JSON.stringify({
        // Using standard 'text_input' and 'output' fields - verify required format for your chosen model/task
        "text_input": promptText, // Or potentially just "prompt"
        "output": outputText      // Or potentially just "completion" or "output_text"
      });
      trainJsonlContent += jsonlLine + "\n";
    }
    // Use Deno specific API for writing file
    // @ts-ignore Deno global object may not be recognized
    await Deno.writeTextFile("./train_data.jsonl", trainJsonlContent.trim());
    console.log("Successfully generated train_data.jsonl");
  } catch (error) {
    console.error("Error writing train_data.jsonl:", error);
  }

  // --- Generate validation_data.jsonl ---
   try {
    let validationJsonlContent = "";
    for (const item of validationData) {
       const promptText = buildFineTuningInputPrompt(item.input);
       const outputText = JSON.stringify(item.output);
       const jsonlLine = JSON.stringify({
         "text_input": promptText,
         "output": outputText
       });
       validationJsonlContent += jsonlLine + "\n";
    }
    // Use Deno specific API for writing file
    // @ts-ignore Deno global object may not be recognized
    await Deno.writeTextFile("./validation_data.jsonl", validationJsonlContent.trim());
    console.log("Successfully generated validation_data.jsonl");
  } catch (error) {
    console.error("Error writing validation_data.jsonl:", error);
  }

  console.log("JSONL generation finished.");
}

// Run the generation function
generateJsonlFiles(); 