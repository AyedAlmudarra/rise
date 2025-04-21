// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy, Suspense } from 'react';
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext'; // Keep if used elsewhere

// Revert RegisterInvestor import to relative path
import RegisterInvestor from '../views/authentication/RegisterInvestor';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('src/layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('src/layouts/blank/BlankLayout')));
const FrontendPageLayout = Loadable(lazy(() => import('src/layouts/blank/FrontendLayout'))); // Assuming this is correct layout for frontend pages

// Dashboards - Corrected Paths
const EcommerceDashboard = Loadable(lazy(() => import('src/views/dashboards/Ecommerce'))); // Corrected path
const Analytics = Loadable(lazy(() => import('src/views/dashboards/Analytics'))); // Corrected path
const Crm = Loadable(lazy(() => import('src/views/dashboards/Crm'))); // Corrected path
const StartupDashboard = Loadable(lazy(() => import('src/views/dashboards/StartupDashboard'))); // Kept as is, assuming correct
const InvestorDashboard = Loadable(lazy(() => import('src/views/dashboards/InvestorDashboard'))); // Kept as is, assuming correct

// +++ Add AI Insights Page +++
const AIInsightsPage = Loadable(lazy(() => import('src/views/ai/AIInsightsPage')));

/* ****Apps***** */ // Corrected Paths
const Contact = Loadable(lazy(() => import('src/views/apps/contact/Contact'))); // Corrected path (lowercase folder)
const Ecommerce = Loadable(lazy(() => import('src/views/apps/eCommerce/Ecommerce'))); // Corrected casing (eCommerce folder)
const EcommerceDetail = Loadable(lazy(() => import('src/views/apps/eCommerce/EcommerceDetail'))); // Corrected casing
const EcommerceAddProduct = Loadable(lazy(() => import('src/views/apps/eCommerce/EcommerceAddProduct'))); // Corrected casing
const EcommerceEditProduct = Loadable(lazy(() => import('src/views/apps/eCommerce/EcommerceEditProduct'))); // Corrected casing
const EcomProductList = Loadable(lazy(() => import('src/views/apps/eCommerce/EcomProductList'))); // Corrected casing
const EcomProductCheckout = Loadable(lazy(() => import('src/views/apps/eCommerce/EcommerceCheckout'))); // Corrected casing & filename
const Blog = Loadable(lazy(() => import('src/views/apps/blog/Blog'))); // Corrected path
const BlogDetail = Loadable(lazy(() => import('src/views/apps/blog/BlogDetail'))); // Corrected path
const Chats = Loadable(lazy(() => import('src/views/apps/chat/Chats'))); // Corrected filename (Chats.tsx)
const UserProfile = Loadable(lazy(() => import('src/views/apps/user-profile/UserProfile'))); // Assuming correct
const Followers = Loadable(lazy(() => import('src/views/apps/user-profile/Followers'))); // Assuming correct
const Friends = Loadable(lazy(() => import('src/views/apps/user-profile/Friends'))); // Assuming correct
const Gallery = Loadable(lazy(() => import('src/views/apps/user-profile/Gallery'))); // Assuming correct
const InvoiceList = Loadable(lazy(() => import('src/views/apps/invoice/List'))); // Corrected filename
const InvoiceCreate = Loadable(lazy(() => import('src/views/apps/invoice/Create'))); // Corrected filename
const InvoiceDetail = Loadable(lazy(() => import('src/views/apps/invoice/Detail'))); // Corrected filename
const InvoiceEdit = Loadable(lazy(() => import('src/views/apps/invoice/Edit'))); // Corrected filename
const Notes = Loadable(lazy(() => import('src/views/apps/notes/Notes'))); // Assuming correct
const Calendar = Loadable(lazy(() => import('src/views/apps/calendar/BigCalendar'))); // Corrected filename
const Email = Loadable(lazy(() => import('src/views/apps/email/Email'))); // Assuming correct
const Tickets = Loadable(lazy(() => import('src/views/apps/tickets/Tickets'))); // Assuming correct
const CreateTickets = Loadable(lazy(() => import('src/views/apps/tickets/CreateTickets'))); // Assuming correct
const Kanban = Loadable(lazy(() => import('src/views/apps/kanban/Kanban'))); // Assuming correct

// Theme Pages - Corrected Paths
const RollbaseCASL = Loadable(lazy(() => import('src/views/pages/rollbaseCASL/RollbaseCASL'))); // Assuming correct
const Faq = Loadable(lazy(() => import('src/views/pages/faq/Faq'))); // Assuming correct
const Pricing = Loadable(lazy(() => import('src/views/pages/pricing/Pricing'))); // Assuming correct
const AccountSetting = Loadable(lazy(() => import('src/views/pages/account-setting/AccountSetting'))); // Corrected path (account-setting singular)

// Widgets - Corrected Paths
const WidgetCards = Loadable(lazy(() => import('src/views/widgets/cards/WidgetCards'))); // Assuming correct
const WidgetBanners = Loadable(lazy(() => import('src/views/widgets/banners/WidgetBanners'))); // Assuming correct
const WidgetCharts = Loadable(lazy(() => import('src/views/widgets/charts/WidgetCharts'))); // Assuming correct

// Icons - Corrected Paths
const SolarIcon = Loadable(lazy(() => import('src/views/icons/SolarIcon'))); // Corrected filename
const TablerIcon = Loadable(lazy(() => import('src/views/icons/TablerIcon'))); // Corrected filename

// UI Components - Assuming paths are correct, corrected capitalization
const FlowbiteAccordion = Loadable(lazy(() => import('src/views/ui-components/FlowbiteAccordion')));
const FlowbiteAlert = Loadable(lazy(() => import('src/views/ui-components/FlowbiteAlert')));
// ... (assuming rest of Flowbite components follow PascalCase naming)
const FlowbiteTypography = Loadable(lazy(() => import('src/views/ui-components/FlowbiteTypography')));

// Tables - Corrected Paths
const BasicTable = Loadable(lazy(() => import('src/views/tables/BasicTable'))); // Assuming correct
const CheckboxTable = Loadable(lazy(() => import('src/views/tables/CheckboxTables'))); // Corrected filename (plural)
const HoverTable = Loadable(lazy(() => import('src/views/tables/HoverTable'))); // Assuming correct
const StrippedTable = Loadable(lazy(() => import('src/views/tables/StrippedTable'))); // Corrected path

// React Tables - Assuming structure like basic/page.tsx within each subfolder
const ReactBasicTable = Loadable(lazy(() => import('src/views/react-tables/basic/page')));
const ReactColumnVisibilityTable = Loadable(lazy(() => import('src/views/react-tables/columnvisibility/page'))); // Corrected path (lowercase)
const ReactDenseTable = Loadable(lazy(() => import('src/views/react-tables/dense/page')));
const ReactDragDropTable = Loadable(lazy(() => import('src/views/react-tables/drag-drop/page')));
const ReactEditableTable = Loadable(lazy(() => import('src/views/react-tables/editable/page')));
const ReactEmptyTable = Loadable(lazy(() => import('src/views/react-tables/empty/page')));
const ReactExpandingTable = Loadable(lazy(() => import('src/views/react-tables/expanding/page')));
const ReactFilterTable = Loadable(lazy(() => import('src/views/react-tables/filtering/page')));
const ReactPaginationTable = Loadable(lazy(() => import('src/views/react-tables/pagination/page')));
const ReactRowSelectionTable = Loadable(lazy(() => import('src/views/react-tables/row-selection/page')));
const ReactSortingTable = Loadable(lazy(() => import('src/views/react-tables/sorting/page')));
const ReactStickyTable = Loadable(lazy(() => import('src/views/react-tables/sticky/page'))); // Corrected path

// Charts - Assuming paths are correct
const AreaChart = Loadable(lazy(() => import('src/views/charts/AreaChart')));
const CandlestickChart = Loadable(lazy(() => import('src/views/charts/CandlestickChart')));
const ColumnChart = Loadable(lazy(() => import('src/views/charts/ColumnChart')));
const DoughnutChart = Loadable(lazy(() => import('src/views/charts/DoughnutChart')));
const GredientChart = Loadable(lazy(() => import('src/views/charts/GredientChart')));
const RadialbarChart = Loadable(lazy(() => import('src/views/charts/RadialbarChart')));
const LineChart = Loadable(lazy(() => import('src/views/charts/LineChart')));

// Forms - Assuming paths are correct
const FormLayouts = Loadable(lazy(() => import('src/views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('src/views/forms/FormCustom')));
const FormHorizontal = Loadable(lazy(() => import('src/views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('src/views/forms/FormVertical')));
const FormValidation = Loadable(lazy(() => import('src/views/forms/FormValidation')));
const FormElements = Loadable(lazy(() => import('src/views/forms/FormElements')));

// Headless UI - Assuming paths are correct
const Dialog = Loadable(lazy(() => import('src/views/headless-ui/Dialog')));
const Disclosure = Loadable(lazy(() => import('src/views/headless-ui/Disclosure')));
const Dropdown = Loadable(lazy(() => import('src/views/headless-ui/Dropdown')));
const Popover = Loadable(lazy(() => import('src/views/headless-ui/Popover')));
const Tabs = Loadable(lazy(() => import('src/views/headless-ui/Tabs')));
const Transition = Loadable(lazy(() => import('src/views/headless-ui/Transition')));

// Headless Form - Corrected paths
const HeadlessButtons = Loadable(lazy(() => import('src/views/headless-form/HeadlessButtons')));
const HeadlessCheckbox = Loadable(lazy(() => import('src/views/headless-form/HeadlessCheckbox')));
const HeadlessComboBox = Loadable(lazy(() => import('src/views/headless-form/HeadlessComboBox')));
const HeadlessFieldset = Loadable(lazy(() => import('src/views/headless-form/HeadlessFieldset')));
const HeadlessInput = Loadable(lazy(() => import('src/views/headless-form/HeadlessInput')));
const HeadlessListbox = Loadable(lazy(() => import('src/views/headless-form/HeadlessListbox')));
const HeadlessRadioGroup = Loadable(lazy(() => import('src/views/headless-form/HeadlessRadioGroup')));
const HeadlessSelect = Loadable(lazy(() => import('src/views/headless-form/HeadlessSelect')));
const HeadlessSwitch = Loadable(lazy(() => import('src/views/headless-form/HeadlessSwitch')));
const HeadlessTextarea = Loadable(lazy(() => import('src/views/headless-form/HeadlessTextarea')));

// Shadcn UI - Assuming paths are correct
const ShadcnButton = Loadable(lazy(() => import('src/views/shadcn-ui/ShadcnButton')));
// ... (assuming rest of Shadcn UI components follow PascalCase naming)
const ShadcnToast = Loadable(lazy(() => import('src/views/shadcn-ui/ShadcnToast')));

// Shadcn Form - Assuming paths are correct
const ShadcnInput = Loadable(lazy(() => import('src/views/shadcn-form/ShadcnInput')));
const ShadcnSelect = Loadable(lazy(() => import('src/views/shadcn-form/ShadcnSelect')));
const ShadcnCheckbox = Loadable(lazy(() => import('src/views/shadcn-form/ShadcnCheckbox')));
const ShadcnRadio = Loadable(lazy(() => import('src/views/shadcn-form/ShadcnRadio')));

// Shadcn Table - Corrected path
const ShadcnBasicTable = Loadable(lazy(() => import('src/views/shadcn-tables/BasicTable')));

// Authentication - Corrected Paths
const Login = Loadable(lazy(() => import('src/views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('src/views/authentication/auth2/Login')));
const ForgotPassword = Loadable(lazy(() => import('src/views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(lazy(() => import('src/views/authentication/auth2/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('src/views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('src/views/authentication/auth2/TwoSteps')));
const SamplePage = Loadable(lazy(() => import('src/views/sample-page/SamplePage'))); // Assuming correct
const Error = Loadable(lazy(() => import('src/views/authentication/Error'))); // Assuming correct
const Maintainance = Loadable(lazy(() => import('src/views/authentication/Maintainance'))); // Assuming correct

// Landingpage - Corrected Path
const Landingpage = Loadable(lazy(() => import('src/views/pages/landingpages/LandingPages'))); // Corrected filename (plural)

// RISE-specific registration components - Corrected Paths
const RegisterStartup = Loadable(lazy(() => import('src/views/authentication/RegisterStartup')));
// Using direct import RegisterInvestor from relative path

// Front end pages - Assuming paths are correct
const Homepage = Loadable(lazy(() => import('src/views/pages/frontend-pages/Homepage')));
const About = Loadable(lazy(() => import('src/views/pages/frontend-pages/About')));
const ContactPage = Loadable(lazy(() => import('src/views/pages/frontend-pages/Contact')));
const Portfolio = Loadable(lazy(() => import('src/views/pages/frontend-pages/Portfolio')));
const PagePricing = Loadable(lazy(() => import('src/views/pages/frontend-pages/Pricing')));
const BlogPage = Loadable(lazy(() => import('src/views/pages/frontend-pages/Blog')));
const BlogPost = Loadable(lazy(() => import('src/views/pages/frontend-pages/BlogPost')));

// --- RISE Specific Views --- 
const SettingsPage = Loadable(lazy(() => import('src/views/settings/SettingsPage')));
const ViewProfilePage = Loadable(lazy(() => import('src/views/profile/ViewProfilePage')));
const EditProfilePage = Loadable(lazy(() => import('src/views/profile/EditProfilePage')));
const ManageDocumentsPage = Loadable(lazy(() => import('src/views/profile/ManageDocumentsPage')));

// --- RISE Dashboard Sub-Pages --- //
const StartupMetricsPage = Loadable(lazy(() => import('src/views/dashboards/startup/StartupMetricsPage')));
const StartupActivityPage = Loadable(lazy(() => import('src/views/dashboards/startup/StartupActivityPage')));
// Placeholder for Investor pages if needed later
// const InvestorSuggestionsPage = Loadable(lazy(() => import('src/views/dashboards/investor/InvestorSuggestionsPage')));
// const InvestorActivityPage = Loadable(lazy(() => import('src/views/dashboards/investor/InvestorActivityPage')));

// Import the new Calendar Page
const CalendarPage = Loadable(lazy(() => import('src/views/calendar/CalendarPage')));

// Add imports for newly created/relevant pages
const FindInvestorsPage = Loadable(lazy(() => import('src/views/startup/FindInvestorsPage')));
const TrackOutreachPage = Loadable(lazy(() => import('src/views/startup/TrackOutreachPage')));

// Add imports for Investor pages
const AISuggestionsPage = Loadable(lazy(() => import('src/views/investor/AISuggestionsPage')));
const BrowseStartupsPage = Loadable(lazy(() => import('src/views/investor/BrowseStartupsPage')));
const AIRecommendationsPage = Loadable(lazy(() => import('src/views/investor/AIRecommendationsPage')));
const SavedSearchesPage = Loadable(lazy(() => import('src/views/investor/SavedSearchesPage')));
const WatchlistPage = Loadable(lazy(() => import('src/views/investor/WatchlistPage')));
const ActiveDealsPage = Loadable(lazy(() => import('src/views/investor/ActiveDealsPage')));
const DataRoomsPage = Loadable(lazy(() => import('src/views/investor/DataRoomsPage')));
const PortfolioSummaryPage = Loadable(lazy(() => import('src/views/investor/portfolio/PortfolioSummaryPage')));
const PortfolioPerformancePage = Loadable(lazy(() => import('src/views/investor/portfolio/PortfolioPerformancePage')));
const ManageCompaniesPage = Loadable(lazy(() => import('src/views/investor/portfolio/ManageCompaniesPage')));
const PortfolioReportingPage = Loadable(lazy(() => import('src/views/investor/portfolio/PortfolioReportingPage')));

// Add imports for Help pages
const FaqPage = Loadable(lazy(() => import('src/views/help/FaqPage')));
const DocsPage = Loadable(lazy(() => import('src/views/help/DocsPage')));
const ContactHelpPage = Loadable(lazy(() => import('src/views/help/ContactPage'))); // Renamed import slightly
const GettingStartedPage = Loadable(lazy(() => import('src/views/help/GettingStartedPage')));

// Add imports for Resources pages
const MarketInsightsPage = Loadable(lazy(() => import('src/views/resources/MarketInsightsPage')));
const TemplatesPage = Loadable(lazy(() => import('src/views/resources/TemplatesPage')));
const StartupGuidesPage = Loadable(lazy(() => import('src/views/resources/StartupGuidesPage')));
const InvestorGuidesPage = Loadable(lazy(() => import('src/views/resources/InvestorGuidesPage')));

// +++ Add imports for the new Public Profile View pages +++
const ViewInvestorProfilePage = Loadable(lazy(() => import('src/views/profile/ViewInvestorProfilePage')));
const ViewStartupProfilePage = Loadable(lazy(() => import('src/views/profile/ViewStartupProfilePage')));

// Add new ConnectionsPage import
const ConnectionsPage = Loadable(lazy(() => import('src/views/connections/ConnectionsPage')));

// +++ Add Chat Page import +++
const ChatPage = Loadable(lazy(() => import('src/views/apps/chat/Chats')));

const Router = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <FullLayout />,
        children: [
          // Default route - Redirect based on role?
          // For now, point to startup dashboard as a default logged-in view
          { path: '/', element: <Navigate to="/startup/dashboard" replace /> },
          { path: '/dashboards/ecommerce', element: <EcommerceDashboard /> }, // Keep others accessible
          { path: '/dashboards/analytics', element: <Analytics /> },
          { path: '/dashboards/crm', element: <Crm /> },

          // --- Core Dashboards (Role determined internally or by access) ---
          { path: '/startup/dashboard', element: <ProtectedRoute requiredRole='startup' />, children: [{ path: '', element: <StartupDashboard /> }] },
          { path: '/investor/dashboard', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <InvestorDashboard /> }] },

          // --- Add Calendar Route (Protected, accessible to all roles) ---
          { path: '/calendar', element: <CalendarPage /> }, // Protected by the parent <ProtectedRoute />

          // --- Add route for AI Insights (All Roles) ---
          { path: '/ai-insights', element: <AIInsightsPage /> },

          // --- RISE Specific Routes (General Access, Role handled internally or unprotected) ---
          { path: '/settings/:tab?', element: <SettingsPage /> },
          { path: '/profile/edit', element: <EditProfilePage /> },

          // --- Public Profile Views (accessible when logged in) --- 
          { path: '/view/startup/:startupId', element: <ViewStartupProfilePage /> },
          { path: '/view/investor/:investorId', element: <ViewInvestorProfilePage /> },

          // --- Startup Specific Routes --- 
          { path: '/startup/find-investors', element: <ProtectedRoute requiredRole='startup' />, children: [{ path: '', element: <FindInvestorsPage /> }] },
          { path: '/startup/track-outreach', element: <ProtectedRoute requiredRole='startup' />, children: [{ path: '', element: <TrackOutreachPage /> }] },

          // --- Investor Specific Routes --- 
          { path: '/investor/browse-startups', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <BrowseStartupsPage /> }] },
          { path: '/investor/ai-recommendations', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <AIRecommendationsPage /> }] },
          { path: '/investor/saved-searches', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <SavedSearchesPage /> }] },
          { path: '/investor/watchlist', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <WatchlistPage /> }] },
          { path: '/investor/active-deals', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <ActiveDealsPage /> }] },
          { path: '/investor/data-rooms', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <DataRoomsPage /> }] },
          { path: '/investor/portfolio/summary', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <PortfolioSummaryPage /> }] },
          { path: '/investor/portfolio/performance', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <PortfolioPerformancePage /> }] },
          { path: '/investor/portfolio/manage', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <ManageCompaniesPage /> }] },
          { path: '/investor/portfolio/reporting', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <PortfolioReportingPage /> }] },
          
          // --- Help Routes (All Roles) ---
          { path: '/help/faq', element: <FaqPage /> },
          { path: '/help/docs', element: <DocsPage /> },
          { path: '/help/contact', element: <ContactHelpPage /> },
          { path: '/help/getting-started', element: <GettingStartedPage /> },

          // --- Resources Routes (All Roles) ---
          { path: '/resources/market-insights', element: <MarketInsightsPage /> },
          { path: '/resources/templates', element: <TemplatesPage /> },
          { path: '/resources/startup-guides', element: <StartupGuidesPage /> },
          { path: '/resources/investor-guides', element: <InvestorGuidesPage /> },

          // --- Add Connections Management Route (Accessible to all logged-in roles) --- 
          { path: '/connections/:tab?', element: <ConnectionsPage /> }, // Allow optional tab parameter

          // +++ Add Messages Route +++
          { path: '/messages', element: <ChatPage /> },

          // ... other existing routes inside FullLayout ...
          { path: '/sample-page', element: <SamplePage /> },
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'auth1/login', element: <Login /> },
      { path: 'auth2/login', element: <Login2 /> },
      { path: 'register/startup', element: <RegisterStartup /> },
      { path: 'register/investor', element: <RegisterInvestor /> },
      { path: 'auth1/forgot-password', element: <ForgotPassword /> },
      { path: 'auth2/forgot-password', element: <ForgotPassword2 /> },
      { path: 'auth1/two-steps', element: <TwoSteps /> },
      { path: 'auth2/two-steps', element: <TwoSteps2 /> },
      { path: 'error', element: <Error /> },
      { path: 'maintenance', element: <Maintainance /> },
      { path: '*', element: <Navigate to="/auth/error" /> },
    ],
  },
  {
    path: '/landingpage',
    element: <Landingpage />,
  },
  {
    path: '/home', // This might need review - consider if needed with / route
    element: <FrontendPageLayout />,
    children: [
      { path: '', element: <Homepage /> }, // Default for /home
      { path: 'about', element: <About /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'pricing', element: <PagePricing /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blogpost', element: <BlogPost /> }, // Consider if this needs a parameter :postId
    ]
  },
  {
    path: '*',
    element: <Navigate to="/auth/404" />,
  }
];

const router = createBrowserRouter(Router)

export default router;
