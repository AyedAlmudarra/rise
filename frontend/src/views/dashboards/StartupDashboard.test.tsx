// Unit tests for StartupDashboard.tsx 

import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom'; // Needed if component uses Link/navigation

// Use default import for the component
import StartupDashboard from './StartupDashboard'; 
import { User } from '@supabase/supabase-js'; 
import { StartupProfile } from '@/types/database';
// Import the REAL supabase client
import { supabase } from '@/lib/supabaseClient';
// Import hooks AFTER mocks are defined to get mocked versions
import { useAuth } from '@/context/AuthContext';

// --- Mock Dependencies ---

// Mock useAuth context hook - Define fn inside factory
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock Child Components rendered in success state
vi.mock('@/components/dashboards/startup/CompanyOverviewCard', () => ({
    CompanyOverviewCard: () => <div data-testid="mock-comp-overview">Mock Company Overview</div>
}));
vi.mock('@/components/dashboards/startup/KeyMetricsSection', () => ({
    KeyMetricsSection: () => <div data-testid="mock-key-metrics">Mock Key Metrics</div>
}));
vi.mock('@/components/dashboards/startup/AIInsightsSection', () => ({
    AIInsightsSection: () => <div data-testid="mock-ai-insights">Mock AI Insights</div>
}));
// Assuming RequestAnalysisButton is a direct child and needs mocking
// Adjust path if necessary
vi.mock('@/components/dashboards/startup/RequestAnalysisButton', () => ({
    RequestAnalysisButton: () => <button data-testid="mock-req-analysis">Mock Request Analysis</button>
}));
// Add mocks for FundingReadinessCard, InvestorInterestSection etc. if they are rendered and cause issues

// --- Test Suite ---
describe('StartupDashboard Unit Tests', () => {

  // Type assertion for mocked hooks
  const mockedUseAuth = useAuth as ReturnType<typeof vi.fn>;
  let mockChannel: any;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedUseAuth.mockClear();

    // Mock Supabase channel subscription
    mockChannel = {
      subscribe: vi.fn((_callback) => {
        // Optionally simulate receiving an event if needed for specific tests
        // callback('ok'); 
        return {
          unsubscribe: vi.fn(), // Mock the unsubscribe function
        };
      }),
      // Mock other channel methods if used (e.g., on())
      on: vi.fn().mockReturnThis(), 
    };
    vi.spyOn(supabase, 'channel').mockReturnValue(mockChannel);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper to render the component (will need context/mocks later)
  const renderComponent = () => {
    return render(
      <BrowserRouter> {/* Add necessary Context Providers here later */}
        <StartupDashboard />
      </BrowserRouter>
    );
  };

  // Remove placeholder test [UNIT-STDASH-000]

  test('[UNIT-STDASH-001] should display loading state initially', async () => {
    // Arrange: Mock useAuth 
    const mockUser = { id: 'user-123', email: 'startup@test.com' } as User;
    mockedUseAuth.mockReturnValue({ user: mockUser, loading: false });

    // Arrange: Mock Supabase fetch to be pending
    const pendingPromise = new Promise(() => {}); 
    const mockSingle = vi.fn().mockReturnValue(pendingPromise);
    // Spy on the actual chain and replace the final call
    const mockQuery = { single: mockSingle }; 
    vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn(() => mockQuery) 
    } as any); // Use any for intermediate chain steps

    // Act
    renderComponent();

    // Assert
    const spinner = await screen.findByRole('status'); 
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Company Overview')).not.toBeInTheDocument(); 
    // Check subscription was NOT attempted in loading state (if applicable)
    // expect(supabase.channel).not.toHaveBeenCalled(); 
  });

  test('[UNIT-STDASH-002] should display error state when fetch fails', async () => {
    // Arrange: Mock useAuth 
    const mockUser = { id: 'user-123', email: 'startup@test.com' } as User;
    mockedUseAuth.mockReturnValue({ user: mockUser, loading: false });

    // Arrange: Mock Supabase fetch to reject
    const errorMessage = 'Database connection failed';
    const mockSingle = vi.fn().mockRejectedValue(new Error(errorMessage));
    const mockQuery = { single: mockSingle };
    vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn(() => mockQuery)
    } as any);

    // Act
    renderComponent();

    // Assert: Check for the custom error block text
    expect(await screen.findByText('Error Loading Dashboard')).toBeInTheDocument(); // Check heading
    // Check specific error message part derived from the rejected promise
    expect(await screen.findByText(new RegExp(`Failed to load dashboard data: ${errorMessage}`, 'i'))).toBeInTheDocument();
    // Check for Try Again button associated with the error
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();

    // Assert: Check that main content and loading indicator are NOT present
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Company Overview')).not.toBeInTheDocument(); 
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); 
    // Check subscription was NOT attempted on fetch error
    expect(supabase.channel).not.toHaveBeenCalled();
  });

  test('[UNIT-STDASH-003] should display no profile message when fetch returns null', async () => {
    // Arrange: Mock useAuth 
    const mockUser = { id: 'user-123', email: 'startup@test.com' } as User;
    mockedUseAuth.mockReturnValue({ user: mockUser, loading: false });

    // Arrange: Mock Supabase fetch to resolve with null data
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockQuery = { single: mockSingle };
    vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn(() => mockQuery)
    } as any);

    // Act
    renderComponent();

    // Assert: Check for the specific error message rendered in this case
    expect(await screen.findByText('Error Loading Dashboard')).toBeInTheDocument(); // Same error block heading
    expect(await screen.findByText(/Startup profile not found. Please complete your registration or contact support./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument(); // Also shows Try Again

    // Assert: Check that main content, loading are NOT present
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Company Overview')).not.toBeInTheDocument(); 
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); 
    // Note: queryByRole('alert') would also be null here, so no change needed for that check
    // Check subscription was NOT attempted if profile is null
    expect(supabase.channel).not.toHaveBeenCalled(); 
  });

  test('[UNIT-STDASH-004] should display dashboard content when fetch succeeds', async () => {
    // Arrange: Mock useAuth 
    const mockUser = { id: 'user-123', email: 'startup@test.com' } as User;
    mockedUseAuth.mockReturnValue({ user: mockUser, loading: false });

    // Arrange: Mock StartupProfile data (can be minimal now)
    const mockProfileData: Partial<StartupProfile> = { 
        id: 1, 
        name: 'Mock Startup Ltd',
        // No need for description, industry etc. unless directly used by StartupDashboard itself
    };

    // Arrange: Mock Supabase fetch 
    const mockSingle = vi.fn().mockResolvedValue({ data: mockProfileData, error: null });
    const mockQuery = { single: mockSingle };
    vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn(() => mockQuery)
    } as any);

    // Act
    renderComponent();

    // Assert: Check for Welcome message
    expect(await screen.findByText(/Welcome, Mock Startup Ltd!/i)).toBeInTheDocument();

    // Assert: Check for presence of MOCKED child components using test IDs
    // ONLY check for components in the default active tab ("Overview")
    expect(await screen.findByTestId('mock-comp-overview')).toBeInTheDocument();
    
    // Assert: Check that components in other tabs are NOT present initially
    expect(screen.queryByTestId('mock-key-metrics')).not.toBeInTheDocument(); 
    expect(screen.queryByTestId('mock-ai-insights')).not.toBeInTheDocument();
    // No need to check for mock-req-analysis unless it's also in the first tab 

    // Assert: Check that loading/error/placeholder states are NOT present
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); 
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); 
    expect(screen.queryByText(/Startup profile not found/i)).not.toBeInTheDocument(); 
    // Check that the subscription was attempted
    expect(supabase.channel).toHaveBeenCalledWith(`dashboard_startup_${mockProfileData.id}`);
    expect(mockChannel.subscribe).toHaveBeenCalled();
  });

}); 