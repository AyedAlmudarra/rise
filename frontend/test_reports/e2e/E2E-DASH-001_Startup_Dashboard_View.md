# E2E Test Case Report: Startup Dashboard Content Verification

## Test Case Title
[E2E-DASH-001] should display key startup profile information on the dashboard

## Test Case ID
E2E-DASH-001

## Requirement ID
5 (Startup Dashboard View) - Partial verification

## Author
Ayed

## Description
Verifies that after a startup user logs in, the Startup Dashboard fetches data and displays key profile information (specifically the startup name). This test relies on MSW handlers for authentication and data fetching.

## Test Steps
1.  Navigate to the login page (`/auth/auth1/login`).
2.  Log in using mock startup credentials (`startup@rise.com` / `1234`).
3.  Intercept `GET` requests to the startup data endpoint (`**/rest/v1/startups*`) and alias it as `getStartupData`.
4.  Assert that the current URL includes `/startup/dashboard` (ensuring redirection occurred).
5.  Wait for the intercepted `getStartupData` network request to complete.
6.  Locate the element containing the startup name using `[data-cy="startup-overview-name"]`.
7.  Assert that this element contains the text "Glint Technologies".
8.  Assert that this element is visible.

## Test Script
```typescript
// Test case from frontend/cypress/e2e/auth.cy.ts

it('[E2E-DASH-001] should display key startup profile information on the dashboard', () => {
  // Arrange: Log in as startup user first
  const startupEmail = 'startup@rise.com'; 
  const startupPassword = '1234'; 
  cy.get('[data-cy="login-email-input"]').should('be.visible').type(startupEmail);
  cy.get('[data-cy="login-password-input"]').should('be.visible').type(startupPassword);
  cy.get('[data-cy="login-submit-button"]').should('be.visible').click();

  // Arrange: Intercept the startup data fetch 
  cy.intercept('GET', '**/rest/v1/startups*').as('getStartupData'); 

  // Assert: Wait for navigation and data fetch
  cy.url().should('include', '/startup/dashboard');
  cy.wait('@getStartupData');

  // Assert: Check for the startup name using the data-cy attribute
  cy.get('[data-cy="startup-overview-name"]')
    .should('contain.text', 'Glint Technologies') 
    .and('be.visible'); 
    
  // Add more assertions here for other key info if needed based on Requirement 5 clarification
  // cy.get('[data-cy="startup-overview-industry"]').should('contain.text', 'Fintech'); // Example

  // Assert: Take screenshot on success
  cy.screenshot('E2E-DASH-001-startup-dashboard-content-success');
});
```

## Expected Result
The test case passes successfully. After logging in, the Startup Dashboard loads, fetches data, and the startup name "Glint Technologies" is found and visible within the element identified by `[data-cy="startup-overview-name"]`. 