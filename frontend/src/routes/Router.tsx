// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Revert RegisterInvestor import to relative path
import RegisterInvestor from '../views/authentication/RegisterInvestor';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('@/layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('@/layouts/blank/BlankLayout')));
const FrontendPageLayout = Loadable(lazy(() => import('@/layouts/blank/FrontendLayout')));

// Dashboards
const StartupDashboard = Loadable(lazy(() => import('@/views/dashboards/StartupDashboard')));
const InvestorDashboard = Loadable(lazy(() => import('@/views/dashboards/InvestorDashboard')));

// AI Insights Page
const AIInsightsPage = Loadable(lazy(() => import('@/views/ai/AIInsightsPage')));

// Chat Page (Renamed from Chats)
const ChatPage = Loadable(lazy(() => import('@/views/apps/chat/Chats')));

// Calendar Page (Renamed from Calendar)
const CalendarPage = Loadable(lazy(() => import('@/views/calendar/CalendarPage')));

// Theme Pages (Kept used ones)
const FaqPage = Loadable(lazy(() => import('@/views/help/FaqPage')));
const SettingsPage = Loadable(lazy(() => import('@/views/settings/SettingsPage')));

// Authentication
const Login = Loadable(lazy(() => import('@/views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('@/views/authentication/auth2/Login')));
const ForgotPassword = Loadable(lazy(() => import('@/views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(lazy(() => import('@/views/authentication/auth2/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('@/views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('@/views/authentication/auth2/TwoSteps')));
const Error = Loadable(lazy(() => import('@/views/authentication/Error')));
const Maintainance = Loadable(lazy(() => import('@/views/authentication/Maintainance')));

// RISE-specific registration components
const RegisterStartup = Loadable(lazy(() => import('@/views/authentication/RegisterStartup')));
// Using direct import RegisterInvestor - OK

// Front end pages (Keeping Homepage and Pricing for now)
const Homepage = Loadable(lazy(() => import('@/views/pages/frontend-pages/Homepage')));

// --- RISE Specific Views ---
// Removed import for deleted EditProfilePage
// const EditProfilePage = Loadable(lazy(() => import('@/views/profile/EditProfilePage')));

// --- RISE Dashboard Sub-Pages (Removed unused placeholders) ---

// --- Startup Specific Views ---
const FindInvestorsPage = Loadable(lazy(() => import('@/views/startup/FindInvestorsPage')));


// --- Investor Specific Views ---
const BrowseStartupsPage = Loadable(lazy(() => import('@/views/investor/BrowseStartupsPage')));
const AIRecommendationsPage = Loadable(lazy(() => import('@/views/investor/AIRecommendationsPage')));
const SavedSearchesPage = Loadable(lazy(() => import('@/views/investor/SavedSearchesPage')));
const WatchlistPage = Loadable(lazy(() => import('@/views/investor/WatchlistPage')));
const ActiveDealsPage = Loadable(lazy(() => import('@/views/investor/ActiveDealsPage')));
const DataRoomsPage = Loadable(lazy(() => import('@/views/investor/DataRoomsPage')));
const PortfolioSummaryPage = Loadable(lazy(() => import('@/views/investor/portfolio/PortfolioSummaryPage')));
const PortfolioPerformancePage = Loadable(lazy(() => import('@/views/investor/portfolio/PortfolioPerformancePage')));
const ManageCompaniesPage = Loadable(lazy(() => import('@/views/investor/portfolio/ManageCompaniesPage')));
const PortfolioReportingPage = Loadable(lazy(() => import('@/views/investor/portfolio/PortfolioReportingPage')));

// --- Help Routes ---
const DocsPage = Loadable(lazy(() => import('@/views/help/DocsPage')));
const ContactHelpPage = Loadable(lazy(() => import('@/views/help/ContactPage')));
const GettingStartedPage = Loadable(lazy(() => import('@/views/help/GettingStartedPage')));

// --- Resources Routes ---
const MarketInsightsPage = Loadable(lazy(() => import('@/views/resources/MarketInsightsPage')));
const TemplatesPage = Loadable(lazy(() => import('@/views/resources/TemplatesPage')));
const StartupGuidesPage = Loadable(lazy(() => import('@/views/resources/StartupGuidesPage')));
const InvestorGuidesPage = Loadable(lazy(() => import('@/views/resources/InvestorGuidesPage')));

// --- Public Profile View pages ---
const ViewInvestorProfilePage = Loadable(lazy(() => import('@/views/profile/ViewInvestorProfilePage')));
const ViewStartupProfilePage = Loadable(lazy(() => import('@/views/profile/ViewStartupProfilePage')));

// --- Connections Page ---
const ConnectionsPage = Loadable(lazy(() => import('@/views/connections/ConnectionsPage')));

const Router = [
  {
    // Public root route for the Homepage
    path: '/',
    element: <FrontendPageLayout />,
    children: [
      { path: '', element: <Homepage /> },
    ]
  },
  {
    // Authenticated application routes
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <FullLayout />,
        children: [
          // Default redirect within /app
          { path: '', element: <Navigate to="/app/startup/dashboard" replace /> },

          // --- Core Dashboards ---
          { path: 'startup/dashboard', element: <ProtectedRoute requiredRole='startup' />, children: [{ path: '', element: <StartupDashboard /> }] },
          { path: 'investor/dashboard', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <InvestorDashboard /> }] },

          // --- Calendar Route ---
          { path: 'calendar', element: <CalendarPage /> },

          // --- AI Insights Route ---
          { path: 'ai-insights', element: <AIInsightsPage /> },

          // --- RISE Specific Routes ---
          { path: 'settings/:tab?', element: <SettingsPage /> },
          // Removed the dedicated edit profile route
          // { path: 'profile/edit', element: <EditProfilePage /> },

          // --- Public Profile Views (within app context for now) ---
          { path: 'view/startup/:startupId', element: <ViewStartupProfilePage /> },
          { path: 'view/investor/:investorId', element: <ViewInvestorProfilePage /> },

          // --- Startup Specific Routes ---
          { path: 'startup/find-investors', element: <ProtectedRoute requiredRole='startup' />, children: [{ path: '', element: <FindInvestorsPage /> }] },
          // { path: 'startup/track-outreach', element: <ProtectedRoute requiredRole='startup' />, children: [{ path: '', element: <TrackOutreachPage /> }] },

          // --- Investor Specific Routes ---
          { path: 'investor/browse-startups', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <BrowseStartupsPage /> }] },
          { path: 'investor/ai-recommendations', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <AIRecommendationsPage /> }] },
          { path: 'investor/saved-searches', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <SavedSearchesPage /> }] },
          { path: 'investor/watchlist', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <WatchlistPage /> }] },
          { path: 'investor/active-deals', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <ActiveDealsPage /> }] },
          { path: 'investor/data-rooms', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <DataRoomsPage /> }] },
          { path: 'investor/portfolio/summary', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <PortfolioSummaryPage /> }] },
          { path: 'investor/portfolio/performance', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <PortfolioPerformancePage /> }] },
          { path: 'investor/portfolio/manage', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <ManageCompaniesPage /> }] },
          { path: 'investor/portfolio/reporting', element: <ProtectedRoute requiredRole='investor' />, children: [{ path: '', element: <PortfolioReportingPage /> }] },

          // --- Help Routes ---
          { path: 'help/faq', element: <FaqPage /> },
          { path: 'help/docs', element: <DocsPage /> },
          { path: 'help/contact', element: <ContactHelpPage /> },
          { path: 'help/getting-started', element: <GettingStartedPage /> },

          // --- Resources Routes ---
          { path: 'resources/market-insights', element: <MarketInsightsPage /> },
          { path: 'resources/templates', element: <TemplatesPage /> },
          { path: 'resources/startup-guides', element: <StartupGuidesPage /> },
          { path: 'resources/investor-guides', element: <InvestorGuidesPage /> },

          // --- Connections Management Route ---
          { path: 'connections/:tab?', element: <ConnectionsPage /> },

          // --- Messages Route ---
          { path: 'messages', element: <ChatPage /> },

          // Catch-all within /app (optional)
          { path: '*', element: <Navigate to="/app/startup/dashboard" replace /> } // Redirect unknown /app paths
        ]
      }
    ]
  },
  {
    // Authentication routes
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
      { path: '', element: <Navigate to="/auth/auth1/login" /> }, // Default to login
      { path: '*', element: <Navigate to="/" /> }, // Changed: Redirect unknown /auth paths to homepage
    ],
  },
  {
    // Global catch-all for unmatched routes
    path: '*',
    element: <Navigate to="/" />, // Changed: Redirect to public homepage
  }
];

const router = createBrowserRouter(Router)

export default router;
