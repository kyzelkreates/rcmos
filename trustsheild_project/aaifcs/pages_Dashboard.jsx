/**
 * ============================================================
 * TrustSheild OS™ — Command Dashboard
 * Run 2 — TrustSheild Command Dashboard Structure
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Sections:
 *   1. Trust Overview (KPI metrics)
 *   2. Active Reputation Risks
 *   3. Crisis Command Centre
 *   4. Live Update Feed
 *   5. PWA Responders / Connected Contacts
 *   6. Tasks Sent
 *   7. Evidence & Timeline
 *   8. Response Drafts
 *   9. Stakeholder Updates
 *  10. Backend Ready Status (placeholder)
 *  11. AI Agent Centre (placeholder)
 *
 * State: useTrustStore (trustsheild: namespace)
 * Demo data: data_trustsheild_demo.js
 * Legacy stores preserved but not used in this page.
 * ============================================================
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './components_ui_Icon'
import { useTrustStore } from './core_storage'
import DEMO_DATA from './data_trustsheild_demo'
import { formatDateTime, formatDate } from './utils_format'
import APP_CONFIG from './config_app'
import { ROUTES } from './config_routes'
import TaskConfigPanel from './modules_tasks_TaskConfigPanel'
import { useTaskStore } from './core_storage'
import { TASK_SEED_DATA } from './data_trustsheild_demo'

// ─── Colour helpers ───────────────────────────────────────────
const RISK_STYLES = {
  Critical: { pill: 'bg-red-500/15 text-red-400 border border-red-500/30', dot: '#f87171', label: 'Critical' },
  High:     { pill: 'bg-orange-500/15 text-orange-400 border border-orange-500/30', dot: '#fb923c', label: 'High' },
  Medium:   { pill: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', dot: '#fbbf24', label: 'Medium' },
  Low:      { pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', dot: '#34d399', label: 'Low' },
}
const STATUS_STYLES = {
  'Escalated':          'bg-red-500/15 text-red-400 border-red-500/25',
  'Action Needed':      'bg-orange-500/15 text-orange-400 border-orange-500/25',
  'Response Drafted':   'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Monitoring':         'bg-sky-500/15 text-sky-400 border-sky-500/25',
  'Resolved':           'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'In Progress':        'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Pending':            'bg-slate-700/60 text-slate-300 border-slate-600/40',
  'Completed':          'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Sent':               'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Draft':              'bg-slate-700/60 text-slate-300 border-slate-600/40',
  'Needs Review':       'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Approved':           'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Legal Review Needed':'bg-red-500/15 text-red-400 border-red-500/25',
  'Demo':               'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Synced':             'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Offline':            'bg-slate-700/60 text-slate-400 border-slate-600/40',
}

const FEED_COLORS = {
  green:  { bg: 'rgba(55,255,139,0.1)',  icon: '#37ff8b', border: 'rgba(55,255,139,0.2)'  },
  red:    { bg: 'rgba(248,113,113,0.1)', icon: '#f87171', border: 'rgba(248,113,113,0.2)' },
  gold:   { bg: 'rgba(214,168,79,0.1)',  icon: '#d6a84f', border: 'rgba(214,168,79,0.2)'  },
  purple: { bg: 'rgba(143,92,255,0.1)',  icon: '#8f5cff', border: 'rgba(143,92,255,0.2)'  },
  silver: { bg: 'rgba(200,204,210,0.08)',icon: '#c8ccd2', border: 'rgba(200,204,210,0.12)' },
}

// ─── Time ago helper ──────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

// ─── Shared Primitives ────────────────────────────────────────

function StatusPill({ status, className = '' }) {
  const s = STATUS_STYLES[status] || 'bg-slate-700/60 text-slate-400 border-slate-600/40'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${s} ${className}`}>
      {status}
    </span>
  )
}

function RiskBadge({ level }) {
  const s = RISK_STYLES[level] || RISK_STYLES.Low
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${s.pill}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot, boxShadow: `0 0 4px ${s.dot}` }} />
      {level}
    </span>
  )
}

function SectionCard({ title, icon, iconColor, subtitle, action, children, className = '' }) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(13,13,18,0.92)',
        border: '1px solid rgba(214,168,79,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(214,168,79,0.08)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(214,168,79,0.08)', border: '1px solid rgba(214,168,79,0.18)' }}
          >
            <Icon name={icon} size={13} style={{ color: iconColor || '#d6a84f' }} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight" style={{ color: '#f5f5f2' }}>{title}</div>
            {subtitle && <div className="text-2xs mt-0.5" style={{ color: '#5a5f6b' }}>{subtitle}</div>}
          </div>
        </div>
        {action && <div className="flex-shrink-0 ml-2">{action}</div>}
      </div>
      {/* Card Body */}
      <div className="p-4">{children}</div>
    </div>
  )
}

function EmptySlate({ icon, message }) {
  return (
    <div className="flex flex-col items-center py-8 gap-2">
      <Icon name={icon} size={28} style={{ color: 'rgba(214,168,79,0.15)' }} />
      <span className="text-xs" style={{ color: '#5a5f6b' }}>{message}</span>
    </div>
  )
}

function SmallBtn({ onClick, children, variant = 'ghost' }) {
  const styles = {
    ghost:  { color: '#a8adb7', background: 'transparent', border: '1px solid transparent' },
    gold:   { color: '#d6a84f', background: 'rgba(214,168,79,0.08)', border: '1px solid rgba(214,168,79,0.25)' },
    purple: { color: '#8f5cff', background: 'rgba(143,92,255,0.08)', border: '1px solid rgba(143,92,255,0.25)' },
  }
  const s = styles[variant] || styles.ghost
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={s}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {children}
    </button>
  )
}

function DemoBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: 'rgba(143,92,255,0.12)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' }}
    >
      <span className="w-1 h-1 rounded-full" style={{ background: '#8f5cff' }} />
      Demo
    </span>
  )
}

// ─── Live Clock ───────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="text-right">
      <div className="font-mono text-xl font-bold tabular-nums" style={{ color: '#d6a84f', textShadow: '0 0 16px rgba(214,168,79,0.35)' }}>
        {time.toLocaleTimeString('en-GB', { hour12: false })}
      </div>
      <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>
        {time.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
      </div>
    </div>
  )
}

// ─── Dashboard Tabs ───────────────────────────────────────────
const TABS = [
  { key: 'overview',    label: 'Trust Overview',    icon: 'ShieldCheck' },
  { key: 'risks',       label: 'Active Risks',       icon: 'AlertTriangle' },
  { key: 'command',     label: 'Crisis Command',     icon: 'Zap' },
  { key: 'feed',        label: 'Live Feed',          icon: 'Radio' },
  { key: 'responders',  label: 'Responders',         icon: 'Users' },
  { key: 'tasks',       label: 'Tasks (Legacy)',      icon: 'CheckSquare' },
  { key: 'taskconfig', label: 'PWA Task Config',    icon: 'Settings'    },
  { key: 'evidence',    label: 'Evidence',           icon: 'FolderOpen' },
  { key: 'drafts',      label: 'Drafts',             icon: 'FileEdit' },
  { key: 'updates',     label: 'Updates',            icon: 'Send' },
  { key: 'backend',     label: 'Backend',            icon: 'Database' },
  { key: 'ai',          label: 'AI Agents',          icon: 'Brain' },
]

function TabBar({ activeTab, onTab }) {
  return (
    <div
      className="flex gap-1 overflow-x-auto scrollbar-none p-1 rounded-xl"
      style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.1)' }}
    >
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onTab(t.key)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
          style={
            activeTab === t.key
              ? { background: 'rgba(214,168,79,0.12)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.3)' }
              : { color: '#5a5f6b', border: '1px solid transparent' }
          }
          onMouseEnter={e => { if (activeTab !== t.key) e.currentTarget.style.color = '#a8adb7' }}
          onMouseLeave={e => { if (activeTab !== t.key) e.currentTarget.style.color = '#5a5f6b' }}
        >
          <Icon name={t.icon} size={12} />
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — Trust Overview
// ═══════════════════════════════════════════════════════════════
function KpiCard({ label, value, sub, icon, dotColor, glowColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 transition-all cursor-pointer select-none"
      style={{
        background: 'rgba(13,13,18,0.9)',
        border: '1px solid rgba(214,168,79,0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(214,168,79,0.25)'
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.4), 0 0 16px ${glowColor || 'rgba(214,168,79,0.1)'}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(214,168,79,0.1)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#5a5f6b' }}>{label}</span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${dotColor}15`, border: `1px solid ${dotColor}30` }}
        >
          <Icon name={icon} size={13} style={{ color: dotColor }} />
        </div>
      </div>
      <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: dotColor || '#f5f5f2', textShadow: `0 0 12px ${glowColor || dotColor}` }}>
        {value ?? '—'}
      </div>
      {sub && <div className="text-[10px] mt-1.5" style={{ color: '#5a5f6b' }}>{sub}</div>}
    </div>
  )
}

function TrustOverviewSection({ cases, tasks, pwas, drafts, onTab }) {
  const active    = cases?.filter(c => c.status !== 'Resolved').length ?? 0
  const critical  = cases?.filter(c => c.riskLevel === 'Critical').length ?? 0
  const connected = pwas?.filter(p => p.syncStatus !== 'Offline').length ?? 0
  const pending   = tasks?.filter(t => t.status === 'Pending' || t.status === 'In Progress').length ?? 0
  const evidence  = 8  // demo count
  const reviewDrafts = drafts?.filter(d => d.status === 'Needs Review' || d.status === 'Legal Review Needed').length ?? 0
  const trustStatus  = critical > 0 ? 'CRITICAL' : active > 4 ? 'ELEVATED' : active > 0 ? 'MONITORING' : 'NOMINAL'
  const trustColor   = critical > 0 ? '#f87171' : active > 4 ? '#fb923c' : active > 0 ? '#fbbf24' : '#37ff8b'

  return (
    <div className="space-y-4">
      {/* Trust Status Banner */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{
          background: `${trustColor}08`,
          border: `1px solid ${trustColor}25`,
          boxShadow: `0 0 20px ${trustColor}10`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full" style={{ background: trustColor, boxShadow: `0 0 10px ${trustColor}` }} />
            {trustStatus !== 'NOMINAL' && (
              <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-40" style={{ background: trustColor }} />
            )}
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: trustColor }}>Trust Status: {trustStatus}</div>
            <div className="text-xs" style={{ color: '#5a5f6b' }}>
              {critical > 0 ? `${critical} critical case${critical > 1 ? 's' : ''} require immediate action` : 'All systems monitoring — no critical cases'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <LiveClock />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active Reputation Risks" value={active} sub={`${critical} critical`} icon="ShieldAlert" dotColor="#f87171" glowColor="rgba(248,113,113,0.2)" onClick={() => onTab('risks')} />
        <KpiCard label="Open Crisis Cases"        value={cases?.length ?? 0} sub="across all clients" icon="FolderOpen" dotColor="#d6a84f" glowColor="rgba(214,168,79,0.2)" onClick={() => onTab('risks')} />
        <KpiCard label="Connected PWAs"           value={connected} sub={`of ${pwas?.length ?? 0} total`} icon="Smartphone" dotColor="#37ff8b" glowColor="rgba(55,255,139,0.2)" onClick={() => onTab('responders')} />
        <KpiCard label="Pending Response Tasks"   value={pending} sub="awaiting completion" icon="CheckSquare" dotColor="#8f5cff" glowColor="rgba(143,92,255,0.2)" onClick={() => onTab('tasks')} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Evidence Items"         value={evidence} sub="logged this session" icon="FileText" dotColor="#c8ccd2" glowColor="rgba(200,204,210,0.15)" onClick={() => onTab('evidence')} />
        <KpiCard label="Drafts Awaiting Review" value={reviewDrafts} sub="need human sign-off" icon="FileEdit" dotColor="#fb923c" glowColor="rgba(251,146,60,0.2)" onClick={() => onTab('drafts')} />
        <KpiCard label="Current Trust Status"   value={trustStatus} sub="AI advisory only" icon="Activity" dotColor={trustColor} glowColor={`${trustColor}30`} onClick={() => onTab('command')} />
        <KpiCard label="Last Updated"           value="Now" sub="demo data" icon="Clock" dotColor="#5a5f6b" glowColor="rgba(90,95,107,0.1)" />
      </div>

      {/* AI Advisory */}
      <div
        className="flex items-start gap-3 p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.18)' }}
      >
        <Icon name="Info" size={14} style={{ color: '#8f5cff', marginTop: 1, flexShrink: 0 }} />
        <p className="text-xs" style={{ color: '#a8adb7' }}>{APP_CONFIG.aiAdvisory}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — Active Reputation Risks
// ═══════════════════════════════════════════════════════════════
function CaseRow({ c, onClick }) {
  return (
    <div
      onClick={() => onClick(c)}
      className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
      style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,168,79,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <RiskBadge level={c.riskLevel} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-tight truncate" style={{ color: '#f5f5f2' }}>{c.title}</div>
          <div className="text-xs mt-0.5 truncate" style={{ color: '#5a5f6b' }}>
            {c.client} · {c.source} · {c.channel}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <StatusPill status={c.status} />
        <span className="text-[10px] font-mono" style={{ color: '#5a5f6b' }}>{timeAgo(c.updatedAt)}</span>
        <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{c.assignedResponder}</span>
      </div>
    </div>
  )
}

function CaseDetail({ c, onClose }) {
  if (!c) return null
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(20,16,30,0.95)', border: '1px solid rgba(143,92,255,0.25)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold" style={{ color: '#f5f5f2' }}>{c.title}</div>
          <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{c.client}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded" style={{ color: '#5a5f6b' }}>
          <Icon name="X" size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <RiskBadge level={c.riskLevel} />
        <StatusPill status={c.status} />
        <DemoBadge />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#a8adb7' }}>{c.summary}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><span style={{ color: '#5a5f6b' }}>Source: </span><span style={{ color: '#c8ccd2' }}>{c.source}</span></div>
        <div><span style={{ color: '#5a5f6b' }}>Channel: </span><span style={{ color: '#c8ccd2' }}>{c.channel}</span></div>
        <div><span style={{ color: '#5a5f6b' }}>Responder: </span><span style={{ color: '#c8ccd2' }}>{c.assignedResponder}</span></div>
        <div><span style={{ color: '#5a5f6b' }}>Updated: </span><span style={{ color: '#c8ccd2' }}>{timeAgo(c.updatedAt)}</span></div>
      </div>
      {c.tags?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {c.tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(214,168,79,0.08)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.18)' }}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ActiveRisksSection({ cases }) {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? cases : cases?.filter(c => c.riskLevel === filter)

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'Critical', 'High', 'Medium', 'Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={
              filter === f
                ? { background: 'rgba(214,168,79,0.15)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.35)' }
                : { background: 'transparent', color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)' }
            }
          >
            {f === 'all' ? `All (${cases?.length ?? 0})` : f}
          </button>
        ))}
      </div>

      {/* Case list */}
      <div
        className="rounded-xl overflow-hidden divide-y"
        style={{ border: '1px solid rgba(214,168,79,0.1)', divideColor: 'rgba(214,168,79,0.06)' }}
      >
        {filtered?.length > 0
          ? filtered.map(c => <CaseRow key={c.id} c={c} onClick={setSelected} />)
          : <EmptySlate icon="ShieldCheck" message="No cases match this filter." />
        }
      </div>

      {/* Detail panel */}
      {selected && <CaseDetail c={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — Crisis Command Centre
// ═══════════════════════════════════════════════════════════════
function CrisisCommandSection({ cases, tasks, pwas, updates }) {
  const priority = cases?.find(c => c.riskLevel === 'Critical') || cases?.[0]
  const activeTeam = pwas?.filter(p => p.syncStatus !== 'Offline') || []
  const pendingTasks = tasks?.filter(t => t.status === 'Pending' || t.status === 'In Progress') || []
  const pendingUpdates = updates?.filter(u => u.pending) || []

  const NEXT_ACTIONS = [
    { id: 1, text: 'Review and approve draft response for Vantage Fintech holding statement', priority: 'Critical', icon: 'FileEdit' },
    { id: 2, text: 'Confirm Elara Health correction approved — coordinate send with Dr. Priya N.', priority: 'High', icon: 'CheckCircle' },
    { id: 3, text: 'Upload evidence screenshots from Meridian Cafe review monitoring', priority: 'Medium', icon: 'Upload' },
    { id: 4, text: 'Send pending stakeholder update to Oakhaven Hotels PR team', priority: 'Medium', icon: 'Send' },
    { id: 5, text: 'Check in with NordVista Capital responder — regulatory update required', priority: 'High', icon: 'Phone' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Priority Incident */}
      <SectionCard title="Priority Incident" icon="Zap" iconColor="#f87171" subtitle="Highest risk case active">
        {priority ? (
          <div className="space-y-3">
            <div>
              <div className="text-sm font-bold" style={{ color: '#f5f5f2' }}>{priority.title}</div>
              <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{priority.client}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <RiskBadge level={priority.riskLevel} />
              <StatusPill status={priority.status} />
              <DemoBadge />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#a8adb7' }}>{priority.summary}</p>
            <div className="text-xs" style={{ color: '#5a5f6b' }}>
              Last updated: {timeAgo(priority.updatedAt)} · Responder: {priority.assignedResponder}
            </div>
          </div>
        ) : (
          <EmptySlate icon="ShieldCheck" message="No active priority incident." />
        )}
      </SectionCard>

      {/* Next Recommended Actions */}
      <SectionCard title="Recommended Actions" icon="ListChecks" iconColor="#d6a84f" subtitle="AI advisory — human review required">
        <div className="space-y-2">
          {NEXT_ACTIONS.map(a => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-2.5 rounded-lg"
              style={{ background: 'rgba(13,13,20,0.6)', border: '1px solid rgba(214,168,79,0.07)' }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: a.priority === 'Critical' ? 'rgba(248,113,113,0.1)' : a.priority === 'High' ? 'rgba(251,146,60,0.1)' : 'rgba(214,168,79,0.08)',
                  border: `1px solid ${a.priority === 'Critical' ? 'rgba(248,113,113,0.25)' : a.priority === 'High' ? 'rgba(251,146,60,0.2)' : 'rgba(214,168,79,0.15)'}`,
                }}
              >
                <Icon name={a.icon} size={11}
                  style={{ color: a.priority === 'Critical' ? '#f87171' : a.priority === 'High' ? '#fb923c' : '#d6a84f' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs leading-snug" style={{ color: '#c8ccd2' }}>{a.text}</div>
                <div className="text-[10px] mt-0.5">
                  <RiskBadge level={a.priority} />
                </div>
              </div>
            </div>
          ))}
          <div
            className="flex items-center gap-2 p-2 rounded-lg mt-1"
            style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}
          >
            <Icon name="Info" size={11} style={{ color: '#8f5cff', flexShrink: 0 }} />
            <span className="text-[10px]" style={{ color: '#8f5cff' }}>AI advisory — all actions require human review before execution</span>
          </div>
        </div>
      </SectionCard>

      {/* Assigned Team */}
      <SectionCard title="Active Response Team" icon="Users" iconColor="#37ff8b" subtitle="Connected PWA users">
        <div className="space-y-2">
          {activeTeam.length > 0 ? activeTeam.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg"
              style={{ background: 'rgba(13,13,20,0.5)', border: '1px solid rgba(55,255,139,0.07)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.2)', color: '#37ff8b' }}>
                {p.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{p.displayName}</div>
                <div className="text-[10px]" style={{ color: '#5a5f6b' }}>{p.role} · {timeAgo(p.lastCheckIn)}</div>
              </div>
              <StatusPill status={p.syncStatus} />
            </div>
          )) : <EmptySlate icon="Users" message="No active responders." />}
        </div>
      </SectionCard>

      {/* Status Matrix */}
      <SectionCard title="Response Status Matrix" icon="Activity" iconColor="#8f5cff" subtitle="Current operation overview">
        <div className="space-y-2">
          {[
            { label: 'Response Status',     value: 'Active',     color: '#37ff8b' },
            { label: 'Escalation Status',   value: '1 Escalated',color: '#f87171' },
            { label: 'Stakeholder Updates', value: `${pendingUpdates.length} Pending`, color: '#fbbf24' },
            { label: 'AI Advisory Status',  value: 'Demo — No AI Connected', color: '#8f5cff' },
            { label: 'Pending Tasks',       value: `${pendingTasks.length} Open`, color: '#d6a84f' },
            { label: 'PWA Sync Mode',       value: 'Demo Mode', color: '#8f5cff' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2"
              style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
              <span className="text-xs" style={{ color: '#5a5f6b' }}>{r.label}</span>
              <span className="text-xs font-semibold" style={{ color: r.color }}>{r.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4 — Live Update Feed
// ═══════════════════════════════════════════════════════════════
function LiveFeedSection({ feedItems }) {
  const sorted = [...(feedItems || [])].sort((a, b) => new Date(b.ts) - new Date(a.ts))

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#37ff8b', boxShadow: '0 0 6px rgba(55,255,139,0.8)' }} />
        <span className="text-xs font-semibold" style={{ color: '#37ff8b' }}>Live Feed</span>
        <DemoBadge />
        <span className="text-[10px] ml-auto" style={{ color: '#5a5f6b' }}>{sorted.length} items</span>
      </div>
      {sorted.length > 0 ? sorted.map(item => {
        const fc = FEED_COLORS[item.color] || FEED_COLORS.silver
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all"
            style={{ background: fc.bg, border: `1px solid ${fc.border}` }}
          >
            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(5,5,5,0.6)', border: `1px solid ${fc.border}` }}>
              <Icon name={item.icon} size={12} style={{ color: fc.icon }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium" style={{ color: '#f5f5f2' }}>{item.text}</div>
              {item.sub && <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>{item.sub}</div>}
            </div>
            <span className="text-[10px] font-mono flex-shrink-0 mt-0.5" style={{ color: '#5a5f6b' }}>
              {timeAgo(item.ts)}
            </span>
          </div>
        )
      }) : <EmptySlate icon="Radio" message="No feed items yet." />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5 — PWA Responders
// ═══════════════════════════════════════════════════════════════
function RespondersSection({ pwas, cases }) {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}
      >
        <Icon name="Info" size={13} style={{ color: '#8f5cff', flexShrink: 0 }} />
        <span className="text-xs" style={{ color: '#8f5cff' }}>
          Unique PWA ID system (Run 5) · Pairing code system (Run 5) · Individual PWA configuration (Run 6)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {pwas?.map(p => {
          const assignedCases = cases?.filter(c => p.assignedCases?.includes(c.id)) || []
          return (
            <div
              key={p.id}
              className="rounded-xl p-4 space-y-3 transition-all"
              style={{
                background: 'rgba(13,13,18,0.9)',
                border: p.syncStatus === 'Offline' ? '1px solid rgba(90,95,107,0.2)' : '1px solid rgba(55,255,139,0.1)',
                opacity: p.syncStatus === 'Offline' ? 0.7 : 1,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = p.syncStatus === 'Offline' ? 'rgba(90,95,107,0.4)' : 'rgba(55,255,139,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = p.syncStatus === 'Offline' ? 'rgba(90,95,107,0.2)' : 'rgba(55,255,139,0.1)'}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.2)', color: '#37ff8b' }}>
                  {p.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{p.displayName}</div>
                  <div className="text-xs" style={{ color: '#5a5f6b' }}>{p.role}</div>
                </div>
                <StatusPill status={p.syncStatus} />
              </div>

              {/* Meta */}
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: '#5a5f6b' }}>Organisation</span>
                  <span className="truncate max-w-[140px] text-right" style={{ color: '#a8adb7' }}>{p.organisation}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5a5f6b' }}>PWA ID</span>
                  <span style={{ color: '#8f5cff' }}>{p.pwaIdPlaceholder}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5a5f6b' }}>Last Check-in</span>
                  <span style={{ color: '#a8adb7' }}>{timeAgo(p.lastCheckIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5a5f6b' }}>Pending Tasks</span>
                  <span style={{ color: p.pendingTasks > 0 ? '#fbbf24' : '#5a5f6b' }}>{p.pendingTasks}</span>
                </div>
              </div>

              {/* Assigned cases */}
              {assignedCases.length > 0 && (
                <div>
                  <div className="text-[10px] mb-1.5 uppercase tracking-wider font-semibold" style={{ color: '#5a5f6b' }}>Assigned Cases</div>
                  <div className="space-y-1">
                    {assignedCases.slice(0, 2).map(c => (
                      <div key={c.id} className="flex items-center gap-1.5 text-[10px]">
                        <RiskBadge level={c.riskLevel} />
                        <span className="truncate" style={{ color: '#a8adb7' }}>{c.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Config status */}
              <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid rgba(214,168,79,0.08)' }}>
                <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Config: {p.configStatus}</span>
                <DemoBadge />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6 — Tasks Sent
// ═══════════════════════════════════════════════════════════════
function TasksSection({ tasks, cases }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? tasks : tasks?.filter(t => t.status === filter)

  const TASK_COLORS = {
    'Completed':   '#37ff8b',
    'In Progress': '#fbbf24',
    'Pending':     '#5a5f6b',
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {['all', 'Pending', 'In Progress', 'Completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={
              filter === f
                ? { background: 'rgba(214,168,79,0.15)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.35)' }
                : { background: 'transparent', color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)' }
            }
          >
            {f === 'all' ? `All (${tasks?.length ?? 0})` : f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered?.length > 0 ? filtered.map(t => {
          const linked = cases?.find(c => c.id === t.linkedCaseId)
          const col = TASK_COLORS[t.status] || '#5a5f6b'
          return (
            <div key={t.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.08)' }}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: col, boxShadow: `0 0 6px ${col}` }} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{t.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>
                    {t.type} · {t.assignedTo}
                    {linked && <> · <span style={{ color: '#d6a84f' }}>{linked.client}</span></>}
                  </div>
                  {t.notes && <div className="text-[10px] mt-1 italic" style={{ color: '#5a5f6b' }}>{t.notes}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <StatusPill status={t.status} />
                <RiskBadge level={t.priority} />
                <span className="text-[10px] font-mono" style={{ color: '#5a5f6b' }}>{timeAgo(t.sentAt)}</span>
                <DemoBadge />
              </div>
            </div>
          )
        }) : <EmptySlate icon="CheckSquare" message="No tasks match this filter." />}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7 — Evidence & Timeline
// ═══════════════════════════════════════════════════════════════
const EVIDENCE_ICONS = {
  Screenshot:      'Camera',
  Note:            'StickyNote',
  Link:            'Link',
  'Customer Message': 'MessageCircle',
  'Internal Note': 'Lock',
  'Public Post':   'Globe',
  Review:          'Star',
  'Media Mention': 'Newspaper',
  Escalation:      'AlertTriangle',
  Evidence:        'FileText',
}

function EvidenceSection({ timeline, cases }) {
  const sorted = [...(timeline || [])].sort((a, b) => new Date(b.ts) - new Date(a.ts))

  return (
    <div className="space-y-2">
      <div className="relative border-l-2 pl-5 space-y-4 ml-3" style={{ borderColor: 'rgba(214,168,79,0.2)' }}>
        {sorted.length > 0 ? sorted.map(evt => {
          const linked = cases?.find(c => c.id === evt.linkedCaseId)
          const iconName = EVIDENCE_ICONS[evt.evidenceType] || EVIDENCE_ICONS[evt.type] || 'FileText'
          const isEscalation = evt.type === 'Escalation'
          return (
            <div key={evt.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2"
                style={{
                  background: isEscalation ? '#f87171' : '#d6a84f',
                  borderColor: '#050505',
                  boxShadow: isEscalation ? '0 0 8px rgba(248,113,113,0.6)' : '0 0 8px rgba(214,168,79,0.4)',
                }}
              />
              <div
                className="rounded-xl p-3 transition-all"
                style={{ background: 'rgba(13,13,18,0.8)', border: `1px solid ${isEscalation ? 'rgba(248,113,113,0.15)' : 'rgba(214,168,79,0.1)'}` }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isEscalation ? 'rgba(248,113,113,0.1)' : 'rgba(214,168,79,0.08)', border: `1px solid ${isEscalation ? 'rgba(248,113,113,0.2)' : 'rgba(214,168,79,0.18)'}` }}>
                    <Icon name={iconName} size={12} style={{ color: isEscalation ? '#f87171' : '#d6a84f' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{evt.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(200,204,210,0.08)', color: '#c8ccd2', border: '1px solid rgba(200,204,210,0.15)' }}>
                        {evt.evidenceType}
                      </span>
                      <DemoBadge />
                    </div>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#a8adb7' }}>{evt.content}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[10px]">
                      <span style={{ color: '#5a5f6b' }}>By: <span style={{ color: '#a8adb7' }}>{evt.submittedBy}</span></span>
                      <span style={{ color: '#5a5f6b' }}>Via: <span style={{ color: '#a8adb7' }}>{evt.source}</span></span>
                      {linked && <span style={{ color: '#5a5f6b' }}>Case: <span style={{ color: '#d6a84f' }}>{linked.client}</span></span>}
                      <span className="font-mono" style={{ color: '#5a5f6b' }}>{timeAgo(evt.ts)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }) : <EmptySlate icon="FolderOpen" message="No evidence or timeline entries yet." />}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 8 — Response Drafts
// ═══════════════════════════════════════════════════════════════
function DraftsSection({ drafts, cases }) {
  const TONE_COLORS = {
    'Holding Statement':    '#fbbf24',
    'Corrective':          '#37ff8b',
    'Apologetic':          '#8f5cff',
    'Formal':              '#c8ccd2',
    'Calm':                '#37ff8b',
    'Legal Review Needed': '#f87171',
  }

  return (
    <div className="space-y-3">
      {/* AI advisory banner */}
      <div
        className="flex items-start gap-3 p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.22)' }}
      >
        <Icon name="ShieldAlert" size={14} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs font-medium" style={{ color: '#8f5cff' }}>{APP_CONFIG.aiAdvisory}</p>
      </div>

      <div className="space-y-3">
        {drafts?.length > 0 ? drafts.map(d => {
          const linked = cases?.find(c => c.id === d.linkedCaseId)
          const toneColor = TONE_COLORS[d.tone] || '#d6a84f'
          return (
            <div key={d.id}
              className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(13,13,18,0.9)', border: '1px solid rgba(214,168,79,0.1)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{d.title}</div>
                  {linked && <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{linked.client}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <StatusPill status={d.status} />
                  <DemoBadge />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 rounded" style={{ background: `${toneColor}12`, color: toneColor, border: `1px solid ${toneColor}25` }}>
                  {d.tone}
                </span>
                <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(200,204,210,0.07)', color: '#c8ccd2', border: '1px solid rgba(200,204,210,0.15)' }}>
                  {d.intendedChannel}
                </span>
              </div>

              <div
                className="p-3 rounded-lg font-mono text-xs leading-relaxed"
                style={{ background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(214,168,79,0.08)', color: '#a8adb7' }}
              >
                {d.content}
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: '#5a5f6b' }}>Owner: <span style={{ color: '#a8adb7' }}>{d.owner}</span></span>
                <span style={{ color: '#5a5f6b' }}>Updated: {timeAgo(d.updatedAt)}</span>
              </div>

              {d.aiAdvisory && (
                <div className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
                  <Icon name="Info" size={11} style={{ color: '#8f5cff', flexShrink: 0 }} />
                  <span className="text-[10px]" style={{ color: '#8f5cff' }}>Human review required before sending</span>
                </div>
              )}
            </div>
          )
        }) : <EmptySlate icon="FileEdit" message="No response drafts yet." />}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 9 — Stakeholder Updates
// ═══════════════════════════════════════════════════════════════
function UpdatesSection({ updates, cases }) {
  return (
    <div className="space-y-2">
      {updates?.length > 0 ? updates.map(u => {
        const linked = cases?.find(c => c.id === u.linkedCaseId)
        return (
          <div key={u.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.08)' }}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: u.pending ? 'rgba(251,191,36,0.08)' : 'rgba(55,255,139,0.08)', border: `1px solid ${u.pending ? 'rgba(251,191,36,0.2)' : 'rgba(55,255,139,0.15)'}` }}>
                <Icon name={u.pending ? 'Clock' : 'CheckCircle'} size={14} style={{ color: u.pending ? '#fbbf24' : '#37ff8b' }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{u.title}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>
                  Audience: {u.audience}
                  {linked && <> · <span style={{ color: '#d6a84f' }}>{linked.client}</span></>}
                </div>
                {u.notes && <div className="text-[10px] mt-0.5 italic" style={{ color: '#5a5f6b' }}>{u.notes}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <StatusPill status={u.status} />
              {u.lastSent
                ? <span className="text-[10px] font-mono" style={{ color: '#5a5f6b' }}>Sent {timeAgo(u.lastSent)}</span>
                : <span className="text-[10px]" style={{ color: '#fbbf24' }}>Not sent yet</span>
              }
              <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{u.owner}</span>
              <DemoBadge />
            </div>
          </div>
        )
      }) : <EmptySlate icon="Send" message="No stakeholder updates yet." />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 10 — Backend Ready Status
// ═══════════════════════════════════════════════════════════════
function BackendStatusSection() {
  const PROVIDERS = [
    { name: 'Supabase', icon: 'Database', status: 'Future Run', color: '#37ff8b' },
    { name: 'Firebase', icon: 'Flame', status: 'Future Run', color: '#fb923c' },
    { name: 'AWS / Custom Endpoint', icon: 'Cloud', status: 'Future Run', color: '#38bdf8' },
    { name: 'Generic REST API', icon: 'Globe', status: 'Future Run', color: '#c8ccd2' },
    { name: 'Local-only Fallback', icon: 'HardDrive', status: 'Available Now', color: '#37ff8b' },
  ]

  return (
    <div className="space-y-4">
      {/* Mode banner */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(143,92,255,0.12)', border: '1px solid rgba(143,92,255,0.25)' }}>
            <Icon name="Database" size={18} style={{ color: '#8f5cff' }} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: '#8f5cff' }}>Demo Mode Active</div>
            <div className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>All data is local and simulated — no backend connected</div>
          </div>
        </div>
        <DemoBadge />
      </div>

      {/* Provider list */}
      <div>
        <div className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'rgba(214,168,79,0.5)' }}>
          Supported Backend Providers
        </div>
        <div className="space-y-2">
          {PROVIDERS.map(p => (
            <div key={p.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.08)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
                <Icon name={p.icon} size={14} style={{ color: p.color }} />
              </div>
              <span className="text-sm flex-1" style={{ color: '#c8ccd2' }}>{p.name}</span>
              <span className="text-xs px-2 py-0.5 rounded"
                style={{ background: p.status === 'Available Now' ? 'rgba(55,255,139,0.1)' : 'rgba(90,95,107,0.15)', color: p.status === 'Available Now' ? '#37ff8b' : '#5a5f6b', border: `1px solid ${p.status === 'Available Now' ? 'rgba(55,255,139,0.2)' : 'rgba(90,95,107,0.2)'}` }}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="p-3 rounded-xl text-xs"
        style={{ background: 'rgba(214,168,79,0.05)', border: '1px solid rgba(214,168,79,0.15)', color: '#a8adb7' }}
      >
        <strong style={{ color: '#d6a84f' }}>Note:</strong> Live Mode and backend configuration will be implemented in a later run. When Live Mode is enabled, this panel will open a secure backend configuration interface with connection testing and credential management.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 11 — AI Agent Centre (Placeholder)
// ═══════════════════════════════════════════════════════════════
function AIAgentSection() {
  const agents = Object.entries(APP_CONFIG.aiAgents).map(([key, name]) => ({
    key,
    name,
    icon: key === 'trustTriage' ? 'ShieldCheck' : key === 'reputationRisk' ? 'AlertOctagon' : key === 'crisisResponse' ? 'Zap' : key === 'responseDrafting' ? 'FileEdit' : key === 'evidenceTimeline' ? 'Clock' : key === 'stakeholderUpdate' ? 'Send' : 'TrendingUp',
    status: 'Demo Advisory Placeholder',
    description: key === 'trustTriage' ? 'Rapid initial assessment of incoming reputation events.' : key === 'reputationRisk' ? 'Continuous risk scoring across channels and cases.' : key === 'crisisResponse' ? 'Coordinated response workflow guidance.' : key === 'responseDrafting' ? 'Human-reviewed draft communication support.' : key === 'evidenceTimeline' ? 'Structured evidence and timeline organisation.' : key === 'stakeholderUpdate' ? 'Stakeholder communication coordination.' : 'Structured trust recovery action planning.',
  }))

  return (
    <div className="space-y-4">
      {/* Advisory banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.2)' }}
      >
        <Icon name="Brain" size={16} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <div>
          <div className="text-sm font-semibold" style={{ color: '#8f5cff' }}>AI Agent Centre — Coming in Future Runs</div>
          <p className="text-xs mt-1" style={{ color: '#a8adb7' }}>
            No external AI is connected yet. No API keys have been added. All agent cards below are advisory placeholders only.
            Full AI agent implementation will support configurable providers (OpenAI, Anthropic, Groq, local models).
          </p>
          <p className="text-xs mt-2 font-semibold" style={{ color: '#8f5cff' }}>{APP_CONFIG.aiAdvisory}</p>
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {agents.map(a => (
          <div key={a.key}
            className="rounded-xl p-4 space-y-2"
            style={{ background: 'rgba(13,13,18,0.9)', border: '1px solid rgba(143,92,255,0.12)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(143,92,255,0.1)', border: '1px solid rgba(143,92,255,0.25)' }}>
                <Icon name={a.icon} size={16} style={{ color: '#8f5cff' }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold" style={{ color: '#c8ccd2' }}>{a.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>Powered by 4P3X Intelligent AI™</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#5a5f6b' }}>{a.description}</p>
            <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid rgba(143,92,255,0.1)' }}>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(143,92,255,0.1)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.2)' }}>
                {a.status}
              </span>
              <span className="text-[10px]" style={{ color: '#5a5f6b' }}>No AI connected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — TrustSheild Command Dashboard
// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate   = useNavigate()
  const { activeTab, setActiveTab, cases, tasks, pwas, timeline, drafts, updates, feedItems, seedDemoData, resetToDemo } = useTrustStore()
  const { seedTaskData, resetTaskData } = useTaskStore()

  // Seed demo data on first load
  useEffect(() => {
    seedDemoData(DEMO_DATA)
    seedTaskData(TASK_SEED_DATA)
  }, [])

  const data = { cases, tasks, pwas, timeline, drafts, updates, feedItems }
  const handleReset = useCallback(() => { if (window.confirm('Reset all demo data?')) resetToDemo(DEMO_DATA) }, [resetToDemo])

  return (
    <div className="min-h-full p-4 sm:p-5 space-y-5" style={{ background: 'transparent' }}>

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold font-display" style={{ color: '#d6a84f', textShadow: '0 0 16px rgba(214,168,79,0.3)' }}>
              TrustSheild Command Dashboard
            </h1>
            <div className="ts-demo-banner">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8f5cff', boxShadow: '0 0 6px rgba(143,92,255,0.8)' }} />
              Demo Mode
            </div>
          </div>
          <p className="text-xs" style={{ color: '#5a5f6b' }}>
            {APP_CONFIG.tagline} · {APP_CONFIG.globalBrand}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.color = '#d6a84f'}
            onMouseLeave={e => e.currentTarget.style.color = '#5a5f6b'}
            title="Reset demo data"
          >
            <Icon name="RefreshCw" size={11} />
            Reset Demo
          </button>
          <button
            onClick={() => navigate(ROUTES.DISPATCH)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ color: '#d6a84f', border: '1px solid rgba(214,168,79,0.3)', background: 'rgba(214,168,79,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(214,168,79,0.15)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(214,168,79,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(214,168,79,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <Icon name="Send" size={11} />
            Send Crisis Update
          </button>
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────── */}
      <TabBar activeTab={activeTab} onTab={setActiveTab} />

      {/* ── Section Content ────────────────────────────────── */}
      {activeTab === 'overview' && (
        <SectionCard title="Trust Overview" icon="ShieldCheck" iconColor="#d6a84f" subtitle="Live reputation & crisis status">
          <TrustOverviewSection cases={cases} tasks={tasks} pwas={pwas} drafts={drafts} onTab={setActiveTab} />
        </SectionCard>
      )}

      {activeTab === 'risks' && (
        <SectionCard title="Active Reputation Risks" icon="AlertTriangle" iconColor="#f87171" subtitle="Click a case to expand details">
          <ActiveRisksSection cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'command' && (
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Icon name="Zap" size={14} style={{ color: '#d6a84f' }} />
            <span className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>Crisis Command Centre</span>
          </div>
          <CrisisCommandSection cases={cases} tasks={tasks} pwas={pwas} updates={updates} />
        </div>
      )}

      {activeTab === 'feed' && (
        <SectionCard title="Live Update Feed" icon="Radio" iconColor="#37ff8b" subtitle="Real-time actions from PWAs and dashboard">
          <LiveFeedSection feedItems={feedItems} />
        </SectionCard>
      )}

      {activeTab === 'responders' && (
        <SectionCard title="PWA Responders & Connected Contacts" icon="Users" iconColor="#37ff8b" subtitle="Connected response PWAs — Unique PWA ID system arriving in Run 5">
          <RespondersSection pwas={pwas} cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'tasks' && (
        <SectionCard title="Tasks Sent to PWAs" icon="CheckSquare" iconColor="#8f5cff" subtitle="Response tasks sent and tracked from the dashboard">
          <TasksSection tasks={tasks} cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'taskconfig' && (
        <SectionCard title="PWA Task Configuration" icon="Settings" iconColor="#d6a84f"
          subtitle="Create, assign, and track response tasks for PWA users — demo/local mode">
          <TaskConfigPanel cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'evidence' && (
        <SectionCard title="Evidence & Crisis Timeline" icon="FolderOpen" iconColor="#d6a84f" subtitle="Chronological evidence log and crisis events">
          <EvidenceSection timeline={timeline} cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'drafts' && (
        <SectionCard title="Response Drafts" icon="FileEdit" iconColor="#fb923c" subtitle="Human-reviewed response drafts — AI advisory only">
          <DraftsSection drafts={drafts} cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'updates' && (
        <SectionCard title="Stakeholder Updates" icon="Send" iconColor="#c8ccd2" subtitle="Updates to clients, teams, legal, PR, and leadership">
          <UpdatesSection updates={updates} cases={cases} />
        </SectionCard>
      )}

      {activeTab === 'backend' && (
        <SectionCard title="Backend Ready Status" icon="Database" iconColor="#8f5cff" subtitle="Demo Mode active — Live Mode and backend configuration coming in a later run">
          <BackendStatusSection />
        </SectionCard>
      )}

      {activeTab === 'ai' && (
        <SectionCard title="AI Agent Centre" icon="Brain" iconColor="#8f5cff" subtitle="Advisory placeholders — full AI integration in future runs">
          <AIAgentSection />
        </SectionCard>
      )}

      {/* ── Global footer branding ──────────────────────────── */}
      <div className="pt-4 pb-2 text-center" style={{ borderTop: '1px solid rgba(214,168,79,0.06)' }}>
        <span className="text-[10px]" style={{ color: 'rgba(214,168,79,0.25)', letterSpacing: '0.05em' }}>
          {APP_CONFIG.globalBrand}
        </span>
      </div>
    </div>
  )
}
