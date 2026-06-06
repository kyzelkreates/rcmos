/**
 * ============================================================
 * TrustSheild OS™ — Sync Control Centre (Run 9)
 * Dashboard Sync Control Panel
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Shows: current sync mode, backend provider, connection status,
 * last sync time, pending queue count, sync event log, and
 * action buttons for running sync checks and managing queue.
 *
 * ⚠  No fake "connected" states. If backend is not configured,
 *    all live sync is disabled — local/demo only.
 * ============================================================
 */

import { useState, useCallback } from 'react'
import Icon from './components_ui_Icon'
import { useSyncStore, useConfigStore, useTrustStore, usePwaStore, useTaskStore, useIdentityStore } from './core_storage'
import {
  getSyncMode, SYNC_STATUS_LABELS, FRESHNESS_LABELS, timeAgo,
  localDemoAdapter, runSyncCheck,
} from './services_trustsheild_sync'
import APP_CONFIG from './config_app'

// ─── Shared mini-primitives ───────────────────────────────────
function Card({ children, glow = false, style }) {
  return (
    <div style={{
      background: 'rgba(13,13,18,0.95)',
      border: `1px solid ${glow ? 'rgba(214,168,79,0.2)' : 'rgba(214,168,79,0.08)'}`,
      borderRadius: 14,
      ...style,
    }}>
      {children}
    </div>
  )
}
function SmBtn({ onClick, children, variant = 'gold', disabled = false, loading = false, fullWidth = false }) {
  const V = {
    gold:   { c: '#d6a84f', bg: 'rgba(214,168,79,0.08)', b: 'rgba(214,168,79,0.28)' },
    green:  { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.25)' },
    red:    { c: '#f87171', bg: 'rgba(248,113,113,0.08)',b: 'rgba(248,113,113,0.25)' },
    ghost:  { c: '#5a5f6b', bg: 'transparent',           b: 'rgba(90,95,107,0.2)'   },
    purple: { c: '#8f5cff', bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.25)' },
  }
  const v = V[variant] || V.gold
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${fullWidth ? 'w-full justify-center' : ''}`}
      style={{ color: disabled ? '#5a5f6b' : v.c, background: v.bg, border: `1px solid ${v.b}`, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 34 }}>
      {loading ? <Icon name="Loader2" size={12} className="animate-spin" /> : children}
    </button>
  )
}
function StatusDot({ status }) {
  const S = {
    'demo-local':     '#8f5cff',
    'not-configured': '#f87171',
    'saved-pending':  '#fbbf24',
    'validation-ok':  '#d6a84f',
    'connected':      '#37ff8b',
    'offline':        '#fb923c',
    'error':          '#f87171',
  }
  const col = S[status] || '#5a5f6b'
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col, boxShadow: `0 0 6px ${col}88` }} />
}

// ─── Sync Status Row ──────────────────────────────────────────
function SyncStatusRow({ label, value, color = '#c8ccd2', mono = false }) {
  return (
    <div className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(214,168,79,0.04)' }}>
      <span className="text-xs" style={{ color: '#5a5f6b' }}>{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''}`} style={{ color }}>{value || '—'}</span>
    </div>
  )
}

// ─── Data Freshness Banner ────────────────────────────────────
function FreshnessBanner({ freshness, pendingCount, connectionStatus }) {
  if (connectionStatus === 'demo-local') return null
  const isStale = freshness === 'stale' || freshness === 'unknown'
  const hasPending = pendingCount > 0
  if (!isStale && !hasPending) return null
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-xl"
      style={{ background: hasPending ? 'rgba(248,113,113,0.06)' : 'rgba(251,191,36,0.06)', border: `1px solid ${hasPending ? 'rgba(248,113,113,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
      <Icon name="AlertTriangle" size={12} style={{ color: hasPending ? '#f87171' : '#fbbf24', flexShrink: 0, marginTop: 1 }} />
      <p className="text-[10px] leading-relaxed" style={{ color: hasPending ? '#f87171' : '#fbbf24' }}>
        {hasPending
          ? `${pendingCount} pending PWA submission${pendingCount > 1 ? 's' : ''} queued locally. Live backend is not connected — updates will sync when backend is configured.`
          : 'Data freshness warning: this view may not include updates from other devices until backend sync is connected.'}
      </p>
    </div>
  )
}

// ─── Sync Event Row ───────────────────────────────────────────
const EVENT_ICONS = {
  sync_check_started:       { i: 'RefreshCw',    c: '#8f5cff' },
  sync_check_passed:        { i: 'CheckCircle',  c: '#37ff8b' },
  backend_not_configured:   { i: 'AlertCircle',  c: '#f87171' },
  backend_validation_passed:{ i: 'ShieldCheck',  c: '#37ff8b' },
  backend_connection_failed:{ i: 'XCircle',      c: '#f87171' },
  dashboard_task_created:   { i: 'Plus',         c: '#d6a84f' },
  task_pushed_to_pwa:       { i: 'Send',         c: '#d6a84f' },
  pwa_task_received:        { i: 'CheckCircle',  c: '#37ff8b' },
  pwa_task_updated:         { i: 'RefreshCw',    c: '#37ff8b' },
  pwa_update_queued:        { i: 'Clock',        c: '#fbbf24' },
  pwa_update_pushed:        { i: 'Upload',       c: '#37ff8b' },
  pwa_update_failed:        { i: 'XCircle',      c: '#f87171' },
  evidence_submitted:       { i: 'FolderOpen',   c: '#38bdf8' },
  escalation_requested:     { i: 'AlertTriangle',c: '#f87171' },
  draft_review_submitted:   { i: 'FileEdit',     c: '#8f5cff' },
  conflict_detected:        { i: 'AlertOctagon', c: '#f87171' },
  queue_cleared:            { i: 'Trash2',       c: '#5a5f6b' },
}
function SyncEventRow({ event }) {
  const meta = EVENT_ICONS[event.eventType] || { i: 'Activity', c: '#5a5f6b' }
  return (
    <div className="flex items-start gap-2.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(214,168,79,0.04)' }}>
      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${meta.c}10` }}>
        <Icon name={meta.i} size={11} style={{ color: meta.c }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold" style={{ color: '#c8ccd2' }}>{event.summary || event.eventType}</div>
        <div className="text-[9px] mt-0.5" style={{ color: '#3a3f4b' }}>
          {event.direction && <span className="mr-2">{event.direction}</span>}
          {event.pwaId && <span className="mr-2">PWA: {event.pwaId}</span>}
          {timeAgo(event.ts)}
        </div>
      </div>
      <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
        style={{ background: `${meta.c}12`, color: meta.c, border: `1px solid ${meta.c}25` }}>
        {event.source || 'demo'}
      </span>
    </div>
  )
}

// ─── Queue Item Row ───────────────────────────────────────────
const QUEUE_TYPE_ICONS = {
  task_update:       { i: 'CheckSquare',  c: '#d6a84f' },
  situation_update:  { i: 'MessageCircle',c: '#37ff8b' },
  evidence_item:     { i: 'FolderOpen',   c: '#38bdf8' },
  escalation_request:{ i: 'AlertTriangle',c: '#f87171' },
  draft_review:      { i: 'FileEdit',     c: '#8f5cff' },
  check_in:          { i: 'UserCheck',    c: '#37ff8b' },
}
function QueueItemRow({ item, onRetry, onCancel }) {
  const meta = QUEUE_TYPE_ICONS[item.type] || { i: 'Clock', c: '#5a5f6b' }
  const statusColor = item.status === 'pending' ? '#fbbf24' : item.status === 'sent' ? '#37ff8b' : item.status === 'failed' ? '#f87171' : '#5a5f6b'
  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(214,168,79,0.04)' }}>
      <Icon name={meta.i} size={13} style={{ color: meta.c, flexShrink: 0, marginTop: 1 }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: '#c8ccd2' }}>{item.type?.replace(/_/g, ' ')}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}25` }}>{item.status}</span>
        </div>
        {item.payload?.message && <div className="text-[10px] mt-0.5 truncate" style={{ color: '#5a5f6b' }}>{item.payload.message.slice(0, 80)}</div>}
        <div className="text-[9px] mt-0.5" style={{ color: '#3a3f4b' }}>
          {item.pwaIdentityId && <span className="mr-2">{item.pwaIdentityId}</span>}
          {timeAgo(item.createdAt)}
          {item.attemptCount > 0 && <span className="ml-2">{item.attemptCount} attempt{item.attemptCount > 1 ? 's' : ''}</span>}
        </div>
        {item.errorMessage && <div className="text-[9px] mt-0.5" style={{ color: '#f87171' }}>{item.errorMessage}</div>}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {item.status === 'failed' && <button onClick={() => onRetry(item.id)} className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: '#d6a84f', border: '1px solid rgba(214,168,79,0.2)' }}>Retry</button>}
        {item.status === 'pending' && <button onClick={() => onCancel(item.id)} className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)' }}>Cancel</button>}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — Sync Control Panel
// ═══════════════════════════════════════════════════════════════
const SYNC_TABS = [
  { key: 'status',  label: 'Sync Status', icon: 'Activity'  },
  { key: 'events',  label: 'Event Log',   icon: 'List'       },
  { key: 'queue',   label: 'Queue',        icon: 'Clock'     },
  { key: 'flow',    label: 'Data Flow',   icon: 'ArrowLeftRight' },
]

export default function SyncControlPanel({ isDemo }) {
  const [activeTab, setActiveTab] = useState('status')
  const [running,   setRunning]   = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const { syncStatus, syncEvents, syncQueue, logSyncEvent, updateSyncStatus, updateQueueItem, clearSentQueue, clearAllQueue, saveBackendSyncState, refreshQueueCount } = useSyncStore()
  const { addFeedItem } = useTrustStore()
  const { mode } = useTrustStore()
  const { pwaIdentities } = useIdentityStore()

  const modeInfo = getSyncMode()
  const statusMeta = SYNC_STATUS_LABELS[modeInfo.connectionStatus] || SYNC_STATUS_LABELS['not-configured']
  const freshMeta  = FRESHNESS_LABELS[syncStatus?.dataFreshness || 'unknown']
  const connectedPwas = (pwaIdentities || []).filter(p => p.status === 'active').length
  const failedEvents  = (syncEvents || []).filter(e => e.eventType?.includes('failed')).length
  const pendingQueue  = (syncQueue || []).filter(q => q.status === 'pending' || q.status === 'failed').length

  // ── Run Sync Check ─────────────────────────────────────────
  const handleSyncCheck = useCallback(async () => {
    setRunning(true)
    const result = await runSyncCheck({ logSyncEvent, saveBackendSyncState, updateSyncStatus })
    setLastResult(result)
    setRunning(false)
  }, [logSyncEvent, saveBackendSyncState, updateSyncStatus])

  // ── Demo: push any pending queue items locally ─────────────
  const handlePushPending = useCallback(() => {
    if (!isDemo) {
      setLastResult({ ok: false, message: 'Live backend not connected. Cannot push pending items.' })
      return
    }
    const pending = (syncQueue || []).filter(q => q.status === 'pending')
    if (pending.length === 0) {
      setLastResult({ ok: true, message: 'No pending items in queue.' })
      return
    }
    pending.forEach(item => {
      updateQueueItem(item.id, { status: 'sent' })
      if (item.type === 'situation_update') {
        localDemoAdapter.pushSituationUpdate({ pwaIdentityId: item.pwaIdentityId, message: item.payload?.message, logSyncEvent, addFeedItem })
      } else if (item.type === 'evidence_item') {
        localDemoAdapter.pushEvidenceItem({ pwaIdentityId: item.pwaIdentityId, title: item.payload?.title, description: item.payload?.description, logSyncEvent, addFeedItem })
      } else if (item.type === 'escalation_request') {
        localDemoAdapter.pushEscalation({ pwaIdentityId: item.pwaIdentityId, reason: item.payload?.reason, urgency: item.payload?.urgency, logSyncEvent, addFeedItem })
      }
    })
    logSyncEvent({ eventType: 'pwa_update_pushed', direction: 'pwa-to-dashboard', status: 'demo-local', summary: `${pending.length} queued item(s) processed (demo/local)`, source: 'demo' })
    clearSentQueue()
    setLastResult({ ok: true, message: `${pending.length} pending item(s) processed in demo/local mode.` })
  }, [isDemo, syncQueue, updateQueueItem, logSyncEvent, addFeedItem, clearSentQueue])

  // ── Clear demo queue ───────────────────────────────────────
  const handleClearQueue = useCallback(() => {
    clearAllQueue()
    logSyncEvent({ eventType: 'queue_cleared', direction: 'internal', status: 'demo-local', summary: 'Sync queue cleared.', source: mode === 'live' ? 'live' : 'demo' })
    setLastResult({ ok: true, message: 'Queue cleared.' })
  }, [clearAllQueue, logSyncEvent, mode])

  return (
    <div className="space-y-4">
      {/* Mode banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-wrap"
        style={{ background: isDemo ? 'rgba(143,92,255,0.07)' : 'rgba(55,255,139,0.06)', border: `1px solid ${isDemo ? 'rgba(143,92,255,0.2)' : 'rgba(55,255,139,0.2)'}` }}>
        <StatusDot status={modeInfo.connectionStatus} />
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: statusMeta.color }}>{statusMeta.label}</div>
          <div className="text-[10px]" style={{ color: '#5a5f6b' }}>
            Provider: {modeInfo.backendProvider} · Direction: {modeInfo.syncDirection} · Freshness: <span style={{ color: freshMeta.color }}>{freshMeta.label}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SmBtn onClick={handleSyncCheck} variant="gold" loading={running} disabled={running}>
            <Icon name="RefreshCw" size={11} />Run Sync Check
          </SmBtn>
          {pendingQueue > 0 && (
            <SmBtn onClick={handlePushPending} variant="green">
              <Icon name="Upload" size={11} />Push {pendingQueue} Pending
            </SmBtn>
          )}
        </div>
      </div>

      {/* Last result */}
      {lastResult && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={lastResult.ok ? { background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.2)' } : { background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Icon name={lastResult.ok ? 'CheckCircle' : 'XCircle'} size={13} style={{ color: lastResult.ok ? '#37ff8b' : '#f87171' }} />
          <span className="text-xs" style={{ color: '#c8ccd2' }}>{lastResult.message}</span>
          <button onClick={() => setLastResult(null)} className="ml-auto" style={{ color: '#5a5f6b' }}><Icon name="X" size={11} /></button>
        </div>
      )}

      {/* Freshness warning */}
      <FreshnessBanner freshness={syncStatus?.dataFreshness} pendingCount={pendingQueue} connectionStatus={modeInfo.connectionStatus} />

      {/* Sub-tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {SYNC_TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={activeTab === t.key ? { background: 'rgba(214,168,79,0.12)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.3)' } : { color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }}>
            <Icon name={t.icon} size={11} />{t.label}
            {t.key === 'queue' && pendingQueue > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171' }}>{pendingQueue}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── STATUS TAB ── */}
      {activeTab === 'status' && (
        <Card glow>
          <div className="p-4 space-y-0">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(214,168,79,0.5)' }}>Sync Control Centre</div>
            <SyncStatusRow label="Mode"             value={modeInfo.mode === 'demo' ? 'Demo / Local' : 'Live'} color={isDemo ? '#8f5cff' : '#37ff8b'} />
            <SyncStatusRow label="Backend Provider" value={modeInfo.backendProvider}     color="#d6a84f" />
            <SyncStatusRow label="Connection"       value={statusMeta.label}             color={statusMeta.color} />
            <SyncStatusRow label="Sync Direction"   value={modeInfo.syncDirection}       color="#c8ccd2" />
            <SyncStatusRow label="Last Sync"        value={timeAgo(syncStatus?.lastSyncAt)} color="#5a5f6b" />
            <SyncStatusRow label="Pending Queue"    value={`${pendingQueue} item${pendingQueue !== 1 ? 's' : ''}`} color={pendingQueue > 0 ? '#fbbf24' : '#5a5f6b'} />
            <SyncStatusRow label="Connected PWAs"   value={`${connectedPwas} active`}   color="#37ff8b" />
            <SyncStatusRow label="Failed Syncs"     value={`${failedEvents}`}            color={failedEvents > 0 ? '#f87171' : '#5a5f6b'} />
            <SyncStatusRow label="Data Freshness"   value={freshMeta.label}              color={freshMeta.color} />
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            <SmBtn onClick={handleSyncCheck} variant="gold" loading={running}><Icon name="RefreshCw" size={11} />Run Sync Check</SmBtn>
            {isDemo
              ? <SmBtn onClick={handlePushPending} variant="green"><Icon name="Upload" size={11} />Push Pending</SmBtn>
              : <SmBtn variant="ghost" disabled><Icon name="Upload" size={11} />Push Pending — No Backend</SmBtn>
            }
            <SmBtn onClick={handleClearQueue} variant="ghost"><Icon name="Trash2" size={11} />Clear Queue</SmBtn>
          </div>
          {/* Safety notice */}
          <div className="px-4 pb-4">
            <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
              <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
              <p className="text-[10px]" style={{ color: '#8f5cff' }}>{APP_CONFIG.aiAdvisory} Monitoring and sync should only be used for owned brands, authorised clients, or lawful business/reputation purposes.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ── EVENTS TAB ── */}
      {activeTab === 'events' && (
        <Card>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(214,168,79,0.5)' }}>Sync Event Log</div>
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{(syncEvents || []).length} events</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {(!syncEvents || syncEvents.length === 0) ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <Icon name="Activity" size={20} style={{ color: 'rgba(214,168,79,0.15)' }} />
                <p className="text-xs" style={{ color: '#3a3f4b' }}>No sync events yet. Run a sync check to start.</p>
              </div>
            ) : (
              syncEvents.slice(0, 50).map(e => <SyncEventRow key={e.id} event={e} />)
            )}
          </div>
        </Card>
      )}

      {/* ── QUEUE TAB ── */}
      {activeTab === 'queue' && (
        <Card>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(214,168,79,0.5)' }}>Offline Submission Queue</div>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{(syncQueue || []).length} total</span>
              <SmBtn onClick={handleClearQueue} variant="ghost"><Icon name="Trash2" size={10} />Clear</SmBtn>
            </div>
          </div>
          {(!syncQueue || syncQueue.length === 0) ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <Icon name="CheckCircle" size={20} style={{ color: 'rgba(55,255,139,0.2)' }} />
              <p className="text-xs" style={{ color: '#3a3f4b' }}>Queue empty — no pending PWA submissions.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {syncQueue.map(item => (
                <QueueItemRow key={item.id} item={item}
                  onRetry={(id) => updateQueueItem(id, { status: 'pending', errorMessage: null })}
                  onCancel={(id) => updateQueueItem(id, { status: 'cancelled' })} />
              ))}
            </div>
          )}
          {!isDemo && pendingQueue > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <Icon name="AlertCircle" size={12} style={{ color: '#f87171' }} />
                <p className="text-[10px]" style={{ color: '#f87171' }}>Live backend is not connected. PWA submissions are queued locally on this device. Items will sync when backend is configured and verified.</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── DATA FLOW TAB ── */}
      {activeTab === 'flow' && (
        <Card>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(214,168,79,0.5)' }}>Data Flow — Dashboard ↔ PWA</div>
          </div>
          <div className="p-4 space-y-3">
            {/* Dashboard → PWA */}
            <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(214,168,79,0.05)', border: '1px solid rgba(214,168,79,0.12)' }}>
              <div className="flex items-center gap-2">
                <Icon name="ArrowRight" size={13} style={{ color: '#d6a84f' }} />
                <span className="text-xs font-semibold" style={{ color: '#d6a84f' }}>Dashboard → PWA</span>
              </div>
              {[
                'Tasks created/assigned to PWA identity',
                'Dashboard instructions and case briefings',
                'Draft responses for PWA review',
                'Mode / backend status awareness',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon name="Check" size={11} style={{ color: '#37ff8b', flexShrink: 0, marginTop: 1 }} />
                  <span className="text-[10px]" style={{ color: '#a8adb7' }}>{item}</span>
                </div>
              ))}
            </div>
            {/* PWA → Dashboard */}
            <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.12)' }}>
              <div className="flex items-center gap-2">
                <Icon name="ArrowLeft" size={13} style={{ color: '#37ff8b' }} />
                <span className="text-xs font-semibold" style={{ color: '#37ff8b' }}>PWA → Dashboard</span>
              </div>
              {[
                'Task status updates (Received / In Progress / Submitted / Complete)',
                'Situation updates → Live Update Feed',
                'Evidence items → Evidence Timeline',
                'Escalation requests → Escalation feed',
                'Draft review submissions → Response Drafts',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon name="Check" size={11} style={{ color: '#37ff8b', flexShrink: 0, marginTop: 1 }} />
                  <span className="text-[10px]" style={{ color: '#a8adb7' }}>{item}</span>
                </div>
              ))}
            </div>
            {/* Status note */}
            <div className="rounded-xl p-3" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.12)' }}>
              <div className="text-[10px] font-semibold mb-1" style={{ color: '#8f5cff' }}>Current Mode: {isDemo ? 'Demo/Local Sync' : 'Live Mode — Backend Required'}</div>
              <p className="text-[10px]" style={{ color: '#5a5f6b' }}>
                {isDemo
                  ? 'In Demo Mode, dashboard and PWA share the same local SSOT. All data flows are instant and local — no network required.'
                  : 'In Live Mode, live sync requires backend configuration. Switch to Demo Mode to use local sync preview.'}
              </p>
              <p className="text-[10px] mt-1.5" style={{ color: '#3a3f4b' }}>
                SQL alignment: trustsheild-os-supabase-setup.sql.txt — execute in Supabase and configure anon key before enabling live sync.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
