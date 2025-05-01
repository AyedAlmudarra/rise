# Unit Test Case Report: CompanyOverviewCard Loading State

## Test Case Title
[UNIT-COVCARD-002] should render loading skeleton when isLoading is true

## Test Case ID
UNIT-COVCARD-002

## Requirement ID
(Implicit requirement for Startup Dashboard - Overview Card)

## Author
Ayed

## Description
Verifies that the `CompanyOverviewCard` component displays a loading skeleton (specifically an element with the `animate-pulse` class) when the `isLoading` prop is true.

## Test Steps
1. Render the `CompanyOverviewCard` component using the helper function, passing `isLoading: true`.
2. Use `document.querySelector('.animate-pulse')` to find an element containing the loading animation class.
3. Assert that such an element is present in the document.
4. Use `screen.queryByText` to ensure the placeholder text ("Company overview details...") is *not* rendered.
5. Use `screen.queryByTestId` (or similar selector) to ensure the company name element is *not* rendered.
6. Assert that both the placeholder text and company name elements are not present.

## Test Script
```typescript
// Test case from frontend/src/components/dashboards/startup/CompanyOverviewCard.test.tsx

test('[UNIT-COVCARD-002] should render loading skeleton when isLoading is true', () => {
  renderComponent({ isLoading: true });

  // Check for the element with the specific class
  const elementWithPulse = document.querySelector('.animate-pulse');
  expect(elementWithPulse).toBeInTheDocument();

  // Ensure the main content isn't rendered
  expect(screen.queryByText(/Company overview details are not available./i)).not.toBeInTheDocument();
  expect(screen.queryByTestId('startup-overview-name')).not.toBeInTheDocument();
});
```

## Expected Result
The test passes, confirming that the loading skeleton is displayed and other content (placeholder, data) is hidden when `isLoading` is true. 