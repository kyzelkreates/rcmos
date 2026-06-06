/**
 * ============================================================
 * TrustSheild OS™ — Application Router
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * AUTH STATUS: DEMO/PUBLIC MODE
 *   All core routes are PUBLIC — no login required.
 *   AuthGuard is preserved in components_auth_AuthGuard.jsx
 *   and can be re-enabled for Live Mode by setting
 *   AUTH_REQUIRED = true in that file.
 *
 * ROUTE STRUCTURE:
 *   /             → /welcome (homepage — always first)
 *   /welcome      → Landing page (public)
 *   /dashboard    → Command Dashboard (public in demo mode)
 *   /driver-app   → Crisis Response PWA (public)
 *   /settings     → API / Live Mode configuration (public)
 *   /auth/*       → Auth pages (preserved for future live mode)
 *
 * ============================================================
 */

import { createHashRouter, Navigate } from 'react-router-dom'

import AppShell      from './layouts_AppShell'

// Auth pages — preserved for future Live Mode use
import Login         from './pages_auth_Login'
import DriverLogin   from './pages_auth_DriverLogin'
import ResetConfirm  from './pages_auth_ResetConfirm'
import Setup         from './pages_auth_Setup'

// Standalone public pages (no AppShell wrapper)
import DriverImport  from './pages_DriverImport'
import DriverSetup   from './pages_DriverSetup'
import DriverApp     from './pages_DriverApp'
import AP3X          from './pages_AP3X'
import Landing       from './pages_Landing'

// Core app pages (inside AppShell, public in demo mode)
import Dashboard   from './pages_Dashboard'
import Fleet       from './pages_Fleet'
import Drivers     from './pages_Drivers'
import Vehicles    from './pages_Vehicles'
import Dispatch    from './pages_Dispatch'
import Navigation  from './pages_Navigation'
import Compliance  from './pages_Compliance'
import Safety      from './pages_Safety'
import Analytics   from './pages_Analytics'
import Incidents   from './pages_Incidents'
import Messaging   from './pages_Messaging'
import Settings    from './pages_Settings'
import NotFound    from './pages_NotFound'
import AIPage      from './pages_AI'

// Root always goes to homepage
const RootRedirect = () => <Navigate to="/welcome" replace />

export const router = createHashRouter([

  // ── Homepage (public — first screen, no auth) ─────────────
  { path: '/welcome', element: <Landing /> },

  // ── Standalone public pages (no AppShell, no auth) ────────
  { path: '/driver-app',   element: <DriverApp /> },
  { path: '/driver-import', element: <DriverImport /> },
  { path: '/ap3x',         element: <AP3X /> },

  // ── Auth pages (preserved for future Live Mode) ────────────
  // These still work if needed but are no longer force-shown.
  { path: '/auth/setup',         element: <Setup /> },
  { path: '/auth/login',         element: <Login /> },
  { path: '/auth/driver',        element: <DriverLogin /> },
  { path: '/auth/reset-confirm', element: <ResetConfirm /> },

  // ── Main app shell (PUBLIC in demo mode — no AuthGuard) ────
  // AuthGuard is removed from this wrapper for demo/public access.
  // To re-enable for Live Mode: wrap AppShell with <AuthGuard> again.
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <RootRedirect /> },

      // ── Trust Dashboard ─────────────────────────────────────
      { path: 'dashboard',              element: <Dashboard /> },

      // ── Crisis Operations ───────────────────────────────────
      { path: 'fleet',                  element: <Fleet /> },
      { path: 'fleet/:vehicleId',       element: <Fleet /> },
      { path: 'drivers',                element: <Drivers /> },
      { path: 'drivers/:driverId',      element: <Drivers /> },
      { path: 'vehicles',               element: <Vehicles /> },
      { path: 'vehicles/:vehicleId',    element: <Vehicles /> },
      { path: 'dispatch',               element: <Dispatch /> },
      { path: 'driver-setup',           element: <DriverSetup /> },

      // ── Live Ops ────────────────────────────────────────────
      { path: 'navigation',             element: <Navigation /> },

      // ── AI Intelligence ─────────────────────────────────────
      { path: 'ai',                     element: <AIPage /> },
      { path: 'safety',                 element: <Safety /> },
      { path: 'compliance',             element: <Compliance /> },
      { path: 'analytics',              element: <Analytics /> },

      // ── Reporting & Evidence ────────────────────────────────
      { path: 'incidents',              element: <Incidents /> },
      { path: 'incidents/:incidentId',  element: <Incidents /> },
      { path: 'messaging',              element: <Messaging /> },

      // ── System / API Config ─────────────────────────────────
      { path: 'settings',               element: <Settings /> },
      { path: 'settings/:section',      element: <Settings /> },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
])

export default router
