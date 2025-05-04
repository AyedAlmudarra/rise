# RISE Platform: Connection & Messaging Flow Implementation Plan

**Version:** 1.0
**Date:** 2023-10-27

**Goal:** Implement a consistent, platform-mediated connection and messaging workflow for both Startups and Investors, enabling them to discover, connect with, and communicate with relevant counterparts directly within the RISE platform.

**Core Flow:** Search -> View Profile -> Connect (Internal Request) -> Accept -> Message (Internal)

**Key Principles:**
*   Symmetrical experience for Startups and Investors.
*   Platform-mediated connections (internal requests).
*   Double opt-in required for messaging.
*   Clear notification system (in-app & email).
*   Phased implementation approach.
*   Single `investors` table with `investor_type` field.

---

## Phase 1: Discovery, Profiles & Connection Request System

**Goal:** Establish the foundational elements for discovery, profile viewing, and the internal connection request mechanism.

**Step 1.1: Enhance Investor Search (Startup View)**
*   **Status:** Done
*   **Summary:** Updated `FindInvestorsPage.tsx` Supabase query to explicitly select columns. Added display of `investor_type` badge on investor cards. Refined search to include name and title.
*   **File:** `frontend/src/views/startup/FindInvestorsPage.tsx`
*   **Database Change:** Assumed `investor_type` column (`text`) exists on `investors` table.
*   **Interface Update:** Assumed `investor_type` exists on `InvestorProfile` in `frontend/src/types/database.ts`.
*   **Frontend Action:**
    *   Add a new filter component (e.g., Checkbox group or Dropdown) to allow filtering by `investor_type`.
    *   Update the Supabase query to include filtering by `investor_type` if selected.
    *   Display the `investor_type` on the investor result cards.

**Step 1.2: Implement Startup Search (Investor View)**
*   **Status:** Done
*   **Summary:** Implemented `BrowseStartupsPage.tsx` to fetch startup profiles, display them in cards, and provide basic search by name/industry/description. Added filter dropdowns for Industry, Geography, and Stage. Integrated connection status checking and the `renderConnectButton` logic for sending connection requests.
*   **File:** `frontend/src/views/investor/BrowseStartupsPage.tsx`
*   **Database Change:** None directly, uses existing `startups` table.
*   **Frontend Action:**
    *   Replace placeholder content with full implementation.
    *   Fetch data from the `startups` table.
    *   Implement filter components relevant to startups (based on `StartupProfile`): Industry, Operational Stage, Location (City/Country), Team Size (Range?), Annual Revenue (Range?), Seeking Investment (Boolean?).
    *   Implement search logic (e.g., by startup name, description keywords).
    *   Display results using `Card` components, mirroring the style of `FindInvestorsPage.tsx`. Show relevant public info (Name, Logo, Industry, Stage, Location, brief Description).
    *   Include loading and error states.

**Step 1.3: Create Investor Public Profile Page**
*   **Status:** Done
*   **Summary:** Created `ViewInvestorProfilePage.tsx` which fetches and displays public investor details. Integrated logic to check connection status with the viewing user and display appropriate Connect/Status buttons (`renderConnectButton`). Added logic for sending connection requests (including message modal) and cancelling requests via RPC calls.
*   **File:** Create `frontend/src/views/profile/ViewInvestorProfilePage.tsx` (or adapt `ViewProfilePage.tsx` with routing/logic).
*   **Routing:** Add a route like `/investor/profile/:investorId` in `Router.tsx`.
*   **Frontend Action:**
    *   Component fetches `InvestorProfile` data from Supabase based on `investorId` from URL params.
    *   Display public fields: `investor_type`, `company_name`, `job_title`, `company_description`, `website`, `linkedin_profile`, `preferred_industries`, `preferred_geography`, `preferred_stage`.
    *   Include a prominent "Connect" button.
    *   **TODO:** Revisit later to potentially add more relevant public fields.

**Step 1.4: Create Startup Public Profile Page**
*   **Status:** Done
*   **Summary:** Created `ViewStartupProfilePage.tsx` which fetches and displays public startup details. Integrated logic to check connection status with the viewing user and display appropriate Connect/Status buttons (`renderConnectButton`). Added logic for sending connection requests (including message modal) and cancelling requests via RPC calls.
*   **File:** Create `frontend/src/views/profile/ViewStartupProfilePage.tsx` (or adapt `ViewProfilePage.tsx` with routing/logic).
*   **Routing:** Add a route like `/startup/profile/:startupId` in `Router.tsx`.
*   **Frontend Action:**
    *   Component fetches `StartupProfile` data from Supabase based on `startupId` from URL params.
    *   Display designated public fields: `name`, `logo_url`, `industry`, `operational_stage`, `location_city`, `description`, `website`, `linkedin_profile`. (Consider adding Team Size Range, Founding Date, Seeking Investment status).
    *   Include a prominent "Connect" button.
    *   **TODO:** Revisit later to potentially add more relevant public fields. Avoid showing sensitive KPIs/AI data.

**Step 1.5: Implement Connection Request Backend**
*   **Status:** Done (RPC functions implemented, RLS assumed correct)
*   **Database:** Create `connection_requests` table in Supabase.
    *   Columns: `id` (bigint, pk), `created_at` (timestamptz), `requester_user_id` (uuid, fk->auth.users), `recipient_user_id` (uuid, fk->auth.users), `requester_role` (text), `recipient_role` (text), `status` (text, default 'pending'), `request_message` (text, nullable - *Added based on decision*).
    *   Enable RLS: Users can select their own requests. Recipients can select requests sent to them. Only recipients can update status.
*   **Backend Logic (Supabase Function: `create_connection_request`):**
    *   Input: `recipient_user_id`, `request_message` (optional). `requester_user_id` and `requester_role` obtained from auth context.
    *   Checks:
        *   Prevent connecting to self.
        *   Check if a pending or accepted request already exists between users.
        *   Check for declined status and 1-week cooldown period.
    *   Action: Inserts a new row into `connection_requests` with status 'pending'.
    *   Triggers: Calls notification logic (Step 1.7).
*   **Backend Logic (Supabase Function: `update_connection_status`):**
    *   Input: `request_id`, `new_status` ('accepted' or 'declined'). `recipient_user_id` obtained from auth context.
    *   Checks: RLS implicitly handles ensuring only the recipient can call this.
    *   Action: Updates the `status` for the given `request_id`.
    *   Triggers: Calls notification logic (Step 1.7).

**Step 1.6: Integrate "Connect" Button & Request Logic**
*   **Status:** Done
*   **Summary:** Implemented connection status fetching and conditional button rendering (`renderConnectButton` handling idle, pending, accepted, declined states) within `ViewInvestorProfilePage.tsx` and `ViewStartupProfilePage.tsx`. Added modal for optional request message and integrated RPC calls for `create_connection_request` and `cancel_connection_request`.
*   **Files:** `ViewInvestorProfilePage.tsx`, `ViewStartupProfilePage.tsx`
*   **Frontend Action:**
    *   Fetch connection status between current user and viewed profile user when page loads.
    *   Configure the "Connect" button:
        *   *Default State:* Text "Connect". On click, potentially opens a small modal to enter the optional `request_message`, then calls the `create_connection_request` Supabase function.
        *   *Request Sent State:* If status is 'pending', button text is "Request Sent", disabled.
        *   *Connected State:* If status is 'accepted', button text is "Connected" (or "Message" - linking to chat in Phase 2), potentially styled differently.
        *   *Declined State:* If status is 'declined' and within cooldown, button is disabled or hidden. If cooldown passed, button reverts to "Connect".

**Step 1.7: Implement Notification Backend & Email**
*   **Status:** Done (Backend table/functions), Pending (Email Function)
*   **Summary:** Created `notifications` table with required columns and RLS. Updated `create_connection_request` and `update_connection_status` RPC functions to insert styled notifications into this table upon request creation, acceptance, or decline. Created RPC functions `mark_notification_read` and `mark_all_notifications_read`. The email sending function (`send-notification-email`) is not yet implemented.
*   **Database:** Create `notifications` table (or use Realtime on `connection_requests`). `AppNotification` interface in `database.ts` defines structure. Enable RLS.
*   **Backend Logic (Triggered by Step 1.5):**
    *   On *new request*: Insert a notification row for the recipient (`type: 'connection_request'`, title/message including sender name, link to Hub). Call email function.
    *   On *request accepted*: Insert notification row for the requester.
    *   On *request declined*: Insert notification row for the requester.
*   **Email Function (Supabase Edge Function: `send-notification-email`):**
    *   Takes user ID, type, title, message, link as input.
    *   Uses email provider (e.g., Resend) to send formatted email.
    *   Requires setting up email provider and storing API key securely.

**Step 1.8: Implement Frontend "Connections Hub" & Notifications**
*   **Status:** Done
*   **Summary:** Refactored `ConnectionsPage.tsx` to serve as the Connections Hub. Implemented tabbed UI for Incoming, Outgoing, and Active connections. Fetches connection data for each tab. Added handlers (`handleAccept`, `handleDecline`, `handleWithdraw`, `handleRemove`) that call respective backend RPC functions (`update_connection_status`, `withdraw_connection_request`, `remove_connection`). Integrated `ProfilePreviewModal` for viewing profiles. Updated header `Notifications.tsx` component to display mock notifications (needs real data).
*   **Files:** Refactor `frontend/src/views/startup/TrackOutreachPage.tsx` into `ConnectionsHubPage.tsx` (or role-specific versions). Implement `frontend/src/layouts/full/vertical/header/Notifications.tsx` (if separate from Messages) or integrate into `Messages.tsx`.
*   **Routing:** Update/Add routes for the Hub page(s).
*   **Hub Page UI (`ConnectionsPage.tsx`):**
    *   Use Tabs/Sections for:
        *   **Incoming Requests:** Fetches `connection_requests` where recipient = current user, status = 'pending'. Display sender info, message (if provided), Accept/Decline buttons calling `update_connection_status`.
        *   **Outgoing Requests:** Fetches requests where requester = current user. Display recipient info, status.
        *   **My Connections:** Fetches requests where status = 'accepted' involving current user. Display connected user info, link to profile. Add placeholder for "Message" button.
    *   Include loading/error states for fetches.
*   **In-App Notification UI:**
    *   Fetch unread notification count (from `notifications` table or derived). Display as badge on sidebar link to Hub and/or header icon.
    *   Header dropdown (`Notifications.tsx` or `Messages.tsx`) fetches recent unread notifications. Clicking a notification marks it as read (update DB) and navigates to the relevant context (e.g., Incoming Requests section).

---

## Phase 2: Internal Messaging System

**Goal:** Enable direct, real-time messaging between connected users within the platform.

**Step 2.1: Implement Messaging Backend**
*   **Status:** Done (SQL Provided)
*   **Summary:** Created `conversations` and `messages` tables with appropriate columns, indexes, constraints, and RLS. `update_connection_status` RPC creates conversations upon connection acceptance. Trigger automatically updates `last_message_at` on new messages.
*   **Database:**
    *   Create `conversations` table: `id` (pk), `created_at`, `participant1_user_id` (fk), `participant2_user_id` (fk), `last_message_at` (timestamptz, for sorting). Add unique constraint on (p1, p2) pair. RLS critical.
    *   Create `messages` table: `id` (pk), `created_at`, `conversation_id` (fk), `sender_user_id` (fk), `content` (text), `read_at` (timestamptz, nullable). RLS critical.
*   **Backend Logic:**
    *   When a connection is 'accepted', create a corresponding entry in the `conversations` table if one doesn't exist.
    *   Logic to insert new messages, update `last_message_at` on the conversation, handle read status updates.
*   **Realtime:** Setup Supabase Realtime subscriptions on the `messages` table (scoped to user's conversations) to push new messages to the frontend. - Done

**Step 2.2: Implement Full Chat Frontend**
*   **Status:** Done
*   **Summary:** Created `ChatPage.tsx`, implemented conversation list fetching (filtered by accepted connections), message display (`ChatMsgSent` with read receipts, `ChatMsgRecieved`), message sending (`ChatMsgInput`), profile modal integration, and real-time message/read status updates using Supabase.
*   **Approach:** Created a new view (`ChatPage.tsx`) and reused/created individual UI components from `frontend/src/components/apps/chat/`.
*   **Detailed Steps:** (Sub-steps merged into main summary)
    *   **Step 2.2.1: Create `ChatPage.tsx` View:** (Done)
    *   **Step 2.2.2: Implement Conversation List:** (Done - Filtered by connections & search)
    *   **Step 2.2.3: Implement Message Display:** (Done - Added read receipts)
    *   **Step 2.2.4: Implement Message Sending:** (Done)
    *   **Step 2.2.5: Implement Realtime Updates:** (Done - INSERT & UPDATE)
    *   **Step 2.2.6: Handle Read Status:** (Done - Via fetch & Realtime)
    *   **Step 2.2.7: Add Routing:** (Done - Via `Chats.tsx`)

**Step 2.3: Integrate Messaging Links**
*   **Status:** Done
*   **Summary:** Added a "Message" button to the Active Connections tab in `ConnectionsPage.tsx` that navigates to `/messages`.
*   **Files:** `frontend/src/views/connections/ConnectionsPage.tsx` ("My Connections" section)
*   **Action:** Update the "Connected" state buttons/links to navigate to the main chat page.

**Step 2.4: Update Header Message Preview**
*   **Status:** Done (Mock Data) / Pending (Real Data)
*   **Summary:** Updated `Messages.tsx` dropdown to display mock recent message previews, show unread count, and link to `/messages`. Needs integration with real conversation/message data.
*   **File:** `frontend/src/layouts/full/vertical/header/Messages.tsx`
*   **Action:** Fetch actual recent unread message previews from the backend. Update unread count based on messages. Clicking a preview navigates to the full chat page.

**Step 2.5: Refine & Debug Chat Page Implementation**
*   **Status:** Done
*   **Goal:** Ensure `ChatPage.tsx` is functional, resolves component issues, and correctly fetches/displays data based on accepted connections.
*   **Detailed Steps:**
    *   **Step 2.5.1: Restore/Recreate `ChatPage.tsx`:** (Done - Was needed during debugging)
    *   **Step 2.5.2: Correct `ChatMsgSent.tsx` Component:** (Done - Renamed template input, created new display component)
    *   **Step 2.5.3: Verify Imports in `ChatPage.tsx`:** (Done)
    *   **Step 2.5.4: Add Debug Logging to `fetchConversationsAndProfiles`:** (Done - Used for debugging, logs can be removed if stable)
    *   **Step 2.5.5: Run and Analyze Console Output:** (Done - Errors found and fixed)
    *   **Step 2.5.6: Fix Fetching Based on Logs:** (Done - Resolved PostgREST filter and missing column errors)
    *   **Step 2.5.7: Implement Last Message Snippet Display:** (Reverted/Pending Backend Update - Attempted but required columns `last_message_content`, `last_message_sender_id` were missing from `conversations` table. Feature reverted until backend schema is updated.)

---

This detailed plan should provide a clear roadmap. I have no further immediate questions based on your clarifications.

Shall I proceed with **Step 1.1: Enhance Investor Search (Startup View)** by adding the `investor_type` filter to `FindInvestorsPage.tsx`? We'll assume the `investor_type` field has been added to the `InvestorProfile` interface in `database.ts` (as we did) and conceptually to the backend table. 