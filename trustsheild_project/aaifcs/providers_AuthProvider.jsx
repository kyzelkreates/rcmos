/**
 * ============================================================
 * TrustSheild OS™ — Auth Provider (Demo-Safe Local Auth)
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * DEMO MODE (AUTH_REQUIRED = false):
 *   The IIFE in app_App.jsx already writes demo session to
 *   localStorage before React mounts. This provider simply
 *   calls getSession() to hydrate the Zustand store from that
 *   persisted data. No loading flash, no redirect.
 *
 *   isAuthenticated is now initialised synchronously from
 *   localStorage in core_storage.js so no auth-dependent
 *   component ever sees false before this provider finishes.
 *
 * ============================================================
 */

import { useEffect } from 'react'
import { authService } from './services_supabase_authService'
import { useAuthStore } from './core_storage'

export default function AuthProvider({ children }) {
  const setLoading = useAuthStore(s => s.setLoading)

  useEffect(() => {
    // Do NOT set isLoading=true here — the store already has
    // isAuthenticated synced from localStorage. Just reconcile.
    authService.getSession()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return children
}
