import { http, HttpResponse } from 'msw';
import { InvestorProfile } from '../../../types/database'; // Adjust path if needed

// Read Supabase URL directly from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("[MSW Investor Handler] VITE_SUPABASE_URL not set.");
}

// Helper function to log with context
const log = (message: string, data?: any) => {
  console.log(`[MSW Investor Handler] ${message}`, data || '');
};

// --- Mock Investor Profile Data ---
const mockInvestorProfiles: { [userId: string]: InvestorProfile } = {
  'mock-investor-uuid-1': { // Corresponds to investor@rise.com
    id: 101, // Mock DB ID
    user_id: 'mock-investor-uuid-1',
    created_at: '2024-01-05T11:00:00Z',
    job_title: 'Investment Analyst',
    company_name: 'Future Ventures Capital',
    preferred_industries: ['SaaS', 'Fintech', 'AI/ML'],
    preferred_geography: ['MENA'],
    preferred_stage: ['Seed', 'Series A'],
    website: 'https://mock-fvc.example.com',
    linkedin_profile: 'https://linkedin.com/in/mock-investor',
    company_description: 'Investing in the next generation of tech leaders.',
  },
  // Add other mock investor profiles if needed
};

export const investorHandlers = [
  // Intercept GET requests to /rest/v1/investors for single record fetch by user_id
  /* --- DISABLED: Task 9 connects dashboards directly to Supabase --- 
  http.get(`${supabaseUrl}/rest/v1/investors`, ({ request }) => {
     const url = new URL(request.url);
     const selectParam = url.searchParams.get('select');
     const userIdEq = url.searchParams.get('user_id');

     const isSingleFetchByUserId = selectParam === '*' && userIdEq && userIdEq.startsWith('eq.');

     if (isSingleFetchByUserId) {
       const requestedUserId = userIdEq.split('eq.')[1];
       log(`Intercepted GET /investors for user_id: ${requestedUserId}`);

       const profile = mockInvestorProfiles[requestedUserId];

       if (profile) {
         log('Found mock investor profile, returning 200');
         return HttpResponse.json(profile, { status: 200 });
       } else {
         log('Mock investor profile not found, returning 406');
         return HttpResponse.json(
           { message: 'JSON object requested, multiple (or no) rows returned', code: 'PGRST116', details: null, hint: 'Results contain 0 rows' },
           { status: 406 }
         );
       }
     }
     console.warn('MSW: Unmatched GET /investors request:', request.url);
     return HttpResponse.json({ error: 'MSW: Unhandled GET /investors request' }, { status: 400 });
  }),
  */

  // We might need a POST handler later if we allow profile updates
]; 