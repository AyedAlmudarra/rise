# 11. Mock Data Strategy

This document outlines the strategy for using mock data during the initial development phase of the RISE platform frontend.

## Approach
*   **Tool:** We will utilize the **Mock Service Worker (MSW)** library, which is already integrated into the MaterialM template.
*   **Location:** All mock API request handlers and mock data definitions will reside within the existing `src/api/mocks/` directory provided by the template.
*   **Initialization:** The MSW worker is initialized in `src/main.tsx` (conditionally, likely for development builds only).

## Purpose
*   **Rapid UI Development:** Using MSW allows us to build and test UI components and user flows quickly with predictable data, without waiting for the full backend (Supabase, Edge Functions, OpenAI) integration.
*   **Decoupling:** It decouples frontend development from backend development initially.

## Workflow
1.  **Define API Contracts:** As we develop features, we will define the expected request/response structures for the APIs the frontend will eventually call (Supabase endpoints, custom Edge Function endpoints).
2.  **Implement Mock Handlers:** Create or modify handlers within `src/api/mocks/` to intercept frontend API calls (e.g., using `rest.get`, `rest.post` from MSW) and return mock data matching the defined contracts.
3.  **Develop UI:** Build React components and views that make API calls (e.g., using SWR or standard fetch) as if interacting with the real backend. MSW will intercept these calls and provide the mock responses.

## Transition to Real APIs
*   **Planned Removal:** The entire MSW setup (`src/api/mocks/` directory and its initialization in `src/main.tsx`) is **temporary** and intended **only for the initial UI development phase.**
*   **Replacement:** Once the relevant UI sections are built, dedicated tasks will be created in the `implementation-plan.mdc` to:
    *   Remove the corresponding mock handlers from `src/api/mocks/`.
    *   Implement the actual API calls using the `supabase-js` client library or `fetch` calls to Supabase Edge Functions within the appropriate `src/api/` modules, hooks, or components.
    *   Eventually, remove the MSW dependency and initialization entirely once all features are connected to the real backend.

This strategy ensures we can leverage the template's built-in mocking for speed while clearly defining the plan for replacing it with live integrations later. 