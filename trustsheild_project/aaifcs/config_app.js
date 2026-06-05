/**
 * ============================================================
 * TrustSheild OS™ — App Configuration
 * Run 1 — Safe Identity Refactor + Futuristic Visual Identity
 * ============================================================
 * Product:   TrustSheild OS™
 * Subtitle:  AI-Assisted Reputation Protection & Crisis Response Platform
 * AI Engine: Powered by 4P3X Intelligent AI™
 * Creator:   Created by Kyzel Kreates™
 * ============================================================
 * IMPORTANT: Internal variable names (e.g. apex:, fleetStore) are
 * preserved for legacy localStorage/state compatibility.
 * Visible UI text now reflects TrustSheild OS™ branding.
 * Full product mode conversion continues in Run 2+.
 * ============================================================
 */

export const APP_CONFIG = {
  // ── Product Identity ──────────────────────────────────────
  name:        'TrustSheild OS™',
  shortName:   'TrustSheild',
  version:     '1.0.0',
  buildStage:  'Run 6 — Demo/Live Toggle + Empty Live Mode Separation',

  // Branding lines used globally across UI
  brandLine:   'Powered by 4P3X Intelligent AI™',
  creatorLine: 'Created by Kyzel Kreates™',
  globalBrand: 'Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™',

  tagline:     'AI-Assisted Reputation Protection & Crisis Response Platform',

  // Ethical advisory notice — must appear in AI output areas
  aiAdvisory:  'AI guidance is advisory and must be reviewed by a responsible human before action.',

  // ── Product Modules (Run 1 — names prepared, features in future runs) ─
  products: {
    // Primary: Dashboard Command Centre
    commandDashboard: {
      name:   'TrustSheild Command Dashboard',
      short:  'Command Dashboard',
      route:  '/dashboard',
    },
    // Secondary: Response PWA (formerly Driver PWA — preserved route for compatibility)
    responsePWA: {
      name:   'TrustSheild Response PWA',
      short:  'Response PWA',
      // NOTE: Route /driver-app preserved for internal compatibility (Run 5 will rename)
      route:  '/driver-app',
    },
  },

  // ── Demo / Live Mode ──────────────────────────────────────
  // Run 6 will fully implement demo/live toggle with backend config UI
  mode: {
    demo:         true,   // Demo Mode ON by default
    live:         false,  // Live Mode OFF until backend configured
    backendReady: false,  // Set true when Supabase/Firebase/AWS endpoint is configured
  },

  // ── Future AI Agents (labels prepared — built in future runs) ───────
  aiAgents: {
    trustTriage:       'Trust Triage Agent',
    reputationRisk:    'Reputation Risk Agent',
    crisisResponse:    'Crisis Response Agent',
    responseDrafting:  'Response Drafting Agent',
    evidenceTimeline:  'Evidence & Timeline Agent',
    stakeholderUpdate: 'Stakeholder Update Agent',
    recoveryPlan:      'Recovery Plan Agent',
  },

  // ── Future PWA Task Types (labels prepared — built in future runs) ──
  pwaTaskTypes: {
    confirmUpdate:        'Confirm Update Received',
    submitSituationUpdate: 'Submit Situation Update',
    uploadEvidence:       'Upload Evidence / Notes',
    completeAction:       'Complete Assigned Action',
    requestEscalation:    'Request Escalation',
    approveDraft:         'Approve Draft Response',
    checkIn:              'Send Availability Check-in',
    addFeedback:          'Add Customer / Witness Feedback',
    logSocialIssue:       'Log Social Media Issue',
    markComplete:         'Mark Task Complete',
    syncDashboard:        'Sync With Dashboard',
  },

  // ── Theme ─────────────────────────────────────────────────
  theme: {
    default: 'dark',
    options: ['dark'],
  },

  // ── Feature Flags ─────────────────────────────────────────
  features: {
    // Active in Run 1
    sidebar:          true,
    topnav:           true,
    pwa:              true,
    routing:          true,
    futuristicTheme:  true,  // NEW: TrustSheild visual identity applied

    // Future runs
    auth:             false,
    maps:             false,
    ai:               false,
    realtime:         false,
    offline:          false,
    notifications:    false,
    pwaUniqueId:      false, // Run 5 — unique PWA ID / pairing code per responder
    backendConfig:    false, // Run 6 — Supabase/Firebase/AWS config UI
    aiAgents:         false, // Run 7+ — full AI agent system
    sqlSchema:        false, // Future — supabase SQL setup
  },
}

export default APP_CONFIG
