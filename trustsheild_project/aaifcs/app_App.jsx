/**
 * ============================================================
 * TrustSheild OS™ — Root App Component
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * DEMO/PUBLIC ACCESS BOOTSTRAP (runs before ANY component mounts):
 *   Sets apex:setup_complete = 'true' and writes a safe demo
 *   session so no auth redirect chain can fire anywhere in the app.
 *   AUTH_REQUIRED = false → full public/demo access.
 *   To re-enable for Live Mode: set AUTH_REQUIRED = true
 *   and remove the IIFE block below.
 * ============================================================
 */

import { RouterProvider } from 'react-router-dom'
import { router }         from './app_Router'
import AuthProvider       from './providers_AuthProvider'
import { useSystemStatus } from './hooks_useSystemStatus'
import { useEffect }      from 'react'
import { mountDashboardBridge } from './services_apex_apexBridge'

// ─── DEMO/PUBLIC ACCESS BOOTSTRAP ────────────────────────────
// Runs synchronously at module load — before React renders anything.
// Guarantees apex:setup_complete = 'true' so no route ever redirects
// to /auth/setup or /auth/login in demo/public mode.
// AUTH_REQUIRED = false (master switch, matches AuthGuard)
;(function bootstrapDemoAccess() {
  const AUTH_REQUIRED = false
  if (AUTH_REQUIRED) return
  try {
    // 1. Setup flag — prevents any LoginOrSetup redirect to /auth/setup
    if (localStorage.getItem('apex:setup_complete') !== 'true') {
      localStorage.setItem('apex:setup_complete', 'true')
    }
    // 2. Demo session — fix ISO-string expiresAt from old bootstrap,
    //    or write fresh session if absent/expired
    let needsSession = true
    const raw = localStorage.getItem('apex:session')
    if (raw) {
      try {
        const s = JSON.parse(raw)
        // Old bootstrap wrote expiresAt as ISO string — rewrite with ms
        if (typeof s.expiresAt === 'string' && s.expiresAt.includes('T')) {
          needsSession = true  // will be overwritten below
        } else if (typeof s.expiresAt === 'number' && Date.now() < s.expiresAt) {
          needsSession = false  // valid ms-based session — keep it
        }
      } catch (_) { needsSession = true }
    }
    if (needsSession) {
      localStorage.setItem('apex:session', JSON.stringify({
        userId:    'demo-user',
        role:      'super_admin',
        username:  'demo',
        fullName:  'TrustSheild Demo User',
        email:     'demo@trustsheild.os',
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
      }))
    }
    // 3. Demo accounts — prevents authService from returning empty array
    if (!localStorage.getItem('apex:accounts')) {
      localStorage.setItem('apex:accounts', JSON.stringify([{
        id:       'demo-user',
        username: 'demo',
        email:    'demo@trustsheild.os',
        password: 'demo1234',
        role:     'super_admin',
        fullName: 'TrustSheild Demo User',
        avatar:   'DU',
      }]))
    }
  } catch (_) {
    // localStorage unavailable (SSR/test/private) — safe no-op
  }
})()

// ─── Inner app wrapper — hooks must be inside component tree ──
function AppCore() {
  useSystemStatus()

  useEffect(() => {
    const cleanup = mountDashboardBridge()
    return cleanup
  }, [])

  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppCore />
    </AuthProvider>
  )
}
