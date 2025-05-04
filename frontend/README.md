# RISE Frontend

This directory contains the React frontend application for the RISE platform.

## Technology Stack

*   **Framework:** React (using Vite)
*   **Language:** TypeScript
*   **UI:** MaterialM Template, Tailwind CSS, Flowbite React
*   **State Management:** React Context API (primarily for Auth)
*   **Routing:** React Router DOM
*   **API Client:** Supabase Client Library
*   **Testing:** Vitest, React Testing Library, Cypress

## Available Scripts

In this (`frontend`) directory, you can run the following commands:

### `npm run dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) (or the port specified by Vite) to view it in the browser.
The page will automatically reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner (Vitest) in interactive watch mode.

### `npm run coverage`

Runs tests with Vitest and generates a coverage report.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include hashes.

### `npm run preview`

Serves the production build locally for previewing before deployment.

### `npm run cy:open`

Opens the Cypress test runner GUI.

### `npm run cy:run`

Runs Cypress end-to-end tests headlessly.

## Environment Variables

This project requires environment variables for connecting to Supabase and potentially other services (like OpenAI).

1.  Create a `.env.local` file in this `frontend` directory.
2.  Add the required variables (see the root `README.md` for details), for example:
    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    ```

## Supabase Functions

The definitions and code for Supabase Edge Functions used by this application are located within the `frontend/supabase/functions` directory. Refer to the Supabase documentation and the root `README.md` for more details on local development and deployment of these functions.

## Deployment

This frontend is configured for deployment via Netlify, as specified in `netlify.toml`.

---
