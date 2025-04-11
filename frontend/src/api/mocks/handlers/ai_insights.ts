import { http, HttpResponse } from 'msw';
import { AIInsight } from '../../../types/database'; // Adjust path if necessary, assuming AIInsight type is defined there now

// Read Supabase URL from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("[MSW AI Insights Handler] VITE_SUPABASE_URL not set.");
}

// Mock AI Insights Data (Consider moving to a shared mock data file later)
const mockInsightsData: { [startupId: number]: AIInsight[] } = {
    1: [ // Corresponds to startupData.id = 1 (e.g., Glint Technologies)
        { 
            id: 'ai-mock-1', 
            startup_id: 1,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            title: 'Market Expansion Opportunity (Mock)', 
            summary: 'Mock: Untapped potential exists in the adjacent EdTech market.', 
            category: 'Opportunity', 
            severity: 'Medium'
        },
        { 
            id: 'ai-mock-2', 
            startup_id: 1,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            title: 'High CAC (Mock)', 
            summary: 'Mock: Your CAC is currently higher than the industry benchmark.', 
            category: 'Weakness', 
            severity: 'High' 
        },
        { 
            id: 'ai-mock-3', 
            startup_id: 1,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            title: 'Recommendation: Focus on PLG (Mock)', 
            summary: 'Mock: Implement a freemium tier or product trial.', 
            category: 'Recommendation', 
            severity: 'High'
        },
        { 
            id: 'ai-mock-4', 
            startup_id: 1,
            created_at: new Date(Date.now() - 604800000).toISOString(),
            title: 'Strong Team Experience (Mock)', 
            summary: 'Mock: Your founding team possesses significant domain expertise.', 
            category: 'Strength', 
            severity: 'Low' 
        },
    ],
    // Add mock insights for other startup IDs if needed
    2: [], // Example for another startup with no insights yet
};

const log = (message: string, data?: any) => {
  console.log(`[MSW AI Insights] ${message}`, data || '');
};

export const aiInsightsHandlers = [
  // Intercept GET requests to /rest/v1/ai_insights
  http.get(`${supabaseUrl}/rest/v1/ai_insights`, ({ request }) => {
    const url = new URL(request.url);
    const startupIdEq = url.searchParams.get('startup_id'); // Gets 'eq.1'

    log('Intercepted GET /ai_insights', { startupIdEq });

    if (startupIdEq && startupIdEq.startsWith('eq.')) {
        try {
            const requestedStartupId = parseInt(startupIdEq.split('eq.')[1], 10);
            log(`Fetching mock insights for startup_id: ${requestedStartupId}`);
            
            const insights = mockInsightsData[requestedStartupId] || [];
            log('Returning mock insights:', insights);
            
            // Supabase returns an array of objects
            return HttpResponse.json(insights, { status: 200 });

        } catch (e) {
             log('Error parsing startup_id', { startupIdEq, error: e });
             return HttpResponse.json({ message: 'Invalid startup_id format' }, { status: 400 });
        }
    } else {
        log('Request did not include startup_id filter, returning 400');
        // If the request doesn't filter by startup_id, return an error or empty array
        // depending on how the real API should behave.
        return HttpResponse.json({ message: 'Missing startup_id filter' }, { status: 400 });
    }
  }),

  // --- Add POST/PUT/DELETE handlers for ai_insights if needed later --- 
]; 