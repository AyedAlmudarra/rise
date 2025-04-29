// Read Supabase URL directly from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("[MSW Investor Handler] VITE_SUPABASE_URL not set.");
}

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