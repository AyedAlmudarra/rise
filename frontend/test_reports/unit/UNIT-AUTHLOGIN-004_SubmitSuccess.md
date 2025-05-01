# Unit Test Case Report: AuthLogin Successful Submission

## Test Case Title
[UNIT-AUTHLOGIN-004] should call Supabase and navigate on successful submit for startup

## Test Case ID
UNIT-AUTHLOGIN-004

## Requirement ID
(Implicit requirement for Login functionality & Role-based redirection)

## Author
Ayed

## Description
Verifies that when a user submits the login form with valid credentials (mocked as a 'startup' user), the component calls the Supabase authentication function, handles the successful response, does not display an error, and navigates the user to the startup dashboard.

## Test Steps
1.  Define mock `User` and `Session` objects conforming to Supabase types, representing a startup user (including `user_metadata: { role: 'startup' }`).
2.  Use `vi.spyOn(supabase.auth, 'signInWithPassword')` to spy on the authentication function and configure it to resolve successfully with the mock user and session data (`{ data: { user: mockUser, session: mockSession }, error: null }`).
3.  Set up `userEvent`.
4.  Render the `AuthLogin` component within a `BrowserRouter`.
5.  Locate email, password, and submit button elements.
6.  Simulate typing valid test credentials into the inputs using `userEvent.type()`.
7.  Simulate clicking the submit button using `userEvent.click()` (wrapped in `act`).
8.  Assert that the `signInWithPassword` spy was called exactly once with the correct email and password.
9.  Use `screen.queryByRole('alert')` to assert that the error Alert component is *not* in the document.
10. Use `waitFor` to asynchronously assert that the mock `navigate` function was called exactly once with the startup dashboard path (`'/startup/dashboard'`).

## Test Script
```typescript
// Test case from frontend/src/views/authentication/authforms/AuthLogin.test.tsx

test('[UNIT-AUTHLOGIN-004] should call Supabase and navigate on successful submit for startup', async () => {
  const user = userEvent.setup();
  const testEmail = 'startup@example.com';
  const testPassword = 'password123';
  
  // Arrange: Mock User and Session (Conforming to Supabase types)
  const mockUser: User = { id: 'mock-startup-id', email: testEmail, user_metadata: { role: 'startup' }, app_metadata: { provider: 'email' }, aud: 'authenticated', created_at: new Date().toISOString(), phone: "", email_confirmed_at: new Date().toISOString(), last_sign_in_at: new Date().toISOString(), role: "authenticated", updated_at: new Date().toISOString(), identities: [], factors: [] };
  const mockSession: Session = { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', expires_in: 3600, token_type: 'bearer', user: mockUser, expires_at: Date.now() / 1000 + 3600 };

  // Arrange: Spy on the actual Supabase client method
  const signInSpy = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({ 
    data: { user: mockUser, session: mockSession }, 
    error: null 
  });

  renderComponent(); 

  const emailInput = screen.getByLabelText(/Email Address/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitButton = screen.getByRole('button', { name: /Sign In/i });

  // Act
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
  expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Check using queryByRole
});
```

## Expected Result
The test passes. Submitting valid credentials triggers the correct API call via the spy, no error message is shown, and navigation to the startup dashboard occurs. 