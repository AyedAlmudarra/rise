import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { IconBook, IconArrowRight } from '@tabler/icons-react'; // Default/Example icons

// Define the structure for guide data
export interface Guide {
  id: string;
  title: string;
  summary: string;
  category: string;
  content_type: 'internal' | 'external';
  content: string; // URL or Markdown content
  icon_name?: string | null;
}

interface GuideCardProps {
  guide: Guide;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  
  // Placeholder for dynamic icon logic
  const CardIcon = IconBook; // Default icon for guides

  // Placeholder click handler - Later this could navigate to a detail page or external link
  const handleCardClick = () => {
    if (guide.content_type === 'external') {
      alert(`Simulating opening external link: ${guide.content}`);
      // window.open(guide.content, '_blank');
    } else {
      alert(`Simulating navigating to internal guide: ${guide.title}`);
      // navigate(`/app/resources/guides/${guide.id}`); // Example navigation
    }
  };

  return (
    // Make the entire card clickable
    <Card 
      href="#" // Add href to make it behave like a link visually, but handle click via JS
      onClick={(e) => { e.preventDefault(); handleCardClick(); }} 
      className="h-full flex flex-col hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
    >
      <div className="flex flex-col flex-grow"> 
        {/* Card Header with Icon */}
        <div className="flex items-start justify-between mb-2">
           <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-200 mr-2">
             {guide.title}
           </h5>
           <CardIcon className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={24} />
        </div>

        {/* Category Badge */}
        <div className="mb-3">
           <Badge color="teal" size="xs"> 
             {guide.category}
           </Badge>
        </div>
        
        {/* Summary */}
        <p className="mb-4 font-normal text-sm text-gray-600 dark:text-gray-400 flex-grow"> 
          {guide.summary}
        </p>

        {/* Footer Link Indicator */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end text-primary dark:text-primary-light">
           <span className="text-xs font-medium mr-1">
             {guide.content_type === 'external' ? 'View External Resource' : 'Read Guide'}
           </span>
           <IconArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default GuideCard; 