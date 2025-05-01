# E2E Test Case Report: Investor Dashboard Content Verification

## Test Case Title
[E2E-DASH-002] should display key investor profile information on the dashboard

## Test Case ID
E2E-DASH-002

## Requirement ID
(Note: Add relevant requirement ID for Investor Dashboard View if available, otherwise TBD)

## Author
Ayed

## Description
Verifies that after an investor user logs in, the Investor Dashboard fetches data and displays key profile information (specifically the investor title and company name). This test relies on MSW handlers for authentication and data fetching.

## Test Steps
1.  Navigate to the login page (`/auth/auth1/login`).
2.  Log in using mock investor credentials (`investor@rise.com` / `password`).
3.  Intercept `GET` requests to the investor data endpoint (`**/rest/v1/investors*`) and alias it as `getInvestorData`.
4.  Assert that the current URL includes `/investor/dashboard` (ensuring redirection occurred).
5.  Wait for the intercepted `getInvestorData` network request to complete.
6.  Locate the element containing the investor title/company using `[data-cy="investor-profile-title-company"]`.
7.  Assert that this element contains the text "Investment Analyst at Future Ventures Capital".
8.  Assert that this element is visible.

## Test Script
```typescript
// Test case from frontend/cypress/e2e/auth.cy.ts

it('[E2E-DASH-002] should display key investor profile information on the dashboard', () => {
  // Arrange: Log in as investor user first
  const investorEmail = 'investor@rise.com';
  const investorPassword = 'password'; 
  cy.get('[data-cy="login-email-input"]').should('be.visible').type(investorEmail);
  cy.get('[data-cy="login-password-input"]').should('be.visible').type(investorPassword);
  cy.get('[data-cy="login-submit-button"]').should('be.visible').click();

  // Arrange: Intercept the investor data fetch 
  cy.intercept('GET', '**/rest/v1/investors*').as('getInvestorData');

  // Assert: Wait for navigation and data fetch
  cy.url().should('include', '/investor/dashboard');
  cy.wait('@getInvestorData');

  // Assert: Check for the investor title/company using the data-cy attribute
  cy.get('[data-cy="investor-profile-title-company"]')
    .should('contain.text', 'Investment Analyst at Future Ventures Capital')
    .and('be.visible');
    
  // Add more assertions here for other key info if needed

  // Assert: Take screenshot on success
  cy.screenshot('E2E-DASH-002-investor-dashboard-content-success');
});
```

## Expected Result
The test case passes successfully. After logging in, the Investor Dashboard loads, fetches data, and the investor title/company "Investment Analyst at Future Ventures Capital" are found and visible within the element identified by `[data-cy="investor-profile-title-company"]`. 