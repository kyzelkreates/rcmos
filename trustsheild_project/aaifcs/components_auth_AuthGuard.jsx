/**
 * ============================================================
 * TrustSheild OS™ — Auth Guard (Demo-Bypass Mode)
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * DEMO MODE BYPASS (Run 13 auth fix):
 *   When AUTH_REQUIRED is false (default for demo/public access),
 *   AuthGuard is completely transparent — it just renders children.
 *   No redirect, no spinner, no login wall.
 *
 *   This preserves all Auth code for future Live Mode use.
 *   To re-enable auth: set AUTH_REQUIRED = true below AND
 *   ensure apex:setup_complete + valid session are in localStorage.
 *
 * LIVE MODE (future):
 *   Set AUTH_REQUIRED = true.
 *   Auth will check session and redirect to /auth/login if absent.
 *
 * ============================================================
 */

import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './core_storage'
import { authService, hasPermission } from './services_supabase_authService'
import Icon from './components_ui_Icon'

// ─── MASTER AUTH SWITCH ───────────────────────────────────────
// false = demo/public mode — no login required (current default)
// true  = live mode — auth required for protected routes
const AUTH_REQUIRED = false

// ─── Demo session bootstrap ───────────────────────────────────
// Silently write a demo session to localStorage so nothing
// downstream ever reads null and triggers a redirect chain.
function bootstrapDemoSession() {
  if (AUTH_REQUIRED) return
  try {
    const existing = localStorage.getItem('apex:session')
    if (!existing) {
      localStorage.setItem('apex:session', JSON.stringify({
        userId:    'demo-user',
        role:      'super_admin',
        username:  'demo',
        fullName:  'Demo User',
        email:     'demo@trustsheild.os',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }))
    }
    // Always ensure setup flag is set so LoginOrSetup never bounces to /auth/setup
    if (localStorage.getItem('apex:setup_complete') !== 'true') {
      localStorage.setItem('apex:setup_complete', 'true')
    }
  } catch (_) {
    // localStorage unavailable — safe to ignore in SSR/test envs
  }
}

// Run once at module load (safe — no React hooks)
bootstrapDemoSession()

// ═══════════════════════════════════════════════════════════════
export default function AuthGuard({ children, requiredRole = null }) {
  const location = useLocation()
  const { role, isAuthenticated } = useAuthStore(s => ({
    role:            s.role,
    isAuthenticated: s.isAuthenticated,
  }))
  const [checking, setChecking] = useState(!AUTH_REQUIRED) // false = skip check

  // ── DEMO BYPASS: if auth not required, render children immediately ──
  if (!AUTH_REQUIRED) {
    return children
  }

  // ── LIVE MODE: validate session (only runs when AUTH_REQUIRED = true) ──
  useEffect(() => {
    if (!AUTH_REQUIRED) return
    let cancelled = false
    const timeout = setTimeout(() => {
      if (!cancelled) setChecking(false)
    }, 3000)
    authService.getSession()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) { clearTimeout(timeout); setChecking(false) }
      })
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [])

  // ── Loading splash (live mode only) ──────────────────────────
  if (checking) {
    return (
      <div
        className="flex items-center justify-center h-[100dvh]"
        style={{ background: '#050505' }}
      >
        <div className="flex flex-col items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-label="TrustSheild OS loading">
            <path d="M32 5 L55 17 L55 35 C55 49 45.5 58 32 63 C18.5 58 9 49 9 35 L9 17 Z"
              fill="rgba(214,168,79,0.06)" stroke="rgba(214,168,79,0.6)" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="32" cy="36" r="6" fill="rgba(55,255,139,0.15)" stroke="rgba(55,255,139,0.4)" strokeWidth="1" />
            <circle cx="32" cy="36" r="3" fill="#37ff8b" opacity="0.8" />
          </svg>
          <div className="w-7 h-7 border-2 rounded-full animate-spin"
            style={{ borderColor: 'rgba(214,168,79,0.15)', borderTopColor: '#d6a84f' }} />
          <span className="text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'rgba(90,95,107,0.8)' }}>
            Verifying session…
          </span>
        </div>
      </div>
    )
  }

  // ── Not authenticated → login (live mode only) ───────────────
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // ── Insufficient role ────────────────────────────────────────
  if (requiredRole && !hasPermission(role, requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 p-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Icon name="ShieldOff" size={28} style={{ color: '#f87171' }} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: '#f5f5f2' }}>Access Denied</h2>
          <p className="text-sm" style={{ color: '#5a5f6b' }}>You don't have permission to access this section.</p>
          <p className="text-xs mt-1" style={{ color: '#5a5f6b' }}>
            Required role: <span style={{ color: '#d6a84f' }}>{requiredRole}</span>
          </p>
        </div>
      </div>
    )
  }

  return children
}
