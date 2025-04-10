import { http, HttpResponse } from 'msw';

// Mock user data (adjust as needed for RISE)
const mockUser = {
  id: 'mock-user-uuid-123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'user@rise.example',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { name: 'Mock RISE User' }, // Add relevant user metadata
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock session data (adjust token/expiry as needed)
const mockSession = {
  access_token: 'mock-access-token-riseriserise',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'mock-refresh-token-supabase',
  user: mockUser,
};

// --- Mock User Definitions ---
const mockUsers = {
  'startup@rise.com': {
    id: 'mock-startup-uuid-1',
    password: '1234', // Use the password you registered with
    email: 'startup@rise.com',
    user_metadata: { full_name: 'Mock Startup User', role: 'startup' },
  },
  'investor@rise.com': {
    id: 'mock-investor-uuid-1',
    password: 'password', // Default password
    email: 'investor@rise.com',
    user_metadata: { full_name: 'Mock Investor User', role: 'investor' },
  },
  // Add other mock users if needed
};

// Helper to create a mock session for a specific user
const createMockSession = (userData: any) => ({
  access_token: `mock-access-${userData.id}-${Date.now()}`,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: `mock-refresh-${userData.id}`,
  user: {
    id: userData.id,
    aud: 'authenticated',
    role: 'authenticated', // Base role
    email: userData.email,
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: userData.user_metadata,
    identities: [],
    created_at: new Date().toISOString(), // Use a fixed date or user creation date if available
    updated_at: new Date().toISOString(),
  },
});

export const authHandlers = [
  // Mock Supabase Sign In with Password
  http.post('*/auth/v1/token', async ({ request }) => {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      console.error("MSW: Error parsing JSON body for /token request:", e);
      // Attempt to read form data as a fallback if JSON fails?
      // For now, return an error if body parsing fails.
       return HttpResponse.json(
          { error: 'invalid_request', error_description: 'Could not parse request body.' },
          { status: 400 }
        );
    }

    console.log("MSW: Received body for /token:", body); // Log the received body

    // --- Check if it looks like a password grant request (RELAXED CHECK) --- 
    // Check primarily for email and password, as grant_type might be missing from body
    if (body && typeof body === 'object' && body.email && body.password) {
      const email = body.email;
      const password = body.password;

      // Log a warning if grant_type is missing, but proceed
      if (!body.grant_type) {
        console.warn("MSW: grant_type missing from /token request body, but email/password present. Proceeding as password grant.");
      } else if (body.grant_type !== 'password') {
         console.warn(`MSW: grant_type in /token body is '${body.grant_type}', expected 'password'. Proceeding as password grant based on email/password presence.`);
      }

      console.log('MSW: Intercepted Password Grant Sign In attempt for:', email);

      // Find the user in our mock list
      const matchedUser = mockUsers[email as keyof typeof mockUsers];

      // Check if user exists and password matches
      if (matchedUser && matchedUser.password === password) {
        console.log('MSW: Mock login successful for:', email);
        const session = createMockSession(matchedUser);
        return HttpResponse.json(session, { status: 200 });
      } else {
        console.log('MSW: Mock login failed (invalid credentials) for:', email);
        return HttpResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid credentials' },
          { status: 400 }
        );
      }
    } 
    // --- Handle other grant types (e.g., refresh token) --- 
    else if (body && typeof body === 'object' && body.grant_type === 'refresh_token') {
        console.log("MSW: Intercepted Refresh Token request. Granting new mock session for default user.");
        // Basic refresh: just return a session for the *first* mock user for simplicity
        // A real mock would validate the refresh token body.refresh_token
        const defaultUserKey = Object.keys(mockUsers)[0] as keyof typeof mockUsers;
        const session = createMockSession(mockUsers[defaultUserKey]);
         return HttpResponse.json(session, { status: 200 });
    }
    // --- Fallback for unsupported grant types or malformed requests ---
    else {
        console.log('MSW: Unsupported grant type or invalid body for /token:', body?.grant_type);
        return HttpResponse.json(
          { error: 'unsupported_grant_type', error_description: 'Grant type not supported or invalid body' },
          { status: 400 }
        );
    }
  }),

  // Mock Supabase Sign Up (Handles role)
  http.post('*/auth/v1/signup', async ({ request }) => {
    const body = await request.json();

    if (body && typeof body === 'object' && body.email && body.password) {
      console.log('MSW: Intercepted Supabase Sign Up:', body.email, 'with data:', body.options?.data);

      const userData = body.options?.data ?? {};
      const role = userData.role || 'authenticated';
      const fullName = userData.full_name || 'New Mock User';

      const newMockUser = {
        id: `mock-uuid-${Date.now()}`,
        aud: 'authenticated',
        role: 'authenticated', // Keep Supabase default role
        email: body.email,
        email_confirmed_at: null, // Simulate confirmation needed
        phone: '',
        confirmed_at: null,
        last_sign_in_at: null,
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
            full_name: fullName,
            role: role, // Store role from options.data
            ...Object.fromEntries(Object.entries(userData).filter(([key]) => key !== 'full_name' && key !== 'role'))
        },
        identities: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return HttpResponse.json({ user: newMockUser, session: null }, { status: 200 });
    }

    return HttpResponse.json({ error: 'Invalid signup request body for mock' }, { status: 400 });
  }),

  // Mock POST to /rest/v1/startups (for startup registration)
  http.post('*/rest/v1/startups', async ({ request }) => {
    const body = await request.json();

    // Helper to parse numeric fields, returning null if invalid/empty
    const parseNumeric = (value: any): number | null => {
      if (value === null || value === undefined || String(value).trim() === '') return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Function to process a single startup data object
    const processStartupData = (data: any): object | null => {
      if (typeof data === 'object' && data !== null && data.user_id && data.name) {
        console.log('MSW: Intercepted POST /rest/v1/startups:', data);
        // Return the data, ensuring numbers are parsed correctly
        return {
          // Keep all incoming fields, including null logo_url/pitch_deck_url
          ...data, 
          num_customers: parseNumeric(data.num_customers),
          num_employees: parseNumeric(data.num_employees),
          annual_revenue: parseNumeric(data.annual_revenue),
          annual_expenses: parseNumeric(data.annual_expenses),
          kpi_cac: parseNumeric(data.kpi_cac),
          kpi_clv: parseNumeric(data.kpi_clv),
          kpi_retention_rate: parseNumeric(data.kpi_retention_rate),
          kpi_conversion_rate: parseNumeric(data.kpi_conversion_rate),
        };
      }
      return null;
    };

    let processedData: object | null = null;

    // Supabase client usually sends an array for insert
    if (Array.isArray(body) && body.length > 0) {
      processedData = processStartupData(body[0]);
    } 
    // Handle single object just in case
    else if (typeof body === 'object' && body !== null) {
      processedData = processStartupData(body);
    }

    // If data was processed successfully
    if (processedData) {
      // Simulate successful insert by returning the processed data in an array
      return HttpResponse.json([processedData], { status: 201 }); // 201 Created
    }

    // If body structure was invalid
    console.error('MSW: Invalid POST /rest/v1/startups body:', body);
    return HttpResponse.json({ error: 'Invalid mock startups insert request body' }, { status: 400 });
  }),

  // Mock POST to /rest/v1/investors (for investor registration)
  http.post('*/rest/v1/investors', async ({ request }) => {
    const body = await request.json();

    // Function to process a single investor data object
    const processInvestorData = (data: any): object | null => {
      if (typeof data === 'object' && data !== null && data.user_id && data.job_title) {
        console.log('MSW: Intercepted POST /rest/v1/investors:', data);
        // Return the data as is (assuming client formats it correctly, e.g., stage array)
        return { ...data };
      }
      return null;
    };

    let processedData: object | null = null;

    // Supabase client usually sends an array for insert
    if (Array.isArray(body) && body.length > 0) {
      processedData = processInvestorData(body[0]);
    } 
    // Handle single object just in case
    else if (typeof body === 'object' && body !== null) {
      processedData = processInvestorData(body);
    }

    // If data was processed successfully
    if (processedData) {
      return HttpResponse.json([processedData], { status: 201 }); // 201 Created
    }

    // If body structure was invalid
    console.error('MSW: Invalid POST /rest/v1/investors body:', body);
    return HttpResponse.json({ error: 'Invalid mock investors insert request body' }, { status: 400 });
  }),

  // Add other mock handlers here (e.g., signout)
]; 