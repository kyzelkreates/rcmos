/**
 * ============================================================
 * TrustSheild OS™ — Response PWA
 * Run 3 — TrustSheild Response PWA Structure
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Route: /driver-app  (public — no auth guard)
 * PWA start_url: /#/driver-app
 * Installed PWA opens this route, not the dashboard.
 *
 * Screens/Sections:
 *   1. Home / Command Brief
 *   2. Current Crisis Brief
 *   3. Required Actions (Tasks)
 *   4. Situation Update Form
 *   5. Evidence / Notes
 *   6. Draft Response Review
 *   7. Escalation Request
 *   8. Sync Status (placeholder)
 *   9. Ethical / Human-Review Notice (persistent footer)
 *
 * State:  usePwaStore (trustsheild_pwa_demo_* namespace)
 * Data:   PWA_DEMO_DATA from data_trustsheild_demo.js
 * Legacy: driverSyncService imports left untouched for compatibility
 * ============================================================
 *
 * ⚠️  DEMO MODE ACTIVE — No backend connected.
 *     All actions are local only until Run 5/6 sync is built.
 *
 * ⚠️  ETHICAL USE NOTICE:
 *     AI guidance and response support are advisory only.
 *     All crisis, reputation, legal, public, or stakeholder
 *     actions must be reviewed by a responsible human before action.
 * ============================================================
 */

import { useState, useEffect, useCallback } from 'react'
import Icon from './components_ui_Icon'
import { usePwaStore, useTaskStore, useIdentityStore, useTrustStore, useConfigStore } from './core_storage'
import { PWA_DEMO_DATA, TASK_SEED_DATA, IDENTITY_SEED_DATA } from './data_trustsheild_demo'
import APP_CONFIG from './config_app'

// ─── Colour maps ──────────────────────────────────────────────
const RISK_COLOR = {
  Critical: { text: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)', dot: '#f87171' },
  High:     { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)',  dot: '#fb923c' },
  Medium:   { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)',  dot: '#fbbf24' },
  Low:      { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)',  dot: '#34d399' },
}
const STATUS_COLOR = {
  'Escalated':         { text: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  'Action Needed':     { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
  'Response Drafted':  { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.25)' },
  'Monitoring':        { text: '#38bdf8', bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.25)'  },
  'Resolved':          { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)'  },
  'New':               { text: '#d6a84f', bg: 'rgba(214,168,79,0.1)',   border: 'rgba(214,168,79,0.25)'  },
  'In Progress':       { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  },
  'Needs Review':      { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
  'Complete':          { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)'  },
  'Submitted (Demo)':  { text: '#8f5cff', bg: 'rgba(143,92,255,0.1)',   border: 'rgba(143,92,255,0.25)'  },
  'Awaiting Your Review': { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
}
const PRIORITY_COLOR = {
  Critical: '#f87171',
  High:     '#fb923c',
  Medium:   '#fbbf24',
  Low:      '#34d399',
}

// ─── Helpers ──────────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return '—'
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60)    return `${d}s ago`
  if (d < 3600)  return `${Math.floor(d/60)}m ago`
  if (d < 86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

// ─── Primitive UI ─────────────────────────────────────────────

function RiskPill({ level }) {
  const s = RISK_COLOR[level] || RISK_COLOR.Low
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
      {level}
    </span>
  )
}

function StatusPill({ status }) {
  const s = STATUS_COLOR[status] || { text: '#a8adb7', bg: 'rgba(168,173,183,0.1)', border: 'rgba(168,173,183,0.2)' }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      {status}
    </span>
  )
}

function DemoBadge({ small = false }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${small ? 'text-[9px]' : 'text-[10px]'}`}
      style={{ background: 'rgba(143,92,255,0.12)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.3)' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8f5cff' }} />
      Demo
    </span>
  )
}

function Card({ children, className = '', glow = false, style = {} }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(13,13,18,0.95)',
        border: glow ? '1px solid rgba(214,168,79,0.3)' : '1px solid rgba(214,168,79,0.12)',
        boxShadow: glow ? '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(214,168,79,0.08)' : '0 4px 16px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function CardHeader({ icon, iconColor, title, subtitle, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: '1px solid rgba(214,168,79,0.08)' }}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor || '#d6a84f'}12`, border: `1px solid ${iconColor || '#d6a84f'}28` }}>
          <Icon name={icon} size={15} style={{ color: iconColor || '#d6a84f' }} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{title}</div>
          {subtitle && <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{subtitle}</div>}
        </div>
      </div>
      {right && <div className="flex-shrink-0 ml-2">{right}</div>}
    </div>
  )
}

function TapButton({ onClick, children, variant = 'gold', disabled = false, fullWidth = false, loading = false }) {
  const V = {
    gold:    { color: '#d6a84f', bg: 'rgba(214,168,79,0.1)', border: 'rgba(214,168,79,0.3)', glow: 'rgba(214,168,79,0.2)' },
    green:   { color: '#37ff8b', bg: 'rgba(55,255,139,0.08)', border: 'rgba(55,255,139,0.25)', glow: 'rgba(55,255,139,0.15)' },
    purple:  { color: '#8f5cff', bg: 'rgba(143,92,255,0.08)', border: 'rgba(143,92,255,0.25)', glow: 'rgba(143,92,255,0.15)' },
    red:     { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', glow: 'rgba(248,113,113,0.15)' },
    amber:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.15)' },
    ghost:   { color: '#a8adb7', bg: 'transparent', border: 'rgba(168,173,183,0.2)', glow: 'transparent' },
  }
  const v = V[variant] || V.gold
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all active:scale-95 ${fullWidth ? 'w-full' : ''}`}
      style={{
        minHeight: 48,
        paddingLeft: 20,
        paddingRight: 20,
        color: disabled ? '#5a5f6b' : v.color,
        background: disabled ? 'rgba(90,95,107,0.08)' : v.bg,
        border: `1px solid ${disabled ? 'rgba(90,95,107,0.2)' : v.border}`,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = `0 0 16px ${v.glow}` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : children}
    </button>
  )
}

function TextInput({ label, value, onChange, placeholder, multiline = false, rows = 3 }) {
  const style = {
    width: '100%',
    background: 'rgba(13,13,18,0.8)',
    border: '1px solid rgba(214,168,79,0.2)',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: '0.875rem',
    color: '#f5f5f2',
    outline: 'none',
    resize: multiline ? 'vertical' : 'none',
    fontFamily: 'Inter, sans-serif',
    minHeight: multiline ? 80 : undefined,
  }
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={style}
            onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.2)'}
          />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style}
            onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.2)'}
          />
      }
    </div>
  )
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}</label>}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl text-sm"
        style={{
          background: 'rgba(13,13,18,0.8)',
          border: '1px solid rgba(214,168,79,0.2)',
          padding: '12px 14px',
          color: '#f5f5f2',
          outline: 'none',
          fontFamily: 'Inter, sans-serif',
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.2)'}
      >
        {options.map(o => (
          <option key={o.value || o} value={o.value || o}
            style={{ background: '#0d0d12', color: '#f5f5f2' }}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  )
}

function SuccessToast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
      style={{ background: 'rgba(55,255,139,0.12)', border: '1px solid rgba(55,255,139,0.3)', backdropFilter: 'blur(16px)', minWidth: 240, maxWidth: 320 }}>
      <Icon name="CheckCircle" size={18} style={{ color: '#37ff8b', flexShrink: 0 }} />
      <span className="text-sm font-medium" style={{ color: '#f5f5f2' }}>{message}</span>
    </div>
  )
}

function EmptySlate({ icon, message, sub }) {
  return (
    <div className="flex flex-col items-center py-10 gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(214,168,79,0.06)', border: '1px solid rgba(214,168,79,0.1)' }}>
        <Icon name={icon} size={24} style={{ color: 'rgba(214,168,79,0.2)' }} />
      </div>
      <div className="text-sm font-medium" style={{ color: '#5a5f6b' }}>{message}</div>
      {sub && <div className="text-xs" style={{ color: '#3a3f4b' }}>{sub}</div>}
    </div>
  )
}

// ─── PWA Bottom Nav ───────────────────────────────────────────
const PWA_TABS = [
  { key: 'home',      label: 'Home',     icon: 'Home'        },
  { key: 'case',      label: 'Case',     icon: 'AlertTriangle' },
  { key: 'tasks',     label: 'Actions',  icon: 'CheckSquare' },
  { key: 'update',    label: 'Update',   icon: 'Send'        },
  { key: 'evidence',  label: 'Evidence', icon: 'FileText'    },
  { key: 'drafts',    label: 'Drafts',   icon: 'FileEdit'    },
  { key: 'escalate',  label: 'Escalate', icon: 'AlertOctagon'},
  { key: 'identity',  label: 'Identity', icon: 'UserCircle'  },
  { key: 'sync',      label: 'Sync',     icon: 'Wifi'        },
]

function BottomNav({ active, onTab, taskBadge }) {
  // Show 5 tabs on mobile — rest accessible via "More" or scrollable bar
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{
        background: 'rgba(8,8,12,0.97)',
        borderTop: '1px solid rgba(214,168,79,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
      <div className="flex overflow-x-auto scrollbar-none">
        {PWA_TABS.map(t => {
          const isActive = active === t.key
          const hasBadge = t.key === 'tasks' && taskBadge > 0
          return (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className="flex flex-col items-center justify-center gap-1 flex-1 min-w-[56px] py-2.5 transition-all relative"
              style={{ color: isActive ? '#d6a84f' : '#5a5f6b' }}
            >
              <div className="relative">
                <Icon name={t.icon} size={20} />
                {hasBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: '#f87171', color: '#fff' }}>
                    {taskBadge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wide">{t.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: '#d6a84f', boxShadow: '0 0 8px rgba(214,168,79,0.6)' }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 1 — Home / Command Brief
// ═══════════════════════════════════════════════════════════════

// ─── PWA Live-Ready Empty State ───────────────────────────────
// Shown in any PWA screen when live mode is active and no
// backend-connected data exists yet.
function PwaLiveReady({ message }) {
  return (
    <Card>
      <div className="flex flex-col items-center py-10 gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(55,255,139,0.07)', border: '1px solid rgba(55,255,139,0.2)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#37ff8b', boxShadow: '0 0 6px rgba(55,255,139,0.8)' }} />
          <span className="text-xs font-semibold" style={{ color: '#37ff8b' }}>Live Mode Active</span>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.1)' }}>
          <Icon name="Radio" size={22} style={{ color: 'rgba(55,255,139,0.18)' }} />
        </div>
        <div className="text-center space-y-2 max-w-xs px-2">
          <div className="text-sm font-semibold" style={{ color: '#5a5f6b' }}>Live Mode is active.</div>
          <p className="text-xs leading-relaxed" style={{ color: '#3a3f4b' }}>
            {message || 'This PWA is ready for backend-connected assignments, but no live backend is configured yet. Demo data is hidden.'}
          </p>
        </div>
        <div className="w-full space-y-1.5 text-xs">
          {[
            { label: 'PWA Mode',  value: 'Live Ready' },
            { label: 'Backend',   value: 'Not Configured' },
            { label: 'Sync',      value: 'Not Connected' },
            { label: 'Tasks',     value: 'No live assigned tasks yet' },
          ].map(r => (
            <div key={r.label} className="flex justify-between px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(13,13,18,0.6)', border: '1px solid rgba(55,255,139,0.08)' }}>
              <span style={{ color: '#5a5f6b' }}>{r.label}</span>
              <span className="font-medium" style={{ color: '#37ff8b' }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] px-3 py-2 rounded-lg w-full text-center"
          style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.15)', color: '#8f5cff' }}>
          Backend configuration is added in Run 7.
        </div>
      </div>
    </Card>
  )
}

function HomeScreen({ profile, pwaCase, pwaTasks, onTab, isDemo }) {
  const pendingCount = pwaTasks?.filter(t => t.status === 'New' || t.status === 'In Progress' || t.status === 'Needs Review').length ?? 0
  const riskStyle = RISK_COLOR[pwaCase?.riskLevel] || RISK_COLOR.Low
  const now = new Date()

  return (
    <div className="space-y-4">
      {/* Identity header */}
      {/* Backend / Sync readiness status */}
      <Card>
        <div className="p-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(214,168,79,0.5)' }}>Backend & Sync Status</div>
          {[
            { label: 'PWA Mode',          value: isDemo ? 'Demo Local' : 'Live Ready',    color: isDemo ? '#8f5cff' : '#37ff8b' },
            { label: 'Backend Provider',  value: backendProvider ? `${backendProvider.charAt(0).toUpperCase() + backendProvider.slice(1)} (Saved Locally)` : 'Not Configured', color: backendProvider ? '#d6a84f' : '#f87171' },
            { label: 'Sync Status',       value: 'Not Connected',                          color: '#f87171'  },
            { label: 'Monitoring APIs',   value: 'Not Configured',                         color: '#5a5f6b'  },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(214,168,79,0.05)' }}>
              <span className="text-xs" style={{ color: '#5a5f6b' }}>{r.label}</span>
              <span className="text-xs font-medium" style={{ color: r.color }}>{r.value}</span>
            </div>
          ))}
          {!backendProvider && (
            <p className="text-[10px] pt-1" style={{ color: '#3a3f4b' }}>
              Configure a backend provider in the Command Dashboard → Backend tab to enable live sync.
            </p>
          )}
        </div>
      </Card>
      <Card glow>
        <div className="p-4 space-y-3">
          {/* Logo + brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-label="TrustSheild OS™">
                  <circle cx="16" cy="16" r="15" stroke="rgba(214,168,79,0.25)" strokeWidth="1"/>
                  <path d="M16 4 L26 8 L26 16 C26 22 21 27 16 29 C11 27 6 22 6 16 L6 8 Z"
                    fill="rgba(214,168,79,0.08)" stroke="rgba(214,168,79,0.6)" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M16 7 L24 10.5 L24 16.5 C24 21 20 25 16 26.5 C12 25 8 21 8 16.5 L8 10.5 Z"
                    fill="rgba(143,92,255,0.06)" stroke="rgba(143,92,255,0.3)" strokeWidth="0.8" strokeLinejoin="round"/>
                  <circle cx="16" cy="17" r="2.5" fill="rgba(55,255,139,0.85)"/>
                  <circle cx="16" cy="17" r="4" fill="rgba(55,255,139,0.12)"/>
                </svg>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: '#37ff8b', borderColor: '#050505', boxShadow: '0 0 8px rgba(55,255,139,0.8)' }}/>
              </div>
              <div>
                <div className="text-base font-bold font-display" style={{ color: '#d6a84f', textShadow: '0 0 12px rgba(214,168,79,0.3)' }}>
                  TrustSheild OS™
                </div>
                <div className="text-[10px] font-semibold tracking-wider" style={{ color: '#5a5f6b' }}>
                  Response PWA
                </div>
              </div>
            </div>
            <DemoBadge />
          </div>

          {/* User identity */}
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.1)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: 'rgba(55,255,139,0.1)', border: '1px solid rgba(55,255,139,0.2)', color: '#37ff8b' }}>
              {profile?.displayName?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'RS'}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{profile?.displayName || 'Response User'}</div>
              <div className="text-xs" style={{ color: '#5a5f6b' }}>{profile?.role || 'Responder'} · {profile?.organisation || 'Demo Organisation'}</div>
            </div>
          </div>

          {/* Welcome brief */}
          <p className="text-xs leading-relaxed" style={{ color: '#a8adb7' }}>
            Your 24/7 connected response PWA for receiving crisis updates, completing response actions, and keeping the TrustSheild Command Dashboard updated.
          </p>
          <div className="text-[10px]" style={{ color: '#3a3f4b' }}>
            {now.toLocaleString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
        </div>
      </Card>

      {/* Current case status banner */}
      {pwaCase && (
        <div
          className="rounded-2xl p-4 space-y-3 cursor-pointer active:opacity-90"
          onClick={() => onTab('case')}
          style={{
            background: `${riskStyle.bg}`,
            border: `1px solid ${riskStyle.border}`,
            boxShadow: `0 0 20px ${riskStyle.bg}`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: riskStyle.text }}>
              Active Case
            </div>
            <div className="flex items-center gap-2">
              <RiskPill level={pwaCase.riskLevel} />
              <Icon name="ChevronRight" size={14} style={{ color: riskStyle.text }} />
            </div>
          </div>
          <div className="text-base font-bold" style={{ color: '#f5f5f2' }}>{pwaCase.title}</div>
          <div className="text-xs" style={{ color: riskStyle.text }}>{pwaCase.client}</div>
          <StatusPill status={pwaCase.status} />
        </div>
      )}

      {/* Action summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 cursor-pointer active:opacity-90" onClick={() => onTab('tasks')}
          style={{ background: 'rgba(13,13,18,0.9)', border: '1px solid rgba(214,168,79,0.12)' }}>
          <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: pendingCount > 0 ? '#fb923c' : '#37ff8b' }}>
            {pendingCount}
          </div>
          <div className="text-xs mt-1" style={{ color: '#5a5f6b' }}>Actions Pending</div>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="ChevronRight" size={12} style={{ color: '#d6a84f' }} />
            <span className="text-[10px]" style={{ color: '#d6a84f' }}>View tasks</span>
          </div>
        </div>
        <div className="rounded-2xl p-4 cursor-pointer active:opacity-90" onClick={() => onTab('update')}
          style={{ background: 'rgba(13,13,18,0.9)', border: '1px solid rgba(55,255,139,0.1)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            style={{ background: 'rgba(55,255,139,0.1)', border: '1px solid rgba(55,255,139,0.2)' }}>
            <Icon name="Send" size={16} style={{ color: '#37ff8b' }} />
          </div>
          <div className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>Send Update</div>
          <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>Submit to dashboard</div>
        </div>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader icon="Zap" iconColor="#d6a84f" title="Quick Actions" />
        <div className="p-4 grid grid-cols-1 gap-2.5">
          {[
            { label: 'Submit Situation Update', icon: 'Send',     variant: 'gold',   tab: 'update'   },
            { label: 'Add Evidence Note',       icon: 'FileText', variant: 'ghost',  tab: 'evidence' },
            { label: 'Review Draft Response',   icon: 'FileEdit', variant: 'purple', tab: 'drafts'   },
            { label: 'Request Escalation',      icon: 'AlertOctagon', variant: 'red', tab: 'escalate'},
          ].map(a => (
            <TapButton key={a.label} fullWidth onClick={() => onTab(a.tab)} variant={a.variant}>
              <Icon name={a.icon} size={16} />
              {a.label}
            </TapButton>
          ))}
        </div>
      </Card>

      {/* Sync status mini */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer active:opacity-90"
        onClick={() => onTab('sync')}
        style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <div className="flex items-center gap-2.5">
          <Icon name="Wifi" size={16} style={{ color: '#8f5cff' }} />
          <div>
            <div className="text-xs font-semibold" style={{ color: '#8f5cff' }}>Demo Mode · Local Only</div>
            <div className="text-[10px]" style={{ color: '#5a5f6b' }}>Backend sync — future run</div>
          </div>
        </div>
        <Icon name="ChevronRight" size={14} style={{ color: '#8f5cff' }} />
      </div>

      {/* Ethical notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <Icon name="ShieldCheck" size={14} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px] leading-relaxed" style={{ color: '#8f5cff' }}>
          {APP_CONFIG.aiAdvisory}
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 2 — Current Crisis Brief
// ═══════════════════════════════════════════════════════════════
function CrisisBriefScreen({ pwaCase, onTab, isDemo }) {
  if (!isDemo) return <PwaLiveReady message="No live crisis case assigned yet. Cases will appear once a live backend is configured and an active case is assigned." />
  if (!pwaCase) return (
    <EmptySlate icon="AlertTriangle" message="No active case assigned." sub="Your dashboard will assign a case when ready." />
  )
  const rs = RISK_COLOR[pwaCase.riskLevel] || RISK_COLOR.Low
  const ss = STATUS_COLOR[pwaCase.status] || {}

  return (
    <div className="space-y-4">
      {/* Risk banner */}
      <div className="rounded-2xl p-4"
        style={{ background: rs.bg, border: `1px solid ${rs.border}`, boxShadow: `0 0 24px ${rs.bg}` }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: rs.text }}>Current Crisis Case</span>
          <div className="flex items-center gap-2">
            <RiskPill level={pwaCase.riskLevel} />
            <DemoBadge small />
          </div>
        </div>
        <div className="text-xl font-bold leading-snug" style={{ color: '#f5f5f2' }}>{pwaCase.title}</div>
        <div className="text-sm mt-1" style={{ color: rs.text }}>{pwaCase.client}</div>
      </div>

      {/* Details */}
      <Card>
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <RiskPill level={pwaCase.riskLevel} />
            <StatusPill status={pwaCase.status} />
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Source',    value: pwaCase.source },
              { label: 'Channel',   value: pwaCase.channel },
              { label: 'Priority',  value: pwaCase.priority },
              { label: 'Owner',     value: pwaCase.dashboardOwner },
              { label: 'Updated',   value: timeAgo(pwaCase.updatedAt) },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-start gap-2"
                style={{ borderBottom: '1px solid rgba(214,168,79,0.06)', paddingBottom: 8 }}>
                <span className="text-xs" style={{ color: '#5a5f6b', flexShrink: 0 }}>{r.label}</span>
                <span className="text-xs text-right" style={{ color: '#c8ccd2' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Latest instruction */}
      {pwaCase.latestInstruction && (
        <Card>
          <CardHeader icon="MessageSquare" iconColor="#d6a84f" title="Latest Instruction" subtitle="From TrustSheild Command Dashboard" />
          <div className="p-4">
            <p className="text-sm leading-relaxed" style={{ color: '#c8ccd2' }}>{pwaCase.latestInstruction}</p>
          </div>
        </Card>
      )}

      {/* Actions from this screen */}
      <div className="grid grid-cols-2 gap-3">
        <TapButton fullWidth onClick={() => onTab('tasks')} variant="gold">
          <Icon name="CheckSquare" size={16} />
          View Tasks
        </TapButton>
        <TapButton fullWidth onClick={() => onTab('update')} variant="green">
          <Icon name="Send" size={16} />
          Send Update
        </TapButton>
      </div>

      {/* Ethical notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <Icon name="Info" size={13} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px] leading-relaxed" style={{ color: '#8f5cff' }}>
          All crisis, reputation, legal, public, or stakeholder actions must be reviewed by a responsible human before action.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 3 — Required Actions / Tasks
// ═══════════════════════════════════════════════════════════════
const TASK_STATUS_NEXT = {
  'New':         'In Progress',
  'In Progress': 'Submitted (Demo)',
  'Needs Review':'Submitted (Demo)',
}
const TASK_BTN_LABEL = {
  'New':          { label: 'Start Action', icon: 'Play',       variant: 'gold'  },
  'In Progress':  { label: 'Mark Submitted', icon: 'CheckCircle', variant: 'green' },
  'Needs Review': { label: 'Mark Reviewed', icon: 'CheckCircle', variant: 'amber' },
  'Submitted (Demo)': { label: 'Submitted ✓', icon: 'CheckCircle', variant: 'ghost' },
  'Complete':     { label: 'Complete ✓', icon: 'CheckCircle', variant: 'ghost' },
}

function TasksScreen({ pwaTasks, updateTask, onTab, activePwaId, isDemo }) {
  if (!isDemo) {
    return (
      <div className="space-y-3">
        <PwaLiveReady message="No live assigned tasks yet. Tasks will appear here once a live backend is configured and tasks are assigned to your secure PWA identity." />
      </div>
    )
  }
  const [toast, setToast] = useState(null)
  const [filter, setFilter] = useState('all')
  const { configTasks, pwaUpdateStatus, seedTaskData } = useTaskStore()

  // Seed configurable tasks on mount if not already set
  useEffect(() => { seedTaskData(TASK_SEED_DATA) }, [])

  // Merge configTasks (dashboard-created) with legacy pwaTasks.
  // configTasks take priority — shown first, identified by source:'demo'.
  const CURRENT_PWA_ID = activePwaId || 'TS-PWA-0001' // live from useIdentityStore — Run 5
  // Match by TS-PWA-XXXX ID (Run 5) OR legacy pwa-00X ID (Run 1-4 seeds)
  const LEGACY_MAP = { 'TS-PWA-0001': 'pwa-001', 'TS-PWA-0002': 'pwa-002', 'TS-PWA-0003': 'pwa-003', 'TS-PWA-0004': 'pwa-004', 'TS-PWA-0005': 'pwa-005' }
  const legacyId = LEGACY_MAP[CURRENT_PWA_ID] || null
  const dashboardTasks = (configTasks || []).filter(t => t.assignedPwaId === CURRENT_PWA_ID || (legacyId && t.assignedPwaId === legacyId))
  const allTasks = [
    ...dashboardTasks,
    ...(pwaTasks || []).filter(pt => !dashboardTasks.some(dt => dt.id === pt.id)),
  ]
  const filtered = filter === 'all' ? allTasks : allTasks.filter(t => t.status === filter)
  const pending  = allTasks.filter(t => ['New','Sent to PWA','In Progress','Needs Review'].includes(t.status)).length

  const handleAction = useCallback((task, forceStatus) => {
    const nextStatus = forceStatus || TASK_STATUS_NEXT[task.status]
    if (!nextStatus) return
    const isDashboardTask = task.source === 'demo' && !!task.createdBy
    if (isDashboardTask) {
      pwaUpdateStatus(task.id, nextStatus, 'Response PWA User')
    } else {
      updateTask(task.id, { status: nextStatus })
    }
    setToast(`"${task.title.slice(0,28)}…" → ${nextStatus} (demo/local)`)
  }, [updateTask, pwaUpdateStatus])

  return (
    <div className="space-y-4">
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}

      {/* Summary */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-base font-bold" style={{ color: pending > 0 ? '#fb923c' : '#37ff8b' }}>{pending}</span>
          <span className="text-sm ml-1.5" style={{ color: '#5a5f6b' }}>pending action{pending !== 1 ? 's' : ''}</span>
        </div>
        <DemoBadge />
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {['all', 'New', 'In Progress', 'Needs Review', 'Complete'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={
              filter === f
                ? { background: 'rgba(214,168,79,0.15)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.35)' }
                : { background: 'transparent', color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)' }
            }>
            {f === 'all' ? `All (${pwaTasks?.length ?? 0})` : f}
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div className="space-y-3">
        {filtered?.length > 0 ? filtered.map(task => {
          const isDashTask = task.source === 'demo' && !!task.createdBy
          const btn = TASK_BTN_LABEL[task.status] || TASK_BTN_LABEL.New
          const isDone = ['Complete','Submitted (Demo)','Approved'].includes(task.status)
          const pc = PRIORITY_COLOR[task.priority] || '#d6a84f'
          const isApprovalTask = ['Approve Draft Response','Review Draft Response'].includes(task.type)
          const dueText = task.dueLabel || task.dueStatus || '—'

          return (
            <Card key={task.id} style={{ opacity: isDone ? 0.75 : 1, border: isDashTask ? '1px solid rgba(214,168,79,0.2)' : undefined }}>
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      {isDashTask && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                          style={{ background: 'rgba(214,168,79,0.1)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.2)' }}>
                          From Dashboard
                        </span>
                      )}
                      {task.humanReviewRequired && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                          style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                          Human Review Required
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold leading-snug" style={{ color: '#f5f5f2' }}>{task.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{task.type}</div>
                  </div>
                  <StatusPill status={task.status} />
                </div>

                {/* Instructions (dashboard tasks) or description (PWA seed tasks) */}
                {(task.instructions || task.description) && (
                  <div className="p-2.5 rounded-xl"
                    style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
                    <div className="text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: '#5a5f6b' }}>
                      {task.instructions ? 'Instructions' : 'Description'}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#a8adb7' }}>{task.instructions || task.description}</p>
                  </div>
                )}

                {/* Required action */}
                {task.requiredAction && (
                  <div className="text-xs" style={{ color: '#c8ccd2' }}>
                    <span style={{ color: '#5a5f6b' }}>Action: </span>{task.requiredAction}
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${pc}12`, color: pc, border: `1px solid ${pc}25` }}>
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Due: {dueText}</span>
                  {(task.linkedCase || task.linkedCaseTitle) && (
                    <span className="text-[10px] truncate max-w-[160px]" style={{ color: '#d6a84f' }}>
                      ↗ {(task.linkedCase || task.linkedCaseTitle).slice(0, 32)}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                {!isDone && (
                  <div className="space-y-2">
                    {/* Primary action */}
                    <TapButton fullWidth onClick={() => handleAction(task)} variant={btn.variant}>
                      <Icon name={btn.icon} size={15} />
                      {btn.label}
                    </TapButton>

                    {/* Approval task — show Approve / Needs Changes */}
                    {isApprovalTask && task.status !== 'New' && (
                      <div className="grid grid-cols-2 gap-2">
                        <TapButton fullWidth onClick={() => handleAction(task, 'Approved')} variant="green">
                          <Icon name="CheckCircle" size={14} />Approve
                        </TapButton>
                        <TapButton fullWidth onClick={() => handleAction(task, 'Needs Changes')} variant="amber">
                          <Icon name="Edit3" size={14} />Changes
                        </TapButton>
                      </div>
                    )}

                    {/* Escalate shortcut */}
                    {task.status === 'In Progress' && (
                      <TapButton fullWidth onClick={() => handleAction(task, 'Escalated')} variant="red">
                        <Icon name="AlertTriangle" size={14} />Request Escalation
                      </TapButton>
                    )}
                  </div>
                )}

                {/* Done state */}
                {isDone && (
                  <div className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.15)' }}>
                    <Icon name="CheckCircle" size={13} style={{ color: '#37ff8b' }} />
                    <span className="text-xs" style={{ color: '#37ff8b' }}>{task.status} (demo/local)</span>
                  </div>
                )}

                {/* Human review advisory */}
                {task.humanReviewRequired && !isDone && (
                  <div className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <Icon name="ShieldAlert" size={11} style={{ color: '#f87171', flexShrink: 0 }} />
                    <span className="text-[10px]" style={{ color: '#fca5a5' }}>Human review required before public action.</span>
                  </div>
                )}
              </div>
            </Card>
          )
        }) : <EmptySlate icon="CheckSquare" message="No assigned tasks yet." sub="New response tasks from the TrustSheild Command Dashboard will appear here." />}
      </div>

      {/* Shortcut to submit update */}
      <TapButton fullWidth onClick={() => onTab('update')} variant="ghost">
        <Icon name="Send" size={15} />
        Submit a Situation Update →
      </TapButton>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 4 — Situation Update Form
// ═══════════════════════════════════════════════════════════════
const UPDATE_TYPES = ['Situation Update', 'Check-in', 'Progress Report', 'Issue Log', 'Confirmation', 'Request for Guidance']
const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical']

function UpdateScreen({ addPwaUpdate, pwaUpdates, pwaCase }) {
  const [type,    setType]    = useState('Situation Update')
  const [message, setMessage] = useState('')
  const [urgency, setUrgency] = useState('Medium')
  const [note,    setNote]    = useState('')
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState(null)

  const canSubmit = message.trim().length >= 10

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => {
      addPwaUpdate({
        type,
        message: message.trim(),
        urgency,
        note: note.trim() || null,
        linkedCase: pwaCase?.title || 'General',
        submittedBy: 'You (Demo)',
      })
      setMessage('')
      setNote('')
      setLoading(false)
      setToast('Update submitted locally (demo mode)')
    }, 600)
  }, [type, message, urgency, note, canSubmit, addPwaUpdate, pwaCase])

  return (
    <div className="space-y-4">
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}

      <Card>
        <CardHeader icon="Send" iconColor="#37ff8b" title="Situation Update" subtitle="Saved locally — demo mode" right={<DemoBadge />} />
        <div className="p-4 space-y-4">
          <SelectInput label="Update Type" value={type} onChange={setType}
            options={UPDATE_TYPES.map(v => ({ value: v, label: v }))} />
          <SelectInput label="Urgency" value={urgency} onChange={setUrgency}
            options={URGENCY_LEVELS.map(v => ({ value: v, label: v }))} />
          <TextInput label="Update Message *" value={message} onChange={setMessage}
            placeholder="Describe the current situation…" multiline rows={4} />
          <TextInput label="Optional Note" value={note} onChange={setNote}
            placeholder="Any additional context or detail…" multiline rows={2} />

          {pwaCase && (
            <div className="flex items-center gap-2 text-xs px-1">
              <Icon name="Link" size={12} style={{ color: '#5a5f6b' }} />
              <span style={{ color: '#5a5f6b' }}>Linked to: </span>
              <span style={{ color: '#d6a84f' }}>{pwaCase.title.slice(0, 40)}…</span>
            </div>
          )}

          <div className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.15)' }}>
            <Icon name="Info" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
            <p className="text-[10px]" style={{ color: '#8f5cff' }}>
              Saved locally until backend sync is enabled (later run). Dashboard will not receive this yet.
            </p>
          </div>

          <TapButton fullWidth onClick={handleSubmit} variant="green" disabled={!canSubmit} loading={loading}>
            <Icon name="Send" size={16} />
            Submit Update
          </TapButton>
        </div>
      </Card>

      {/* Update history */}
      {pwaUpdates && pwaUpdates.length > 0 && (
        <Card>
          <CardHeader icon="Clock" iconColor="#5a5f6b" title="Submitted Updates" subtitle="Local history" />
          <div className="p-3 space-y-2">
            {pwaUpdates.map(u => (
              <div key={u.id} className="p-3 rounded-xl"
                style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.12)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: '#c8ccd2' }}>{u.type}</span>
                  <span className="text-[10px] font-mono" style={{ color: '#5a5f6b' }}>{timeAgo(u.ts)}</span>
                </div>
                <p className="text-xs" style={{ color: '#a8adb7' }}>{u.message}</p>
                <StatusPill status={u.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 5 — Evidence & Notes
// ═══════════════════════════════════════════════════════════════
const EVIDENCE_TYPES = ['Note', 'Screenshot (placeholder)', 'Link', 'Customer Message', 'Public Post', 'Internal Note', 'Review', 'Media Mention']
const EVIDENCE_ICONS_MAP = {
  'Note':                  'StickyNote',
  'Screenshot (placeholder)': 'Camera',
  'Link':                  'Link',
  'Customer Message':      'MessageCircle',
  'Public Post':           'Globe',
  'Internal Note':         'Lock',
  'Review':                'Star',
  'Media Mention':         'Newspaper',
}

function EvidenceScreen({ pwaNotes, addNote, pwaCase }) {
  const [evType,  setEvType]  = useState('Note')
  const [desc,    setDesc]    = useState('')
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState(null)

  const canAdd = desc.trim().length >= 5

  const handleAdd = useCallback(() => {
    if (!canAdd) return
    setLoading(true)
    setTimeout(() => {
      addNote({
        evidenceType: evType,
        description: desc.trim(),
        linkedCase: pwaCase?.title || 'General',
        submittedBy: 'You (Demo)',
      })
      setDesc('')
      setLoading(false)
      setToast('Evidence note added locally')
    }, 500)
  }, [evType, desc, canAdd, addNote, pwaCase])

  return (
    <div className="space-y-4">
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}

      <Card>
        <CardHeader icon="FileText" iconColor="#d6a84f" title="Add Evidence / Note" subtitle="Local demo only" right={<DemoBadge />} />
        <div className="p-4 space-y-4">
          <SelectInput label="Evidence Type" value={evType} onChange={setEvType}
            options={EVIDENCE_TYPES.map(v => ({ value: v, label: v }))} />
          <TextInput label="Description *" value={desc} onChange={setDesc}
            placeholder="Describe what you observed or are logging…" multiline rows={3} />

          {evType === 'Screenshot (placeholder)' && (
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(214,168,79,0.06)', border: '1px solid rgba(214,168,79,0.18)', borderStyle: 'dashed' }}>
              <Icon name="Camera" size={20} style={{ color: 'rgba(214,168,79,0.4)', flexShrink: 0 }} />
              <div>
                <div className="text-xs font-semibold" style={{ color: '#d6a84f' }}>Screenshot / File Upload</div>
                <div className="text-[10px]" style={{ color: '#5a5f6b' }}>File upload will be available in a later run. Add a description for now.</div>
              </div>
            </div>
          )}

          <TapButton fullWidth onClick={handleAdd} variant="gold" disabled={!canAdd} loading={loading}>
            <Icon name="Plus" size={16} />
            Add Evidence Note
          </TapButton>
        </div>
      </Card>

      {/* Existing notes */}
      {pwaNotes && pwaNotes.length > 0 && (
        <Card>
          <CardHeader icon="FolderOpen" iconColor="#5a5f6b" title="Evidence Log" subtitle="Local records" />
          <div className="p-3 space-y-2">
            {pwaNotes.map(n => {
              const iconName = EVIDENCE_ICONS_MAP[n.evidenceType] || 'FileText'
              return (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(13,13,20,0.6)', border: '1px solid rgba(214,168,79,0.08)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(214,168,79,0.08)', border: '1px solid rgba(214,168,79,0.18)' }}>
                    <Icon name={iconName} size={14} style={{ color: '#d6a84f' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#d6a84f' }}>{n.evidenceType}</span>
                      <span className="text-[10px] font-mono" style={{ color: '#5a5f6b' }}>{timeAgo(n.ts)}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#a8adb7' }}>{n.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {(!pwaNotes || pwaNotes.length === 0) && (
        <EmptySlate icon="FileText" message="No evidence notes yet." sub="Add your first note above." />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 6 — Draft Response Review
// ═══════════════════════════════════════════════════════════════
function DraftsScreen({ pwaDraftReviews, updateDraftReview }) {
  const [toast, setToast] = useState(null)

  const handleReview = useCallback((id, action) => {
    const statusMap = {
      approve:        'Approved (Demo)',
      needs_changes:  'Changes Requested (Demo)',
      escalate:       'Escalated (Demo)',
    }
    updateDraftReview(id, { reviewStatus: action, status: statusMap[action] })
    setToast(`Draft marked: ${statusMap[action]}`)
  }, [updateDraftReview])

  return (
    <div className="space-y-4">
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}

      {/* Safety banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(143,92,255,0.08)', border: '1px solid rgba(143,92,255,0.25)' }}>
        <Icon name="ShieldAlert" size={16} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <div>
          <div className="text-sm font-bold" style={{ color: '#8f5cff' }}>Human Review Required</div>
          <p className="text-xs mt-1" style={{ color: '#a87dff' }}>
            {APP_CONFIG.aiAdvisory} Do not approve any draft response without carefully reading it first.
          </p>
        </div>
      </div>

      {pwaDraftReviews && pwaDraftReviews.length > 0 ? pwaDraftReviews.map(draft => {
        const reviewed = !!draft.reviewStatus
        return (
          <Card key={draft.id}>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{draft.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{draft.linkedCase}</div>
                </div>
                <StatusPill status={reviewed ? (draft.status || 'Reviewed') : draft.status} />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                  {draft.tone}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(200,204,210,0.08)', color: '#c8ccd2', border: '1px solid rgba(200,204,210,0.15)' }}>
                  {draft.intendedChannel}
                </span>
                <DemoBadge small />
              </div>

              {/* Draft note from dashboard */}
              {draft.dashboardNote && (
                <div className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(214,168,79,0.06)', border: '1px solid rgba(214,168,79,0.15)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon name="MessageSquare" size={11} style={{ color: '#d6a84f' }} />
                    <span className="text-[10px] font-semibold" style={{ color: '#d6a84f' }}>Dashboard Note</span>
                  </div>
                  <p className="text-xs" style={{ color: '#a8adb7' }}>{draft.dashboardNote}</p>
                </div>
              )}

              {/* Draft content */}
              <div className="p-3 rounded-xl"
                style={{ background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(214,168,79,0.08)' }}>
                <p className="text-xs font-mono leading-relaxed" style={{ color: '#a8adb7' }}>{draft.content}</p>
              </div>

              {/* Action buttons */}
              {!reviewed ? (
                <div className="grid grid-cols-3 gap-2">
                  <TapButton onClick={() => handleReview(draft.id, 'approve')} variant="green">
                    <Icon name="CheckCircle" size={14} />
                    Approve
                  </TapButton>
                  <TapButton onClick={() => handleReview(draft.id, 'needs_changes')} variant="amber">
                    <Icon name="Edit3" size={14} />
                    Changes
                  </TapButton>
                  <TapButton onClick={() => handleReview(draft.id, 'escalate')} variant="red">
                    <Icon name="AlertTriangle" size={14} />
                    Escalate
                  </TapButton>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl"
                  style={{ background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.15)' }}>
                  <Icon name="CheckCircle" size={14} style={{ color: '#37ff8b' }} />
                  <span className="text-xs" style={{ color: '#37ff8b' }}>{draft.status}</span>
                  <span className="text-[10px] ml-auto" style={{ color: '#5a5f6b' }}>{timeAgo(draft.reviewedAt)}</span>
                </div>
              )}
            </div>
          </Card>
        )
      }) : (
        <EmptySlate icon="FileEdit" message="No drafts awaiting review." sub="The dashboard will send drafts here when ready." />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 7 — Escalation Request
// ═══════════════════════════════════════════════════════════════
const ESCALATION_REASONS = [
  'Legal review needed',
  'PR review needed',
  'Customer complaint worsening',
  'Public post gaining traction',
  'Media contact involved',
  'Safety / safeguarding concern',
  'Incorrect public claim spreading',
  'Client approval required',
  'Other',
]

function EscalationScreen({ addEscalation, pwaEscalations, pwaCase }) {
  const [reason,  setReason]  = useState(ESCALATION_REASONS[0])
  const [urgency, setUrgency] = useState('High')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState(null)

  const canSubmit = message.trim().length >= 10

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => {
      addEscalation({
        reason,
        urgency,
        message: message.trim(),
        linkedCase: pwaCase?.title || 'General',
        submittedBy: 'You (Demo)',
      })
      setMessage('')
      setLoading(false)
      setToast('Escalation request submitted locally (demo mode)')
    }, 700)
  }, [reason, urgency, message, canSubmit, addEscalation, pwaCase])

  return (
    <div className="space-y-4">
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}

      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
        <Icon name="AlertOctagon" size={18} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
        <div>
          <div className="text-sm font-bold" style={{ color: '#f87171' }}>Request Escalation</div>
          <p className="text-xs mt-1" style={{ color: '#fca5a5' }}>
            Use this to flag that a situation requires urgent attention from the dashboard team or a specialist. All escalations are reviewed by a human.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader icon="AlertOctagon" iconColor="#f87171" title="Escalation Details" subtitle="Saved locally — demo mode" right={<DemoBadge />} />
        <div className="p-4 space-y-4">
          <SelectInput label="Escalation Reason" value={reason} onChange={setReason}
            options={ESCALATION_REASONS.map(v => ({ value: v, label: v }))} />
          <SelectInput label="Urgency Level" value={urgency} onChange={setUrgency}
            options={URGENCY_LEVELS.map(v => ({ value: v, label: v }))} />
          <TextInput label="Message *" value={message} onChange={setMessage}
            placeholder="Describe what is happening and why you are escalating…" multiline rows={4} />

          <TapButton fullWidth onClick={handleSubmit} variant="red" disabled={!canSubmit} loading={loading}>
            <Icon name="AlertTriangle" size={16} />
            Submit Escalation Request
          </TapButton>
        </div>
      </Card>

      {/* History */}
      {pwaEscalations && pwaEscalations.length > 0 && (
        <Card>
          <CardHeader icon="Clock" iconColor="#5a5f6b" title="Escalation History" />
          <div className="p-3 space-y-2">
            {pwaEscalations.map(e => (
              <div key={e.id} className="p-3 rounded-xl"
                style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: '#f87171' }}>{e.reason}</span>
                  <span className="text-[10px] font-mono" style={{ color: '#5a5f6b' }}>{timeAgo(e.ts)}</span>
                </div>
                <p className="text-xs" style={{ color: '#a8adb7' }}>{e.message}</p>
                <div className="mt-2"><StatusPill status={e.status} /></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Ethical reminder */}
      <div className="p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <p className="text-[10px]" style={{ color: '#8f5cff' }}>
          ⚠ TrustSheild OS™ must not be used to automate harassment, fake reviews, impersonation, threats, misinformation, or unlawful activity. All escalations must be lawful and in good faith.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 8 — Sync Status
// ═══════════════════════════════════════════════════════════════
function SyncScreen({ profile, isDemo, backendProvider }) {
  const SYNC_ROWS = [
    { label: 'PWA Mode',         value: 'Demo',                   color: '#8f5cff' },
    { label: 'Sync Status',      value: 'Local Demo / No Backend', color: '#fbbf24' },
    { label: 'Unique PWA ID',    value: 'Pending — Run 5',        color: '#5a5f6b' },
    { label: 'Dashboard Link',   value: 'Pending Sync Setup',     color: '#5a5f6b' },
    { label: 'Last Local Update',value: new Date().toLocaleTimeString('en-GB', { hour12: false }), color: '#37ff8b' },
    { label: 'Backend',          value: 'Not configured yet',     color: '#5a5f6b' },
    { label: 'App Version',      value: APP_CONFIG.version,       color: '#a8adb7' },
    { label: 'Build Stage',      value: APP_CONFIG.buildStage,    color: '#a8adb7' },
  ]

  return (
    <div className="space-y-4">
      {/* Sync status card */}
      <Card>
        <CardHeader icon="Wifi" iconColor="#8f5cff" title="Sync Status" subtitle="Demo Mode — local only" right={<DemoBadge />} />
        <div className="p-4 space-y-1">
          {SYNC_ROWS.map(r => (
            <div key={r.label} className="flex justify-between items-center py-2.5"
              style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
              <span className="text-xs" style={{ color: '#5a5f6b' }}>{r.label}</span>
              <span className="text-xs font-semibold text-right ml-4" style={{ color: r.color }}>{r.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* PWA profile */}
      <Card>
        <CardHeader icon="User" iconColor="#d6a84f" title="Responder Profile" subtitle="Demo placeholder" />
        <div className="p-4 space-y-2">
          {[
            { label: 'Display Name', value: profile?.displayName || '—' },
            { label: 'Role',         value: profile?.role || '—' },
            { label: 'Organisation', value: profile?.organisation || '—' },
            { label: 'PWA ID',       value: profile?.pwaIdLabel || 'Pending Run 5' },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2"
              style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
              <span className="text-xs" style={{ color: '#5a5f6b' }}>{r.label}</span>
              <span className="text-xs font-semibold" style={{ color: '#c8ccd2' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* PWA install info */}
      <Card>
        <CardHeader icon="Download" iconColor="#37ff8b" title="Install Response PWA" subtitle="Available on any device" />
        <div className="p-4 space-y-3">
          <p className="text-sm" style={{ color: '#a8adb7' }}>
            This app can be installed directly on your device. Once installed, it opens immediately without a browser — tap the share/menu icon in your browser to install.
          </p>
          <div className="space-y-2 text-xs" style={{ color: '#5a5f6b' }}>
            <div className="flex items-center gap-2"><Icon name="CheckCircle" size={12} style={{ color: '#37ff8b' }} /> Works offline (local demo)</div>
            <div className="flex items-center gap-2"><Icon name="CheckCircle" size={12} style={{ color: '#37ff8b' }} /> No app store required</div>
            <div className="flex items-center gap-2"><Icon name="CheckCircle" size={12} style={{ color: '#37ff8b' }} /> Opens Response PWA, not dashboard</div>
            <div className="flex items-center gap-2"><Icon name="Clock" size={12} style={{ color: '#fbbf24' }} /> Live backend sync — future run</div>
          </div>
        </div>
      </Card>

      {/* Ethical / safety notice */}
      <div className="p-4 rounded-2xl"
        style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Icon name="ShieldCheck" size={14} style={{ color: '#8f5cff' }} />
          <span className="text-xs font-bold" style={{ color: '#8f5cff' }}>Ethical Use Notice</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#a87dff' }}>
          AI guidance and response support are advisory only. All crisis, reputation, legal, public, or stakeholder actions must be reviewed by a responsible human before action.
        </p>
        <p className="text-[10px] mt-2" style={{ color: '#5a3f8f' }}>
          TrustSheild OS™ must not be used for harassment, fake reviews, impersonation, threats, defamation, misinformation, or unlawful activity.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — TrustSheild Response PWA
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SCREEN 9 — PWA Identity & Pairing (Run 5)
// ═══════════════════════════════════════════════════════════════
function IdentityScreen({ onTab }) {
  const { pwaIdentities, currentPwaId, pairByCode, setCurrentPwaId, seedIdentities } = useIdentityStore()

  // Seed identities on mount if needed
  useEffect(() => { seedIdentities(IDENTITY_SEED_DATA) }, [])

  const currentIdentity = pwaIdentities?.find(i => i.id === currentPwaId) || null
  const [codeInput,  setCodeInput]  = useState('')
  const [pairResult, setPairResult] = useState(null)  // null | { success, error?, identity? }
  const [pairing,    setPairing]    = useState(false)

  const handlePair = () => {
    if (!codeInput.trim()) return
    setPairing(true)
    setTimeout(() => {
      const result = pairByCode(codeInput)
      setPairResult(result)
      if (result.success) setCodeInput('')
      setPairing(false)
    }, 600)
  }

  const handleSelect = (id) => {
    setCurrentPwaId(id)
    setPairResult({ success: true, identity: pwaIdentities?.find(i => i.id === id) })
  }

  return (
    <div className="space-y-4">
      {/* Current identity */}
      {currentIdentity ? (
        <Card glow>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#37ff8b' }}>Active Identity</span>
              <DemoBadge />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ background: 'rgba(55,255,139,0.1)', border: '1px solid rgba(55,255,139,0.25)', color: '#37ff8b', fontSize: '0.9rem' }}>
                {currentIdentity.avatar}
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: '#f5f5f2' }}>{currentIdentity.displayName}</div>
                <div className="text-xs" style={{ color: '#5a5f6b' }}>{currentIdentity.roleType} · {currentIdentity.organisationName}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'PWA ID',        value: currentIdentity.id,           mono: true,  color: '#d6a84f' },
                { label: 'Pairing Code',  value: currentIdentity.pairingCode,  mono: true,  color: '#d6a84f' },
                { label: 'Sync Status',   value: currentIdentity.syncStatus,   mono: false, color: '#37ff8b' },
                { label: 'Backend',       value: currentIdentity.backendStatus, mono: false, color: '#5a5f6b' },
                { label: 'Role',          value: currentIdentity.roleType,     mono: false, color: '#c8ccd2' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
                  <span style={{ color: '#5a5f6b' }}>{r.label}</span>
                  <span className={r.mono ? 'font-mono font-bold' : 'font-medium'} style={{ color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
            {currentIdentity.dashboardInstruction && (
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#5a5f6b' }}>Dashboard Instruction</div>
                <p className="text-xs" style={{ color: '#a8adb7' }}>{currentIdentity.dashboardInstruction}</p>
              </div>
            )}
            <div className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.15)' }}>
              <Icon name="Info" size={11} style={{ color: '#8f5cff', flexShrink: 0 }} />
              <span className="text-[10px]" style={{ color: '#8f5cff' }}>Demo pairing — backend live sync is added in later runs.</span>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(214,168,79,0.06)', border: '1px solid rgba(214,168,79,0.1)' }}>
              <Icon name="UserCircle" size={24} style={{ color: 'rgba(214,168,79,0.3)' }} />
            </div>
            <div className="text-sm font-medium text-center" style={{ color: '#5a5f6b' }}>No identity loaded.</div>
            <div className="text-xs text-center" style={{ color: '#3a3f4b' }}>Enter a demo pairing code or select an identity below.</div>
          </div>
        </Card>
      )}

      {/* Pairing code entry */}
      <Card>
        <CardHeader icon="Key" iconColor="#d6a84f" title="Enter Pairing Code" subtitle="Demo/local — not secure live auth" />
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>Demo Pairing Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value.toUpperCase()); setPairResult(null) }}
                placeholder="TS-XXXX-XXXX"
                maxLength={12}
                className="flex-1 rounded-xl text-sm font-mono"
                style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.2)', padding: '12px 14px', color: '#d6a84f', outline: 'none', letterSpacing: '0.05em', fontFamily: 'monospace' }}
                onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.2)'}
                onKeyDown={e => e.key === 'Enter' && handlePair()}
              />
              <TapButton onClick={handlePair} variant="gold" disabled={!codeInput.trim() || pairing} loading={pairing}>
                <Icon name="Key" size={15} />
                Pair
              </TapButton>
            </div>
          </div>

          {pairResult && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg" style={pairResult.success ? { background: 'rgba(55,255,139,0.07)', border: '1px solid rgba(55,255,139,0.2)' } : { background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <Icon name={pairResult.success ? 'CheckCircle' : 'XCircle'} size={14} style={{ color: pairResult.success ? '#37ff8b' : '#f87171', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: pairResult.success ? '#37ff8b' : '#f87171' }}>
                {pairResult.success ? `Paired as ${pairResult.identity?.displayName} (${pairResult.identity?.id})` : pairResult.error}
              </span>
            </div>
          )}
          <p className="text-[10px]" style={{ color: '#5a5f6b' }}>
            Demo pairing code — backend live sync is added in later runs. This is local simulation only.
          </p>
        </div>
      </Card>

      {/* Demo identity selector */}
      <Card>
        <CardHeader icon="Users" iconColor="#8f5cff" title="Demo Identity Selector" subtitle="Demo identity selector — real secure pairing comes with backend live mode" />
        <div className="p-3 space-y-2">
          {pwaIdentities?.filter(i => i.status !== 'Archived').map(identity => {
            const isActive = identity.id === currentPwaId
            return (
              <button key={identity.id} onClick={() => handleSelect(identity.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{ background: isActive ? 'rgba(55,255,139,0.08)' : 'rgba(13,13,18,0.6)', border: `1px solid ${isActive ? 'rgba(55,255,139,0.3)' : 'rgba(214,168,79,0.08)'}` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{ background: isActive ? 'rgba(55,255,139,0.12)' : 'rgba(214,168,79,0.08)', color: isActive ? '#37ff8b' : '#d6a84f' }}>
                  {identity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: isActive ? '#f5f5f2' : '#a8adb7' }}>{identity.displayName}</div>
                  <div className="text-[10px]" style={{ color: '#5a5f6b' }}>{identity.roleType}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <code className="text-[9px] font-mono" style={{ color: '#5a5f6b' }}>{identity.id}</code>
                  {isActive && <Icon name="CheckCircle" size={14} style={{ color: '#37ff8b' }} />}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Security notice */}
      <div className="p-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="ShieldCheck" size={13} style={{ color: '#8f5cff' }} />
          <span className="text-xs font-semibold" style={{ color: '#8f5cff' }}>Security Notice</span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: '#a87dff' }}>
          Demo pairing codes are for local simulation only. Real secure user access, authentication, and multi-device sync require backend live mode.
        </p>
      </div>
    </div>
  )
}

export default function DriverApp() {
  const {
    activeTab, setActiveTab,
    profile, pwaCase, pwaTasks, pwaUpdates, pwaNotes, pwaEscalations, pwaDraftReviews,
    seedPwaDemo, updatePwaTask, addNote, addPwaUpdate, addEscalation, updateDraftReview, resetPwaToDemo,
  } = usePwaStore()

  const { seedTaskData } = useTaskStore()
  const { seedIdentities, currentPwaId, pwaIdentities } = useIdentityStore()
  const { mode: appMode } = useTrustStore()
  const isDemo = appMode !== 'live'
  const { backendConfig } = useConfigStore()
  const backendProvider = backendConfig ? Object.entries(backendConfig).find(([,v]) => v?.status === 'saved_locally')?.[0] : null

  // Seed demo data on first load
  useEffect(() => {
    seedPwaDemo(PWA_DEMO_DATA)
    seedTaskData(TASK_SEED_DATA)
    seedIdentities(IDENTITY_SEED_DATA)
  }, [])

  // Badge count for bottom nav
  // Badge count from both stores — configTasks are dashboard-assigned tasks for pwa-001 (demo)
  const { configTasks: _cfgT } = useTaskStore()
  const dashTasksPending = (_cfgT || []).filter(t => t.assignedPwaId === 'pwa-001' && ['New','Sent to PWA','In Progress','Needs Review'].includes(t.status)).length
  const legacyPending    = pwaTasks?.filter(t => ['New','In Progress','Needs Review'].includes(t.status)).length ?? 0
  const pendingTasks     = dashTasksPending + legacyPending

  // Screen renderer
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':     return <HomeScreen profile={profile} pwaCase={pwaCase} pwaTasks={pwaTasks} onTab={setActiveTab} isDemo={isDemo} />
      case 'case':     return <CrisisBriefScreen pwaCase={pwaCase} onTab={setActiveTab} isDemo={isDemo} />
      case 'tasks':    return <TasksScreen pwaTasks={pwaTasks} updateTask={updatePwaTask} onTab={setActiveTab} activePwaId={currentPwaId} isDemo={isDemo} />
      case 'update':   return <UpdateScreen addPwaUpdate={addPwaUpdate} pwaUpdates={pwaUpdates} pwaCase={pwaCase} />
      case 'evidence': return <EvidenceScreen pwaNotes={pwaNotes} addNote={addNote} pwaCase={pwaCase} />
      case 'drafts':   return <DraftsScreen pwaDraftReviews={pwaDraftReviews} updateDraftReview={updateDraftReview} />
      case 'escalate': return <EscalationScreen addEscalation={addEscalation} pwaEscalations={pwaEscalations} pwaCase={pwaCase} />
      case 'identity': return <IdentityScreen onTab={setActiveTab} />
      case 'sync':     return <SyncScreen profile={profile} isDemo={isDemo} backendProvider={backendProvider} />
      default:         return <HomeScreen profile={profile} pwaCase={pwaCase} pwaTasks={pwaTasks} onTab={setActiveTab} />
    }
  }

  return (
    <div
      className="min-h-[100dvh] w-screen overflow-x-hidden"
      style={{
        background: '#050505',
        backgroundImage: 'radial-gradient(ellipse at 20% 10%, rgba(214,168,79,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(143,92,255,0.04) 0%, transparent 50%)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 safe-top"
        style={{
          height: 56,
          background: 'rgba(5,5,5,0.97)',
          borderBottom: '1px solid rgba(214,168,79,0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden>
              <path d="M16 4 L26 8 L26 16 C26 22 21 27 16 29 C11 27 6 22 6 16 L6 8 Z"
                fill="rgba(214,168,79,0.08)" stroke="rgba(214,168,79,0.6)" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="16" cy="17" r="3" fill="#37ff8b"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold font-display" style={{ color: '#d6a84f' }}>TrustSheild OS™</span>
            <span className="text-[10px] ml-1.5 font-medium" style={{ color: '#5a5f6b' }}>Response PWA</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge small />
          <button
            onClick={() => { if (window.confirm('Reset PWA demo data?')) resetPwaToDemo(PWA_DEMO_DATA) }}
            className="p-1.5 rounded-lg"
            style={{ color: '#5a5f6b' }}
            title="Reset demo data"
          >
            <Icon name="RefreshCw" size={14} />
          </button>
        </div>
      </header>

      {/* ── Screen content ────────────────────────────────────── */}
      <main className="px-4 pt-5 pb-28 max-w-lg mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(214,168,79,0.5)' }}>
            {PWA_TABS.find(t => t.key === activeTab)?.label || 'Home'}
          </span>
        </div>

        {renderScreen()}
      </main>

      {/* ── Bottom navigation ─────────────────────────────────── */}
      <BottomNav active={activeTab} onTab={setActiveTab} taskBadge={pendingTasks} />
    </div>
  )
}
