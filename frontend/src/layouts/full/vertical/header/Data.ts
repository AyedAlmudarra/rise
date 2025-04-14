//Apps Links Type & Data
interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}
import chatImg from "/src/assets//images/svgs/icon-dd-chat.svg";
import cartImg from "/src/assets//images/svgs/icon-dd-cart.svg";
import invoiceImg from "/src/assets//images/svgs/icon-dd-invoice.svg";
import dateImg from "/src/assets//images/svgs/icon-dd-date.svg";
import mobileImg from "/src/assets//images/svgs/icon-dd-mobile.svg";
import lifebuoyImg from "/src/assets//images/svgs/icon-dd-lifebuoy.svg";
import messageBoxImg from "/src/assets//images/svgs/icon-dd-message-box.svg";
import applicationImg from "/src/assets//images/svgs/icon-dd-application.svg";

const appsLink: appsLinkType[] = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "New messages arrived",
    avatar: chatImg,
  },
  {
    href: "/apps/ecommerce/shop",
    title: "eCommerce App",
    subtext: "New stock available",
    avatar: cartImg,
  },
  {
    href: "/apps/notes",
    title: "Notes App",
    subtext: "To-do and Daily tasks",
    avatar: invoiceImg,
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Get dates",
    avatar: dateImg,
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "2 Unsaved Contacts",
    avatar: mobileImg,
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Submit tickets",
    avatar: lifebuoyImg,
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "Get new emails",
    avatar: messageBoxImg,
  },
  {
    href: "/apps/blog/post",
    title: "Blog App",
    subtext: "added new blog",
    avatar: applicationImg,
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/theme-pages/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/auth1/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/auth1/register",
    title: "Register Now",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/apps/kanban",
    title: "Kanban App",
  },
  {
    href: "/apps/user-profile/profile",
    title: "User Application",
  },
  {
    href: "/apps/blog/post",
    title: "Blog Design",
  },
  {
    href: "/apps/ecommerce/checkout",
    title: "Shopping Cart",
  },
];

//   Search Data
interface SearchType {
  href: string;
  title: string;
}

const SearchLinks: SearchType[] = [
  {
    title: "Analytics",
    href: "/dashboards/analytics",
  },
  {
    title: "eCommerce",
    href: "/dashboards/eCommerce",
  },
  {
    title: "CRM",
    href: "/dashboards/crm",
  },
  {
    title: "Contacts",
    href: "/dashboards/eCommerce",
  },
  {
    title: "Posts",
    href: "/dashboards/posts",
  },
  {
    title: "Details",
    href: "/dashboards/details",
  },
];

//   Message Data (REMOVED - Handled dynamically)
/*
interface MessageType {
  title: string;
  avatar: any;
  subtitle: string;
  color: string;
  time: string;
}
import avatar1 from "/src/assets/images/profile/user-6.jpg";
import avatar2 from "/src/assets/images/profile/user-2.jpg";
import avatar3 from "/src/assets/images/profile/user-3.jpg";
import avatar4 from "/src/assets/images/profile/user-4.jpg";
import avatar5 from "/src/assets/images/profile/user-5.jpg";
const MessagesLink: MessageType[] = [
  // ... data removed ...
];
*/

//   Notification Data (REMOVED - Handled dynamically)
/*
interface NotificationType {
  title: string;
  icon: any;
  subtitle: string;
  bgcolor: string;
  color:string;
  time: string;
}
const Notification: NotificationType[] = [
  // ... data removed ...
];
*/

//  Profile Data (REMOVED - Handled dynamically)
/*
interface ProfileType {
  title: string;
  icon: any;
  subtitle: string;
  color: string;
  bgcolor: string;
  url: string;
}
const profileDD: ProfileType[] = [
 // ... data removed ...
];
*/

// Language Data was already removed/handled in Language.tsx

export {
  appsLink,
  pageLinks,
  SearchLinks,
  // MessagesLink, // Removed export
  // Notification, // Removed export
  // profileDD, // Removed export
};
