# 2. Technology Stack

This document outlines the primary technologies, libraries, and services used in the RISE platform.

## Frontend
*   **Framework/Library:** React (Version specified in MaterialM template)
*   **Language:** TypeScript (v5.6.2, as per MaterialM)
*   **UI Kit/Template:** MaterialM React Admin Template (v1.0.2)
    *   Includes Material UI
*   **UI Utility Libraries (from Template):**
    *   Headless UI (v2.1.2)
    *   Shadcn Components
    *   Flowbite React (v2.5.2)
*   **Data Fetching/State Management (from Template):** SWR (v2.3.0)
*   **State Management (Core):** TBD (To be determined later)
*   **Routing:** React Router (or the specific router used by the MaterialM template)

## Backend & Infrastructure
*   **Platform:** Supabase
    *   **Authentication:** Supabase Auth
    *   **Database:** Supabase Postgres Database
    *   **Storage:** Supabase Storage (for files like pitch decks, reports)
    *   **Serverless Functions:** Supabase Edge Functions (for API endpoints, AI integration logic)
*   **API:** RESTful APIs built primarily using Supabase Edge Functions.

## AI & Machine Learning
*   **Provider:** OpenAI API
*   **Model:** Fine-tuned models (specific models TBD)
*   **Integration:** Via Supabase Edge Functions which call the OpenAI API.

## Development & Operations
*   **Version Control:** Git (Platform TBD, e.g., GitHub, GitLab)
*   **Package Manager:** npm or yarn (align with template)
*   **Linting/Formatting:** ESLint & Prettier (using template's configuration)
*   **Deployment:** TBD
*   **Testing:** Frameworks TBD (initial focus on code quality).

## Languages
*   **Primary Development:** English
*   **Future Support:** Arabic (leveraging template's multi-language capabilities) 



*   **UI Utility Libraries (from Template):**
    *   Headless UI (v2.1.2)
    *   Shadcn Components (via `@radix-ui/*` dependencies)
    *   Flowbite React (v0.10.2)
*   **Data Fetching/State Management (from Template):** SWR (v2.2.5)
*   **State Management (Core):** TBD (React Context used by template for Customizer, Dashboard)
*   **Routing:** React Router (v7.0.2)
*   **Charting:** ApexCharts (via `react-apexcharts`)
*   **Package Manager:** npm (based on `package-lock.json`)
*   **Linting/Formatting:** ESLint & Prettier (using template's configuration)
*   **API Mocking (Dev):** MSW (Mock Service Worker)
*   **Deployment:** TBD
*   **Testing:** Frameworks TBD (initial focus on code quality). 