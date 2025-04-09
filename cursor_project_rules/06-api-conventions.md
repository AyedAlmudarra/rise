# 6. API Conventions

This document outlines the conventions for designing and implementing APIs within the RISE platform, primarily focusing on the RESTful APIs exposed via Supabase Edge Functions.

## General Principles
*   **Standard:** Adhere to RESTful principles for API design.
*   **Format:** Use JSON for request and response bodies.
*   **Authentication:** API endpoints requiring authentication must be protected using Supabase's authentication mechanisms (e.g., JWT verification within Edge Functions).
*   **Authorization:** Implement role-based access control within Edge Functions to ensure users can only access resources and perform actions appropriate for their role (Startup, Investor, Admin).

## Endpoint Naming
*   Use plural nouns for resource collections (e.g., `/api/v1/startups`, `/api/v1/investors`).
*   Use specific IDs for individual resources (e.g., `/api/v1/startups/{startupId}`).
*   Use verbs for actions that don't fit standard CRUD operations where necessary, but prefer resource-based interactions.
*   Prefix custom API routes with `/api/v{version}` (e.g., `/api/v1/`).

## HTTP Methods
*   `GET`: Retrieve resources.
*   `POST`: Create new resources or trigger actions.
*   `PUT`/`PATCH`: Update existing resources (PUT for full replacement, PATCH for partial updates).
*   `DELETE`: Remove resources.

## Status Codes
*   Use standard HTTP status codes appropriately (e.g., `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).

## Error Handling
*   Provide meaningful error messages in the response body for client-side errors (4xx).
*   Log server-side errors (5xx) thoroughly for debugging, but avoid exposing sensitive details in the response.
*   A consistent error response structure should be used, e.g.:
    ```json
    {
      "error": {
        "code": "ERROR_CODE",
        "message": "Descriptive error message"
      }
    }
    ```

## Versioning
*   Include the API version in the URL path (e.g., `/api/v1/`). 