# Unit Test Case Report: CompanyOverviewCard Data Display

## Test Case Title
[UNIT-COVCARD-004] should render startup data correctly when provided

## Test Case ID
UNIT-COVCARD-004

## Requirement ID
(Implicit requirement for Startup Dashboard - Overview Card)

## Author
Ayed

## Description
Verifies that the `CompanyOverviewCard` component correctly displays startup information (name, description, badges, logo) when valid `startupData` is provided and it is not loading or in an error state. Accounts for potential duplicate icons associated with badges.

## Test Steps
1.  Define a mock `StartupProfile` object (`mockData`) with relevant test data, casting to `any` to bypass strict type checking for unused fields.
2.  Mock the `@tabler/icons-react` components used for badges (`IconBuildingSkyscraper`, `IconCategory`, `IconMapPin`) to render simple SVGs with unique `data-testid` attributes.
3.  Render the `CompanyOverviewCard` component using the helper function, passing `mockData` to the `startupData` prop.
4.  Use `screen.getByText` to assert that the company name and description are displayed.
5.  For each expected badge:
    *   Locate the corresponding mocked icon(s) using `screen.getByTestId` or `screen.getAllByTestId`.
    *   If multiple icons are found, use `.find()` to identify the correct icon based on its `parentElement`'s text content.
    *   Assert that the `parentElement` of the uniquely identified icon has the correct text content (e.g., "Growth Stage", "Testing & QA", "Testville").
6.  Use `screen.getByAltText` to locate the company logo image.
7.  Assert that the logo is in the document and has the correct `src` attribute from `mockData`.
8.  Assert that elements corresponding to loading (`.animate-pulse`), error (`/Error loading data:/i`), and placeholder (`/Company overview details.../i`) states are *not* present in the document.

## Test Script
```typescript
// Test case from frontend/src/components/dashboards/startup/CompanyOverviewCard.test.tsx

// Includes vi.mock for @tabler/icons-react

test('[UNIT-COVCARD-004] should render startup data correctly when provided', () => {
  // Define mock data with relevant fields, cast to any initially
  const mockData: any = { /* ... mock data fields ... */ };

  renderComponent({ startupData: mockData, isLoading: false, error: null });

  // Check for key data points
  expect(screen.getByText('Test Startup Inc.')).toBeInTheDocument();
  expect(screen.getByText(/A revolutionary new testing framework./i)).toBeInTheDocument();
  
  // --- Find specific badges using icons + parent text --- 
  
  // Growth Stage (Assuming icon-building is unique)
  const buildingIcon = screen.getByTestId('icon-building');
  expect(buildingIcon.parentElement).toHaveTextContent('Growth Stage');

  // Testing & QA (IconCategory might be duplicated)
  const categoryIcons = screen.getAllByTestId('icon-category');
  const testingQaBadgeParent = categoryIcons.find(icon => 
    icon.parentElement?.textContent?.includes('Testing & QA')
  )?.parentElement;
  expect(testingQaBadgeParent).toBeInTheDocument(); 
  expect(testingQaBadgeParent).toHaveTextContent('Testing & QA');

  // Testville (IconMapPin might be duplicated)
  const mapPinIcons = screen.getAllByTestId('icon-map-pin');
  const testvilleBadgeParent = mapPinIcons.find(icon => 
    icon.parentElement?.textContent?.includes('Testville')
  )?.parentElement;
  expect(testvilleBadgeParent).toBeInTheDocument(); // Ensure we found the parent
  expect(testvilleBadgeParent).toHaveTextContent('Testville');
  // --- End badge checks ---
  
  const logo = screen.getByAltText(/Test Startup Inc. logo/i);
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute('src', mockData.logo_url);

  // Ensure loading/error/placeholder states are not shown
  expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
  expect(screen.queryByText(/Error loading data:/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Company overview details are not available./i)).not.toBeInTheDocument();
});
```

## Expected Result
The test passes, confirming that key startup data points (name, description, badges, logo) are correctly displayed when valid data is provided, and that other states (loading, error, placeholder) are hidden. 