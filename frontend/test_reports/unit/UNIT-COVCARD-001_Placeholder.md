# Unit Test Case Report: CompanyOverviewCard Placeholder State

## Test Case Title
[UNIT-COVCARD-001] should render placeholder when no startup data is provided

## Test Case ID
UNIT-COVCARD-001

## Requirement ID
(Implicit requirement for Startup Dashboard - Overview Card)

## Author
Ayed

## Description
Verifies that the `CompanyOverviewCard` component displays a placeholder message when the `startupData` prop is null and it is not in a loading or error state.

## Test Steps
1. Render the `CompanyOverviewCard` component using the helper function, explicitly passing `startupData: null`, `isLoading: false`, and `error: null`.
2. Use `screen.getByText` to locate the placeholder text "Company overview details are not available.".
3. Assert that the placeholder text is present in the document.
4. Use `screen.queryByTestId` (or `queryByAttribute`) to ensure the element intended to display the company name (e.g., `data-testid="startup-overview-name"`) is *not* rendered.
5. Assert that the company name element is not present in the document.

## Test Script
```typescript
// Test case from frontend/src/components/dashboards/startup/CompanyOverviewCard.test.tsx

test('[UNIT-COVCARD-001] should render placeholder when no startup data is provided', () => {
  renderComponent({ startupData: null, isLoading: false, error: null });

  // Check for the fallback text
  expect(screen.getByText(/Company overview details are not available./i)).toBeInTheDocument();
  
  // Check that the main company name element is NOT rendered in this case
  expect(screen.queryByTestId('startup-overview-name')).not.toBeInTheDocument(); 
});
```

## Expected Result
The test passes, confirming that the correct placeholder message is displayed and primary data elements are absent when no startup data is provided. 