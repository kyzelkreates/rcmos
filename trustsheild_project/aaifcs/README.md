# TrustSheild OS™

> **AI-Assisted Reputation Protection & Crisis Response Platform**
> Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™

---

## Overview

TrustSheild OS™ is a full-stack-ready reputation protection and crisis response platform built with React, Vite, Tailwind CSS, Zustand, and a complete PWA layer. It enables organisations, individuals, and PR/legal teams to monitor, triage, and coordinate crisis response in real time — with AI-assisted advisory guidance, a mobile Response PWA for distributed responders, and a complete Supabase-ready backend schema.

---

## Product Identity

| Field | Value |
|---|---|
| **Product Name** | TrustSheild OS™ *(spelling is intentional — not TrustShield)* |
| **Tagline** | AI-Assisted Reputation Protection & Crisis Response Platform |
| **Branding Line** | Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™ |
| **Build** | 12-run refactor — Run 12 complete |

---

## What It Does

- **Monitor & Triage** active reputation risks and crisis cases with structured severity scoring
- **Assign Response Tasks** to specific PWA users (clients, legal contacts, PR responders, staff)
- **Coordinate Evidence** — collect, timestamp, and audit evidence and incident timelines
- **Draft Stakeholder Updates** — AI-advisory drafts reviewed by a human before sending
- **Mobile Response PWA** — responders receive tasks, submit situation updates, evidence, and escalation requests from any device
- **Demo Mode / Live Mode** — full demo with realistic sample data OR empty live-ready state for real backend use
- **Backend-Ready** — complete Supabase SQL schema with RLS enabled; supports Supabase, Firebase, AWS, or generic REST
- **4P3X AI Advisory Agents** — 8 specialised agents for triage, risk, crisis coordination, drafting, evidence, stakeholder updates, recovery planning, and PWA guidance

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS + custom CSS design tokens |
| State | Zustand (14 stores — single source of truth via `core_storage.js`) |
| Local Persistence | localStorage (`trustsheild_*` prefix) |
| Routing | React Router v6 (hash-based `/#/...`) |
| PWA | Vite PWA plugin + custom service worker |
| Backend (ready) | Supabase-compatible SQL schema + RLS |
| AI Advisory | Demo advisory mode; safe backend-proxy pattern for live |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet / OpenStreetMap |

---

## Project Structure

```
/
├── index.html                              ← App entry, favicon, OG meta tags
├── main.jsx                                ← React root mount
├── app_App.jsx                             ← Root component + providers
├── app_Router.jsx                          ← Hash router + all routes
├── config_app.js                           ← APP_CONFIG: name, branding, buildStage
├── config_routes.js                        ← ROUTES + NAV_ITEMS + NAV_GROUPS
│
├── core_storage.js                         ← ⭐ SSOT: all 14 Zustand stores + persist helpers
├── data_trustsheild_demo.js                ← Demo seed data: cases, tasks, PWA identities, feed
│
├── pages_Dashboard.jsx                     ← TrustSheild Command Dashboard (13 tabs)
├── pages_DriverApp.jsx                     ← TrustSheild Response PWA
├── pages_Landing.jsx                       ← /welcome — investor/demo explainer
├── pages_Settings.jsx                      ← System settings
├── pages_AI.jsx                            ← AI Command Centre page
├── pages_AP3X.jsx                          ← AP3X HUD / mobile operations panel
├── pages_Analytics.jsx                     ← Analytics & reporting
├── pages_Compliance.jsx                    ← Compliance & trust checks
├── pages_Dispatch.jsx                      ← Send updates / escalate
├── pages_Drivers.jsx                       ← Response contacts
├── pages_Fleet.jsx                         ← Crisis command (case list)
├── pages_Incidents.jsx                     ← Incident reports
├── pages_Messaging.jsx                     ← Stakeholder messaging
├── pages_Navigation.jsx                    ← Live case map
├── pages_Safety.jsx                        ← Reputation risk AI
├── pages_Vehicles.jsx                      ← Active cases detail
│
├── layouts_AppShell.jsx                    ← App shell + scroll-to-top
├── layouts_Sidebar.jsx                     ← Burger drawer navigation
├── layouts_TopNav.jsx                      ← Top navigation bar
│
├── styles_globals.css                      ← Global CSS + ts-* design system tokens
├── tailwind.config.js                      ← ts-* colour palette + custom fonts
├── vite.config.js                          ← Vite + PWA manifest + service worker config
│
├── modules_tasks_TaskConfigPanel.jsx       ← PWA Task Configuration panel
├── modules_ai_AgentCentre.jsx              ← 4P3X AI Agent Centre UI
├── modules_ap3x_ApiConfigPanel.jsx         ← Backend/API Configuration Centre
├── modules_sync_SyncControlPanel.jsx       ← Dashboard ↔ PWA Sync Control
├── modules_ai_AICommandPanel.jsx           ← AI quick-command panel
├── modules_ai_useAIChat.js                 ← AI chat hook
│
├── services_trustsheild_ai_agents.js       ← AI agent definitions + safety filters
├── services_trustsheild_sync.js            ← Sync engine (demo/live adapter)
├── services_supabase_supabaseClient.js     ← Supabase client (anon key only)
├── services_supabase_authService.js        ← Auth service (Supabase Auth)
├── services_realtime_realtimeService.js    ← Realtime subscription layer
├── services_realtime_telemetryService.js   ← Telemetry/status service
├── services_sync_liveSync.js               ← Live sync coordinator
├── services_sync_driverSyncService.js      ← PWA-side sync service
│
├── sql_7_trustsheild_supabase_setup.sql.txt  ← ⭐ Full Supabase schema (RLS enabled)
│
├── public/
│   ├── trustsheild-logo.svg               ← Full product logo (SVG)
│   ├── trustsheild-icon.svg               ← Compact PWA/favicon icon
│   ├── icons/icon-192x192.png             ← PWA manifest PNG (192×192)
│   ├── icons/icon-512x512.png             ← PWA manifest PNG (512×512)
│   └── sw-job-sync.js                     ← Custom service worker (job sync)
│
├── README.md                              ← This file
└── TRUSTSHEILD_OS_FINAL_HANDOFF.md        ← Full production handoff document
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone the repo
git clone https://github.com/kyzelkreates/TrustSheild.git
cd TrustSheild

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at:
- **Welcome / Intro:** `http://localhost:5173/#/welcome`
- **Command Dashboard:** `http://localhost:5173/#/dashboard`
- **Response PWA:** `http://localhost:5173/#/driver-app`

### Build for Production

```bash
npm run build
# Output → dist/
```

---

## Demo Mode vs Live Mode

### Demo Mode (default — no backend required)
All features work immediately with realistic sample data:
- 8 AI advisory agents
- Sample reputation cases, tasks, PWA identities, pairing codes
- Dashboard ↔ PWA sync (local/demo)
- Evidence, timeline, drafts, stakeholder updates

**Toggle:** Dashboard header → "Demo Mode" switch

### Live Mode (requires backend)
- Demo data hidden — no demo/live data mixing
- Empty live-ready dashboard and PWA states
- Backend/API configuration panel becomes prominent
- PWA submissions queue locally until backend connected

**To activate live mode:** Configure a backend provider in the **Backend** tab of the dashboard.

---

## PWA Install

TrustSheild OS™ is a fully installable PWA.

| Setting | Value |
|---|---|
| `start_url` | `/#/driver-app` — opens Response PWA |
| `display` | `standalone` |
| `theme_color` | `#050505` |
| `short_name` | `TrustSheild OS` |

> ⚠️ **Important:** The installed PWA always opens the **Response PWA** (`/#/driver-app`), not the Command Dashboard. This is by design — the PWA is for field responders; the dashboard is accessed via browser.

---

## PWA Identity & Pairing

Each Response PWA user gets a unique identity generated from the Command Dashboard:

```
PWA ID format:    TS-PWA-0001
Pairing code:     TS-7K2F-91QX
```

- Generated in **Dashboard → PWA Identities** tab
- Each identity: display name, role, organisation, linked case, assigned tasks
- Pairing codes are demo/local in Demo Mode
- Real secure pairing requires live backend + auth layer

**Available roles:**
Client Contact · PR Responder · Legal Contact · Staff Member · Agency Lead · Customer Support Lead · Community Manager · Founder / Business Owner · Internal Communications Contact · Reputation Response Team Member

---

## 4P3X API Config Guard™

The frontend automatically **blocks** any attempt to save backend-only secrets:

| Blocked Pattern | Reason |
|---|---|
| `SERVICE_ROLE_KEY` / `service_role` | Supabase backend-only secret |
| `OPENAI_API_KEY` | AI provider — backend only |
| `GROQ_API_KEY` | AI provider — backend only |
| `STRIPE_SECRET_KEY` | Payment secret — backend only |
| `sk-*` (20+ chars) | OpenAI/Stripe key pattern |
| `DATABASE_URL` | Backend connection string |
| `JWT_SECRET` | Auth secret — backend only |
| `private_key` | Service account key |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase admin — backend only |
| `AWS_SECRET_ACCESS_KEY` | AWS backend secret |

> **Rule:** Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe to expose via `VITE_*` env vars — and only after RLS is verified.

---

## Supabase SQL Setup

The full database schema is in:
```
sql_7_trustsheild_supabase_setup.sql.txt
```

### What's included
- All TrustSheild OS™ tables (cases, tasks, PWA identities, evidence, updates, logs)
- **Row Level Security (RLS) ENABLED** on all tables
- Safe `authenticated` user policies (scoped to `auth.uid()`)
- No broad allow-all or anonymous full-access policies
- Indexes for performance
- Verification queries
- Commented rollback guidance

### How to execute

1. Open your **Supabase project → SQL Editor**
2. Paste the full contents of `sql_7_trustsheild_supabase_setup.sql.txt`
3. Click **Run**
4. Verify RLS: check that all tables show `rowsecurity = true`
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment
6. **Never** put the service role key in the frontend

---

## 4P3X Intelligent AI™ Advisory Agents

8 specialised advisory agents — all work in Demo Mode without API keys:

| Agent | Purpose |
|---|---|
| **Trust Triage** | Classify reputation incidents by severity and urgency |
| **Reputation Risk** | Assess risk vectors and recommend monitoring strategy |
| **Crisis Response** | Coordinate response timeline and action priorities |
| **Response Drafting** | Draft stakeholder communications with appropriate tone |
| **Evidence & Timeline** | Structure incident documentation and evidence review |
| **Stakeholder Update** | Prepare audience-specific update messaging |
| **Recovery Plan** | Plan post-crisis trust restoration steps |
| **PWA Guidance** | Task-specific guidance for Response PWA users |

### AI Safety Boundaries

The AI safety filter blocks requests to generate:
- Fake reviews, fake testimonials, astroturfing
- Impersonation, harassment, threats, blackmail
- Misinformation, defamatory claims
- Guaranteed reputation repair claims
- Automatic public posting instructions
- Private surveillance or doxxing content

> **All AI outputs are advisory only.** A responsible human must review every output before any public, legal, media, or stakeholder action is taken.

---

## Dashboard Tabs

| Tab | Purpose |
|---|---|
| Trust Overview | KPIs, active case summary, risk heat map |
| Active Risks | Reputation risk register with severity scoring |
| Crisis Command | Active crisis case management and coordination |
| Live Feed | Real-time update feed from PWA responders |
| PWA Identities | Manage responder identities and pairing codes |
| PWA Task Config | Create and configure tasks sent to PWA users |
| Evidence | Evidence collection, timeline, audit log |
| Drafts | Response draft review and approval |
| Updates | Stakeholder update management |
| Backend | Live Backend Configuration Centre |
| AI Agents | 4P3X Intelligent AI™ Advisory Agent Centre |
| Sync Centre | Dashboard ↔ PWA sync control and queue |
| Legacy Tasks | (compatibility) legacy task assignments |

---

## Design System

TrustSheild OS™ uses the **4P3X Verse™** visual identity:

| Token | Value | Use |
|---|---|---|
| `--bg-main` | `#050505` | Page background |
| `--metal-gold` | `#d6a84f` | Primary accent, headings |
| `--metal-silver` | `#c8ccd2` | Secondary text, borders |
| `--ai-green` | `#37ff8b` | Status active, online |
| `--ai-purple` | `#8f5cff` | AI outputs, insights |
| `--text-main` | `#f5f5f2` | Body text |

CSS utilities: `ts-glass`, `ts-card-safe`, `ts-pulse-green`, `ts-pulse-gold`, `ts-badge`, `ts-scanlines`

---

## Deployment

### Vercel
```bash
npm run build
vercel deploy dist/
```

### Netlify
```bash
npm run build
# Deploy dist/ — add _redirects: /* /index.html 200
```

### Environment Variables (Live Mode only)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

> Never put service role keys, private keys, or AI provider keys in `.env` files committed to this repo. Use your hosting provider's secure env vars for anything sensitive.

---

## Ethical & Legal Boundaries

TrustSheild OS™ is designed for **ethical reputation protection** only.

It must **not** be used to:
- Automate harassment, astroturfing, or fake reviews
- Impersonate individuals or organisations
- Generate threats, blackmail, or deceptive content
- Perform unlawful takedown activity
- Enable private surveillance or doxxing
- Make defamatory claims or spread misinformation

> **"Monitoring and sync should only be used for owned brands, authorised clients, public information sources, or lawful business/reputation purposes."**

---

## Known Limitations

- PNG icons in `public/icons/` are placeholder files — generate proper PNGs from the SVG for production PWA quality on Android
- Live backend sync requires SQL execution + Supabase credentials
- AI advisory is demo-mode only until a safe backend AI proxy is configured
- Pairing codes are local/demo only — real secure pairing requires the auth layer
- No email/SMS/WhatsApp PWA invite sharing yet

---

## Next Optional Upgrades

1. **Supabase Auth** — real JWT login, RLS activation
2. **Live AI proxy** — safe backend endpoint for AI provider calls
3. **WhatsApp/Email PWA invites** — share pairing codes via messaging
4. **Supabase Realtime** — instant dashboard ↔ PWA sync via subscriptions
5. **Evidence file uploads** — Supabase Storage for photos/documents
6. **Audit PDF export** — incident timeline + evidence PDF
7. **Multi-tenant** — separate organisations with full data isolation
8. **Web push notifications** — escalation and task assignment alerts
9. **Custom AI provider** — connect chosen AI service via safe proxy

---

## Build History

| Run | Feature |
|---|---|
| Run 1 | Safe ZIP refactor + 4P3X Verse™ visual identity |
| Run 2 | TrustSheild Command Dashboard structure |
| Run 3 | TrustSheild Response PWA structure + PWA install |
| Run 4 | Dashboard-configurable PWA tasks/actions |
| Run 5 | Unique PWA ID + pairing/sync-code system |
| Run 6 | Demo Mode / Live Mode toggle + separation |
| Run 7 | Backend/API config UI + 4P3X API Config Guard™ |
| Run 8 | Full Supabase SQL schema (RLS enabled) |
| Run 9 | Dashboard ↔ PWA sync engine wiring |
| Run 10 | 4P3X Intelligent AI™ advisory agent layer |
| Run 11 | Branding, logo, icons, PWA polish, responsive UI |
| Run 12 | Final QA, terminology cleanup, production handoff |

---

## Licence

Private project — Created by Kyzel Kreates™.  
All rights reserved. Not for redistribution without permission.

---

*TrustSheild OS™ — AI-Assisted Reputation Protection & Crisis Response Platform*  
*Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™*
