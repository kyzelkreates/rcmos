/**
 * ============================================================
 * TrustSheild OS™ — Root App Component
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * DEMO/PUBLIC ACCESS BOOTSTRAP (synchronous, before React mounts):
 *
 *   Writes a demo session to ALL relevant localStorage keys so that:
 *     1. apex:setup_complete   = 'true'      → no /auth/setup redirect
 *     2. apex:session          = {...}        → authService.getSession() returns session
 *     3. apex:auth:session     = {...}        → Zustand store loads isAuthenticated=true
 *     4. apex:auth:user        = {...}        → useAuth().user is populated
 *     5. apex:auth:role        = 'super_admin'→ useAuth().role is populated
 *     6. apex:accounts         = [...]        → signIn never sees empty accounts
 *
 *   AUTH_REQUIRED = false → full public/demo access.
 *
 * ============================================================
 */

import { RouterProvider } from 'react-router-dom'
import { router }         from './app_Router'
import AuthProvider       from './providers_AuthProvider'
import { useSystemStatus } from './hooks_useSystemStatus'
import { useEffect }      from 'react'
import { mountDashboardBridge } from './services_apex_apexBridge'

// ─── DEMO/PUBLIC ACCESS BOOTSTRAP ────────────────────────────
// Runs synchronously at module load — BEFORE React renders ANYTHING.
;(function bootstrapDemoAccess() {
  const AUTH_REQUIRED = false
  if (AUTH_REQUIRED) return

  try {
    const DEMO_SESSION = {
      userId:    'demo-user',
      role:      'super_admin',
      username:  'demo',
      fullName:  'TrustSheild Demo User',
      email:     'demo@trustsheild.os',
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,  // 1 year, ms number
    }
    const DEMO_USER = {
      id:    'demo-user',
      email: 'demo@trustsheild.os',
      user_metadata: {
        full_name: 'TrustSheild Demo User',
        username:  'demo',
        role:      'super_admin',
        avatar:    'DU',
      }
    }
    const DEMO_ACCOUNTS = [{
      id:       'demo-user',
      username: 'demo',
      email:    'demo@trustsheild.os',
      password: 'demo1234',
      role:     'super_admin',
      fullName: 'TrustSheild Demo User',
      avatar:   'DU',
    }]

    // 1. Setup flag
    localStorage.setItem('apex:setup_complete', 'true')

    // 2. authService session key  (used by authService.getSession)
    localStorage.setItem('apex:session', JSON.stringify(DEMO_SESSION))

    // 3. Zustand store keys  (used by useAuthStore initial state)
    //    These are what core_storage.js STORAGE_KEYS.AUTH_SESSION/USER/ROLE map to
    localStorage.setItem('apex:auth:session', JSON.stringify(DEMO_SESSION))
    localStorage.setItem('apex:auth:user',    JSON.stringify(DEMO_USER))
    localStorage.setItem('apex:auth:role',    'super_admin')

    // 4. Accounts list (authService signIn lookup)
    if (!localStorage.getItem('apex:accounts')) {
      localStorage.setItem('apex:accounts', JSON.stringify(DEMO_ACCOUNTS))
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
