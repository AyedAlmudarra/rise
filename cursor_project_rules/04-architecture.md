# 4. System Architecture

This document describes the high-level architecture and structural organization of the RISE platform.

## Overview
RISE utilizes a modern web architecture with a React frontend, a Supabase backend-as-a-service (BaaS), and integrates OpenAI for its AI capabilities.

```mermaid
graph TD
    A[User Browser] --> B{React Frontend (MaterialM Template)};
    B --> C{Supabase Client SDK};
    C --> D[Supabase Auth];
    C --> E[Supabase Database (Postgres)];
    C --> F[Supabase Storage];
    B --> G{Supabase Edge Functions (REST API)};
    G --> E;
    G --> F;
    G --> H{OpenAI API (Fine-tuned Models)};
    I[Admin Interface] --> G;
    I --> D;
    I --> E;
    I --> F;

    subgraph Frontend
        B
    end

    subgraph Backend (Supabase)
        C
        D
        E
        F
        G
    end

    subgraph External Services
        H
    end

    subgraph Administration
        I
    end
```

## Frontend (React Application)
*   **Foundation:** Built using the MaterialM React Admin Template.
*   **Structure:** Adheres strictly to the folder structure provided by the MaterialM template. Components, pages, hooks, services, etc., will be organized according to the template's conventions.
*   **UI Components:** Leverages Material UI, Headless UI, Shadcn, and Flowbite React as provided by the template.
*   **Data Fetching:** Primarily uses SWR for client-side data fetching and caching, interacting directly with Supabase via its client SDK or calling Supabase Edge Functions for custom logic.
*   **State Management:** Specific library TBD, but will manage application-wide state (e.g., user session, notifications) and potentially complex local component state.
*   **Routing:** Handled by the routing solution included in the template (likely React Router).

## Backend (Supabase)
*   **Core Services:** Supabase provides Authentication, a PostgreSQL Database, and File Storage.
*   **Direct Interaction:** The frontend interacts directly with Supabase services (Auth, DB, Storage) via the Supabase JS client library for standard CRUD operations and real-time subscriptions where applicable.
*   **Custom Logic & API:** Supabase Edge Functions (written in TypeScript/Deno) host the custom backend logic:
    *   Serve as the REST API endpoints for actions not covered by direct Supabase SDK calls.
    *   Contain logic for interacting with the OpenAI API (preparing data, making calls, processing responses).
    *   Implement complex business logic, authorization checks, and data validation.
    *   Used for tasks like AI analysis triggers, matchmaking algorithms, and potentially administrative functions.

## AI Integration (OpenAI)
*   **Service:** Uses fine-tuned models hosted by OpenAI.
*   **Interaction:** Supabase Edge Functions act as intermediaries. They receive requests from the frontend, format data appropriately, securely call the OpenAI API using API keys stored as Supabase secrets, process the results, and return them to the frontend.
*   **Fine-tuning:** The process and data for fine-tuning OpenAI models are managed separately.

## Data Storage
*   **Structured Data:** Stored in the Supabase PostgreSQL database. Schema will be designed to represent users (startups, investors, admins), company profiles, financials, metrics, relationships, requests, etc.
*   **Unstructured Data (Files):** Stored in Supabase Storage (e.g., pitch decks, financial reports). Access control policies will be implemented using Supabase Storage permissions, often linked to Supabase Auth user roles and specific grant logic (e.g., data room access).

## Folder Structure
*   The project will maintain the folder structure defined by the `materialm-react-admin-v1-0-2` template.
*   Supabase Edge Functions will reside in the `supabase/functions` directory as per Supabase conventions. 