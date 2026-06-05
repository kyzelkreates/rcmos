/**
 * ============================================================
 * TrustSheild OS™ — Route Registry
 * Run 1 — Safe Identity Refactor
 * ============================================================
 * COMPATIBILITY NOTE:
 * Route paths are intentionally preserved from the original
 * Fleet/Driver build for localStorage, PWA install, and
 * internal service compatibility.
 * Visible UI labels have been updated to TrustSheild OS™
 * crisis/reputation management language.
 * Route path renaming continues in Run 2+.
 * ============================================================
 */

export const ROUTES = {
  // ── Core ──────────────────────────────────────────────────
  ROOT:       '/',
  DASHBOARD:  '/dashboard',

  // ── Crisis / Reputation Cases (legacy: fleet) ─────────────
  FLEET:          '/fleet',
  FLEET_VEHICLE:  '/fleet/:vehicleId',

  // ── Response Contacts / PWA Users (legacy: drivers) ───────
  DRIVERS:         '/drivers',
  DRIVER_PROFILE:  '/drivers/:driverId',

  // ── Cases / Reputation Items (legacy: vehicles) ───────────
  VEHICLES:        '/vehicles',
  VEHICLE_DETAIL:  '/vehicles/:vehicleId',

  // ── Send Update / Escalate (legacy: dispatch) ─────────────
  DISPATCH: '/dispatch',

  // ── PWA Responder Setup (legacy: driver-setup) ────────────
  DRIVER_SETUP: '/driver-setup',

  // ── Action Guidance (legacy: navigation) ──────────────────
  NAVIGATION: '/navigation',
  AP3X:       '/ap3x',

  // ── AI Command Centre ─────────────────────────────────────
  AI: '/ai',

  // ── Compliance & Trust Risk ───────────────────────────────
  COMPLIANCE: '/compliance',

  // ── Reputation Risk AI ────────────────────────────────────
  SAFETY: '/safety',

  // ── Analytics ─────────────────────────────────────────────
  ANALYTICS: '/analytics',

  // ── Incident Reports ──────────────────────────────────────
  INCIDENTS:        '/incidents',
  INCIDENT_DETAIL:  '/incidents/:incidentId',

  // ── Stakeholder Messaging ─────────────────────────────────
  MESSAGING: '/messaging',

  // ── Settings ──────────────────────────────────────────────
  SETTINGS:               '/settings',
  SETTINGS_PROFILE:       '/settings/profile',
  SETTINGS_FLEET:         '/settings/fleet',
  SETTINGS_AI:            '/settings/ai',
  SETTINGS_SECURITY:      '/settings/security',
  SETTINGS_INTEGRATIONS:  '/settings/integrations',

  // ── Auth ──────────────────────────────────────────────────
  AUTH_LOGIN:   '/auth/login',
  AUTH_LOGOUT:  '/auth/logout',
  AUTH_DRIVER:  '/auth/driver',

  // ── Error ─────────────────────────────────────────────────
  NOT_FOUND: '*',
}

// ─── Navigation structure for sidebar ────────────────────────
// Labels updated to TrustSheild OS™ crisis/reputation language
export const NAV_ITEMS = [
  {
    id:    'dashboard',
    label: 'Trust Overview',
    route: ROUTES.DASHBOARD,
    icon:  'LayoutDashboard',
    group: 'core',
  },
  {
    id:    'fleet',
    label: 'Crisis Command',
    route: ROUTES.FLEET,
    icon:  'ShieldAlert',
    group: 'operations',
  },
  {
    id:    'drivers',
    label: 'Response Contacts',
    route: ROUTES.DRIVERS,
    icon:  'Users',
    group: 'operations',
  },
  {
    id:    'vehicles',
    label: 'Active Cases',
    route: ROUTES.VEHICLES,
    icon:  'FolderOpen',
    group: 'operations',
  },
  {
    id:    'dispatch',
    label: 'Send Update / Escalate',
    route: ROUTES.DISPATCH,
    icon:  'Send',
    group: 'operations',
  },
  {
    id:        'driver-setup',
    label:     'Set Up Response PWA',
    route:     ROUTES.DRIVER_SETUP,
    icon:      'Smartphone',
    group:     'operations',
    highlight: true,
  },
  {
    id:    'navigation',
    label: 'Live Update Feed',
    route: ROUTES.NAVIGATION,
    icon:  'Radio',
    group: 'liveops',
  },
  {
    id:        'ai',
    label:     'AI Command Centre',
    route:     ROUTES.AI,
    icon:      'Brain',
    group:     'intelligence',
    highlight: true,
  },
  {
    id:    'safety',
    label: 'Reputation Risk AI',
    route: ROUTES.SAFETY,
    icon:  'ShieldCheck',
    group: 'intelligence',
  },
  {
    id:    'compliance',
    label: 'Compliance & Trust',
    route: ROUTES.COMPLIANCE,
    icon:  'ClipboardCheck',
    group: 'intelligence',
  },
  {
    id:    'analytics',
    label: 'Analytics',
    route: ROUTES.ANALYTICS,
    icon:  'BarChart3',
    group: 'intelligence',
  },
  {
    id:    'incidents',
    label: 'Incident Reports',
    route: ROUTES.INCIDENTS,
    icon:  'AlertTriangle',
    group: 'reporting',
  },
  {
    id:    'messaging',
    label: 'Stakeholder Messaging',
    route: ROUTES.MESSAGING,
    icon:  'MessageSquare',
    group: 'reporting',
  },
  {
    id:    'settings',
    label: 'Settings',
    route: ROUTES.SETTINGS,
    icon:  'Settings',
    group: 'system',
  },
]

export const NAV_GROUPS = {
  core:         { label: null,                    order: 0 },
  operations:   { label: 'Crisis Operations',     order: 1 },
  liveops:      { label: 'Live Ops',              order: 2 },
  intelligence: { label: 'AI Intelligence',       order: 3 },
  reporting:    { label: 'Reporting & Evidence',  order: 4 },
  system:       { label: 'System',                order: 5 },
}

export default ROUTES
