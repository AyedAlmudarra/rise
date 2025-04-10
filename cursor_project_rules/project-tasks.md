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

*   **Status:** Done
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
    *   Commit changes. (Done)

## Task 6: Enhance Startup Dashboard with Placeholders and Data Fetching

*   **Status:** Done
*   **Goal:** Structure the Startup Dashboard to dynamically display the logged-in startup's basic company information fetched from the (mocked) database and include clearly defined placeholder sections for future metrics, AI features, and investor interactions using Flowbite `Card` components and a grid layout.
*   **Detailed Steps:**

    1.  **Define Startup Data Type (Optional but Recommended):**
        *   Create an interface or type named `StartupProfile` (e.g., in a new file `frontend/src/types/database.ts` or similar) that accurately reflects the structure of the data stored in the `startups` table (based on the fields sent in `AuthRegisterStartup.tsx`: `user_id`, `name`, `description`, `industry`, `sector`, `operational_stage`, `location_city`, `num_customers`, `num_employees`, `annual_revenue`, `annual_expenses`, `kpi_cac`, `kpi_clv`, `kpi_retention_rate`, `kpi_conversion_rate`, `logo_url`, `pitch_deck_url`, plus Supabase auto-generated `id`, `created_at`). Ensure nullable fields are typed correctly (e.g., `string | null`). (Done)

    2.  **Implement Data Fetching in `StartupDashboard.tsx`:**
        *   Import `useState`, `useEffect` from React.
        *   Import `useAuth` from `../../context/AuthContext`.
        *   Import `supabase` from `../../lib/supabaseClient`.
        *   Import the `StartupProfile` type if created in step 1.
        *   Import `Spinner`, `Alert` from `flowbite-react`.
        *   Add state variables: `startupData`, `dataLoading`, `dataError`.
        *   Add `useEffect` hook with `[user]` dependency to fetch data using `supabase.from('startups').select('*').eq('user_id', user.id).single()`. Handle loading, success, and error states.
        *   Render loading (`Spinner`) and error (`Alert`) indicators conditionally.
        (Done)

    3.  **Create Company Overview Card:**
        *   Import `Card` from `flowbite-react`.
        *   Render a `Card` with title "Company Overview".
        *   Conditionally display `startupData.name`, `.industry`, `.operational_stage`, `.location_city`, `.description` if `!dataLoading && startupData`.
        *   Use fallback text (e.g., "N/A") for null/empty fields.
        *   Display "No company profile found." if `!dataLoading && !startupData && !dataError`.
        (Done)

    4.  **Remove Old Placeholders & Add New Placeholder Cards:**
        *   Remove imports and usage of `Products` and `Customer` components.
        *   Create four new `Card` components with appropriate titles ("Key Metrics", "AI Insights & Recommendations", "Funding Readiness Score", "Investor Interest") and placeholder paragraph content.
        (Done)

    5.  **Adjust Layout:**
        *   Use a main `div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"` below the welcome message/loading indicators.
        *   Place the "Company Overview" `Card` in the first column (e.g., `lg:col-span-1`).
        *   Place the other four placeholder `Card`s in the remaining two columns (e.g., two cards in `lg:col-span-1`, two cards in the last `lg:col-span-1`, possibly using nested grids or adjusting spans).
        (Done)

    6.  **Update Task Definition:**
        *   Add this task definition to `cursor_project_rules/project-tasks.md`. (Done)

    7.  **Commit:**
        *   Commit all changes. (Done)

## Task 7: Enhance Investor Dashboard with Placeholders and Data Fetching

*   **Status:** In Progress
*   **Goal:** Structure the Investor Dashboard to dynamically display the logged-in investor's basic information fetched from the (mocked) database and include clearly defined placeholder sections for deal flow, AI suggestions, and watchlist using Flowbite `Card` components and a grid layout.
*   **Detailed Steps:**

    1.  **Define Investor Data Type:**
        *   In `frontend/src/types/database.ts`, define an `InvestorProfile` interface reflecting the fields submitted by `AuthRegisterInvestor.tsx` (e.g., `user_id`, `job_title`, `company_name`, `preferred_industries`, `preferred_geography`, `preferred_stage`, `website`, `linkedin_profile`) plus Supabase auto-fields (`id`, `created_at`). Ensure array fields (`preferred_industries`, etc.) are typed correctly (e.g., `string[]`). (Done)

    2.  **Implement Data Fetching in `InvestorDashboard.tsx`:**
        *   Import necessary hooks (`useState`, `useEffect`), components (`Spinner`, `Alert`), types (`InvestorProfile`), context (`useAuth`), and Supabase client.
        *   Add state variables: `investorData`, `dataLoading`, `dataError`.
        *   Add `useEffect` hook (dependency `[user]`) to fetch data using `supabase.from('investors').select('*').eq('user_id', user.id).single()`. Handle loading, success, and error states.
        *   Render loading (`Spinner`) and error (`Alert`) indicators conditionally. (Done)

    3.  **Create Investor Overview Card:**
        *   Import `Card` from `flowbite-react`.
        *   Render a `Card` titled "Investor Profile Summary".
        *   Conditionally display `investorData` fields if available (e.g., `job_title`, `company_name`). Display arrays like `preferred_industries` appropriately (e.g., as a comma-separated string or list items).
        *   Use fallback text ("N/A") for missing fields.
        *   Display "No investor profile found." if data is fetched but null. (Done)

    4.  **Remove Old Placeholders & Add New Placeholder Cards:**
        *   Remove imports and usage of `LatestDeal` and `PopularProducts`.
        *   Create three new `Card` components with appropriate titles ("Deal Flow", "AI-Suggested Startups", "Watchlist Summary") and placeholder paragraph content. (Done)

    5.  **Adjust Layout:**
        *   Use a main `div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"` below the welcome message/loading indicators.
        *   Place the "Investor Profile Summary" `Card` in the first column (`lg:col-span-1`).
        *   Place the three new placeholder `Card`s ("Deal Flow", "AI-Suggested Startups", "Watchlist Summary") in the remaining two columns (`lg:col-span-2`), potentially using a nested grid or stacking them. (Done)

    6.  **Update Task Definition:**
        *   Add this detailed task definition to `cursor_project_rules/project-tasks.md`. (Done)

    7.  **Commit:**
        *   Commit all related changes. (Done)

--- 

## Task 8: Implement Mock Data Handlers for Profile Fetching

*   **Status:** Done
*   **Goal:** Create MSW handlers to intercept Supabase `GET` requests (specifically `.select().eq('user_id', ...).single()`) for the `startups` and `investors` tables, returning predefined mock profile data corresponding to the requested `user_id`. This will allow the dashboards to display data for users like `startup@rise.com`.
*   **Detailed Steps:**

    1.  **Define Mock Startup Profile Data (`startup.ts`):**
        *   **File:** `frontend/src/api/mocks/handlers/startup.ts`
        *   **Action:** Define `const mockStartupProfiles: { [userId: string]: StartupProfile }` mapping user IDs (e.g., `'mock-startup-uuid-1'`) to `StartupProfile` objects containing plausible data.
        *   **(Done)**

    2.  **Implement Startup Select Handler (`startup.ts`):**
        *   **File:** `frontend/src/api/mocks/handlers/startup.ts`
        *   **Action:** Add `http.get(\`\${supabaseUrl}/rest/v1/startups\`, ...)` handler.
        *   Parse `request.url` to extract `user_id` from `?user_id=eq.USER_ID`.
        *   Check if `select=*` is present and `user_id` filter exists.
        *   Look up `user_id` in `mockStartupProfiles`.
        *   Return found profile object with status 200, or a 406 error object if not found (mimicking `.single()`).
        *   **(Done)**

    3.  **Define Mock Investor Profile Data & Handler (`investor.ts`):**
        *   **File:** `frontend/src/api/mocks/handlers/investor.ts` (New File)
        *   **Action:** Create file, define `const mockInvestorProfiles`, and implement `http.get(\`\${supabaseUrl}/rest/v1/investors\`, ...)` handler similar to step 2, using `mockInvestorProfiles`.
        *   **(Done)**

    4.  **Update `mockHandlers.ts`:**
        *   **File:** `frontend/src/api/mocks/handlers/mockHandlers.ts`
        *   **Action:** Import `investorHandlers` from `./investor` and add `...investorHandlers` to the `mockHandlers` array.
        *   **(Done)**

    5.  **Update Task Definition:**
        *   Add this task definition to `cursor_project_rules/project-tasks.md`. (Done)

    6.  **Commit:**
        *   Commit all related changes. (Done) 