import { http, HttpResponse } from 'msw';
import { InterestedInvestor } from '../../../types/database'; // Adjust path if necessary

// Read Supabase URL from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("[MSW Investor Interactions] VITE_SUPABASE_URL not set.");
}

// Mock Data: Combine profile aspects with interaction summaries
// This data should ideally match the expected output of the RPC call
const mockInterestedInvestorData: { [startupId: number]: InterestedInvestor[] } = {
    1: [ // For startupData.id = 1 (e.g., Glint Technologies)
         {
            id: 1, // investor.id
            name: 'Sarah Johnson (Mock)',
            company: 'Horizon Ventures',
            title: 'Principal',
            avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg',
            last_activity_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            view_count: 5,
            interest_level: 'High',
            has_viewed_deck: true,
            has_viewed_financials: true,
            profile_url: '#'
         },
         {
            id: 2,
            name: 'Michael Chen (Mock)',
            company: 'Blue Ocean Capital',
            title: 'Managing Partner',
            avatar_url: 'https://randomuser.me/api/portraits/men/67.jpg',
            last_activity_at: new Date(Date.now() - 86400000 * 7).toISOString(),
            view_count: 3,
            interest_level: 'Medium',
            has_viewed_deck: true,
            has_viewed_financials: false,
            profile_url: '#'
         },
         {
            id: 3,
            name: 'Emily Rodriguez (Mock)',
            company: 'Catalyst Fund',
            title: 'Associate',
            avatar_url: 'https://randomuser.me/api/portraits/women/45.jpg',
            last_activity_at: new Date(Date.now() - 86400000 * 15).toISOString(),
            view_count: 2,
            interest_level: 'Low',
            has_viewed_deck: false,
            has_viewed_financials: false,
            profile_url: '#'
        }
    ],
    2: [] // Example for another startup
};

const log = (message: string, data?: any) => {
  console.log(`[MSW Investor Interactions] ${message}`, data || '');
};

export const investorInteractionHandlers = [
  // Intercept POST requests to /rest/v1/rpc/get_interested_investors
  http.post(`${supabaseUrl}/rest/v1/rpc/get_interested_investors`, async ({ request }) => {
    try {
        const body = await request.json() as { startup_param_id?: number };
        const startupId = body?.startup_param_id;

        log('Intercepted RPC get_interested_investors', { startupId });

        if (startupId === undefined || typeof startupId !== 'number') {
            log('Invalid or missing startup_param_id');
            return HttpResponse.json({ message: 'Invalid or missing startup_param_id' }, { status: 400 });
        }

        const investors = mockInterestedInvestorData[startupId] || [];
        log(`Returning mock interested investors for startup ${startupId}:`, investors);

        // RPC calls return the data directly
        return HttpResponse.json(investors, { status: 200 });

    } catch (error) {
        log('Error processing RPC request', error);
        return HttpResponse.json({ message: 'Mock Server Error processing RPC' }, { status: 500 });
    }
  }),

  // --- Add handlers for direct interaction table calls (GET, POST) if needed --- 
]; 