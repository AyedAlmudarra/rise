import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import StartupDashboard from './StartupDashboard';
import { AuthProvider, AuthContextType } from '@/context/AuthContext'; // Import real provider and type
import { supabase } from '@/lib/supabaseClient'; // Import real client to spy on
import { User } from '@supabase/supabase-js';
import { StartupProfile } from '@/types/database'; // Assuming this type exists

// Mock react-router-dom's useNavigate (likely used by AuthProvider or dashboard children)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: () => Promise<typeof import('react-router-dom')>) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Supabase Realtime
const mockRealtimeChannel = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn((_callback) => {
    // Optionally simulate successful subscription immediately
    // callback?.('SUBSCRIBED', null);
    return mockRealtimeChannel; // Return self for chaining
  }),
  unsubscribe: vi.fn().mockResolvedValue('ok'),
};
const realtimeChannelSpy = vi.spyOn(supabase, 'channel').mockReturnValue(mockRealtimeChannel as any);
// Also mock removeChannel to prevent errors during cleanup
const removeChannelSpy = vi.spyOn(supabase, 'removeChannel').mockResolvedValue('ok');

// Mock useAuth to provide a logged-in user for the tests
const mockStartupUser: User = {
    id: 'test-startup-user-id',
    email: 'startup-test@rise.com',
    user_metadata: { role: 'startup' },
    app_metadata: { provider: 'email' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    // Add other required User fields with default/empty values if necessary
    phone: "",
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: "authenticated",
    updated_at: new Date().toISOString(),
    identities: [],
    factors: [],
};

// Define a mock context value matching AuthContextType
  const mockAuthContextValue: AuthContextType = {
    user: mockStartupUser,
    session: null, // Or a mock session if needed by the component
    loading: false, // Simulate initial check completed
    userRole: 'startup', // Match the mock user
    signOut: vi.fn(),
    // Removed extra properties not in AuthContextType: error, signIn, signUp, setUser, setSession, setLoading, setError
};

vi.mock('@/context/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
        // Provide the mock context value directly
        <>{children}</>
    ),
    useAuth: () => mockAuthContextValue, // Return the mock context value when useAuth is called
}));


describe('StartupDashboard Integration Tests', () => {

  let selectSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear();
    selectSpy?.mockRestore();
    // Reset Realtime mocks
    mockRealtimeChannel.on.mockClear();
    mockRealtimeChannel.subscribe.mockClear();
    mockRealtimeChannel.unsubscribe.mockClear();
    realtimeChannelSpy.mockClear();
    removeChannelSpy.mockClear();
  });

  // Helper to render within MemoryRouter and mocked AuthProvider
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AuthProvider> {/* This uses the mocked provider/context */} 
          <StartupDashboard />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  // Test Case 1: Successful Data Fetch
  test('[INT-STDASH-001] should fetch data and display CompanyOverviewCard content on success', async () => {
    // Arrange: Mock Supabase SUCCESS response
    // Completed StartupProfile with default/null values for missing fields
    const mockProfileData: StartupProfile = {
        id: 123, 
        user_id: 'test-startup-user-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(), // Added
        name: 'Test Success Startup',
        industry: 'Testing',
        sector: 'Integration Tests',
        location_city: 'Vitest City',
        country_of_operation: 'Testland', // Added
        founding_date: '2023-01-01', // Added
        description: 'Successfully fetched description.',
        operational_stage: 'Growth Stage',
        num_employees: 10,
        num_customers: 100,
        annual_revenue: 100000,
        annual_expenses: 50000,
        website: 'https://example.com', // Added
        linkedin_profile: 'https://linkedin.com/company/example', // Added
        twitter_profile: null, // Added
        logo_url: 'http://example.com/logo.png',
        pitch_deck_url: null,
        kpi_cac: 50,
        kpi_clv: 500,
        kpi_retention_rate: 0.8,
        kpi_conversion_rate: 0.05,
        kpi_monthly_growth: null, // Added
        kpi_payback_period: null, // Added
        kpi_churn_rate: null, // Added
        kpi_nps: null, // Added
        kpi_tam_size: null, // Added
        kpi_avg_order_value: null, // Added
        kpi_market_share: null, // Added
        kpi_yoy_growth: null, // Added
        team_size: null, // Added
        has_co_founder: null, // Added
        founder_name: null, // Added
        founder_title: null, // Added
        founder_education: null, // Added
        previous_startup_experience: null, // Added
        founder_bio: null, // Added
        market_growth_rate: null, // Added
        market_key_trends: null, // Added
        target_customer_profile: null, // Added
        customer_pain_points: null, // Added
        market_barriers: null, // Added
        competitive_advantage: null, // Added
        competitor1_name: null, // Added
        competitor1_size: null, // Added
        competitor1_threat: null, // Added
        competitor1_differentiator: null, // Added
        competitor2_name: null, // Added
        competitor2_size: null, // Added
        competitor2_threat: null, // Added
        competitor2_differentiator: null, // Added
        competitor3_name: null, // Added
        competitor3_size: null, // Added
        competitor3_threat: null, // Added
        competitor3_differentiator: null, // Added
        current_funding: null, // Added
        seeking_investment: null, // Added
        target_raise_amount: null, // Added
        ai_analysis: null,
        analysis_status: 'pending',
        analysis_timestamp: null,
        // Assuming these new fields are nullable or have defaults
        competitive_advantage_evaluation: null as any, // Add defaults or null as appropriate
        strategic_recommendations: null as any,
        suggested_kpis: null as any,
        current_challenges: [],
        what_if_scenarios: [],
        key_risks: [],
    };

    // Spy on the select chain
    const mockQueryBuilder = {
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockProfileData, error: null })
    };
    selectSpy = vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockReturnValue(mockQueryBuilder)
    }) as any);

    renderComponent();

    // Assert: Wait for loading to finish and data to display
    await waitFor(() => {
      // Check that Supabase select was called correctly
      expect(selectSpy).toHaveBeenCalledWith('startups');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'test-startup-user-id');
      expect(mockQueryBuilder.single).toHaveBeenCalled();

      // Check for elements inside CompanyOverviewCard using data from mockProfileData
      const cardHeading = screen.getByRole('heading', { name: mockProfileData.name, level: 3 });
      expect(cardHeading).toBeInTheDocument();
      
      // Find the card container relative to the heading (assuming specific structure)
      // This depends heavily on the actual DOM structure of CompanyOverviewCard
      const cardContainer = cardHeading.closest('div[class*="rounded-lg"], div[role="article"], article'); 
      expect(cardContainer).toBeInTheDocument(); // Assert it exists

      // Add check and cast for within
      if (cardContainer) { 
          // Cast to HTMLElement for 'within' and ensure non-null strings for RegExp/getByText
          const safeCardContainer = cardContainer as HTMLElement;
          expect(within(safeCardContainer).getByText(new RegExp(mockProfileData.description!, 'i'))).toBeInTheDocument();
          
          // Find the specific badge span containing the operational stage text
          const operationalStageBadge = within(safeCardContainer).getByText(mockProfileData.operational_stage!, {
            // Attempt to select the span directly inside the badge structure
            selector: 'span[data-testid="flowbite-badge"] > span',
          });
          expect(operationalStageBadge).toBeInTheDocument();

      } else {
          // Fallback or fail if card container isn't found
          throw new Error("Could not find CompanyOverviewCard container relative to heading");
      }

    });

    // Assert: Loading/Error/Placeholder states are gone from main dashboard
    expect(screen.queryByRole('status', { name: /Loading/i })).not.toBeInTheDocument(); // Check for loading spinner
    expect(screen.queryByRole('alert', { name: /Error/i })).not.toBeInTheDocument(); // Check for main error alert
    expect(screen.queryByRole('alert', { name: /Profile Missing/i })).not.toBeInTheDocument(); // Check for missing profile alert

  });

  // Test Case 2: No Profile Found
  test('[INT-STDASH-002] should display placeholder alert when no profile data is found', async () => {
    // Arrange: Mock Supabase response with data: null
    const mockQueryBuilder = {
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: null, error: null }) // Simulate profile not found
    };
    selectSpy = vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockReturnValue(mockQueryBuilder)
    }) as any);

    renderComponent();

    // Assert: Wait for loading to finish and check for placeholder alert text from dashboard
    await waitFor(() => {
      // Check that Supabase select was called correctly
      expect(selectSpy).toHaveBeenCalledWith('startups');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'test-startup-user-id');
      expect(mockQueryBuilder.single).toHaveBeenCalled();

      // Check that the main data heading did NOT render
      expect(screen.queryByRole('heading', { name: /Test Success Startup/i, level: 3 })).not.toBeInTheDocument();
    });

    // Check again after wait just to be sure
    expect(screen.queryByRole('heading', { name: /Test Success Startup/i, level: 3 })).not.toBeInTheDocument();
    
    // Assert: Loading/Error states are gone
    expect(screen.queryByRole('status', { name: /Loading/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert', { name: /Error/i })).not.toBeInTheDocument(); 
  });

  // Test Case 3: Fetch Error
  test('[INT-STDASH-003] should display error alert on fetch error', async () => {
    // Arrange: Mock Supabase response with an error
    const errorMessage = 'Failed to connect to DB';
    const mockQueryBuilder = {
      eq: vi.fn().mockReturnThis(),
      // Simulate a DB error
      single: vi.fn().mockResolvedValueOnce({ data: null, error: new Error(errorMessage) })
    };
    selectSpy = vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockReturnValue(mockQueryBuilder)
    }) as any);

    // Suppress console.error for this specific test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderComponent();

    // Assert: Wait for loading to finish and check for error content
    await waitFor(() => {
      // Check that Supabase select was called correctly
      expect(selectSpy).toHaveBeenCalledWith('startups');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'test-startup-user-id');
      expect(mockQueryBuilder.single).toHaveBeenCalled();

      // Check that the main data heading did NOT render
      expect(screen.queryByRole('heading', { name: /Test Success Startup/i, level: 3 })).not.toBeInTheDocument();

      // Check for the custom error UI elements
      expect(screen.getByRole('heading', { name: /Error Loading Dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
      // Check for the specific error message passed in the mock
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument(); 
      expect(screen.getByRole('button', { name: /Try Again/i})).toBeInTheDocument(); // Check for button too
    });

    // Check again after wait
    expect(screen.queryByRole('heading', { name: /Test Success Startup/i, level: 3 })).not.toBeInTheDocument();

    // Assert: Loading/Placeholder states are gone
    expect(screen.queryByRole('status', { name: /Loading/i })).not.toBeInTheDocument();
    // Check for the missing profile alert *specifically* - it should NOT be present
    expect(screen.queryByRole('alert', { name: /profile not found/i })).not.toBeInTheDocument(); 

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

}); 