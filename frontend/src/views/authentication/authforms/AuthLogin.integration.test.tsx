// Import ReactNode from react
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest'; // Removed MockedFunction import
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Using MemoryRouter can be simpler for controlling routes in tests
import AuthLogin from './AuthLogin';
import { AuthProvider } from '@/context/AuthContext'; // Import the REAL provider
import { supabase } from '@/lib/supabaseClient'; // Import the REAL client to spy on
import { User, Session, AuthError } from '@supabase/supabase-js';
import toast from 'react-hot-toast'; // Import toast and necessary types

// --- Mock react-router-dom's useNavigate ---
// We still mock navigate because AuthProvider likely uses it internally after state update
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: () => Promise<typeof import('react-router-dom')>) => {
  const actual = await importOriginal();
  return {
    ...actual, // Use actual BrowserRouter/MemoryRouter etc.
    useNavigate: () => mockNavigate, // Only mock useNavigate
  };
});

// --- Test Suite ---
describe('AuthLogin Component Integration Tests', () => {

  // Use explicit 'any' to resolve complex type inference issues with spies
  let signInSpy: any;
  let toastSuccessSpy: any;
  let toastErrorSpy: any;

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockClear();

    // --- Spy on toast methods instead of global mock ---
    // Mock implementation now returns a dummy string ID
    toastSuccessSpy = vi.spyOn(toast, 'success').mockImplementation(() => 'mock-toast-id');
    toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 'mock-toast-id');

    // Clear Supabase spy if needed (restored automatically by Vitest spyOn after test)
    // if (signInSpy) {
    //   signInSpy.mockRestore(); // Vitest typically handles spy restoration
    // }
  });

  // Optional: Restore spies if needed, though Vitest usually handles it for spies created in beforeEach
  // afterEach(() => {
  //   toastSuccessSpy?.mockRestore();
  //   toastErrorSpy?.mockRestore();
  // });

  // Helper to render AuthLogin within the actual AuthProvider and a Router
  const renderWithProviders = () => {
    // Using MemoryRouter to avoid actual browser history manipulation
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthLogin />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  // Test Case: Successful Startup Login Integration
  test('[INT-AUTHLOGIN-001] should update context and navigate on successful startup login', async () => {
    const user = userEvent.setup();
    const testEmail = 'startup@example.com';
    const testPassword = 'password123';

    // Arrange: Mock Supabase SUCCESS response for STARTUP
    const mockUser: User = { id: 'mock-startup-id', email: testEmail, user_metadata: { role: 'startup' }, app_metadata: {}, aud: 'authenticated', created_at: '' }; // Simplified mock
    const mockSession: Session = { access_token: 'a', refresh_token: 'b', expires_in: 3600, token_type: 'bearer', user: mockUser }; // Simplified mock
    // Assign the spy directly without prior declaration type issues
    signInSpy = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({ data: { user: mockUser, session: mockSession }, error: null });

    renderWithProviders();

    // Act: Wait for form elements to appear, then fill and submit
    await waitFor(async () => {
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(emailInput, testEmail);
      await user.type(passwordInput, testPassword);
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Sign In/i }));
      });
    });

    // Assert
    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith({ email: testEmail, password: testPassword });

    // Wait for navigation (triggered by AuthProvider state change)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/app/startup/dashboard');

    // Optional: Check for success toast using the spy
    // await waitFor(() => expect(toastSuccessSpy).toHaveBeenCalled()); 
    expect(toastErrorSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // No error alert in the form itself
  });

  // --- Add tests for Investor Success and Failure --- //

  // Test Case: Successful Investor Login Integration
  test('[INT-AUTHLOGIN-002] should update context and navigate on successful investor login', async () => {
    const user = userEvent.setup();
    const testEmail = 'investor@example.com';
    const testPassword = 'password456';

    // Arrange: Mock Supabase SUCCESS response for INVESTOR
    const mockUser: User = { id: 'mock-investor-id', email: testEmail, user_metadata: { role: 'investor' }, app_metadata: {}, aud: 'authenticated', created_at: '' }; // Simplified mock
    const mockSession: Session = { access_token: 'c', refresh_token: 'd', expires_in: 3600, token_type: 'bearer', user: mockUser }; // Simplified mock
    // Assign the spy directly
    signInSpy = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({ data: { user: mockUser, session: mockSession }, error: null });

    renderWithProviders();

    // Act: Wait for form elements to appear, then fill and submit
    await waitFor(async () => {
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(emailInput, testEmail);
      await user.type(passwordInput, testPassword);
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Sign In/i }));
      });
    });

    // Assert
    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith({ email: testEmail, password: testPassword });

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/app/investor/dashboard');

    expect(toastErrorSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // Test Case: Failed Login Integration
  test('[INT-AUTHLOGIN-003] should show error alert and no navigation on failed login', async () => {
    const user = userEvent.setup();
    const testEmail = 'failure@example.com';
    const testPassword = 'badpassword';
    const errorMessage = 'Invalid credentials provided.';

    // Arrange: Mock Supabase FAILURE response
    // Assign the spy directly
    signInSpy = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({ data: { user: null, session: null }, error: new AuthError(errorMessage) });

    renderWithProviders();

    // Act: Wait for form elements to appear, then fill and submit
    await waitFor(async () => {
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(emailInput, testEmail);
      await user.type(passwordInput, testPassword);
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /Sign In/i }));
      });
    });

    // Assert
    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith({ email: testEmail, password: testPassword });

    // Wait for inline error alert instead of toast
    await waitFor(() => {
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveTextContent(errorMessage);
      // Check toast spy was NOT called
      // expect(toastErrorSpy).not.toHaveBeenCalled(); 
    });

    // Ensure navigation did NOT happen
    expect(mockNavigate).not.toHaveBeenCalled();

    // Ensure no success toast
    expect(toastSuccessSpy).not.toHaveBeenCalled();
  });

}); 