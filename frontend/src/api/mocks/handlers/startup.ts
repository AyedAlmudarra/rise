// Import the StartupProfile type

// Read Supabase URL directly from environment variables for mocking
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("[MSW Startup Handler] VITE_SUPABASE_URL environment variable not set. Mock handler cannot intercept requests.");
}

export const startupHandlers = [
  // Intercept GET requests to /rest/v1/startups for single record fetch by user_id
  /* DISABLED for Task 10 to allow real profile fetching
  http.get(`${supabaseUrl}/rest/v1/startups`, ({ request }) => {
    const url = new URL(request.url);
    const selectParam = url.searchParams.get('select');
    const userIdEq = url.searchParams.get('user_id'); // Gets 'eq.mock-startup-uuid-1'

    // Check if it's a single fetch by user_id (mimics .single())
    const isSingleFetchByUserId = selectParam === '*' && userIdEq && userIdEq.startsWith('eq.');

    if (isSingleFetchByUserId) {
      const requestedUserId = userIdEq.split('eq.')[1];
      console.log(`[MSW Startup Handler] Intercepted GET /startups for user_id: ${requestedUserId}`);

      const profile = mockStartupProfiles[requestedUserId];

      if (profile) {
        console.log('[MSW Startup Handler] Found mock startup profile, returning 200');
        // Supabase .single() returns the object directly, not in an array
        return HttpResponse.json(profile, { status: 200 });
      } else {
        console.log('[MSW Startup Handler] Mock startup profile not found, returning 406');
        // Mimic .single() not finding a row
        return HttpResponse.json(
          { message: 'JSON object requested, multiple (or no) rows returned', code: 'PGRST116', details: null, hint: 'Results contain 0 rows' },
          { status: 406 } // Not Acceptable
        );
      }
    }

    // If it's not the specific fetch we want to mock, return error
    console.warn('MSW: Unmatched GET /startups request:', request.url);
    return HttpResponse.json({ error: 'MSW: Unhandled GET /startups request' }, { status: 400 });
  }),
  */

  // Intercept POST requests to Supabase /rest/v1/startups
  /* --- DISABLED: Task 9 connects registration directly to Supabase --- 
  http.post(`${supabaseUrl}/rest/v1/startups`, async ({ request }) => {
    try {
      const requestBody = await request.json();
      console.log('[MSW Startup Handler] Received startup registration request:', requestBody);

      // --- Mock Success Response ---
      // Supabase typically returns the inserted data in an array on success
      // We can simulate this. We might need to add a mock `id` and timestamps.
      const mockInsertedData = {
        ...(requestBody as Record<string, any>),
        id: Math.floor(Math.random() * 10000) + 1, // Example ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Add null placeholders for any fields expected by the table but maybe not sent
        // (like logo_url, pitch_deck_url if not handled yet)
        logo_url: null,
        pitch_deck_url: null,
      };

      console.log('[MSW Startup Handler] Simulating successful insertion with data:', mockInsertedData);

      return HttpResponse.json([mockInsertedData], {
        status: 201, // HTTP 201 Created
        headers: {
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      console.log('[MSW Startup Handler] Error processing startup registration request:', error);
      return HttpResponse.json(
        { message: 'Mock Server Error: Failed to process startup registration', error },
        { status: 500 }
      );
    }
  }),
  */

  // --- Add other startup-related handlers here if needed (e.g., PUT) ---
]; 