import { http, HttpResponse } from 'msw';

// Read Supabase URL directly from environment variables for mocking
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("[MSW Startup Handler] VITE_SUPABASE_URL environment variable not set. Mock handler cannot intercept requests.");
}

// Helper function to log with context (optional, but good practice)
const log = (message: string, data?: any) => {
  console.log(`[MSW Startup Handler] ${message}`, data || '');
};

export const startupHandlers = [
  // Intercept POST requests to Supabase /rest/v1/startups
  http.post(`${supabaseUrl}/rest/v1/startups`, async ({ request }) => {
    try {
      const requestBody = await request.json();
      log('Received startup registration request:', requestBody);

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

      log('Simulating successful insertion with data:', mockInsertedData);

      return HttpResponse.json([mockInsertedData], {
        status: 201, // HTTP 201 Created
        headers: {
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      log('Error processing startup registration request:', error);
      return HttpResponse.json(
        { message: 'Mock Server Error: Failed to process startup registration', error },
        { status: 500 }
      );
    }
  }),

  // --- Add other startup-related handlers here if needed (e.g., GET, PUT) ---
]; 