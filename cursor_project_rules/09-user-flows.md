# 9. User Flows

This document provides a detailed, step-by-step description of the key user flows within the RISE platform.

---

## 1. User Onboarding Process

### Startup Onboarding Flow
| Step | Description |
|------|-------------|
| **1. Visit Homepage** | User clicks "Join as Startup" → navigates to `/signup/startup` |
| **2. Fill Registration Form** | Enters personal and business data (name, email, startup info, industry, etc.) |
| **3. Role Assignment** | On submission, user is created in Supabase with `role = startup` |
| **4. Email Verification** | User receives email verification link via Supabase |
| **5. First Login Redirect** | After login, redirected to `/dashboard` with role check |
| **6. Guided Profile Setup** | Stepper UI prompts to: Upload logo, write company bio, add financials, upload pitch deck |
| **7. AI Initialization** | AI auto-generates initial "Funding Readiness Score" based on submitted data |
| **8. Dashboard Access** | Full access to dashboard, insights, and funding page |

---

### Investor Onboarding Flow
| Step | Description |
|------|-------------|
| **1. Visit Homepage** | User clicks "Join as Investor" → navigates to `/signup/investor` |
| **2. Fill Registration Form** | Provides investment focus, budget, thesis, region |
| **3. Role Assignment** | Supabase creates user with `role = investor` |
| **4. Email Verification** | Confirms account |
| **5. First Login Redirect** | Redirected to `/investor/dashboard` |
| **6. Define Preferences** | Guided stepper to set filters (industry, stage, geography) |
| **7. Dashboard Activation** | Receives suggested startups from AI |

---

## 2. Requesting & Granting Access to Data Rooms

RISE features a **controlled data room system**, allowing secure sharing of startup documents with investors.

### Investor Request Access Flow
| Step | Description |
|------|-------------|
| **1. View Startup Profile** | From `/investor/startups`, investor clicks a profile |
| **2. Click "Request Access"** | Sends request to startup owner via Supabase `access_requests` table |
| **3. Status = Pending** | Investor sees "Waiting for approval" label in UI |
| **4. Startup Receives Notification** | Startup sees the request in `/funding` page or notification center |
| **5. Click "Grant Access"** | Updates request status to "approved" and grants investor token-based file access (Supabase Storage) |
| **6. Investor Accesses Data Room** | UI reveals secured pitch decks, financials, and team data |

> All access is **logged** with timestamps and tied to user IDs for compliance.

---

## 3. Using AI Features: Trigger to Output Flow

RISE integrates **two core AI modules**:
1.  Business Health & Trend Analysis
2.  Matchmaking Engine

---

### Business Analysis AI Flow
| Step | Description |
|------|-------------|
| **1. Startup Visits Dashboard** | On load, basic KPIs are shown from Supabase |
| **2. Click "Run Analysis"** | Button triggers call to Supabase Edge Function `/analyze-business` |
| **3. Backend Processes:** | Pulls financials → prepares data for OpenAI → calls OpenAI API → processes response |
| **4. Response Returned** | Includes: Financial health score, AI observations, red flags |
| **5. Insights Displayed** | Component updates with:
    *   📊 Growth Trend
    *   🧠 AI Tips (e.g., reduce CAC)
    *   ⚠️ Risk Flags (e.g., burn > revenue)

---

### AI Matchmaking Flow
| Step | Description |
|------|-------------|
| **1. Startup Completes Profile** | Must include pitch deck, funding stage, and financial metrics |
| **2. Visit Funding Page (`/funding`)** | Triggers matchmaking logic (potentially via Edge Function call) |
| **3. AI API Runs Matching Algorithm** | Edge function prepares data (startup profile, investor preferences) → calls OpenAI API → processes response |
| **4. Response → Ranked Matches** | Displayed as cards with:
    *   Investor name
    *   Match Score
    *   Shared interests
    *   CTA: Request Intro |
| **5. Intro Request Sent** | Adds row in `match_requests` table; notifies investor |

---

## 4. Admin Workflow

Admins will use a lightweight **internal panel** (likely integrated within the main app under an `/admin` route or using the Supabase Studio UI) for platform operations.

### Admin Role Functions
| Action | Details |
|--------|---------|
| **User Management** | View all users (startups, investors), roles, signup date, status |
| **Moderate Pitch Decks** | Approve/reject uploads before visibility (optional flag in Supabase) |
| **Review Access Logs** | See access history to data rooms |
| **Flag Suspicious Activity** | Based on rapid file views, repeated requests, fake profiles |
| **Reset User Data** | Reset passwords, unlock suspended accounts |
| **Feature Toggles** | Enable/disable AI features per user (e.g., Beta test only for early adopters) |

---

## Summary of Core Flows

| Actor    | Flow             | Entry Point             | Outcome                               |
|----------|------------------|-------------------------|---------------------------------------|
| Startup  | Onboarding       | `/signup/startup`       | Guided profile setup + insights       |
| Investor | Onboarding       | `/signup/investor`      | Preferences set → matched startups    |
| Startup  | Share data       | `/funding` page         | Grant access to pitch + financials    |
| Investor | Discover         | `/investor/startups`    | Request intro + view profiles         |
| Startup  | Use AI Analysis  | `/dashboard`, `/ai-insights` | Analysis & recommendations            |
| Startup  | Use AI Matchmake | `/funding` page         | Suggested investor list               |
| Admin    | Moderate/Manage  | `/admin` or Supabase UI | Platform integrity & oversight        |

--- 