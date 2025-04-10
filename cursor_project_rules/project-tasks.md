# Project Tasks

This document outlines the development tasks for the RISE platform.

---

## Task 1: Initial Project Cleanup & Supabase Setup

*   **Status:** Done
*   **Summary:** Installed the `@supabase/supabase-js` client library via npm. Created the `.env` file in the `frontend` directory with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables. Added the Supabase client initialization logic in `frontend/src/lib/supabaseClient.ts`. Skipped template cleanup steps for now.
*   **Goal:** Prepare the template for RISE development and establish Supabase connection.
*   **Steps:**
    *   Install Supabase client: `cd frontend && npm install @supabase/supabase-js`. (Done)
    *   Create Supabase environment variables (`.env` file): `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. (Done)
    *   Set up Supabase client initialization (e.g., in `frontend/src/lib/supabaseClient.ts`). (Done)
    *   Commit changes. (Done)

---

## Task 2: Implement Basic User Authentication (Signup/Login)

*   **Status:** Done
*   **Summary:** Adapted the template's login view (`auth1/Login.tsx`) and form (`authforms/AuthLogin.tsx`) for RISE. Created a mock sign-in handler using MSW in `frontend/src/api/mocks/handlers/auth.ts` and integrated it into `mockHandlers.ts`. Updated `AuthLogin.tsx` to call `supabase.auth.signInWithPassword` (intercepted by MSW). Implemented protected routing using `ProtectedRoute.tsx` in `Router.tsx`. Added user session management via `AuthContext.tsx` and `AuthProvider`.
*   **Goal:** Implement core signup and login functionality using Supabase Auth and template components, leveraging MSW for initial UI feedback.
*   **Steps:**
    *   Adapt/create authentication views in `frontend/src/views/authentication/` for RISE. (Done - Adapted auth1/Login.tsx and authforms/AuthLogin.tsx)
    *   Define mock handlers in `frontend/src/api/mocks/` for relevant Supabase Auth endpoints. (Done - Created handlers/auth.ts with sign-in mock and added to mockHandlers.ts)
    *   Implement UI logic in auth views/forms to call Supabase Auth functions (intercepted by MSW initially). (Done - Updated AuthLogin.tsx to call supabase.auth.signInWithPassword)
    *   Set up protected routes in `frontend/src/routes/Router.tsx`. (Done - Created ProtectedRoute.tsx and applied it in Router.tsx)
    *   Manage user session state. (Done - Implemented AuthContext.tsx and wrapped app in AuthProvider)
    *   Commit changes. (Done)

---

## Task 3: Enhance Investor Registration Form

*   **Status:** Done
*   **Summary:** Added 'Preferred Industries', 'Preferred Geography', 'Company Description', 'Website', and 'LinkedIn Profile' fields to the `AuthRegisterInvestor.tsx` form component. Updated the corresponding mock API handler (`frontend/src/api/mocks/handlers/investor.ts`) to accept and log these new fields during registration simulation. Made the `RegisterInvestor.tsx` view scrollable to accommodate the longer form. Changed 'Preferred Industries' and 'Preferred Geography' inputs from simple text/selects to use Flowbite Checkbox groups for multiple selections.
*   **Goal:** Expand the investor registration form to capture more detailed information.
*   **Steps:**
    *   Add new fields to `AuthRegisterInvestor.tsx` form component. (Done)
    *   Update validation logic for new fields (if applicable). (Done - Basic `required` added)
    *   Modify the mock API handler (`handlers/investor.ts`) to accept and log the new fields. (Done)
    *   Ensure the `RegisterInvestor.tsx` view correctly renders the updated form. (Done)
    *   Adjust layout/styling as needed, ensuring the page is scrollable. (Done)
    *   Commit changes. (Done)

---

## Task 4: Implement Startup Registration Backend/Mock Handling

*   **Status:** Done
*   **Goal:** Ensure the data submitted via the `AuthRegisterStartup.tsx` form is correctly processed by the backend (initially using MSW mock handlers).
*   **Steps:**
    *   Create/update mock handlers in `frontend/src/api/mocks/handlers/startup.ts` (or similar) to intercept the Supabase insert call from `AuthRegisterStartup.tsx`. (Done)
    *   Ensure the mock handler correctly receives and logs all fields from the startup form. (Done)
    *   Test the complete startup registration flow from the UI to the mock handler. (Done)
    *   Add this task definition to `cursor_project_rules/project-tasks.md`. (Done)
    *   Commit changes. (Done)

---

## Task 5: Implement Basic Startup & Investor Dashboards

*   **Status:** Done
*   **Goal:** Create initial landing dashboards for logged-in Startup and Investor users, utilizing existing template components for structure and basic widgets/cards.
*   **Steps:**
    *   Define routes for `/startup/dashboard` and `/investor/dashboard` in `frontend/src/routes/Router.tsx`. Ensure these routes use the `ProtectedRoute` component and potentially the `FullLayout` component. (Done)
    *   Create new view files: `frontend/src/views/dashboards/StartupDashboard.tsx` and `frontend/src/views/dashboards/InvestorDashboard.tsx`. (Done)
    *   Inside `StartupDashboard.tsx` and `InvestorDashboard.tsx`, import and display a basic page title (e.g., "Startup Dashboard", "Investor Dashboard") and the user's name/email obtained from `AuthContext`. (Done)
    *   Select and integrate 1-2 relevant pre-built components (e.g., welcome card, simple stat card) from `frontend/src/components/dashboards/` or `frontend/src/components/widgets/` into each new dashboard view as placeholders for future content. (Done)
    *   Modify the login logic (likely in `frontend/src/views/authentication/authforms/AuthLogin.tsx` or `AuthContext.tsx`) to redirect users to `/startup/dashboard` or `/investor/dashboard` based on their role after successful login. (Done)
    *   Add this task definition to `cursor_project_rules/project-tasks.md`. (Done)
    *   Commit changes. (Done)

## Task 5.1: Refine Dashboard Placeholders with Role-Specific Components

*   **Status:** To Do
*   **Goal:** Replace generic placeholder components on the Startup and Investor dashboards with more role-specific template components (from `components/dashboards/analytics/`) to better represent future functionality, using a consistent grid layout.
*   **Steps:**
    *   **Startup Dashboard (`StartupDashboard.tsx`):**
        *   Keep the `Congratulations` component.
        *   Remove `RecentTransactionCard`.
        *   Import and integrate `Products` (as placeholder for key metrics). (Done)
        *   Import and integrate `Customer` (as placeholder for investor interest). (Done)
        *   Arrange components in a `grid grid-cols-1 lg:grid-cols-2 gap-6` layout below the welcome message/user info. (Done)
    *   **Investor Dashboard (`InvestorDashboard.tsx`):**
        *   Keep the `Congratulations` component.
        *   Remove `RecentTransactionCard`.
        *   Import and integrate `LatestDeal` (as placeholder for deal flow/watchlist). (Done)
        *   Import and integrate `PopularProducts` (as placeholder for suggested startups). (Done)
        *   Arrange components in the same `grid grid-cols-1 lg:grid-cols-2 gap-6` layout below the welcome message/user info. (Done)
    *   Add this task definition to `cursor_project_rules/project-tasks.md`. (Done)
    *   Commit changes. (To Do) 