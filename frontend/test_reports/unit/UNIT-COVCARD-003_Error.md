# Unit Test Case Report: CompanyOverviewCard Error State

## Test Case Title
[UNIT-COVCARD-003] should render error message when error prop is provided

## Test Case ID
UNIT-COVCARD-003

## Requirement ID
(Implicit requirement for Startup Dashboard - Overview Card)

## Author
Ayed

## Description
Verifies that the `CompanyOverviewCard` component displays a specific error message when the `error` prop contains an error string.

## Test Steps
1. Define a test error message string.
2. Render the `CompanyOverviewCard` component using the helper function, passing the error string to the `error` prop.
3. Use `screen.getByText` with a regular expression to locate the text containing "Error loading data: {errorMessage}".
4. Assert that the error message text is present in the document.
5. Use `document.querySelector` to ensure the loading skeleton (`.animate-pulse`) is *not* rendered.
6. Use `screen.queryByText` to ensure the placeholder text ("Company overview details...") is *not* rendered.
7. Use `screen.queryByTestId` (or similar selector) to ensure the company name element is *not* rendered.
8. Assert that the loading skeleton, placeholder text, and company name elements are not present.

## Test Script
```typescript
// Test case from frontend/src/components/dashboards/startup/CompanyOverviewCard.test.tsx

test('[UNIT-COVCARD-003] should render error message when error prop is provided', () => {
  const errorMessage = 'Failed to fetch profile';
  renderComponent({ error: errorMessage });

  // Check for the error message text
  expect(screen.getByText(new RegExp(`Error loading data: ${errorMessage}`, 'i'))).toBeInTheDocument();

  // Ensure the main content and loading/placeholder aren't rendered
  expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
  expect(screen.queryByText(/Company overview details are not available./i)).not.toBeInTheDocument();
  expect(screen.queryByTestId('startup-overview-name')).not.toBeInTheDocument();
});
```

## Expected Result
The test passes, confirming that the correct error message is displayed and other content (placeholder, data, loading) is hidden when an error string is provided. 