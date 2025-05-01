import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { CompanyOverviewCard } from './CompanyOverviewCard';
import { StartupProfile } from 'src/types/database'; // Import the type

// Mock Tabler Icons used in badges
vi.mock('@tabler/icons-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tabler/icons-react')>();
  return {
    ...actual, // Keep other icons if needed elsewhere
    IconBuildingSkyscraper: () => <svg data-testid="icon-building" />, 
    IconCategory: () => <svg data-testid="icon-category" />, 
    IconMapPin: () => <svg data-testid="icon-map-pin" />, 
    // Add mocks for other icons used in the component if assertions are needed for them
  };
});

describe('CompanyOverviewCard Unit Tests', () => {

  // Helper function to render with props
  const renderComponent = (props: Partial<React.ComponentProps<typeof CompanyOverviewCard>> = {}) => {
    const defaultProps: React.ComponentProps<typeof CompanyOverviewCard> = {
      startupData: null,
      isLoading: false,
      error: null,
    };
    // Ensure startupData passed matches the expected type, even if mock is partial
    const finalProps = { ...defaultProps, ...props };
    if (finalProps.startupData) {
      finalProps.startupData = finalProps.startupData as StartupProfile;
    }
    return render(<CompanyOverviewCard {...finalProps} />);
  };

  test('[UNIT-COVCARD-001] should render placeholder when no startup data is provided', () => {
    renderComponent({ startupData: null, isLoading: false, error: null });

    // Check for the fallback text
    expect(screen.getByText(/Company overview details are not available./i)).toBeInTheDocument();
    
    // Check that the main company name element is NOT rendered in this case
    expect(screen.queryByTestId('startup-overview-name')).not.toBeInTheDocument(); 
  });

  test('[UNIT-COVCARD-002] should render loading skeleton when isLoading is true', () => {
    renderComponent({ isLoading: true });

    // The loading state uses a CardBox with animate-pulse class
    // Or more directly, check for the element with the specific class if getByRole is unreliable
    const elementWithPulse = document.querySelector('.animate-pulse');
    expect(elementWithPulse).toBeInTheDocument();

    // Ensure the main content isn't rendered
    expect(screen.queryByText(/Company overview details are not available./i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('startup-overview-name')).not.toBeInTheDocument();
  });

  test('[UNIT-COVCARD-003] should render error message when error prop is provided', () => {
    const errorMessage = 'Failed to fetch profile';
    renderComponent({ error: errorMessage });

    // Check for the error message text
    // Using stringContaining because the component adds prefix text
    expect(screen.getByText(new RegExp(`Error loading data: ${errorMessage}`, 'i'))).toBeInTheDocument();

    // Ensure the main content and loading/placeholder aren't rendered
    expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    expect(screen.queryByText(/Company overview details are not available./i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('startup-overview-name')).not.toBeInTheDocument();
  });

  test('[UNIT-COVCARD-004] should render startup data correctly when provided', () => {
    // Define mock data with relevant fields, cast to any initially
    const mockData: any = { // Cast to any to allow partial mock
      id: 123, 
      user_id: 'user-abc',
      name: 'Test Startup Inc.',
      description: 'A revolutionary new testing framework.',
      industry: 'Software',
      sector: 'Testing & QA',
      operational_stage: 'Growth Stage',
      location_city: 'Testville',
      num_customers: 1000, 
      num_employees: 50,   
      annual_revenue: 5000000, 
      annual_expenses: 2000000, 
      kpi_cac: 500,        
      kpi_clv: 5000,       
      kpi_retention_rate: 85, 
      kpi_conversion_rate: 5, 
      logo_url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Logo',
      pitch_deck_url: null, 
      website: 'https://teststartup.com',
      linkedin_profile: 'https://linkedin.com/company/teststartup',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_analysis: null,
      analysis_status: 'pending',
      analysis_timestamp: null,
    };

    // Pass the mock, relying on the helper to cast back to StartupProfile
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

}); 