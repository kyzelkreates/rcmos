# TrustSheild OS™

**AI-Assisted Reputation Protection & Crisis Response Platform**

> Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™

---

## Product Overview

TrustSheild OS™ helps organisations protect trust, respond to reputation risks, manage crisis actions, coordinate stakeholder updates, log evidence, and keep dashboard-connected PWA users aligned during fast-moving reputation events.

### Who It Serves
- Reputation management agencies
- PR crisis teams
- Small businesses
- Founders and startup teams
- Creators and public figures
- Local organisations
- Client-facing consultants
- Legal/compliance support teams
- Customer support teams handling public issues
- Internal communications teams
- Community management teams
- Agencies managing multiple clients

---

## System Architecture

### 1. TrustSheild Command Dashboard
The central control interface for the reputation/crisis team.
- Trust Overview
- Crisis Operations
- AI Command Centre
- Analytics & Reporting
- Stakeholder Messaging
- System Settings

### 2. TrustSheild Response PWA
An installable progressive web app for responders, clients, staff, PR teams, legal/compliance users, and external crisis contacts.
- Receives dashboard-pushed updates and tasks
- Submits situation updates, evidence, confirmations
- Offline-capable with local-first sync
- PWA installable on any device

### 3. Sync & Update Flow
- Dashboard configures and sends updates/tasks to PWAs
- PWA users submit responses, evidence, confirmations back to dashboard
- 24/7 update flow with demo mode by default

---

## Modes

| Mode       | Status            | Notes                                          |
|------------|-------------------|------------------------------------------------|
| Demo Mode  | ON (default)      | All data is local/simulated                    |
| Live Mode  | OFF (default)     | Requires backend configuration                 |
| Backend    | Not configured    | Supabase / Firebase / AWS / custom endpoint    |

---

## Ethical Advisory

> ⚠️ **AI guidance is advisory and must be reviewed by a responsible human before action.**

TrustSheild OS™ is built for ethical reputation protection and crisis support. It must not be used to automate harassment, astroturfing, fake reviews, fake testimonials, impersonation, threats, blackmail, deception, defamation, misinformation, or unlawful takedown activity.

---

## Future AI Agents (coming in later runs)

| Agent                    | Purpose                                        |
|--------------------------|------------------------------------------------|
| Trust Triage Agent       | Initial rapid risk assessment                  |
| Reputation Risk Agent    | Ongoing monitoring and threat scoring          |
| Crisis Response Agent    | Coordinated crisis response guidance           |
| Response Drafting Agent  | Human-reviewed draft communications            |
| Evidence & Timeline Agent| Structured evidence logging                    |
| Stakeholder Update Agent | Automated stakeholder comms coordination       |
| Recovery Plan Agent      | Structured trust recovery action planning      |

---

## Run Status

| Run | Status     | Scope                                                  |
|-----|------------|--------------------------------------------------------|
| 1   | ✅ Complete | Safe identity refactor + futuristic visual identity    |
| 2   | Planned    | TrustSheild Command Dashboard structure                |
| 3   | Planned    | Response PWA identity + task system foundation         |
| 4   | Planned    | Evidence & incident logging                            |
| 5   | Planned    | Unique PWA ID / pairing code / multi-responder system  |
| 6   | Planned    | Demo/live toggle + backend config UI                   |
| 7+  | Planned    | AI agents, Supabase SQL, full sync system              |

---

## Branding

```
TrustSheild OS™
AI-Assisted Reputation Protection & Crisis Response Platform
Powered by 4P3X Intelligent AI™
Created by Kyzel Kreates™
```

> **SPELLING LOCK:** The product name is TrustSheild OS™ — do not auto-correct to TrustShield.

---

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3 + custom CSS variables
- Zustand (state management)
- React Router v6 (hash router)
- Vite PWA Plugin + Workbox
- Supabase (backend — future configuration)
- Lucide React (icons)

---

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

---

## Project Structure

All source files live flat in the project root (no subdirectory nesting).
File naming convention: `type_module_Component.jsx` or `type_module.js`

---

*TrustSheild OS™ is created by Kyzel Kreates™. Powered by 4P3X Intelligent AI™.*

---

## TrustSheild OS™ Supabase Setup (Run 8)

### SQL File Location

```
sql_7_trustsheild_supabase_setup.sql.txt
```

Located in the project root alongside the other `sql_*.txt` files.

### How to Run

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Open `sql_7_trustsheild_supabase_setup.sql.txt`.
4. Run **each section in order** (Extensions → Functions → Tables → Indexes → Triggers → RLS → Policies → Verification).
5. Run the **Verification Queries** (Section 9) to confirm the schema is correct.
6. Do NOT run the rollback section unless explicitly reverting.

### Important Security Notes

- **RLS is ENABLED** on all 23 user-facing tables.
- All policies use `user_has_org_access()` — authenticated users only see records belonging to their organisation.
- **NEVER** place `SUPABASE_SERVICE_ROLE_KEY` in the frontend.
- Use only the public **anon key** in the frontend, **after** verifying RLS policies are correctly configured.
- No anonymous full-access policies exist. No broad "allow all" policies exist.

### Tables Created (23)

`organisations` · `profiles` · `tracked_entities` · `reputation_cases` · `crisis_incidents` · `pwa_identities` · `pwa_pairing_sessions` · `pwa_tasks` · `pwa_task_updates` · `live_update_feed` · `evidence_items` · `response_drafts` · `response_draft_reviews` · `stakeholder_updates` · `escalation_requests` · `backend_provider_configs` · `api_provider_configs` · `entity_provider_map` · `api_test_results` · `sync_events` · `ai_agent_logs` · `reports` · `audit_logs`

### Run Status

- **Run 8** — SQL file created. No live backend connection yet.
- **Run 9** — Will wire Supabase client + dashboard ↔ PWA sync engine.

### Ethical Notice

Monitored entities must be owned brands, authorised clients, or public information sources only. No private surveillance, harassment, doxxing, or unauthorised tracking. AI guidance is advisory and must be reviewed by a responsible human before action.

---

## TrustSheild OS™ Sync Setup (Run 9)

- **Demo/local sync** works without any backend — dashboard and PWA share the same local SSOT.
- **Live sync** requires backend provider configuration (Backend tab in Command Dashboard).
- **Supabase live sync** requires executing `sql_7_trustsheild_supabase_setup.sql.txt` first, then configuring Project URL + anon key.
- **RLS must remain enabled** — never disable RLS policies.
- **Use anon key only** in frontend configuration. Service role key must never be used in frontend.
- **Offline queue** stores pending PWA submissions locally until sync is available (`trustsheild_sync_queue`).
- **Data freshness warnings** are shown when backend is not connected or queue is pending.
- Sync aligns with: `sql_7_trustsheild_supabase_setup.sql.txt`

---

## TrustSheild OS™ Branding + PWA Notes (Run 11)

### Product Name Spelling Lock
**TrustSheild OS™** — note the 'ei' spelling. Do NOT auto-correct to TrustShield.

### Branding Line
```
Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
```
Use the `globalBrand` constant from `config_app.js` wherever the branding line appears.

### Colour Tokens (CSS variables in `styles_globals.css`)
| Token            | Value                    |
|------------------|--------------------------|
| `--bg-main`      | `#050505`                |
| `--metal-gold`   | `#d6a84f`                |
| `--metal-silver` | `#c8ccd2`                |
| `--ai-green`     | `#37ff8b`                |
| `--ai-purple`    | `#8f5cff`                |
| `--text-main`    | `#f5f5f2`                |

### PWA Start URL Rule
- The installed PWA **must** open `/#/driver-app` (the TrustSheild Response PWA).
- Do NOT change `start_url` away from `/#/driver-app`.
- The Command Dashboard is at `/#/dashboard`.

### Logo Assets
- `public/trustsheild-logo.svg` — full logo with text
- `public/trustsheild-icon.svg` — compact icon for favicon/PWA
- PNG icons: `public/icons/icon-192x192.png` + `public/icons/icon-512x512.png`
  (replace with generated PNGs from the SVG for production)

### Welcome / Landing Page
- Route: `/#/welcome` (public — no auth required)
- Investor/demo-ready explainer

### Demo Mode vs Live Mode
- **Demo Mode** — shows the product with realistic sample data. No backend required.
- **Live Mode** — requires backend provider (Supabase/Firebase/REST) configured in Backend tab.

### Run 12
Final run handles: QA, cross-browser testing, console clean-up, ZIP export, GitHub push, production handoff notes.
