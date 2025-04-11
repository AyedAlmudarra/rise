import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/shadcn-ui/Default-Ui/card'; // Corrected path to Default-Ui

interface FormSectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const FormSectionCard: React.FC<FormSectionCardProps> = ({ title, icon, children, className }) => {
  return (
    <Card className={`bg-white dark:bg-gray-800/50 border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSectionCard; 