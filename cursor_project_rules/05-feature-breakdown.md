# 5. Core Feature Breakdown

This document lists the core features of the RISE platform, broken down by user role.

## Common Features
*   **Authentication:** Secure Sign-up, Login, Password Reset, Email Verification (via Supabase Auth).
*   **Profile Management:** Basic profile editing (name, email).
*   **Notifications:** In-app notification system (e.g., for requests, messages).

## Startup Features (`role=startup`)
*   **Dashboard:**
    *   Private overview with key metrics (Revenue, Burn Rate, MRR, Churn).
    *   Investor Interest Tracker (views, requests).
    *   AI Insights Panel (displaying results from analysis).
*   **Profile Management (Extended):**
    *   Company Details (Description, Business Model, Industry, Location, Stage).
    *   Team Members & Roles.
    *   Funding Rounds History (Amount, Investors, Dates).
    *   Traction Metrics (Users, Customers).
    *   Financial Data Input (Monthly Revenue, Burn Rate, CAC, LTV).
    *   Pitch Deck Upload & Management (Supabase Storage).
    *   Vision & Mission Statement.
*   **AI Tools:**
    *   On-demand Business Analysis (trigger via button).
    *   Funding Readiness Score (auto-calculated/updated).
    *   (Potential Future: Competitor Comparison).
*   **Investor Relations:**
    *   View curated list of AI-matched Investors.
    *   Receive & Manage Access Requests from Investors.
    *   Grant/Revoke Access to Data Room (Pitch Deck, Financials).
    *   Direct Messaging (once connection approved).
    *   Funding Application Submission (if applicable).
*   **Reporting:**
    *   Financial Report Builder (PDF/CSV export).

## Investor Features (`role=investor`)
*   **Dashboard:**
    *   Overview of deal flow.
    *   Display of AI-suggested Startups ("Startups You Should Watch").
    *   Watchlist/Portfolio Summary.
*   **Profile Management (Extended):**
    *   Investment Preferences (Budget, Industries, Stage, Geography).
    *   Investment Thesis (optional text field).
    *   Portfolio Management (list of invested/followed startups).
*   **Startup Discovery:**
    *   Browse/Search Startup Profiles.
    *   Advanced Filtering (Industry, Stage, Revenue, Region, AI Score).
    *   Sorting Options (Potential, Growth, Funding Status).
*   **Interaction:**
    *   View Startup Profiles (limited view initially).
    *   Request Access to Startup Data Room (Pitch Deck, Financials).
    *   View Data Room content upon approval.
    *   Save Startups to Watchlist.
    *   Initiate Connection/Direct Message (upon mutual approval).
*   **AI Tools:**
    *   AI-generated Startup Scoring.
    *   Risk Alerts based on startup data.
    *   (Potential Future: Market Trend Analysis).

## Platform Administrator Features (`role=admin`)
*   **User Management:**
    *   View/Search all users (Startups, Investors).
    *   Verify/Approve user accounts (if needed).
    *   Manage user roles and permissions.
    *   Suspend/Deactivate accounts.
*   **Content Moderation:**
    *   Review/Approve sensitive uploads (Pitch Decks, Financials - if moderation enabled).
    *   Flag/Remove inappropriate content.
*   **Platform Monitoring:**
    *   View platform usage analytics.
    *   Monitor system health.
    *   Review access logs (Data Room access, Admin actions).
*   **Settings & Configuration:**
    *   Manage feature toggles.
    *   Configure platform-wide settings.
    *   (Potential Future: Manage newsletter/communication templates).
*   **Support:**
    *   Handle user support tickets/reports. 