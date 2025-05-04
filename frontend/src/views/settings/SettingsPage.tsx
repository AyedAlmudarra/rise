import React from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

// Import the main index component that handles its own tabs
import AccountSettingIndex from 'src/components/theme-pages/account-settings/index';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Account Settings',
  },
];

const SettingsPage: React.FC = () => {
  return (
    <>
      <BreadcrumbComp title="Account Settings" items={BCrumb} />
      
      <div className="mt-6">
        <AccountSettingIndex />
      </div>
    </>
  );
};

export default SettingsPage; 