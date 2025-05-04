import React from 'react';
import TemplateCard, { Template } from '@/components/resources/TemplateCard'; // Import component and type
import { IconFileText } from '@tabler/icons-react'; // Icon for header

// Mock data simulating what would come from Supabase
const mockTemplates: Template[] = [
  {
    id: 'tpl_001',
    name: "Pitch Deck Outline",
    description: "A structured outline for creating a compelling startup pitch deck. Covers key sections and provides content suggestions.",
    target_role: "startup",
    type: "file",
    content_url: "/mock-templates/pitch-deck-outline.md", // Placeholder path
    file_name: "pitch-deck-outline.md",
    icon_name: "IconFilePresentation" // Placeholder
  },
  {
    id: 'tpl_002',
    name: "Financial Projections",
    description: "Basic spreadsheet template (XLSX) for forecasting revenue, expenses, and key financial metrics.",
    target_role: "startup",
    type: "file",
    content_url: "/mock-templates/financial-projections.xlsx", // Placeholder path
    file_name: "financial-projections.xlsx",
    icon_name: "IconCalculator" // Placeholder
  },
  {
    id: 'tpl_003',
    name: "One-Pager Template",
    description: "A concise, single-page document template (DOCX) to summarize your startup for quick investor review.",
    target_role: "startup",
    type: "file",
    content_url: "/mock-templates/one-pager-template.docx", // Placeholder path
    file_name: "one-pager-template.docx",
    icon_name: "IconFileDescription" // Placeholder
  },
  {
    id: 'tpl_004',
    name: "Due Diligence Checklist",
    description: "A checklist covering key areas investors typically examine during the due diligence process.",
    target_role: "investor",
    type: "file",
    content_url: "/mock-templates/dd-checklist.md", // Placeholder path
    file_name: "due-diligence-checklist.md",
    icon_name: "IconChecklist" // Placeholder
  },
  {
    id: 'tpl_005',
    name: "Example External Resource",
    description: "Link to a helpful external website or article relevant to fundraising.",
    target_role: "all",
    type: "link",
    content_url: "https://example.com/helpful-resource", // Placeholder external link
    file_name: null,
    icon_name: "IconLink" // Placeholder
  },
];


const TemplatesPage: React.FC = () => {
  // In a real implementation, useState and useEffect would fetch this data
  const templates = mockTemplates; 
  const isLoading = false; // Mock loading state
  const error = null; // Mock error state

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-teal-500 to-lime-600 rounded-lg shadow-lg">
            <IconFileText size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Templates & Resources</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Downloadable templates and helpful resources.</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">Loading templates...</div> // Replace with Spinner later
      )}

      {/* Error State */}
      {!isLoading && error && (
         <div className="text-center py-10 text-red-500">Error loading templates: {error}</div> // Replace with Alert later
      )}

      {/* Content Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.length > 0 ? (
            templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 md:col-span-2 lg:col-span-3 text-center py-10">
              No templates available at this time.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage; 