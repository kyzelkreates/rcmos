/**
 * ============================================================
 * TrustSheild OS™ — Single Source of Truth
 * Run 2 — Command Dashboard State Extension
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * ALL system state reads and writes go through this module.
 * NO secondary state engines.
 * NO duplicate localStorage keys.
 * NO hard-coded UI state outside this file.
 *
 * COMPATIBILITY NOTE:
 * - Legacy apex: localStorage keys preserved for existing auth/map/nav/PWA sync.
 * - New TrustSheild OS™ keys use trustsheild: namespace.
 * - Legacy store names (useFleetStore, useDriverStore) preserved for PWA compat.
 * ============================================================
 */

import { create } from 'zustand'

// ─── Storage Keys ─────────────────────────────────────────────
export const STORAGE_KEYS = {
  // App (legacy — preserved)
  APP_THEME:          'apex:app:theme',
  APP_SIDEBAR:        'apex:app:sidebar',
  APP_LOCALE:         'apex:app:locale',

  // Auth (legacy — preserved)
  AUTH_SESSION:       'apex:auth:session',
  AUTH_USER:          'apex:auth:user',
  AUTH_ROLE:          'apex:auth:role',

  // Fleet (legacy — preserved for internal compat)
  FLEET_ACTIVE_VIEW:  'apex:fleet:activeView',
  FLEET_FILTERS:      'apex:fleet:filters',
  FLEET_SELECTED:     'apex:fleet:selected',

  // Map (legacy — preserved)
  MAP_PROVIDER:       'apex:map:provider',
  MAP_CENTER:         'apex:map:center',
  MAP_ZOOM:           'apex:map:zoom',
  MAP_LAYER:          'apex:map:layer',

  // AI (legacy — preserved)
  AI_PROVIDER:        'apex:ai:provider',
  AI_MODEL:           'apex:ai:model',
  AI_CONFIG:          'apex:ai:config',

  // Driver/Responder (legacy — preserved for PWA sync)
  DRIVER_SELECTED:    'apex:driver:selected',
  DRIVER_SESSION:     'apex:driver:session',

  // Navigation (legacy — preserved)
  NAV_ROUTE:          'apex:nav:route',
  NAV_DESTINATION:    'apex:nav:destination',
  NAV_MODE:           'apex:nav:mode',

  // Notifications (legacy — preserved)
  NOTIF_QUEUE:        'apex:notif:queue',
  NOTIF_PREFS:        'apex:notif:prefs',

  // ── TrustSheild OS™ Dashboard Keys (Run 2) ────────────────
  TS_DASHBOARD_TAB:   'trustsheild:dashboard:activeTab',
  TS_CASES:           'trustsheild_demo_cases',
  TS_TASKS:           'trustsheild_demo_tasks',
  TS_PWAS:            'trustsheild_demo_pwas',
  TS_TIMELINE:        'trustsheild_demo_timeline',
  TS_DRAFTS:          'trustsheild_demo_drafts',
  TS_UPDATES:         'trustsheild_demo_updates',
  TS_FEED:            'trustsheild:dashboard:feed',
  TS_MODE:            'trustsheild:app:mode',   // 'demo' | 'live'
  // ── TrustSheild OS™ PWA Keys (Run 3) ─────────────────────
  TS_PWA_PROFILE:    'trustsheild_pwa_demo_profile',
  TS_PWA_CASE:       'trustsheild_pwa_demo_case',
  TS_PWA_TASKS:      'trustsheild_pwa_demo_tasks',
  TS_PWA_UPDATES:    'trustsheild_pwa_demo_updates',
  TS_PWA_NOTES:      'trustsheild_pwa_demo_notes',
  TS_PWA_ESCALATIONS:'trustsheild_pwa_demo_escalations',
  TS_PWA_DRAFTS:     'trustsheild_pwa_demo_draft_reviews',
  TS_PWA_TAB:        'trustsheild:pwa:activeTab',
  // ── TrustSheild OS™ Configurable Task Keys (Run 4) ────────
  // Shared task store — dashboard creates, PWA reads/acts.
  // DISTINCT from trustsheild_demo_tasks (dashboard legacy seed)
  // and trustsheild_pwa_demo_tasks (PWA legacy seed).
  TS_CONFIG_TASKS:     'trustsheild_tasks',
  TS_TASK_ACTIVITY:    'trustsheild_task_activity',
  TS_TASK_TEMPLATES:   'trustsheild_task_templates',
  TS_PWA_CONTACTS:     'trustsheild_pwa_contacts',
  // ── TrustSheild OS™ PWA Identity & Pairing Keys (Run 5) ──
  TS_PWA_IDENTITIES:   'trustsheild_pwa_identities',
  TS_PAIRING_CODES:    'trustsheild_pairing_codes',
  TS_CURRENT_PWA_ID:   'trustsheild_current_pwa_identity',
  TS_PWA_CONFIG:       'trustsheild_pwa_config',
  TS_PWA_ID_COUNTER:   'trustsheild_pwa_id_counter',


  // ── TrustSheild OS™ Backend/API Config Keys (Run 7) ──────
  TS_BACKEND_CONFIG:       'trustsheild_backend_config',
  TS_API_PROVIDERS:        'trustsheild_api_providers',
  TS_MONITORING_PROVIDERS: 'trustsheild_monitoring_providers',
  TS_TRACKED_ENTITIES:     'trustsheild_tracked_entities',
  TS_ENTITY_PROVIDER_MAP:  'trustsheild_entity_provider_map',
  TS_API_TEST_RESULTS:     'trustsheild_api_test_results',
  TS_CONFIG_GUARD_EVENTS:  'trustsheild_config_guard_events',
  // ── TrustSheild OS™ Sync Keys (Run 9) ────────────────────
  TS_SYNC_STATUS:      'trustsheild_sync_status',
  TS_SYNC_QUEUE:       'trustsheild_sync_queue',
  TS_SYNC_EVENTS:      'trustsheild_sync_events',
  TS_LAST_SYNC:        'trustsheild_last_sync',
  TS_BACKEND_SYNC:     'trustsheild_backend_sync_state',
  // ── TrustSheild OS™ AI Agent Keys (Run 10) ───────────────
  TS_AI_AGENT_LOGS:    'trustsheild_ai_agent_logs',
  TS_AI_SETTINGS:      'trustsheild_ai_settings',
  TS_AI_SAFETY_EVENTS: 'trustsheild_ai_safety_events',

}

// ─── Persist Helpers ──────────────────────────────────────────
const persist = {
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('[TrustSheild:Storage] persist.set failed:', key, e)
    }
  },
  remove: (key) => {
    try { localStorage.removeItem(key) } catch { /* silent */ }
  },
  clear: (prefix = 'apex:') => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .forEach(k => localStorage.removeItem(k))
    } catch { /* silent */ }
  }
}

// ─── App Store ────────────────────────────────────────────────
export const useAppStore = create((set, get) => ({
  theme:           persist.get(STORAGE_KEYS.APP_THEME, 'dark'),
  sidebarExpanded: false,
  locale:          persist.get(STORAGE_KEYS.APP_LOCALE, 'en'),
  systemStatus:    'online',
  notifications:   [],
  alerts:          [],

  setTheme: (theme) => { persist.set(STORAGE_KEYS.APP_THEME, theme); set({ theme }) },
  toggleSidebar: () => {
    const next = !get().sidebarExpanded
    persist.set(STORAGE_KEYS.APP_SIDEBAR, next)
    set({ sidebarExpanded: next })
  },
  setSidebarExpanded: (val) => { persist.set(STORAGE_KEYS.APP_SIDEBAR, val); set({ sidebarExpanded: val }) },
  closeSidebar: () => set({ sidebarExpanded: false }),
  openSidebar:  () => set({ sidebarExpanded: true }),
  setSystemStatus: (status) => set({ systemStatus: status }),
  addNotification: (notif) => set(s => ({
    notifications: [{ id: Date.now(), ...notif }, ...s.notifications].slice(0, 50)
  })),
  clearNotifications: () => set({ notifications: [] }),
  addAlert: (alert) => set(s => ({
    alerts: [{ id: Date.now(), ...alert }, ...s.alerts].slice(0, 20)
  })),
  dismissAlert: (id) => set(s => ({ alerts: s.alerts.filter(a => a.id !== id) })),
}))

// ─── Auth Store ───────────────────────────────────────────────
export const useAuthStore = create((set) => ({
  session:         persist.get(STORAGE_KEYS.AUTH_SESSION, null),
  user:            persist.get(STORAGE_KEYS.AUTH_USER, null),
  role:            persist.get(STORAGE_KEYS.AUTH_ROLE, null),
  isLoading:       false,
  isAuthenticated: false,

  setSession: (session) => { persist.set(STORAGE_KEYS.AUTH_SESSION, session); set({ session, isAuthenticated: !!session }) },
  setUser:    (user)    => { persist.set(STORAGE_KEYS.AUTH_USER, user); set({ user }) },
  setRole:    (role)    => { persist.set(STORAGE_KEYS.AUTH_ROLE, role); set({ role }) },
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => {
    persist.remove(STORAGE_KEYS.AUTH_SESSION)
    persist.remove(STORAGE_KEYS.AUTH_USER)
    persist.remove(STORAGE_KEYS.AUTH_ROLE)
    set({ session: null, user: null, role: null, isAuthenticated: false })
  }
}))

// ─── Fleet Store (legacy name — preserved for PWA/sync compat) ─
export const useFleetStore = create((set) => ({
  vehicles:      [],
  activeVehicle: null,
  activeView:    persist.get(STORAGE_KEYS.FLEET_ACTIVE_VIEW, 'grid'),
  filters:       persist.get(STORAGE_KEYS.FLEET_FILTERS, {}),
  selectedIds:   persist.get(STORAGE_KEYS.FLEET_SELECTED, []),
  isLoading:     false,
  telemetry:     {},

  setVehicles:      (vehicles) => set({ vehicles }),
  setActiveVehicle: (v) => set({ activeVehicle: v }),
  setActiveView: (view) => { persist.set(STORAGE_KEYS.FLEET_ACTIVE_VIEW, view); set({ activeView: view }) },
  setFilters: (filters) => { persist.set(STORAGE_KEYS.FLEET_FILTERS, filters); set({ filters }) },
  setSelectedIds: (ids) => { persist.set(STORAGE_KEYS.FLEET_SELECTED, ids); set({ selectedIds: ids }) },
  setLoading: (isLoading) => set({ isLoading }),
  updateTelemetry: (vehicleId, data) => set(s => ({
    telemetry: { ...s.telemetry, [vehicleId]: { ...s.telemetry[vehicleId], ...data, ts: Date.now() } }
  }))
}))

// ─── Map Store (legacy — preserved) ──────────────────────────
export const useMapStore = create((set) => ({
  provider:  persist.get(STORAGE_KEYS.MAP_PROVIDER, 'osm'),
  center:    persist.get(STORAGE_KEYS.MAP_CENTER, { lat: 51.5074, lng: -0.1278 }),
  zoom:      persist.get(STORAGE_KEYS.MAP_ZOOM, 11),
  layer:     persist.get(STORAGE_KEYS.MAP_LAYER, 'tactical'),
  isLoaded:  false,
  markers:   [],
  routes:    [],
  geofences: [],

  setProvider:  (provider) => { persist.set(STORAGE_KEYS.MAP_PROVIDER, provider); set({ provider }) },
  setCenter:    (center)   => { persist.set(STORAGE_KEYS.MAP_CENTER, center); set({ center }) },
  setZoom:      (zoom)     => { persist.set(STORAGE_KEYS.MAP_ZOOM, zoom); set({ zoom }) },
  setLayer:     (layer)    => { persist.set(STORAGE_KEYS.MAP_LAYER, layer); set({ layer }) },
  setLoaded:    (isLoaded) => set({ isLoaded }),
  setMarkers:   (markers)  => set({ markers }),
  addMarker:    (m)        => set(s => ({ markers: [...s.markers, m] })),
  setRoutes:    (routes)   => set({ routes }),
  setGeofences: (geofences) => set({ geofences }),
}))

// ─── AI Store (legacy — preserved) ───────────────────────────
export const useAIStore = create((set) => ({
  provider:       persist.get(STORAGE_KEYS.AI_PROVIDER, 'openai'),
  model:          persist.get(STORAGE_KEYS.AI_MODEL, null),
  config:         persist.get(STORAGE_KEYS.AI_CONFIG, {}),
  status:         'idle',
  activeModule:   null,
  tokenUsage:     { prompt: 0, completion: 0, total: 0 },
  costEstimate:   0,
  fallbackActive: false,

  setProvider:  (provider) => { persist.set(STORAGE_KEYS.AI_PROVIDER, provider); set({ provider }) },
  setModel:     (model)    => { persist.set(STORAGE_KEYS.AI_MODEL, model); set({ model }) },
  setConfig:    (config)   => { persist.set(STORAGE_KEYS.AI_CONFIG, config); set({ config }) },
  setStatus:    (status)   => set({ status }),
  setActiveModule: (module) => set({ activeModule: module }),
  updateTokenUsage: (usage) => set(s => ({
    tokenUsage: {
      prompt:     s.tokenUsage.prompt + (usage.prompt || 0),
      completion: s.tokenUsage.completion + (usage.completion || 0),
      total:      s.tokenUsage.total + (usage.total || 0),
    }
  })),
  setCostEstimate: (cost) => set({ costEstimate: cost }),
  setFallbackActive: (val) => set({ fallbackActive: val }),
}))

// ─── Driver Store (legacy name — preserved for PWA/sync compat) ─
export const useDriverStore = create((set) => ({
  drivers:       [],
  activeDriver:  persist.get(STORAGE_KEYS.DRIVER_SELECTED, null),
  driverSession: persist.get(STORAGE_KEYS.DRIVER_SESSION, null),
  scores:        {},
  isLoading:     false,

  setDrivers:       (drivers) => set({ drivers }),
  setActiveDriver:  (driver) => { persist.set(STORAGE_KEYS.DRIVER_SELECTED, driver); set({ activeDriver: driver }) },
  setDriverSession: (session) => { persist.set(STORAGE_KEYS.DRIVER_SESSION, session); set({ driverSession: session }) },
  updateScore: (driverId, score) => set(s => ({ scores: { ...s.scores, [driverId]: score } })),
  setLoading: (isLoading) => set({ isLoading }),
}))

// ─── Navigation Store (legacy — preserved) ───────────────────
export const useNavStore = create((set) => ({
  route:           persist.get(STORAGE_KEYS.NAV_ROUTE, null),
  destination:     persist.get(STORAGE_KEYS.NAV_DESTINATION, null),
  mode:            persist.get(STORAGE_KEYS.NAV_MODE, 'drive'),
  isNavigating:    false,
  currentPosition: null,
  eta:             null,
  distanceLeft:    null,
  turnInstructions: [],

  setRoute:       (route) => { persist.set(STORAGE_KEYS.NAV_ROUTE, route); set({ route }) },
  setDestination: (dest)  => { persist.set(STORAGE_KEYS.NAV_DESTINATION, dest); set({ destination: dest }) },
  setMode:        (mode)  => { persist.set(STORAGE_KEYS.NAV_MODE, mode); set({ mode }) },
  setNavigating:  (val)   => set({ isNavigating: val }),
  setCurrentPosition: (pos) => set({ currentPosition: pos }),
  setEta:         (eta)   => set({ eta }),
  setDistanceLeft: (d)    => set({ distanceLeft: d }),
  setTurnInstructions: (t) => set({ turnInstructions: t }),
}))

// ─── TrustSheild OS™ Dashboard Store (Run 2) ─────────────────
// All TrustSheild-specific dashboard state lives here.
// Namespace: trustsheild: / trustsheild_demo_*
// This is additive — does NOT replace or alter any legacy store.
export const useTrustStore = create((set, get) => ({
  // ── App Mode ──────────────────────────────────────────────
  mode: persist.get(STORAGE_KEYS.TS_MODE, 'demo'), // 'demo' | 'live'

  // ── Dashboard Tab ─────────────────────────────────────────
  activeTab: persist.get(STORAGE_KEYS.TS_DASHBOARD_TAB, 'overview'),

  // ── Core Data Collections ─────────────────────────────────
  cases:       persist.get(STORAGE_KEYS.TS_CASES,    null), // null = use demo seed
  tasks:       persist.get(STORAGE_KEYS.TS_TASKS,    null),
  pwas:        persist.get(STORAGE_KEYS.TS_PWAS,     null),
  timeline:    persist.get(STORAGE_KEYS.TS_TIMELINE, null),
  drafts:      persist.get(STORAGE_KEYS.TS_DRAFTS,   null),
  updates:     persist.get(STORAGE_KEYS.TS_UPDATES,  null),
  feedItems:   persist.get(STORAGE_KEYS.TS_FEED,     null),

  // ── Actions ───────────────────────────────────────────────
  // ── Extended app mode state (Run 6) ──────────────────────
  liveReady:          false,       // true once backend is configured (Run 7)
  backendConfigured:  false,       // true once a real provider is connected
  lastModeChange:     persist.get(STORAGE_KEYS.TS_MODE, 'demo'),

  setMode: (newMode) => {
    const prev = get().mode
    if (prev === newMode) return
    persist.set(STORAGE_KEYS.TS_MODE, newMode)
    set({
      mode:           newMode,
      lastModeChange: new Date().toISOString(),
    })
  },
  // Convenience helpers
  enableDemo: () => {
    persist.set(STORAGE_KEYS.TS_MODE, 'demo')
    set({ mode: 'demo', lastModeChange: new Date().toISOString() })
  },
  enableLive: () => {
    persist.set(STORAGE_KEYS.TS_MODE, 'live')
    set({ mode: 'live', lastModeChange: new Date().toISOString() })
  },

  setActiveTab: (tab) => {
    persist.set(STORAGE_KEYS.TS_DASHBOARD_TAB, tab)
    set({ activeTab: tab })
  },

  // Seed with demo data if not already set
  seedDemoData: (demoData) => {
    const s = get()
    const next = {}
    if (!s.cases)     { next.cases     = demoData.cases;     persist.set(STORAGE_KEYS.TS_CASES,    demoData.cases)    }
    if (!s.tasks)     { next.tasks     = demoData.tasks;     persist.set(STORAGE_KEYS.TS_TASKS,    demoData.tasks)    }
    if (!s.pwas)      { next.pwas      = demoData.pwas;      persist.set(STORAGE_KEYS.TS_PWAS,     demoData.pwas)     }
    if (!s.timeline)  { next.timeline  = demoData.timeline;  persist.set(STORAGE_KEYS.TS_TIMELINE, demoData.timeline) }
    if (!s.drafts)    { next.drafts    = demoData.drafts;    persist.set(STORAGE_KEYS.TS_DRAFTS,   demoData.drafts)   }
    if (!s.updates)   { next.updates   = demoData.updates;   persist.set(STORAGE_KEYS.TS_UPDATES,  demoData.updates)  }
    if (!s.feedItems) { next.feedItems = demoData.feedItems; persist.set(STORAGE_KEYS.TS_FEED,     demoData.feedItems)}
    if (Object.keys(next).length) set(next)
  },

  // Case actions
  updateCase: (id, patch) => {
    const cases = get().cases?.map(c => c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c) || []
    persist.set(STORAGE_KEYS.TS_CASES, cases)
    set({ cases })
  },

  // Task actions
  updateTask: (id, patch) => {
    const tasks = get().tasks?.map(t => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t) || []
    persist.set(STORAGE_KEYS.TS_TASKS, tasks)
    set({ tasks })
  },

  // Feed — prepend a new item
  addFeedItem: (item) => {
    const feedItems = [{ id: Date.now(), ts: new Date().toISOString(), ...item }, ...(get().feedItems || [])].slice(0, 50)
    persist.set(STORAGE_KEYS.TS_FEED, feedItems)
    set({ feedItems })
  },

  // Draft actions
  updateDraft: (id, patch) => {
    const drafts = get().drafts?.map(d => d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d) || []
    persist.set(STORAGE_KEYS.TS_DRAFTS, drafts)
    set({ drafts })
  },

  // Hard reset demo data (clears and re-seeds)
  resetToDemo: (demoData) => {
    persist.set(STORAGE_KEYS.TS_CASES,    demoData.cases)
    persist.set(STORAGE_KEYS.TS_TASKS,    demoData.tasks)
    persist.set(STORAGE_KEYS.TS_PWAS,     demoData.pwas)
    persist.set(STORAGE_KEYS.TS_TIMELINE, demoData.timeline)
    persist.set(STORAGE_KEYS.TS_DRAFTS,   demoData.drafts)
    persist.set(STORAGE_KEYS.TS_UPDATES,  demoData.updates)
    persist.set(STORAGE_KEYS.TS_FEED,     demoData.feedItems)
    set({
      cases:     demoData.cases,
      tasks:     demoData.tasks,
      pwas:      demoData.pwas,
      timeline:  demoData.timeline,
      drafts:    demoData.drafts,
      updates:   demoData.updates,
      feedItems: demoData.feedItems,
    })
  },
}))

// ─── TrustSheild OS™ PWA Store (Run 3) ───────────────────────
// All Response PWA state lives here.
// Namespace: trustsheild_pwa_demo_* / trustsheild:pwa:*
// This is additive — does NOT alter any legacy or dashboard store.
export const usePwaStore = create((set, get) => ({
  // ── PWA Tab ───────────────────────────────────────────────
  activeTab: persist.get(STORAGE_KEYS.TS_PWA_TAB, 'home'),

  // ── Demo Profile ──────────────────────────────────────────
  profile: persist.get(STORAGE_KEYS.TS_PWA_PROFILE, null),

  // ── Core PWA Collections (null = use demo seed) ───────────
  pwaCase:      persist.get(STORAGE_KEYS.TS_PWA_CASE,       null),
  pwaTasks:     persist.get(STORAGE_KEYS.TS_PWA_TASKS,      null),
  pwaUpdates:   persist.get(STORAGE_KEYS.TS_PWA_UPDATES,    null),
  pwaNotes:     persist.get(STORAGE_KEYS.TS_PWA_NOTES,      null),
  pwaEscalations: persist.get(STORAGE_KEYS.TS_PWA_ESCALATIONS, null),
  pwaDraftReviews: persist.get(STORAGE_KEYS.TS_PWA_DRAFTS,  null),

  // ── Actions ───────────────────────────────────────────────
  setActiveTab: (tab) => {
    persist.set(STORAGE_KEYS.TS_PWA_TAB, tab)
    set({ activeTab: tab })
  },

  // Seed with demo data if not already set
  seedPwaDemo: (demoData) => {
    const s = get()
    const next = {}
    if (!s.profile)         { next.profile          = demoData.profile;       persist.set(STORAGE_KEYS.TS_PWA_PROFILE,    demoData.profile) }
    if (!s.pwaCase)         { next.pwaCase           = demoData.pwaCase;       persist.set(STORAGE_KEYS.TS_PWA_CASE,       demoData.pwaCase) }
    if (!s.pwaTasks)        { next.pwaTasks          = demoData.pwaTasks;      persist.set(STORAGE_KEYS.TS_PWA_TASKS,      demoData.pwaTasks) }
    if (!s.pwaUpdates)      { next.pwaUpdates        = demoData.pwaUpdates;    persist.set(STORAGE_KEYS.TS_PWA_UPDATES,    demoData.pwaUpdates) }
    if (!s.pwaNotes)        { next.pwaNotes          = demoData.pwaNotes;      persist.set(STORAGE_KEYS.TS_PWA_NOTES,      demoData.pwaNotes) }
    if (!s.pwaEscalations)  { next.pwaEscalations    = demoData.pwaEscalations; persist.set(STORAGE_KEYS.TS_PWA_ESCALATIONS, demoData.pwaEscalations) }
    if (!s.pwaDraftReviews) { next.pwaDraftReviews   = demoData.pwaDraftReviews; persist.set(STORAGE_KEYS.TS_PWA_DRAFTS,   demoData.pwaDraftReviews) }
    if (Object.keys(next).length) set(next)
  },

  // Task actions
  updatePwaTask: (id, patch) => {
    const pwaTasks = get().pwaTasks?.map(t => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t) || []
    persist.set(STORAGE_KEYS.TS_PWA_TASKS, pwaTasks)
    set({ pwaTasks })
  },

  // Add a note
  addNote: (note) => {
    const pwaNotes = [{ id: `note-${Date.now()}`, ts: new Date().toISOString(), ...note }, ...(get().pwaNotes || [])]
    persist.set(STORAGE_KEYS.TS_PWA_NOTES, pwaNotes)
    set({ pwaNotes })
  },

  // Add a situation update
  addPwaUpdate: (upd) => {
    const pwaUpdates = [{ id: `upd-${Date.now()}`, ts: new Date().toISOString(), status: 'Submitted (Demo)', ...upd }, ...(get().pwaUpdates || [])]
    persist.set(STORAGE_KEYS.TS_PWA_UPDATES, pwaUpdates)
    set({ pwaUpdates })
  },

  // Add an escalation request
  addEscalation: (esc) => {
    const pwaEscalations = [{ id: `esc-${Date.now()}`, ts: new Date().toISOString(), status: 'Submitted (Demo)', ...esc }, ...(get().pwaEscalations || [])]
    persist.set(STORAGE_KEYS.TS_PWA_ESCALATIONS, pwaEscalations)
    set({ pwaEscalations })
  },

  // Update draft review
  updateDraftReview: (id, patch) => {
    const pwaDraftReviews = get().pwaDraftReviews?.map(d => d.id === id ? { ...d, ...patch, reviewedAt: new Date().toISOString() } : d) || []
    persist.set(STORAGE_KEYS.TS_PWA_DRAFTS, pwaDraftReviews)
    set({ pwaDraftReviews })
  },

  // Hard reset to demo
  resetPwaToDemo: (demoData) => {
    persist.set(STORAGE_KEYS.TS_PWA_PROFILE,    demoData.profile)
    persist.set(STORAGE_KEYS.TS_PWA_CASE,       demoData.pwaCase)
    persist.set(STORAGE_KEYS.TS_PWA_TASKS,      demoData.pwaTasks)
    persist.set(STORAGE_KEYS.TS_PWA_UPDATES,    demoData.pwaUpdates)
    persist.set(STORAGE_KEYS.TS_PWA_NOTES,      demoData.pwaNotes)
    persist.set(STORAGE_KEYS.TS_PWA_ESCALATIONS, demoData.pwaEscalations)
    persist.set(STORAGE_KEYS.TS_PWA_DRAFTS,     demoData.pwaDraftReviews)
    set({
      profile:          demoData.profile,
      pwaCase:          demoData.pwaCase,
      pwaTasks:         demoData.pwaTasks,
      pwaUpdates:       demoData.pwaUpdates,
      pwaNotes:         demoData.pwaNotes,
      pwaEscalations:   demoData.pwaEscalations,
      pwaDraftReviews:  demoData.pwaDraftReviews,
    })
  },
}))

// ─── TrustSheild OS™ Configurable Task Store (Run 4) ─────────
// The SHARED task store — dashboard creates/edits tasks here,
// PWA reads and updates status here.
// Key: trustsheild_tasks (distinct from trustsheild_demo_tasks)
// This is additive — does NOT replace any legacy or demo store.
export const useTaskStore = create((set, get) => ({
  // ── Configurable tasks ────────────────────────────────────
  configTasks:   persist.get(STORAGE_KEYS.TS_CONFIG_TASKS,   null),

  // ── Task activity feed ────────────────────────────────────
  taskActivity:  persist.get(STORAGE_KEYS.TS_TASK_ACTIVITY,  null),

  // ── PWA contacts (demo list, Run 5 will replace with real IDs) ─
  pwaContacts:   persist.get(STORAGE_KEYS.TS_PWA_CONTACTS,   null),

  // ── Seed ──────────────────────────────────────────────────
  seedTaskData: (seed) => {
    const s = get()
    const next = {}
    if (!s.configTasks)  { next.configTasks  = seed.configTasks;  persist.set(STORAGE_KEYS.TS_CONFIG_TASKS,  seed.configTasks)  }
    if (!s.taskActivity) { next.taskActivity  = seed.taskActivity; persist.set(STORAGE_KEYS.TS_TASK_ACTIVITY, seed.taskActivity) }
    if (!s.pwaContacts)  { next.pwaContacts   = seed.pwaContacts;  persist.set(STORAGE_KEYS.TS_PWA_CONTACTS,  seed.pwaContacts)  }
    if (Object.keys(next).length) set(next)
  },

  // ── Create a new configurable task ────────────────────────
  createTask: (task) => {
    const id = `tsk-${Date.now()}`
    const now = new Date().toISOString()
    const newTask = {
      id,
      createdAt: now,
      updatedAt: now,
      status: 'Sent to PWA',
      source: 'demo',
      createdBy: 'TrustSheild Command Dashboard',
      ...task,
    }
    const configTasks = [newTask, ...(get().configTasks || [])]
    persist.set(STORAGE_KEYS.TS_CONFIG_TASKS, configTasks)
    set({ configTasks })
    // Log activity
    get().addActivity({
      type: 'task_created',
      icon: 'Plus',
      color: 'gold',
      text: `Task created: "${newTask.title.slice(0, 40)}"`,
      sub:  `Assigned to ${newTask.assignedName || 'PWA'} · ${newTask.type}`,
      taskId: id,
    })
    return newTask
  },

  // ── Update a task (dashboard or PWA) ──────────────────────
  updateTask: (id, patch) => {
    const configTasks = get().configTasks?.map(t =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    ) || []
    persist.set(STORAGE_KEYS.TS_CONFIG_TASKS, configTasks)
    set({ configTasks })
  },

  // ── PWA status update (logs activity too) ─────────────────
  pwaUpdateStatus: (id, newStatus, actorName) => {
    const configTasks = get().configTasks?.map(t =>
      t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString(), lastPwaAction: newStatus } : t
    ) || []
    persist.set(STORAGE_KEYS.TS_CONFIG_TASKS, configTasks)
    set({ configTasks })
    const task = configTasks.find(t => t.id === id)
    const activityMap = {
      'Received':        { icon: 'CheckCircle',  color: 'green',  text: `PWA confirmed task received` },
      'In Progress':     { icon: 'Play',         color: 'gold',   text: `PWA started task` },
      'Submitted':       { icon: 'Send',         color: 'green',  text: `PWA submitted task update` },
      'Complete':        { icon: 'CheckSquare',  color: 'green',  text: `Task marked complete by PWA` },
      'Escalated':       { icon: 'AlertTriangle',color: 'red',    text: `PWA requested escalation` },
      'Approved':        { icon: 'CheckCircle',  color: 'green',  text: `Draft approved by PWA` },
      'Needs Changes':   { icon: 'Edit3',        color: 'amber',  text: `Changes requested by PWA` },
    }
    const ev = activityMap[newStatus] || { icon: 'RefreshCw', color: 'silver', text: `Task status → ${newStatus}` }
    get().addActivity({
      type:   'pwa_action',
      icon:   ev.icon,
      color:  ev.color,
      text:   ev.text,
      sub:    `"${task?.title?.slice(0,35) || id}" · ${actorName || 'PWA User'}`,
      taskId: id,
    })
  },

  // ── Activity feed ─────────────────────────────────────────
  addActivity: (item) => {
    const taskActivity = [
      { id: Date.now(), ts: new Date().toISOString(), ...item },
      ...(get().taskActivity || []),
    ].slice(0, 60)
    persist.set(STORAGE_KEYS.TS_TASK_ACTIVITY, taskActivity)
    set({ taskActivity })
  },

  // ── Delete a task ─────────────────────────────────────────
  deleteTask: (id) => {
    const configTasks = (get().configTasks || []).filter(t => t.id !== id)
    persist.set(STORAGE_KEYS.TS_CONFIG_TASKS, configTasks)
    set({ configTasks })
  },

  // ── Hard reset ────────────────────────────────────────────
  resetTaskData: (seed) => {
    persist.set(STORAGE_KEYS.TS_CONFIG_TASKS,  seed.configTasks)
    persist.set(STORAGE_KEYS.TS_TASK_ACTIVITY, seed.taskActivity)
    persist.set(STORAGE_KEYS.TS_PWA_CONTACTS,  seed.pwaContacts)
    set({
      configTasks:  seed.configTasks,
      taskActivity: seed.taskActivity,
      pwaContacts:  seed.pwaContacts,
    })
  },
}))

// ─── TrustSheild OS™ PWA Identity Store (Run 5) ──────────────
// Manages all PWA identities, unique IDs, and pairing codes.
// Key: trustsheild_pwa_identities, trustsheild_current_pwa_identity
// This is additive — does NOT replace any legacy or prior store.
// ⚠️  DEMO/LOCAL ONLY — Pairing codes are identifiers for
//     local simulation only. Secure auth added in later runs.

// ─── ID & Code helpers (pure functions, no side effects) ──────
function _padId(n) { return String(n).padStart(4, '0') }
function _randSegment(len) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
export function generatePwaId(counter) {
  return `TS-PWA-${_padId(counter)}`
}
export function generatePairingCode() {
  return `TS-${_randSegment(4)}-${_randSegment(4)}`
}

export const useIdentityStore = create((set, get) => ({
  // ── PWA Identities ────────────────────────────────────────
  pwaIdentities: persist.get(STORAGE_KEYS.TS_PWA_IDENTITIES, null),

  // ── Pairing code → identity ID map ───────────────────────
  pairingCodes:  persist.get(STORAGE_KEYS.TS_PAIRING_CODES,  null),

  // ── Currently active PWA identity (for the PWA screen) ───
  currentPwaId:  persist.get(STORAGE_KEYS.TS_CURRENT_PWA_ID, null),

  // ── Per-PWA config ────────────────────────────────────────
  pwaConfig:     persist.get(STORAGE_KEYS.TS_PWA_CONFIG,     null),

  // ── ID counter (starts at 6 — 1-5 are seed data) ─────────
  idCounter:     persist.get(STORAGE_KEYS.TS_PWA_ID_COUNTER, 6),

  // ── Seed demo identities ──────────────────────────────────
  seedIdentities: (seed) => {
    const s = get()
    const next = {}
    if (!s.pwaIdentities) { next.pwaIdentities = seed.pwaIdentities; persist.set(STORAGE_KEYS.TS_PWA_IDENTITIES, seed.pwaIdentities) }
    if (!s.pairingCodes)  { next.pairingCodes  = seed.pairingCodes;  persist.set(STORAGE_KEYS.TS_PAIRING_CODES,  seed.pairingCodes)  }
    if (!s.pwaConfig)     { next.pwaConfig      = seed.pwaConfig;    persist.set(STORAGE_KEYS.TS_PWA_CONFIG,     seed.pwaConfig)     }
    if (!s.currentPwaId)  { next.currentPwaId   = seed.defaultPwaId; persist.set(STORAGE_KEYS.TS_CURRENT_PWA_ID, seed.defaultPwaId)  }
    if (Object.keys(next).length) set(next)
  },

  // ── Create a new PWA identity ─────────────────────────────
  createIdentity: (fields) => {
    const counter = get().idCounter
    const pwaId   = generatePwaId(counter)
    const code    = generatePairingCode()
    // Ensure code uniqueness — regen if collision
    const existingCodes = Object.keys(get().pairingCodes || {})
    const finalCode = existingCodes.includes(code) ? generatePairingCode() : code
    const now = new Date().toISOString()
    const identity = {
      id: pwaId,
      pairingCode: finalCode,
      displayName: fields.displayName || 'Response User',
      organisationName: fields.organisationName || '',
      roleType: fields.roleType || 'Client Contact',
      contactLabel: fields.contactLabel || '',
      avatar: (fields.displayName || 'RU').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      linkedCaseIds: fields.linkedCaseIds || [],
      assignedTaskIds: [],
      syncStatus: 'Demo Local',
      backendStatus: 'Not Configured',
      configurationStatus: 'Demo Configured',
      permissions: {
        canSubmitUpdates: true,
        canAddEvidence: true,
        canApproveDrafts: fields.roleType === 'Client Contact' || fields.roleType === 'Founder / Business Owner' || fields.roleType === 'Legal Contact',
        canRequestEscalation: true,
      },
      dashboardInstruction: fields.dashboardInstruction || '',
      status: 'Active',
      source: 'demo',
      notes: fields.notes || '',
      createdAt: now,
      updatedAt: now,
      _demo: true,
    }
    const pwaIdentities = [...(get().pwaIdentities || []), identity]
    const pairingCodes  = { ...(get().pairingCodes || {}), [finalCode]: pwaId }
    const newCounter    = counter + 1
    persist.set(STORAGE_KEYS.TS_PWA_IDENTITIES, pwaIdentities)
    persist.set(STORAGE_KEYS.TS_PAIRING_CODES,  pairingCodes)
    persist.set(STORAGE_KEYS.TS_PWA_ID_COUNTER, newCounter)
    set({ pwaIdentities, pairingCodes, idCounter: newCounter })
    return identity
  },

  // ── Update identity ────────────────────────────────────────
  updateIdentityRecord: (pwaId, patch) => {
    const pwaIdentities = (get().pwaIdentities || []).map(i =>
      i.id === pwaId ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
    )
    persist.set(STORAGE_KEYS.TS_PWA_IDENTITIES, pwaIdentities)
    set({ pwaIdentities })
  },

  // ── Deactivate identity ────────────────────────────────────
  deactivateIdentity: (pwaId) => {
    const pwaIdentities = (get().pwaIdentities || []).map(i =>
      i.id === pwaId ? { ...i, status: 'Archived', updatedAt: new Date().toISOString() } : i
    )
    persist.set(STORAGE_KEYS.TS_PWA_IDENTITIES, pwaIdentities)
    set({ pwaIdentities })
  },

  // ── Set current active PWA identity (for PWA screen) ──────
  setCurrentPwaId: (pwaId) => {
    persist.set(STORAGE_KEYS.TS_CURRENT_PWA_ID, pwaId)
    set({ currentPwaId: pwaId })
  },

  // ── Pair by code (demo local only) ────────────────────────
  pairByCode: (code) => {
    const map = get().pairingCodes || {}
    const pwaId = map[code.trim().toUpperCase()]
    if (!pwaId) return { success: false, error: 'Code not found in demo identities.' }
    const identity = (get().pwaIdentities || []).find(i => i.id === pwaId)
    if (!identity) return { success: false, error: 'Identity not found for this code.' }
    if (identity.status === 'Archived') return { success: false, error: 'This PWA identity is archived.' }
    persist.set(STORAGE_KEYS.TS_CURRENT_PWA_ID, pwaId)
    set({ currentPwaId: pwaId })
    return { success: true, identity }
  },

  // ── Get current identity object ───────────────────────────
  getCurrentIdentity: () => {
    const id = get().currentPwaId
    return (get().pwaIdentities || []).find(i => i.id === id) || null
  },

  // ── Save per-PWA config ────────────────────────────────────
  savePwaConfig: (pwaId, config) => {
    const pwaConfig = { ...(get().pwaConfig || {}), [pwaId]: config }
    persist.set(STORAGE_KEYS.TS_PWA_CONFIG, pwaConfig)
    set({ pwaConfig })
  },

  // ── Hard reset ────────────────────────────────────────────
  resetIdentities: (seed) => {
    persist.set(STORAGE_KEYS.TS_PWA_IDENTITIES, seed.pwaIdentities)
    persist.set(STORAGE_KEYS.TS_PAIRING_CODES,  seed.pairingCodes)
    persist.set(STORAGE_KEYS.TS_PWA_CONFIG,     seed.pwaConfig)
    persist.set(STORAGE_KEYS.TS_CURRENT_PWA_ID, seed.defaultPwaId)
    persist.set(STORAGE_KEYS.TS_PWA_ID_COUNTER, 6)
    set({ pwaIdentities: seed.pwaIdentities, pairingCodes: seed.pairingCodes, pwaConfig: seed.pwaConfig, currentPwaId: seed.defaultPwaId, idCounter: 6 })
  },
}))

// ─── TrustSheild OS™ Config Store (Run 7) ────────────────────
// All backend/API provider config, tracked entities, test
// results, and API Config Guard events live here.
// This is the 12th distinct Zustand store — additive only.
// SSOT key: trustsheild_backend_config (and siblings)
//
// ⚠️  SAFETY: Never store backend-only secrets here.
//     Public anon keys / project URLs only.
//     Service role keys / private keys are BLOCKED by the
//     4P3X API Config Guard™ before they can be saved.
// ============================================================

export const useConfigStore = create((set, get) => ({

  // ── Backend Provider Config ───────────────────────────────
  backendConfig: persist.get(STORAGE_KEYS.TS_BACKEND_CONFIG, null),

  // ── API/Monitoring Provider Configs ──────────────────────
  apiProviders:        persist.get(STORAGE_KEYS.TS_API_PROVIDERS,        null),
  monitoringProviders: persist.get(STORAGE_KEYS.TS_MONITORING_PROVIDERS, null),

  // ── Tracked Entities (companies, people, brands…) ────────
  trackedEntities: persist.get(STORAGE_KEYS.TS_TRACKED_ENTITIES, null),

  // ── Entity → Provider mapping ─────────────────────────────
  entityProviderMap: persist.get(STORAGE_KEYS.TS_ENTITY_PROVIDER_MAP, null),

  // ── Test results per provider ─────────────────────────────
  testResults: persist.get(STORAGE_KEYS.TS_API_TEST_RESULTS, null),

  // ── 4P3X API Config Guard™ event log ─────────────────────
  guardEvents: persist.get(STORAGE_KEYS.TS_CONFIG_GUARD_EVENTS, null),

  // ── Seed demo config examples ─────────────────────────────
  seedConfigData: (seedData) => {
    const s = get()
    const next = {}
    if (!s.backendConfig)        { next.backendConfig        = seedData.backendConfig;        persist.set(STORAGE_KEYS.TS_BACKEND_CONFIG,       seedData.backendConfig)       }
    if (!s.apiProviders)         { next.apiProviders         = seedData.apiProviders;         persist.set(STORAGE_KEYS.TS_API_PROVIDERS,        seedData.apiProviders)        }
    if (!s.monitoringProviders)  { next.monitoringProviders  = seedData.monitoringProviders;  persist.set(STORAGE_KEYS.TS_MONITORING_PROVIDERS, seedData.monitoringProviders) }
    if (!s.trackedEntities)      { next.trackedEntities      = seedData.trackedEntities;      persist.set(STORAGE_KEYS.TS_TRACKED_ENTITIES,     seedData.trackedEntities)     }
    if (!s.entityProviderMap)    { next.entityProviderMap    = seedData.entityProviderMap;    persist.set(STORAGE_KEYS.TS_ENTITY_PROVIDER_MAP,  seedData.entityProviderMap)   }
    if (!s.testResults)          { next.testResults          = {};                            persist.set(STORAGE_KEYS.TS_API_TEST_RESULTS,     {})                           }
    if (!s.guardEvents)          { next.guardEvents          = [];                            persist.set(STORAGE_KEYS.TS_CONFIG_GUARD_EVENTS,  [])                           }
    if (Object.keys(next).length) set(next)
  },

  // ── Save a backend provider config ────────────────────────
  saveBackendConfig: (providerId, config) => {
    const backendConfig = { ...(get().backendConfig || {}), [providerId]: { ...config, savedAt: new Date().toISOString() } }
    persist.set(STORAGE_KEYS.TS_BACKEND_CONFIG, backendConfig)
    set({ backendConfig })
  },

  // ── Save an API/monitoring provider config ─────────────────
  saveApiProvider: (providerId, config) => {
    const apiProviders = { ...(get().apiProviders || {}), [providerId]: { ...config, savedAt: new Date().toISOString() } }
    persist.set(STORAGE_KEYS.TS_API_PROVIDERS, apiProviders)
    set({ apiProviders })
  },

  saveMonitoringProvider: (providerId, config) => {
    const monitoringProviders = { ...(get().monitoringProviders || {}), [providerId]: { ...config, savedAt: new Date().toISOString() } }
    persist.set(STORAGE_KEYS.TS_MONITORING_PROVIDERS, monitoringProviders)
    set({ monitoringProviders })
  },

  // ── Save test result ───────────────────────────────────────
  saveTestResult: (providerId, result) => {
    const testResults = {
      ...(get().testResults || {}),
      [providerId]: { ...result, testedAt: new Date().toISOString() }
    }
    persist.set(STORAGE_KEYS.TS_API_TEST_RESULTS, testResults)
    set({ testResults })
  },

  // ── Create tracked entity ──────────────────────────────────
  createTrackedEntity: (entity) => {
    const id = `ent-${Date.now()}`
    const now = new Date().toISOString()
    const record = { id, ...entity, createdAt: now, updatedAt: now }
    const trackedEntities = [...(get().trackedEntities || []), record]
    persist.set(STORAGE_KEYS.TS_TRACKED_ENTITIES, trackedEntities)
    set({ trackedEntities })
    return record
  },

  // ── Update tracked entity ──────────────────────────────────
  updateTrackedEntity: (id, patch) => {
    const trackedEntities = (get().trackedEntities || []).map(e =>
      e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
    )
    persist.set(STORAGE_KEYS.TS_TRACKED_ENTITIES, trackedEntities)
    set({ trackedEntities })
  },

  // ── Save entity-provider mapping ───────────────────────────
  saveEntityProviderMap: (entityId, providers) => {
    const entityProviderMap = { ...(get().entityProviderMap || {}), [entityId]: providers }
    persist.set(STORAGE_KEYS.TS_ENTITY_PROVIDER_MAP, entityProviderMap)
    set({ entityProviderMap })
  },

  // ── 4P3X API Config Guard™ ────────────────────────────────
  logGuardEvent: (event) => {
    const guardEvents = [
      { id: Date.now(), ts: new Date().toISOString(), ...event },
      ...(get().guardEvents || [])
    ].slice(0, 50)
    persist.set(STORAGE_KEYS.TS_CONFIG_GUARD_EVENTS, guardEvents)
    set({ guardEvents })
  },
}))

// ─── 4P3X API Config Guard™ ───────────────────────────────────
// Pure function — does NOT save to store (caller logs events).
// Returns { safe: boolean, reason: string | null }
const BLOCKED_PATTERNS = [
  { re: /service_role/i,            reason: 'Contains "service_role" — backend-only secret' },
  { re: /SUPABASE_SERVICE_ROLE/i,   reason: 'Supabase service role key — never in frontend' },
  { re: /OPENAI_API_KEY/i,          reason: 'OpenAI secret key — backend only' },
  { re: /GROQ_API_KEY/i,            reason: 'Groq API key — backend only' },
  { re: /STRIPE_SECRET_KEY/i,       reason: 'Stripe secret key — backend only' },
  { re: /sk-[A-Za-z0-9]{20,}/,     reason: 'Looks like an OpenAI/Stripe secret key pattern' },
  { re: /DATABASE_URL/i,            reason: 'Database URL — backend only' },
  { re: /JWT_SECRET/i,              reason: 'JWT secret — backend only' },
  { re: /WEBHOOK_SECRET/i,          reason: 'Webhook secret — backend only' },
  { re: /AWS_SECRET_ACCESS_KEY/i,   reason: 'AWS secret access key — backend only' },
  { re: /private_key/i,             reason: 'Private key detected — backend only' },
  { re: /GOOGLE_SERVICE_ACCOUNT/i,  reason: 'Google service account — backend only' },
  { re: /FIREBASE_SERVICE_ACCOUNT/i,reason: 'Firebase service account — backend only' },
  { re: /client_email.*iam\.gserviceaccount/i, reason: 'Service account email — backend only' },
  { re: /"type"\s*:\s*"service_account"/i,     reason: 'Service account JSON detected — backend only' },
  { re: /eyJhbGciOi.*service_role/i,           reason: 'Supabase service role JWT pattern' },
]
export function applyConfigGuard(value, logGuardEvent) {
  if (!value || typeof value !== 'string') return { safe: true, reason: null }
  const trimmed = value.trim()
  for (const { re, reason } of BLOCKED_PATTERNS) {
    if (re.test(trimmed)) {
      logGuardEvent?.({ type: 'blocked', reason, preview: trimmed.slice(0, 8) + '…' })
      return { safe: false, reason }
    }
  }
  return { safe: true, reason: null }
}

// ─── TrustSheild OS™ Sync Store (Run 9) ──────────────────────
// Central sync state: queue, events, status, last-sync time.
// This is the 13th distinct Zustand store — additive only.
//
// Sync Modes (read from useTrustStore.mode + useConfigStore):
//   demo-local     — Demo Mode ON. Local SSOT sync preview.
//   not-configured — Live Mode ON but no backend config saved.
//   saved-pending  — Backend config saved, not verified.
//   validation-ok  — Client-side validation passed.
//   connected      — Live test passed (set only after real test).
//   offline        — Browser offline.
//   error          — Last sync attempt failed.
//
// ⚠  NEVER store service role keys, private keys, or
//    backend-only secrets in this store or sync payloads.
// ============================================================
export const useSyncStore = create((set, get) => ({

  // ── Sync Status Object ────────────────────────────────────
  syncStatus: persist.get(STORAGE_KEYS.TS_SYNC_STATUS, {
    mode:             'demo',
    backendProvider:  'local',
    connectionStatus: 'demo-local',
    syncDirection:    'none',
    lastSyncAt:       null,
    pendingQueueCount: 0,
    errorMessage:     null,
    dataFreshness:    'unknown',
    source:           'demo',
  }),

  // ── Offline submission queue ──────────────────────────────
  syncQueue: persist.get(STORAGE_KEYS.TS_SYNC_QUEUE, []),

  // ── Sync event log (last 100 events) ─────────────────────
  syncEvents: persist.get(STORAGE_KEYS.TS_SYNC_EVENTS, []),

  // ── Last confirmed sync timestamps ───────────────────────
  lastSync: persist.get(STORAGE_KEYS.TS_LAST_SYNC, null),

  // ── Backend sync connection state ────────────────────────
  backendSyncState: persist.get(STORAGE_KEYS.TS_BACKEND_SYNC, {
    provider: 'none',
    tested:   false,
    testedAt: null,
    result:   null,
  }),

  // ── Update sync status ────────────────────────────────────
  updateSyncStatus: (patch) => {
    const syncStatus = { ...(get().syncStatus || {}), ...patch }
    persist.set(STORAGE_KEYS.TS_SYNC_STATUS, syncStatus)
    set({ syncStatus })
  },

  // ── Log a sync event ──────────────────────────────────────
  logSyncEvent: (event) => {
    const entry = {
      id:        `se-${Date.now()}`,
      ts:        new Date().toISOString(),
      source:    'demo',
      ...event,
    }
    const syncEvents = [entry, ...(get().syncEvents || [])].slice(0, 100)
    persist.set(STORAGE_KEYS.TS_SYNC_EVENTS, syncEvents)
    set({ syncEvents })
    // Also update lastSyncAt
    const lastSync = entry.ts
    persist.set(STORAGE_KEYS.TS_LAST_SYNC, lastSync)
    set({ lastSync })
    // Update pending count
    get().refreshQueueCount()
    return entry
  },

  // ── Add item to offline queue ─────────────────────────────
  enqueueSubmission: (item) => {
    const entry = {
      id:            `sq-${Date.now()}`,
      createdAt:     new Date().toISOString(),
      lastAttemptAt: null,
      attemptCount:  0,
      status:        'pending',
      errorMessage:  null,
      source:        'demo',
      ...item,
    }
    const syncQueue = [entry, ...(get().syncQueue || [])]
    persist.set(STORAGE_KEYS.TS_SYNC_QUEUE, syncQueue)
    set({ syncQueue })
    get().refreshQueueCount()
    return entry
  },

  // ── Update queue item status ──────────────────────────────
  updateQueueItem: (id, patch) => {
    const syncQueue = (get().syncQueue || []).map(q =>
      q.id === id
        ? { ...q, ...patch, lastAttemptAt: new Date().toISOString(), attemptCount: (q.attemptCount || 0) + 1 }
        : q
    )
    persist.set(STORAGE_KEYS.TS_SYNC_QUEUE, syncQueue)
    set({ syncQueue })
    get().refreshQueueCount()
  },

  // ── Clear completed queue items ───────────────────────────
  clearSentQueue: () => {
    const syncQueue = (get().syncQueue || []).filter(q => q.status === 'pending' || q.status === 'failed')
    persist.set(STORAGE_KEYS.TS_SYNC_QUEUE, syncQueue)
    set({ syncQueue })
    get().refreshQueueCount()
  },

  // ── Clear ALL queue items (demo reset) ───────────────────
  clearAllQueue: () => {
    persist.set(STORAGE_KEYS.TS_SYNC_QUEUE, [])
    set({ syncQueue: [] })
    get().refreshQueueCount()
  },

  // ── Refresh pending queue count in status ─────────────────
  refreshQueueCount: () => {
    const pending = (get().syncQueue || []).filter(q => q.status === 'pending' || q.status === 'failed').length
    const syncStatus = { ...(get().syncStatus || {}), pendingQueueCount: pending }
    persist.set(STORAGE_KEYS.TS_SYNC_STATUS, syncStatus)
    set({ syncStatus })
  },

  // ── Save backend sync test result ─────────────────────────
  saveBackendSyncState: (state) => {
    const backendSyncState = { ...(get().backendSyncState || {}), ...state, testedAt: new Date().toISOString() }
    persist.set(STORAGE_KEYS.TS_BACKEND_SYNC, backendSyncState)
    set({ backendSyncState })
  },
}))

// ─── TrustSheild OS™ AI Agent Store (Run 10) ─────────────────
// 14th distinct Zustand store — additive only.
// Manages AI agent settings, output logs, safety events.
//
// ⚠  SECURITY / ETHICS RULES:
//   • Never store private AI API keys (OPENAI_API_KEY etc.) here.
//   • All AI outputs are advisory only — advisoryOnly: true always.
//   • humanReviewRequired: true always.
//   • Safety filter blocks unethical reputation manipulation.
//   • Demo AI mode works without any external API.
//   • Aligns with Run 8 sql: ai_agent_logs table fields.
//   • Compatible with Run 9 sync engine (logs marked syncable).
// ============================================================
export const useAIAgentStore = create((set, get) => ({

  // ── AI Settings ───────────────────────────────────────────
  aiSettings: persist.get(STORAGE_KEYS.TS_AI_SETTINGS, {
    enabled:       true,           // AI advisory support on/off
    mode:          'demo',         // 'demo' | 'provider-ready' | 'provider-connected'
    providerName:  null,           // set when safe provider is configured
    lastUpdated:   null,
  }),

  // ── AI Agent Advisory Logs (last 100) ─────────────────────
  aiAgentLogs: persist.get(STORAGE_KEYS.TS_AI_AGENT_LOGS, []),

  // ── AI Safety Events (last 50) ────────────────────────────
  aiSafetyEvents: persist.get(STORAGE_KEYS.TS_AI_SAFETY_EVENTS, []),

  // ── Toggle AI advisory support ────────────────────────────
  setAiEnabled: (enabled) => {
    const aiSettings = { ...(get().aiSettings || {}), enabled, lastUpdated: new Date().toISOString() }
    persist.set(STORAGE_KEYS.TS_AI_SETTINGS, aiSettings)
    set({ aiSettings })
  },

  // ── Set AI mode ───────────────────────────────────────────
  setAiMode: (mode, providerName = null) => {
    const aiSettings = { ...(get().aiSettings || {}), mode, providerName, lastUpdated: new Date().toISOString() }
    persist.set(STORAGE_KEYS.TS_AI_SETTINGS, aiSettings)
    set({ aiSettings })
  },

  // ── Log an AI agent advisory output ───────────────────────
  // Aligns with Run 8 ai_agent_logs table schema.
  logAiOutput: (entry) => {
    const record = {
      id:                   `ai-${Date.now()}`,
      createdAt:            new Date().toISOString(),
      advisoryOnly:         true,   // immutable — always true
      humanReviewRequired:  true,   // immutable — always true
      reviewStatus:         'new',  // new | reviewed | accepted | rejected | needs_review
      synced:               false,  // marked true when backend sync is available
      source:               'demo',
      ...entry,
    }
    const aiAgentLogs = [record, ...(get().aiAgentLogs || [])].slice(0, 100)
    persist.set(STORAGE_KEYS.TS_AI_AGENT_LOGS, aiAgentLogs)
    set({ aiAgentLogs })
    return record
  },

  // ── Update review status of a log entry ───────────────────
  updateLogReview: (id, reviewStatus) => {
    const aiAgentLogs = (get().aiAgentLogs || []).map(l =>
      l.id === id ? { ...l, reviewStatus, reviewedAt: new Date().toISOString() } : l
    )
    persist.set(STORAGE_KEYS.TS_AI_AGENT_LOGS, aiAgentLogs)
    set({ aiAgentLogs })
  },

  // ── Log a safety filter event ─────────────────────────────
  logSafetyEvent: (event) => {
    const record = {
      id:        `safe-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...event,
    }
    const aiSafetyEvents = [record, ...(get().aiSafetyEvents || [])].slice(0, 50)
    persist.set(STORAGE_KEYS.TS_AI_SAFETY_EVENTS, aiSafetyEvents)
    set({ aiSafetyEvents })
    return record
  },
}))
