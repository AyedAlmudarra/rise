# RISE: Startup & Investor Connection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Placeholder: Update license if different -->
<!-- Add other relevant badges: Build Status, Coverage, etc. -->

## Overview

**RISE** is an innovative business management platform designed to connect Startups and Investors within the Saudi Arabian market. Leveraging the power of AI, RISE facilitates analysis, matchmaking, and communication to foster growth and investment opportunities.

This repository contains the core codebase for the RISE platform.

## Technology Stack

*   **Frontend:** React (Vite), TypeScript, MaterialM Template, Tailwind CSS, Flowbite React
*   **Backend & DB:** Supabase (PostgreSQL, Auth, Edge Functions)
*   **AI:** OpenAI API
*   **Testing:** Vitest, React Testing Library, Cypress
*   **Deployment:** Netlify

## Key Features

*   **Dual User Roles:** Separate dashboards and functionalities for Startups and Investors.
*   **Profile Management:** Detailed profile creation for both startups and investors.
*   **AI-Powered Analysis:** Automated analysis of startup data to generate insights and readiness scores.
*   **Matchmaking:** AI-driven suggestions connecting relevant startups and investors (Future Scope).
*   **Communication Tools:** In-app messaging and connection requests (Future Scope).

## Project Structure

*   `/frontend`: Contains the main React frontend application, Supabase function definitions, configuration, and tests.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn/pnpm)
*   Supabase Account (for database, auth, and API keys)
*   OpenAI API Key (for AI features)
*   [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local function testing/management)

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AyedAlmudarra/rise.git
    cd rise
    ```

2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Environment Variables:**
    *   Create a file named `.env.local` in the `/frontend` directory.
    *   Add the following environment variables, replacing the placeholder values with your actual credentials:
        ```dotenv
        # Supabase Project Details
        VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

        # OpenAI API Key (ensure this is kept secure and ideally not exposed directly to the frontend if possible)
        # Consider using a Supabase Edge Function as a proxy if security is paramount.
        VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY 
        ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (or the port specified by Vite).

### Running Tests

1.  **Run unit and integration tests (Vitest):**
    ```bash
    npm test 
    # or for coverage
    npm run coverage
    ```
2.  **Run end-to-end tests (Cypress):**
    *   Open Cypress GUI: `npm run cy:open`
    *   Run Cypress tests headlessly: `npm run cy:run`

## Deployment

This project is configured for deployment via Netlify. Configuration details can be found in `frontend/netlify.toml`. Pushes to the `main` branch should trigger automatic deployments (assuming Netlify integration is set up).

## Contributing

<!-- Add contribution guidelines here: How to report bugs, suggest features, submit PRs, coding standards, etc. -->
Currently, contributions are managed internally. Please contact the project maintainers for details.

## License

<!-- Specify the project's license -->
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if one exists).

## Support

For issues, questions, or support, please contact [Your Name/Email or relevant contact point]. 