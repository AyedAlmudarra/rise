# E2E Test Case Report: Successful Investor Login & Redirect

## Test Case Title
[E2E-AUTH-002] should log in an investor user and redirect to the investor dashboard

## Test Case ID
E2E-AUTH-002

## Requirement ID
R01 (Note: Represents core authentication flows)

## Author
Ayed

## Description
Verifies that a user with valid 'investor' credentials can successfully log in via the login form and be redirected to the correct investor dashboard page (`/investor/dashboard`). This test relies on MSW handlers for authentication.

## Test Steps
1.  Navigate to the login page (`/auth/auth1/login`).
2.  Locate the email input field using `[data-cy="login-email-input"]`.
3.  Verify the email input is visible.
4.  Type the mock investor email (`investor@rise.com`) into the email input.
5.  Locate the password input field using `[data-cy="login-password-input"]`.
6.  Verify the password input is visible.
7.  Type the corresponding mock password (`password`) into the password input.
8.  Locate the submit button using `[data-cy="login-submit-button"]`.
9.  Verify the submit button is visible.
10. Click the submit button.
11. Assert that the current URL includes `/investor/dashboard`.

## Test Script
```typescript
// Test case from frontend/cypress/e2e/auth.cy.ts

it('[E2E-AUTH-002] should log in an investor user and redirect to the investor dashboard', () => {
  // Arrange: Use known mock credentials for an investor user
  const investorEmail = 'investor@rise.com';
  const investorPassword = 'password'; 

  // Act: Fill in login form
  cy.get('[data-cy="login-email-input"]').should('be.visible').type(investorEmail);
  cy.get('[data-cy="login-password-input"]').should('be.visible').type(investorPassword);

  // Act: Submit the form
  cy.get('[data-cy="login-submit-button"]').should('be.visible').click();

  // Assert: Check for redirection to the investor dashboard
  cy.url().should('include', '/investor/dashboard');

  // Assert: Take screenshot on success
  cy.screenshot('E2E-AUTH-002-investor-redirect-success'); 
});
```

## Expected Result
The test case passes successfully. The user is redirected to `/investor/dashboard` after submitting valid investor credentials. 