# Role-Based File Mapping (Frontend)

This document outlines the key frontend files associated with different user roles (Startup, Investor) and common functionalities within the RISE platform.

**Note:** Role access is primarily controlled via:
*   `src/routes/Router.tsx`: Using `ProtectedRoute` with `requiredRole`. Defines URL paths and links them to view components. - Done
*   `src/layouts/full/vertical/sidebar/Sidebaritems.ts`: Filtering displayed navigation based on `roles`. Defines the structure and links shown in the main sidebar menu. - Done
*   Component-level logic: Some components might fetch data or display elements conditionally based on `userRole` from `useAuth()`. - Done

---

## Startup Specific Files

These files are primarily accessed or used by users with the 'startup' role.

*   **Views (Pages):**
    *   `src/views/authentication/RegisterStartup.tsx`: Startup registration page view. Hosts the registration form. - Done
    *   `src/views/dashboards/StartupDashboard.tsx`: Main dashboard view for startups. Displays overview, key metrics, AI insights, etc. - Done
    *   `src/views/dashboards/startup/StartupMetricsPage.tsx`: Dedicated view for displaying detailed startup metrics and performance data. - Done
    *   `src/views/dashboards/startup/StartupActivityPage.tsx`: Dedicated view for displaying startup activity feed and task management. - Done
    *   `src/views/profile/ManageDocumentsPage.tsx`: View for startups to upload, view, and manage relevant documents (pitch deck, financials, etc.). - Done
    *   `src/views/startup/FindInvestorsPage.tsx`: Page allowing startups to search, filter, and view potential investor profiles. - Done
    *   `src/views/startup/TrackOutreachPage.tsx`: Page for startups to log and track communication status and interactions with investors (Investor Relationship Management - IRM). - Done (Placeholder)
*   **Components:**
    *   `src/components/auth/authforms/AuthRegisterStartup.tsx`: The reusable form component containing fields for startup registration. - Done
    *   `src/components/dashboards/startup/`: Directory containing reusable UI components specifically for the Startup Dashboard views (e.g., cards, sections). - Done
*   **Types/Validation:**
    *   `src/types/startupRegistration.ts`: Defines the Zod schema for validating startup registration form data. - Done
    *   `src/types/database.ts` (Usage of `StartupProfile`): Contains the TypeScript interface (`StartupProfile`) mirroring the `startups` table structure. - Done

---

## Investor Specific Files

These files are primarily accessed or used by users with the 'investor' role.

*   **Views (Pages):**
    *   `src/views/authentication/RegisterInvestor.tsx`: Investor registration page view. Hosts the registration form. - Done
    *   `src/views/dashboards/InvestorDashboard.tsx`: Main dashboard view for investors. Displays portfolio summary, deal flow overview, AI suggestions, etc. - Done
    *   `src/views/investor/BrowseStartupsPage.tsx`: Page allowing investors to browse, search, and filter all startup profiles on the platform. - Done
    *   `src/views/investor/AIRecommendationsPage.tsx`: Page displaying AI-driven startup recommendations based on investor preferences and activity. - Done (Placeholder)
    *   `src/views/investor/SavedSearchesPage.tsx`: Page allowing investors to save and manage custom search criteria for finding startups. - Done (Placeholder)
    *   `src/views/investor/WatchlistPage.tsx`: Page displaying startups the investor has specifically marked for monitoring. - Done (Placeholder)
    *   `src/views/investor/ActiveDealsPage.tsx`: Page showing startups currently in the active due diligence or investment process with this investor. - Done (Placeholder)
    *   `src/views/investor/DataRoomsPage.tsx`: Page providing access to secure data rooms shared by startups during due diligence. - Done (Placeholder)
    *   `src/views/investor/portfolio/PortfolioSummaryPage.tsx`: Page providing an overview of the investor's portfolio, including aggregate metrics and diversification. - Done (Placeholder)
    *   `src/views/investor/portfolio/PortfolioPerformancePage.tsx`: Page displaying performance metrics (IRR, MOIC, etc.) for the investor's portfolio. - Done (Placeholder)
    *   `src/views/investor/portfolio/ManageCompaniesPage.tsx`: Page listing invested companies, allowing management of related information and updates. - Done (Placeholder)
    *   `src/views/investor/portfolio/PortfolioReportingPage.tsx`: Page allowing investors to generate and view reports based on their portfolio data. - Done (Placeholder)
*   **Components:**
    *   `src/components/auth/authforms/AuthRegisterInvestor.tsx`: The reusable form component containing fields for investor registration. - Done
    *   `src/components/dashboards/investor/`: Directory containing reusable UI components specifically for the Investor Dashboard views. - Done
*   **Types/Validation:**
    *   `src/types/investorRegistration.ts`: (Assumed file) Defines the Zod schema for validating investor registration form data. - Pending
    *   `src/types/database.ts` (Usage of `InvestorProfile`): Contains the TypeScript interface (`InvestorProfile`) mirroring the `investors` table structure. - Done

---

## Admin Specific Files

*No specific Admin roles, routes, or dedicated files were identified in the core routing (`Router.tsx`) or sidebar configuration (`Sidebaritems.ts`) provided.*

Admin functionality might be handled through:
*   Specific flags or roles checked within common components (e.g., based on `user.app_metadata`).
*   A separate Admin portal/application.
*   Files not yet created or integrated into the main routing.

---

## Common Files (All Authenticated Roles)

These files are generally accessible or foundational for all authenticated users.

*   **Core Routing & Layout:**
    *   `src/routes/Router.tsx`: Defines application routes and associates paths with components. - Done
    *   `src/layouts/full/FullLayout.tsx`: Main application layout wrapper for authenticated users (includes header, sidebar, main content area). - Done
    *   `src/layouts/full/vertical/sidebar/Sidebar.tsx`: The visual sidebar component. - Done
    *   `src/layouts/full/vertical/sidebar/Sidebaritems.ts`: Configuration array defining the sidebar menu structure, links, icons, and role access. - Done
    *   `src/layouts/full/vertical/header/Header.tsx`: The top header component. - Done
    *   `src/layouts/full/vertical/header/Notifications.tsx`: The notification dropdown component in the header. - Done (UI Only - Fetches mock data, needs real data integration)
    *   `src/layouts/full/shared/loadable/Loadable.tsx`: Higher-order component for lazy loading React components. - Done
*   **Authentication & Authorization:**
    *   `src/components/auth/ProtectedRoute.tsx`: Wraps routes to ensure user is authenticated and optionally has the required role. Redirects if checks fail. - Done
    *   `src/context/AuthContext.tsx`: React context provider managing user session state (user object, role, loading status) via Supabase auth listeners. Fetches application role (`userRole`). - Done
    *   `src/views/authentication/auth1/Login.tsx`: Default login page view used by the application. - Done
*   **Views (Pages):**
    *   `src/views/calendar/CalendarPage.tsx`: Page wrapper that displays the main calendar component. - Done
    *   `src/views/ai/AIInsightsPage.tsx`: Page displaying AI-generated insights, potentially tailored based on user role (Startup analysis or Investor recommendations). - Done
    *   `src/views/settings/SettingsPage.tsx`: Page for users to manage account settings, notifications, etc. (likely uses tabs). - Done
    *   `src/views/profile/ViewProfilePage.tsx`: Page displaying the user's own profile details (Startup or Investor). - Done
    *   `src/views/profile/EditProfilePage.tsx`: Page allowing users to edit their own profile details. - Done
    *   `src/views/profile/ViewInvestorProfilePage.tsx`: Public view page for an investor profile. Fetches data, displays public fields, handles connection status/actions. - Done
    *   `src/views/profile/ViewStartupProfilePage.tsx`: Public view page for a startup profile. Fetches data, displays public fields, handles connection status/actions. - Done
    *   `src/views/connections/ConnectionsPage.tsx`: Page for users to manage connections (Connections Hub). Displays Incoming/Outgoing/Active tabs, fetches data, handles Accept/Decline/Withdraw/Remove actions via RPC. Integrates `ProfilePreviewModal`. - Done
    *   `src/views/apps/chat/Chats.tsx`: Top-level route view wrapper for the chat application. - Done
    *   `src/views/chat/ChatPage.tsx`: Main chat interface view handling conversation list, messages, input, and profile modal integration. - Done
    *   `src/views/sample-page/SamplePage.tsx`: A generic placeholder page from the original template. - Done
    *   `src/views/help/FaqPage.tsx`: Displays frequently asked questions and answers. - Done (Placeholder)
    *   `src/views/help/DocsPage.tsx`: Hosts detailed documentation and knowledge base articles. - Done (Placeholder)
    *   `src/views/help/ContactPage.tsx`: Provides contact information or a form for users to reach support. - Done (Placeholder)
    *   `src/views/help/GettingStartedPage.tsx`: Offers onboarding guidance for new users. - Done (Placeholder)
    *   `src/views/resources/MarketInsightsPage.tsx`: Displays market trend data, analysis, or reports. - Done (Placeholder)
    *   `src/views/resources/TemplatesPage.tsx`: Provides downloadable document templates (pitch decks, financials, etc.). - Done (Placeholder)
    *   `src/views/resources/StartupGuidesPage.tsx`: Contains articles and guides tailored for startups. - Done (Placeholder)
    *   `src/views/resources/InvestorGuidesPage.tsx`: Contains articles and guides tailored for investors. - Done (Placeholder)
*   **Components:**
    *   `src/components/apps/calendar/index.tsx`: The interactive calendar component with Supabase integration. - Done
    *   `src/components/apps/chat/ChatMsgSent.tsx`: Displays a sent chat message bubble, including read receipt indicator. - Done
    *   `src/components/apps/chat/ChatMsgRecieved.tsx`: Displays a received chat message bubble. - Done
    *   `src/components/apps/chat/ChatMsgInput.tsx`: Component for typing and sending chat messages. - Done
    *   `src/components/shared/`: Directory containing common, reusable UI components across the application. - Done
    *   `src/components/container/PageContainer.tsx`: A wrapper component for providing consistent page structure/padding (existence/usage unclear). - Pending
    *   `src/components/profile/ProfilePreviewModal.tsx`: Modal component for displaying a quick preview of a Startup or Investor profile. Fetches basic profile data. Used in `ConnectionsPage`. - Done
    *   `src/components/common/UserProfileModal.tsx`: Modal component for displaying a full Startup or Investor profile. Fetches profile data. Used in `ChatPage`. - Done
*   **Configuration & Utilities:**
    *   `src/lib/supabaseClient.ts`: Initializes and exports the Supabase JavaScript client instance. - Done
    *   `src/types/database.ts`: Central file defining TypeScript interfaces for database tables (e.g., `StartupProfile`, `InvestorProfile`, `CalendarEvent`). - Done
    *   `src/context/CustomizerContext.tsx`: React context for managing theme customizations (layout, colors, etc.). - Done
*   **API Mocks (Development):**
    *   `src/api/mocks/`: Directory containing Mock Service Worker (MSW) handlers and mock data used for simulating backend responses during development. - Done

---

## Unauthenticated / Public Files

These files are part of flows accessible without logging in.

*   `src/layouts/blank/BlankLayout.tsx`: Minimal layout wrapper used for pages outside the main authenticated application structure (e.g., login, register). - Done
*   `src/layouts/blank/FrontendLayout.tsx`: Layout used for public-facing website pages (e.g., landing page, about). - Done
*   `src/views/authentication/...`: Directory containing views related to authentication (Login, Register, Forgot Password). - Done
*   `src/views/pages/landingpages/LandingPages.tsx`: The main public landing page component. - Done
*   `src/views/pages/frontend-pages/`: Directory containing other public-facing website pages (Homepage, About, Contact, etc.). - Done 