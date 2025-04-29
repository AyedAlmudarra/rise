// Define unique IDs using static strings
export const DASHBOARD_ID = 'dashboard';
export const PROFILE_ID = 'profile';
export const RELATIONS_ID = 'relations'; // Startup only
export const DEALFLOW_ID = 'dealflow';   // Investor only
export const PORTFOLIO_ID = 'portfolio'; // Investor only
export const SETTINGS_ID = 'settings';
export const HELP_ID = 'help';         // New Help Section ID
export const RESOURCES_ID = 'resources'; // New Resources Section ID

// Define the type for MiniSidebar icons, including roles
interface MiniiconsType {
  id: string; // Use explicit string IDs
  icon: string;
  tooltip: string;
  roles: ('startup' | 'investor' | 'all')[];
}

// Define the main navigation icons for RISE using explicit IDs
const MiniSidebarIcons: MiniiconsType[] = [
  {
    id: DASHBOARD_ID,
    tooltip: "Dashboard",
    icon: "solar:layers-minimalistic-line-duotone",
    roles: ['all'],
  },
  {
    id: PROFILE_ID,
    tooltip: "My Profile",
    icon: "solar:user-circle-line-duotone",
    roles: ['all'],
  },
  {
    id: RELATIONS_ID,
    tooltip: "Investor Relations",
    icon: "solar:users-group-two-rounded-line-duotone",
    roles: ['startup'], // Specific to startups
  },
  {
    id: DEALFLOW_ID,
    tooltip: "Deal Flow",
    icon: "solar:filter-line-duotone",
    roles: ['investor'], // Specific to investors
  },
  {
    id: PORTFOLIO_ID,
    tooltip: "My Portfolio",
    icon: "solar:pie-chart-2-line-duotone",
    roles: ['investor'], // Specific to investors
  },
  {
    id: SETTINGS_ID,
    tooltip: "Settings",
    icon: "solar:settings-line-duotone",
    roles: ['all'],
  },
  {
    id: HELP_ID,
    tooltip: "Help",
    icon: "solar:question-square-line-duotone",
    roles: ['all']
  },
  {
    id: RESOURCES_ID,
    tooltip: "Resources",
    icon: "solar:bookmark-square-minimalistic-line-duotone",
    roles: ['all']
  }
];

export default MiniSidebarIcons;
