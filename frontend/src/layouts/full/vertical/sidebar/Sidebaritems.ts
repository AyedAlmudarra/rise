// Import explicit IDs and the icon data (though we mainly need the IDs)
import {
  DASHBOARD_ID,
  RELATIONS_ID,
  DEALFLOW_ID,
  SETTINGS_ID,
  HELP_ID,
  RESOURCES_ID
} from './MiniSidebar'; 
// Removed Tabler icon imports

// Define allowed roles explicitly
type UserRole = 'startup' | 'investor' | 'all';

// Updated interfaces with 'roles' using the specific type
export interface ChildItem {
  id?: string; // Use string for unique IDs
  name?: string;
  icon?: string; // Changed from any to string
  children?: ChildItem[];
  item?: any;
  url?: string; // Changed from any to string
  color?: string;
  roles?: UserRole[]; // Use the specific type
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string; // Changed from any to string
  id?: string; // Use string for unique IDs
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string; // Changed from any to string
  roles?: UserRole[]; // Use the specific type
}

// Helper function to explicitly type roles array
const roles = (r: UserRole[]): UserRole[] => r;

// Removed NETWORK_ID constant as the section is removed

const SidebarContent: MenuItem[] = [
  {
    // === Dashboard ===
    id: DASHBOARD_ID,
    name: "Dashboard",
    roles: roles(['all']),
    items: [
      {
        heading: "Overview",
        roles: roles(['all']),
        children: [
          {
            id: 'startup-dashboard-overview',
            name: "Dashboard",
            icon: "solar:home-smile-angle-line-duotone",
            url: "/app/startup/dashboard",
            roles: roles(['startup']),
          },
          {
            id: 'investor-dashboard-overview',
            name: "Dashboard",
            icon: "solar:home-smile-angle-line-duotone",
            url: "/app/investor/dashboard",
            roles: roles(['investor']),
          },
        ]
      },
      {
        // === Workspace ===
        heading: "Workspace",
        roles: roles(['all']),
        children: [
          {
            id: 'dashboard-ai-insights',
            name: "AI Insights",
            icon: "solar:lightbulb-bolt-line-duotone",
            url: "/app/ai-insights",
            roles: roles(['all']),
          },
          {
            id: 'dashboard-calendar',
            name: "Calendar",
            icon: "solar:calendar-line-duotone",
            url: "/app/calendar",
            roles: roles(['all']),
          },
        ]
      },
    ],
  },
  // REMOVE Profile Section Start
  // {
  //   // === Profile ===
  //   id: PROFILE_ID, 
  //   name: "Profile",
  //   roles: roles(['all']),
  //   items: [
  //     {
  //       heading: "Profile Management",
  //       roles: roles(['all']),
  //       children: [
  //         {
  //           id: 'profile-view',
  //           name: "View Profile",
  //           icon: "solar:user-id-line-duotone",
  //           url: "/app/profile/view", 
  //           roles: roles(['all']),
  //         },
  //         {
  //           id: 'profile-documents', 
  //           name: "Manage Documents",
  //           icon: "solar:folder-with-files-line-duotone",
  //           url: "/app/profile/documents",
  //           roles: roles(['startup']), // Only for startups
  //         },
  //       ],
  //     },
  //   ],
  // },
  // REMOVE Profile Section End
  {
    // === Investor Relations (Startup Only) ===
    id: RELATIONS_ID, 
    name: "Investor Relations",
    roles: roles(['startup']),
    items: [
      {
        heading: "Fundraising",
        roles: roles(['startup']),
        children: [
          {
            id: 'startup-find-investors', 
            name: "Find Investors",
            icon: "solar:magnifer-zoom-in-line-duotone",
            url: "/app/startup/find-investors", 
            roles: roles(['startup']),
          },
          // Re-added Connections and Messages for Startups
          {
            id: 'startup-connections-manage', 
            name: "Manage Connections",
            icon: "solar:users-group-rounded-line-duotone", 
            url: "/app/connections", 
            roles: roles(['startup', 'investor']), // Keep shared role marker
          },
          {
            id: 'startup-messages', 
            name: "Messages",
            icon: "solar:chat-line-line-duotone", 
            url: "/app/messages",
            roles: roles(['startup', 'investor']), // Keep shared role marker
          },
        ],
      },
    ],
  },
  {
    // === Deal Flow (Investor Only) - Enhanced ===
    id: DEALFLOW_ID, 
    name: "Opportunities",
    roles: roles(['investor']),
    items: [
      {
        heading: "Discover Startups",
        roles: roles(['investor']),
        children: [
          {
            id: 'investor-browse-startups', 
            name: "Find Startups",
            icon: "solar:list-check-minimalistic-line-duotone",
            url: "/app/investor/browse-startups", 
            roles: roles(['investor']),
          },
          {
            id: 'investor-connections-manage', // Use different ID to avoid key conflicts if filtering logic changes
            name: "Manage Connections",
            icon: "solar:users-group-rounded-line-duotone", 
            url: "/app/connections", 
            roles: roles(['startup', 'investor']), // Keep shared role marker
          },
          {
            id: 'investor-messages', // Use different ID
            name: "Messages",
            icon: "solar:chat-line-line-duotone", 
            url: "/app/messages",
            roles: roles(['startup', 'investor']), // Keep shared role marker
          },
        ],
      },
    ],
  },
  // REMOVE My Portfolio Section Start
  // {
  //   // === My Portfolio (Investor Only) - NEW ===
  //   id: PORTFOLIO_ID, 
  //   name: "My Portfolio",
  //   roles: roles(['investor']),
  //   items: [
  //     {
  //       heading: "Portfolio Overview",
  //       roles: roles(['investor']),
  //       children: [
  //         {
  //           id: 'investor-portfolio-summary', 
  //           name: "Summary",
  //           icon: "solar:pie-chart-2-line-duotone",
  //           url: "/app/investor/portfolio/summary", 
  //           roles: roles(['investor']),
  //         },
  //         {
  //           id: 'investor-portfolio-performance', 
  //           name: "Performance",
  //           icon: "solar:graph-up-line-duotone",
  //           url: "/app/investor/portfolio/performance", 
  //           roles: roles(['investor']),
  //         },
  //       ],
  //     },
  //     {
  //       heading: "Investments",
  //       roles: roles(['investor']),
  //       children: [
  //         {
  //           id: 'investor-portfolio-manage', 
  //           name: "Manage Companies",
  //           icon: "solar:buildings-2-line-duotone",
  //           url: "/app/investor/portfolio/manage", 
  //           roles: roles(['investor']),
  //         },
  //         {
  //           id: 'investor-portfolio-reporting', 
  //           name: "Reporting",
  //           icon: "solar:document-text-line-duotone",
  //           url: "/app/investor/portfolio/reporting", 
  //           roles: roles(['investor']),
  //         },
  //       ],
  //     },
  //   ],
  // },
  // REMOVE My Portfolio Section End
  {
    // === Settings ===
    id: SETTINGS_ID, 
    name: "Settings",
    roles: roles(['all']),
    items: [
      {
        heading: "Application Settings",
        roles: roles(['all']),
        children: [
          {
            id: 'settings-account', 
            name: "Account & Profile",
            icon: "solar:shield-user-line-duotone",
            url: "/app/settings/account",
            roles: roles(['all']),
          },
        ],
      },
    ],
  },
  {
    // === Help Section (New) ===
    id: HELP_ID, 
    name: "Help",
    roles: roles(['all']),
    items: [
      {
        heading: "Support Resources",
        roles: roles(['all']),
        children: [
          {
            id: 'help-faq', 
            name: "FAQ",
            icon: "solar:question-circle-line-duotone",
            url: "/app/help/faq", 
            roles: roles(['all'])
          },
          {
            id: 'help-contact', 
            name: "Contact Support",
            icon: "solar:mailbox-line-duotone",
            url: "/app/help/contact", 
            roles: roles(['all'])
          },
          {
            id: 'help-getting-started', 
            name: "Getting Started",
            icon: "solar:rocket-line-duotone",
            url: "/app/help/getting-started", 
            roles: roles(['all'])
          },
        ],
      },
    ],
  },
  {
    // === Resources Section (New) ===
    id: RESOURCES_ID, 
    name: "Resources",
    roles: roles(['all']),
    items: [
      {
        heading: "Knowledge & Tools",
        roles: roles(['all']),
        children: [
          {
            id: 'resources-templates', 
            name: "Templates",
            icon: "solar:file-text-line-duotone",
            url: "/app/resources/templates", 
            roles: roles(['all'])
          },
          {
            id: 'resources-startup-guides', 
            name: "Startup Guides",
            icon: "solar:notebook-bookmark-line-duotone",
            url: "/app/resources/startup-guides", 
            roles: roles(['startup'])
          },
          {
            id: 'resources-investor-guides', 
            name: "Investor Guides",
            icon: "solar:notebook-bookmark-line-duotone", 
            url: "/app/resources/investor-guides", 
            roles: roles(['investor'])
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
