import { uniqueId } from "lodash";
// Import explicit IDs and the icon data (though we mainly need the IDs)
import MiniSidebarIcons, {
  DASHBOARD_ID,
  PROFILE_ID,
  RELATIONS_ID,
  DEALFLOW_ID,
  PORTFOLIO_ID,
  SETTINGS_ID,
  HELP_ID,
  RESOURCES_ID
} from './MiniSidebar'; 
// Remove Tabler icon import as we will use solar strings
// import { IconChartPie, IconBriefcase, IconCalendarEvent, IconSettings } from "@tabler/icons-react";

// Define allowed roles explicitly
type UserRole = 'startup' | 'investor' | 'all';

// Updated interfaces with 'roles' using the specific type
export interface ChildItem {
  id?: string; // Use string for unique IDs
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  roles?: UserRole[]; // Use the specific type
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: string; // Use string for unique IDs
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  roles?: UserRole[]; // Use the specific type
}

// Helper function to explicitly type roles array
const roles = (r: UserRole[]): UserRole[] => r;

const SidebarContent: MenuItem[] = [
  {
    // === Dashboard ===
    id: DASHBOARD_ID, // Use imported constant
    name: "Dashboard",
    roles: roles(['all']),
    items: [
      {
        roles: roles(['all']),
        children: [
          {
            id: uniqueId('link-'),
            name: "AI Insights",
            icon: "solar:lightbulb-bolt-line-duotone",
            url: "/ai-insights",
            roles: roles(['all']),
          },
          {
            id: uniqueId('link-'),
            name: "Calendar",
            icon: "solar:calendar-line-duotone",
            url: "/calendar",
            roles: roles(['all']),
          },
        ]
      },
      {
        roles: roles(['startup']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Overview",
            icon: "solar:home-smile-angle-line-duotone",
            url: "/startup/dashboard",
            roles: roles(['startup']),
          },
          {
            id: uniqueId('link-'),
            name: "Metrics & Performance",
            icon: "solar:chart-line-duotone",
            url: "/startup/metrics",
            roles: roles(['startup']),
          },
          {
            id: uniqueId('link-'),
            name: "Activity & Tasks",
            icon: "solar:checklist-minimalistic-line-duotone",
            url: "/startup/activity",
            roles: roles(['startup']),
          },
        ],
      },
      {
        roles: roles(['investor']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Overview",
            icon: "solar:home-smile-angle-line-duotone",
            url: "/investor/dashboard",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "AI Suggestions",
            icon: "solar:chat-bot-line-duotone",
            url: "/investor/ai-suggestions",
            roles: roles(['investor']),
          },
        ],
      },
    ],
  },
  {
    // === Profile ===
    id: PROFILE_ID, // Use imported constant
    name: "Profile",
    roles: roles(['all']),
    items: [
      {
        heading: "Profile Management",
        roles: roles(['all']),
        children: [
          {
            id: uniqueId('link-'),
            name: "View Profile",
            icon: "solar:user-id-line-duotone",
            url: "/profile/view", // Needs role-specific target or logic
            roles: roles(['all']),
          },
          {
            id: uniqueId('link-'),
            name: "Edit Profile",
            icon: "solar:document-add-line-duotone",
            url: "/profile/edit", // Needs role-specific target or logic
            roles: roles(['all']),
          },
          {
            id: uniqueId('link-'),
            name: "Manage Documents",
            icon: "solar:folder-with-files-line-duotone",
            url: "/profile/documents",
            roles: roles(['startup']), // Only for startups
          },
        ],
      },
    ],
  },
  {
    // === Investor Relations (Startup Only) ===
    id: RELATIONS_ID, // Use imported constant
    name: "Investor Relations",
    roles: roles(['startup']),
    items: [
      {
        heading: "Fundraising",
        roles: roles(['startup']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Find Investors",
            icon: "solar:magnifer-zoom-in-line-duotone",
            url: "/startup/find-investors",
            roles: roles(['startup']),
          },
          {
            id: uniqueId('link-'),
            name: "Track Outreach",
            icon: "solar:notebook-line-duotone",
            url: "/startup/investor-outreach",
            roles: roles(['startup']),
          },
        ],
      },
    ],
  },
  {
    // === Deal Flow (Investor Only) - Enhanced ===
    id: DEALFLOW_ID, // Use imported constant
    name: "Deal Flow",
    roles: roles(['investor']),
    items: [
      {
        heading: "Discover Startups",
        roles: roles(['investor']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Browse All",
            icon: "solar:list-check-minimalistic-line-duotone",
            url: "/investor/browse-startups",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "AI Recommendations",
            icon: "solar:lightbulb-minimalistic-line-duotone", // Updated icon
            url: "/investor/ai-recommendations",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "Saved Searches", // New
            icon: "solar:bookmark-circle-line-duotone", 
            url: "/investor/saved-searches",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "My Watchlist",
            icon: "solar:eye-line-duotone", // Updated icon
            url: "/investor/watchlist",
            roles: roles(['investor']),
          },
        ],
      },
      {
        heading: "Due Diligence", // New Section
        roles: roles(['investor']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Active Deals",
            icon: "solar:clipboard-text-line-duotone",
            url: "/investor/active-deals",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "Data Rooms",
            icon: "solar:archive-check-line-duotone",
            url: "/investor/data-rooms",
            roles: roles(['investor']),
          },
        ]
      }
    ],
  },
  {
    // === My Portfolio (Investor Only) - NEW ===
    id: PORTFOLIO_ID, // Use imported constant
    name: "My Portfolio",
    roles: roles(['investor']),
    items: [
      {
        heading: "Portfolio Overview",
        roles: roles(['investor']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Summary",
            icon: "solar:pie-chart-2-line-duotone",
            url: "/investor/portfolio/summary",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "Performance",
            icon: "solar:graph-up-line-duotone",
            url: "/investor/portfolio/performance",
            roles: roles(['investor']),
          },
        ],
      },
      {
        heading: "Investments",
        roles: roles(['investor']),
        children: [
          // Potentially list invested companies dynamically here later,
          // or provide links to manage them.
          {
            id: uniqueId('link-'),
            name: "Manage Companies",
            icon: "solar:buildings-2-line-duotone",
            url: "/investor/portfolio/manage",
            roles: roles(['investor']),
          },
          {
            id: uniqueId('link-'),
            name: "Reporting",
            icon: "solar:document-text-line-duotone",
            url: "/investor/portfolio/reporting",
            roles: roles(['investor']),
          },
        ],
      },
    ],
  },
  {
    // === Settings ===
    id: SETTINGS_ID, // Use imported constant
    name: "Settings",
    roles: roles(['all']),
    items: [
      {
        heading: "Application Settings",
        roles: roles(['all']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Account",
            icon: "solar:shield-user-line-duotone",
            url: "/settings/account",
            roles: roles(['all']),
          },
          {
            id: uniqueId('link-'),
            name: "Notifications",
            icon: "solar:bell-bing-line-duotone",
            url: "/settings/notifications",
            roles: roles(['all']),
          },
          // Add more settings links here
        ],
      },
    ],
  },
  {
    // === Help Section (New) ===
    id: HELP_ID, // Use imported constant
    name: "Help",
    roles: roles(['all']),
    items: [
      {
        heading: "Support Resources",
        roles: roles(['all']),
        children: [
          {
            id: uniqueId('link-'),
            name: "FAQ",
            icon: "solar:question-circle-line-duotone",
            url: "/help/faq",
            roles: roles(['all'])
          },
          {
            id: uniqueId('link-'),
            name: "Knowledge Base",
            icon: "solar:notebook-minimalistic-line-duotone",
            url: "/help/docs",
            roles: roles(['all'])
          },
          {
            id: uniqueId('link-'),
            name: "Contact Support",
            icon: "solar:mailbox-line-duotone",
            url: "/help/contact",
            roles: roles(['all'])
          },
          {
            id: uniqueId('link-'),
            name: "Getting Started",
            icon: "solar:rocket-line-duotone",
            url: "/help/getting-started",
            roles: roles(['all'])
          },
        ],
      },
    ],
  },
  {
    // === Resources Section (New) ===
    id: RESOURCES_ID, // Use imported constant
    name: "Resources",
    roles: roles(['all']),
    items: [
      {
        heading: "Knowledge & Tools",
        roles: roles(['all']),
        children: [
          {
            id: uniqueId('link-'),
            name: "Market Insights",
            icon: "solar:chart-line-duotone", // Reusing icon, consider a unique one if available
            url: "/resources/market-insights",
            roles: roles(['all'])
          },
          {
            id: uniqueId('link-'),
            name: "Templates",
            icon: "solar:file-text-line-duotone",
            url: "/resources/templates",
            roles: roles(['all'])
          },
          {
            id: uniqueId('link-'),
            name: "Startup Guides",
            icon: "solar:notebook-bookmark-line-duotone",
            url: "/resources/startup-guides",
            roles: roles(['all'])
          },
          {
            id: uniqueId('link-'),
            name: "Investor Guides",
            icon: "solar:notebook-bookmark-line-duotone", // Could be same icon or different
            url: "/resources/investor-guides",
            roles: roles(['all'])
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
