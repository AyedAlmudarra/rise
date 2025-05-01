# E2E Test Case Report: Successful Startup Login & Redirect

## Test Case Title
[E2E-AUTH-001] should log in a startup user and redirect to the startup dashboard

## Test Case ID
E2E-AUTH-001

## Requirement ID
R01 (Note: Represents core authentication flows)

## Author
Ayed

## Description
Verifies that a user with valid 'startup' credentials can successfully log in via the login form and be redirected to the correct startup dashboard page (`/startup/dashboard`). This test relies on MSW handlers for authentication.

## Test Steps
1.  Navigate to the login page (`/auth/auth1/login`).
2.  Locate the email input field using `[data-cy="login-email-input"]`.
3.  Verify the email input is visible.
4.  Type the mock startup email (`startup@rise.com`) into the email input.
5.  Locate the password input field using `[data-cy="login-password-input"]`.
6.  Verify the password input is visible.
7.  Type the corresponding mock password (`1234`) into the password input.
8.  Locate the submit button using `[data-cy="login-submit-button"]`.
9.  Verify the submit button is visible.
10. Click the submit button.
11. Assert that the current URL includes `/startup/dashboard`.

## Test Script
```typescript
// Test case from frontend/cypress/e2e/auth.cy.ts

it('[E2E-AUTH-001] should log in a startup user and redirect to the startup dashboard', () => {
  // Arrange: Use known mock credentials for a startup user
  const startupEmail = 'startup@rise.com'; 
  const startupPassword = '1234'; 

  // Act: Fill in login form
  cy.get('[data-cy="login-email-input"]').should('be.visible').type(startupEmail);
  cy.get('[data-cy="login-password-input"]').should('be.visible').type(startupPassword);

  // Act: Submit the form
  cy.get('[data-cy="login-submit-button"]').should('be.visible').click();

  // Assert: Check for redirection to the startup dashboard
  cy.url().should('include', '/startup/dashboard');

  // Assert: Take screenshot on success
  cy.screenshot('E2E-AUTH-001-startup-redirect-success');
});
```

## Expected Result
The test case passes successfully. The user is redirected to `/startup/dashboard` after submitting valid startup credentials. 