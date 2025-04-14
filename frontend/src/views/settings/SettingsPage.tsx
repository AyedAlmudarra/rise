import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs } from 'flowbite-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

// Import existing tab components (adjust path if necessary)
import GeneralSettingsTab from 'src/components/theme-pages/account-settings/GeneralSettingsTab';
import NotificationTab from 'src/components/theme-pages/account-settings/NotificationTab';
import PrivacyTab from 'src/components/theme-pages/account-settings/PrivacyTab';
import PlatformSettingsTab from 'src/components/theme-pages/account-settings/PlatformSettingsTab';
// Import others if needed later (e.g., SecurityTab, BillsTab)
// import SecurityTab from 'src/components/theme-pages/account-settings/SecurityTab';
// import BillsTab from 'src/components/theme-pages/account-settings/BillsTab';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Settings',
  },
];

const SettingsPage: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // Default to first tab (Account)

  // Map tab names to indices
  const tabMap: { [key: string]: number } = {
    account: 0,
    notifications: 1,
    privacy: 2,
    platform: 3,
    // security: 2, // Add if using SecurityTab
    // billing: 3,  // Add if using BillsTab
  };

  // Set active tab based on URL parameter
  useEffect(() => {
    const tabKey = tab?.toLowerCase() || 'account';
    const tabIndex = tabMap[tabKey];
    if (tabIndex !== undefined) {
      setActiveTab(tabIndex);
    } else {
      // If URL tab is invalid, default to 'account' and update URL
      navigate('/settings/account', { replace: true });
      setActiveTab(0);
    }
  }, [tab, navigate]);

  // Handle tab change and update URL
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const tabName = Object.keys(tabMap).find(key => tabMap[key] === index);
    navigate(`/settings/${tabName || 'account'}`, { replace: true });
  };

  return (
    <>
      <BreadcrumbComp title="Settings" items={BCrumb} />
      
      <Tabs onActiveTabChange={handleTabChange}>
        <Tabs.Item title="Account" active={activeTab === 0}>
          <GeneralSettingsTab />
        </Tabs.Item>
        <Tabs.Item title="Notifications" active={activeTab === 1}>
          <NotificationTab />
        </Tabs.Item>
        <Tabs.Item title="Privacy" active={activeTab === 2}>
          <PrivacyTab />
        </Tabs.Item>
        <Tabs.Item title="Platform" active={activeTab === 3}>
          <PlatformSettingsTab />
        </Tabs.Item>
        {/* Add other tabs here if needed */}
        {/* <Tabs.Item title="Security" active={activeTab === 2}>
          <SecurityTab />
        </Tabs.Item> */}
        {/* <Tabs.Item title="Billing" active={activeTab === 3}>
          <BillsTab />
        </Tabs.Item> */}
      </Tabs>
    </>
  );
};

export default SettingsPage; 