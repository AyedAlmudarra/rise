import React from 'react';
import { Card } from 'flowbite-react';
import { IconClockHour4, IconSparkles } from "@tabler/icons-react";

interface ComingSoonPlaceholderProps {
  featureName: string;
  description?: string;
}

const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({
  featureName,
  description = "This section is currently under development and will be available soon. Stay tuned for updates!",
}) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[300px] h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-900 border-dashed border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50">
        <IconClockHour4 size={32} className="text-indigo-600 dark:text-blue-400" />
      </div>
      <h5 className="mb-2 text-xl md:text-2xl font-semibold tracking-tight text-gray-700 dark:text-white flex items-center">
        {featureName} Coming Soon
        <IconSparkles size={20} className="ml-2 text-amber-400" />
      </h5>
      <p className="font-normal text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md">
        {description}
      </p>
      {/* Optional: Add a button or link if needed */}
      {/* <Button size="sm" color="light" className="mt-5">
        Learn More
      </Button> */}
    </Card>
  );
};

export default ComingSoonPlaceholder; 