import React from 'react';
import { Grid } from '@mui/material'; // Or use Tailwind grid classes if preferred
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { KeyMetricsSection } from 'src/components/dashboards/startup'; // Assuming index exports it

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/startup/dashboard',
    title: 'Startup Dashboard',
  },
  {
    title: 'Metrics & Performance',
  },
];

const StartupMetricsPage = () => {
  // Add data fetching logic for metrics if needed, or pass props to KeyMetricsSection

  return (
    <>
      <BreadcrumbComp title="Metrics & Performance" items={BCrumb} />
      {/* Using Tailwind grid for consistency with Analytics.tsx example */}
      <div className="grid grid-cols-12 gap-6">
         {/* You can adjust the grid span as needed */}
        <div className="col-span-12">
           <KeyMetricsSection />
         </div>
         {/* Add other relevant components here if needed */}
       </div>
    </>
  );
};

export default StartupMetricsPage; 