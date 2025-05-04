import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { IconFileText, IconDownload, IconExternalLink } from '@tabler/icons-react'; // Example icons

// Define the structure for template data (matching our planned DB structure)
export interface Template {
  id: string; // Use string for mock ID
  name: string;
  description: string;
  target_role: 'startup' | 'investor' | 'all';
  type: 'file' | 'link' | 'markdown';
  content_url: string; // Placeholder URL for now
  file_name?: string | null;
  icon_name?: string | null; // Placeholder for now
}

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  
  // Determine button action based on type
  const isDownload = template.type === 'file' || template.type === 'markdown'; // Treat markdown as downloadable for now
  const buttonText = isDownload ? 'Download' : 'View Link';
  const ButtonIcon = isDownload ? IconDownload : IconExternalLink;

  // Placeholder for handling icon logic later if needed
  const CardIcon = IconFileText; // Default icon

  // Placeholder for button click (will be link/download later)
  const handleButtonClick = () => {
    if (isDownload) {
      alert(`Simulating download of: ${template.file_name || template.name}`);
      // In real implementation: window.location.href = template.content_url; (or use download attribute)
    } else {
       alert(`Simulating opening link: ${template.content_url}`);
       // In real implementation: window.open(template.content_url, '_blank');
    }
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'startup': return 'success';
      case 'investor': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Card className="h-full flex flex-col"> {/* Ensure card takes full height for grid alignment */}
      <div className="flex flex-col flex-grow"> {/* Allow content to grow */}
        {/* Card Header with Icon */}
        <div className="flex items-start justify-between mb-3">
           <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mr-2">
             {template.name}
           </h5>
           <CardIcon className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={24} />
        </div>

        {/* Description */}
        <p className="mb-4 font-normal text-sm text-gray-700 dark:text-gray-400 flex-grow"> {/* Allow description to grow */}
          {template.description}
        </p>

        {/* Footer with Badge and Button */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
           <Badge color={getRoleBadgeColor(template.target_role)} size="sm">
             For {template.target_role.charAt(0).toUpperCase() + template.target_role.slice(1)}
           </Badge>
           <Button size="xs" color="light" onClick={handleButtonClick}>
             <ButtonIcon size={14} className="mr-1.5" />
             {buttonText}
           </Button>
        </div>
      </div>
    </Card>
  );
};

export default TemplateCard; 