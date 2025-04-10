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

export const authHandlers = [
  // Mock Supabase Sign In with Password
  http.post('*/auth/v1/token', async ({ request }) => {
    const body = await request.json();

    // Basic check if it's a password grant type
    if (body && typeof body === 'object' && body.grant_type === 'password') {
        // In a real scenario, you might validate body.email and body.password
        console.log('MSW: Intercepted Supabase Sign In:', body.email);

        // Simulate successful login
        return HttpResponse.json(mockSession, {
            status: 200,
        });
    }

    // If not the expected grant_type or body structure, let it pass through or handle differently
    // For simplicity here, we return a generic error if the grant_type doesn't match
    return HttpResponse.json({ error: 'Invalid grant type for mock' }, { status: 400 });

  }),

  // Add other mock handlers here (e.g., signup, signout)
]; 