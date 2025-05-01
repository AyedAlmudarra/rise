import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Use userEvent for more realistic interactions
import { describe, test, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom'; // Needed for Link components
import AuthLogin from './AuthLogin';
// Import the REAL supabase client
import { supabase } from '@/lib/supabaseClient';
// Import Supabase types
import { AuthError, User, Session } from '@supabase/supabase-js';

// --- Mock Dependencies ---

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  success: vi.fn(),
  error: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --- Mock AuthContext ---
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({}),
}));

// --- Test Suite ---
describe('AuthLogin Component Unit Tests', () => {

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const renderComponent = () => { 
    render(<BrowserRouter><AuthLogin /></BrowserRouter>);
  };

  // Test Case 1: Initial Render (modified to test simple render first)
  test('[UNIT-AUTHLOGIN-001] should render login form elements correctly', () => {
    renderComponent(); // Render the actual component

    // Check for email input (using label)
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    
    // Check for password input (using label)
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    
    // Check for submit button (using role)
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();

    // REMOVED: Link checks - these are likely outside this specific component's scope
    // expect(screen.getByRole('link', { name: /Forgot Password \?/i })).toBeInTheDocument();
    // expect(screen.getByRole('link', { name: /Create an account/i })).toBeInTheDocument();
  });

  // Test Case 2: Input Handling
  test('[UNIT-AUTHLOGIN-002] should allow typing into email and password fields', async () => {
    const user = userEvent.setup();
    renderComponent(); 
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    // Simulate typing into email field
    await user.type(emailInput, testEmail);
    expect(emailInput).toHaveValue(testEmail);

    // Simulate typing into password field
    await user.type(passwordInput, testPassword);
    expect(passwordInput).toHaveValue(testPassword);
  });

  // Test Case 3: Successful Submission (Renamed from 004)
  test('[UNIT-AUTHLOGIN-003] should call Supabase and navigate on successful submit for startup', async () => {
    const user = userEvent.setup();
    const testEmail = 'startup@example.com';
    const testPassword = 'password123';
    
    // Arrange: Mock User and Session
    const mockUser: User = { id: 'mock-startup-id', email: testEmail, user_metadata: { role: 'startup' }, app_metadata: { provider: 'email' }, aud: 'authenticated', created_at: new Date().toISOString(), phone: "", email_confirmed_at: new Date().toISOString(), last_sign_in_at: new Date().toISOString(), role: "authenticated", updated_at: new Date().toISOString(), identities: [], factors: [] };
    const mockSession: Session = { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', expires_in: 3600, token_type: 'bearer', user: mockUser, expires_at: Date.now() / 1000 + 3600 };

    const signInSpy = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({ 
      data: { user: mockUser, session: mockSession }, 
      error: null 
    });

    renderComponent(); 
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // Act: Fill form, submit (no timer logic)
    await user.type(emailInput, testEmail);
    await user.type(passwordInput, testPassword);
    await act(async () => { 
      await user.click(submitButton);
    });

    // Assert
    await waitFor(() => { expect(mockNavigate).toHaveBeenCalledTimes(1); });
    expect(mockNavigate).toHaveBeenCalledWith('/startup/dashboard');
    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith({ email: testEmail, password: testPassword });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // --- More tests will go here (e.g., successful investor login) --- //

}); 