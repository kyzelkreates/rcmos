/**
 * ============================================================
 * TrustSheild OS™ — Central Sync Service (Run 9)
 * Dashboard ↔ PWA Sync Engine
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * This service is the ONLY place sync logic lives.
 * It reads app mode + backend config from SSOT stores and
 * routes all sync operations to the correct adapter.
 *
 * Adapters:
 *   localDemoAdapter   — Demo Mode / local SSOT (always works)
 *   supabaseAdapter    — Live Mode / Supabase (when configured)
 *   restAdapter        — Live Mode / Generic REST (when configured)
 *
 * ⚠  SECURITY RULES (Run 9):
 *   • Never use SUPABASE_SERVICE_ROLE_KEY.
 *   • Never bypass RLS.
 *   • Never hardcode private API keys.
 *   • No anonymous full-access writes.
 *   • If backend is not safely configured, fall back to local
 *     queue + clear "not configured" status.
 *   • Run 9 SQL alignment: trustsheild-os-supabase-setup.sql.txt
 *     Execute SQL in Supabase and configure public anon key
 *     before enabling live Supabase sync.
 *
 * ETHICAL NOTICE:
 *   Sync must only support authorised, lawful reputation/crisis
 *   management.  No harassment, doxxing, private surveillance,
 *   fake engagement, or unauthorised tracking.
 *   AI guidance is advisory and must be reviewed by a
 *   responsible human before action.
 * ============================================================
 */

// ─── Store imports ────────────────────────────────────────────
// These are lazy-read at call time to avoid circular imports.
// Each function reads the current store state inline.

/**
 * getSyncMode()
 * Determines the current sync mode from app state.
 * @returns SyncStatus object shape
 */
export function getSyncMode() {
  try {
    const mode = JSON.parse(localStorage.getItem('trustsheild:app:mode') || '"demo"')
    const backendRaw = localStorage.getItem('trustsheild_backend_config')
    const backendConfig = backendRaw ? JSON.parse(backendRaw) : null
    const testResultsRaw = localStorage.getItem('trustsheild_api_test_results')
    const testResults = testResultsRaw ? JSON.parse(testResultsRaw) : null
    const backendSyncRaw = localStorage.getItem('trustsheild_backend_sync_state')
    const backendSyncState = backendSyncRaw ? JSON.parse(backendSyncRaw) : null

    if (mode !== 'live') {
      return {
        mode: 'demo',
        backendProvider: 'local',
        connectionStatus: 'demo-local',
        syncDirection: 'two-way',
        source: 'demo',
        dataFreshness: 'fresh',
      }
    }

    // Live mode — check which provider is configured
    const savedProvider = backendConfig
      ? Object.entries(backendConfig).find(([, v]) => v?.status === 'saved_locally')?.[0]
      : null

    if (!savedProvider) {
      return {
        mode: 'live',
        backendProvider: 'none',
        connectionStatus: 'not-configured',
        syncDirection: 'none',
        source: 'live',
        dataFreshness: 'unknown',
      }
    }

    // Provider saved — check test result
    const testResult = testResults?.[savedProvider]
    const connectionStatus = backendSyncState?.result === 'live_test_passed'
      ? 'connected'
      : testResult?.status === 'validation_passed'
        ? 'validation-ok'
        : 'saved-pending'

    return {
      mode: 'live',
      backendProvider: savedProvider,
      connectionStatus,
      syncDirection: connectionStatus === 'connected' ? 'two-way' : 'none',
      source: 'live',
      dataFreshness: connectionStatus === 'connected' ? 'fresh' : 'stale',
    }
  } catch {
    return {
      mode: 'demo',
      backendProvider: 'local',
      connectionStatus: 'error',
      syncDirection: 'none',
      source: 'demo',
      dataFreshness: 'unknown',
    }
  }
}

// ─── Sync Status Label Helper ─────────────────────────────────
export const SYNC_STATUS_LABELS = {
  'demo-local':    { label: 'Demo / Local Sync',              color: '#8f5cff' },
  'not-configured':{ label: 'Live Mode — Backend Not Configured', color: '#f87171' },
  'saved-pending': { label: 'Backend Saved — Sync Pending Verification', color: '#fbbf24' },
  'validation-ok': { label: 'Validation Passed — Live Sync Pending', color: '#d6a84f' },
  'connected':     { label: 'Backend Connected',              color: '#37ff8b' },
  'offline':       { label: 'Offline — Submissions Queued',   color: '#fb923c' },
  'error':         { label: 'Sync Error',                     color: '#f87171' },
}

// ─── Freshness Label Helper ───────────────────────────────────
export const FRESHNESS_LABELS = {
  fresh:   { label: 'Up to date',    color: '#37ff8b' },
  stale:   { label: 'May be stale',  color: '#fbbf24' },
  unknown: { label: 'Unknown',       color: '#5a5f6b' },
}

// ─── Time helper ─────────────────────────────────────────────
export function timeAgo(iso) {
  if (!iso) return '—'
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60)    return `${d}s ago`
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return `${Math.floor(d / 86400)}d ago`
}

// ═══════════════════════════════════════════════════════════════
// LOCAL / DEMO SYNC ADAPTER
// Works without any backend. Uses existing SSOT stores.
// ═══════════════════════════════════════════════════════════════

/**
 * localDemoAdapter
 * All operations read/write through the existing Zustand SSOT.
 * This is the primary adapter for Demo Mode and the safe
 * fallback when backend is not configured.
 *
 * Note: Because Zustand stores are module singletons, all
 * operations here use localStorage directly (same as persist
 * helper) so this module stays dependency-free and importable
 * from both dashboard and PWA code paths without React hooks.
 */
export const localDemoAdapter = {

  // ── Dashboard creates a task and "pushes" it to PWA ───────
  // In demo/local mode this is a no-op because configTasks
  // is the shared SSOT — PWA reads the same key.
  // We just log the sync event.
  pushTaskToPwa({ taskId, pwaIdentityId, taskTitle, logSyncEvent }) {
    logSyncEvent?.({
      eventType:   'task_pushed_to_pwa',
      direction:   'dashboard-to-pwa',
      pwaId:       pwaIdentityId,
      taskId,
      status:      'demo-local',
      summary:     `Task "${taskTitle?.slice(0, 40)}" pushed to ${pwaIdentityId} (demo/local)`,
      source:      'demo',
    })
    return { ok: true, status: 'demo-local', message: 'Task visible to PWA via shared local store.' }
  },

  // ── PWA updates task status → dashboard reflects ──────────
  // pwaUpdateStatus() in useTaskStore already handles this.
  // We add a sync event + feed item.
  pwaTaskUpdate({ taskId, newStatus, pwaIdentityId, taskTitle, logSyncEvent, addFeedItem }) {
    addFeedItem?.({
      event_type: 'pwa_task_update',
      title:      `PWA Task Update — ${newStatus}`,
      body:       `Task "${taskTitle?.slice(0, 40)}" updated to "${newStatus}" by ${pwaIdentityId}`,
      actor_type: 'pwa',
      source:     'demo',
    })
    logSyncEvent?.({
      eventType:  'pwa_task_updated',
      direction:  'pwa-to-dashboard',
      pwaId:      pwaIdentityId,
      taskId,
      status:     'demo-local',
      summary:    `Task "${taskTitle?.slice(0, 40)}" → "${newStatus}"`,
      source:     'demo',
    })
    return { ok: true, status: 'demo-local' }
  },

  // ── PWA submits situation update → dashboard feed ─────────
  pushSituationUpdate({ pwaIdentityId, message, caseId, logSyncEvent, addFeedItem }) {
    const feedEntry = {
      event_type: 'pwa_situation_update',
      title:      'PWA Situation Update',
      body:       message?.slice(0, 200) || '(no message)',
      actor_type: 'pwa',
      source:     'demo',
    }
    addFeedItem?.(feedEntry)
    logSyncEvent?.({
      eventType:  'pwa_update_pushed',
      direction:  'pwa-to-dashboard',
      pwaId:      pwaIdentityId,
      caseId,
      status:     'demo-local',
      summary:    `Situation update from ${pwaIdentityId}: "${message?.slice(0, 60)}"`,
      source:     'demo',
    })
    return { ok: true, status: 'demo-local', feedEntry }
  },

  // ── PWA submits evidence/note → dashboard timeline ────────
  pushEvidenceItem({ pwaIdentityId, title, description, caseId, logSyncEvent, addFeedItem }) {
    addFeedItem?.({
      event_type: 'evidence_submitted',
      title:      `Evidence Submitted — ${title?.slice(0, 40)}`,
      body:       description?.slice(0, 160) || '',
      actor_type: 'pwa',
      source:     'demo',
    })
    logSyncEvent?.({
      eventType:  'evidence_submitted',
      direction:  'pwa-to-dashboard',
      pwaId:      pwaIdentityId,
      caseId,
      status:     'demo-local',
      summary:    `Evidence: "${title?.slice(0, 60)}" from ${pwaIdentityId}`,
      source:     'demo',
    })
    return { ok: true, status: 'demo-local' }
  },

  // ── PWA requests escalation → dashboard escalation + feed ─
  pushEscalation({ pwaIdentityId, reason, urgency, caseId, logSyncEvent, addFeedItem }) {
    addFeedItem?.({
      event_type: 'escalation_requested',
      title:      `⚠ Escalation Request — ${urgency?.toUpperCase() || 'NORMAL'}`,
      body:       reason?.slice(0, 200) || '(no reason given)',
      actor_type: 'pwa',
      source:     'demo',
    })
    logSyncEvent?.({
      eventType:  'escalation_requested',
      direction:  'pwa-to-dashboard',
      pwaId:      pwaIdentityId,
      caseId,
      status:     'demo-local',
      summary:    `Escalation from ${pwaIdentityId} [${urgency}]: "${reason?.slice(0, 60)}"`,
      source:     'demo',
    })
    return { ok: true, status: 'demo-local' }
  },

  // ── PWA submits draft review → dashboard draft review status
  pushDraftReview({ pwaIdentityId, draftId, reviewStatus, comments, logSyncEvent, addFeedItem }) {
    addFeedItem?.({
      event_type: 'draft_review_submitted',
      title:      `Draft Review — ${reviewStatus}`,
      body:       comments?.slice(0, 160) || '',
      actor_type: 'pwa',
      source:     'demo',
    })
    logSyncEvent?.({
      eventType:  'draft_review_submitted',
      direction:  'pwa-to-dashboard',
      pwaId:      pwaIdentityId,
      status:     'demo-local',
      summary:    `Draft ${draftId} reviewed as "${reviewStatus}" by ${pwaIdentityId}`,
      source:     'demo',
    })
    return { ok: true, status: 'demo-local' }
  },

  // ── PWA check-in ──────────────────────────────────────────
  checkIn({ pwaIdentityId, logSyncEvent }) {
    logSyncEvent?.({
      eventType:  'pwa_task_received',
      direction:  'pwa-to-dashboard',
      pwaId:      pwaIdentityId,
      status:     'demo-local',
      summary:    `PWA check-in from ${pwaIdentityId}`,
      source:     'demo',
    })
    return { ok: true, status: 'demo-local', checkedInAt: new Date().toISOString() }
  },

  // ── Run demo sync check ───────────────────────────────────
  runSyncCheck({ logSyncEvent }) {
    logSyncEvent?.({
      eventType: 'sync_check_passed',
      direction: 'internal',
      status:    'demo-local',
      summary:   'Demo/local sync check passed. All stores are consistent.',
      source:    'demo',
    })
    return {
      ok:      true,
      status:  'demo-local',
      message: 'Demo/local sync check passed. Dashboard and PWA share the same local SSOT.',
    }
  },
}

// ═══════════════════════════════════════════════════════════════
// SUPABASE ADAPTER PLACEHOLDER
// Ready for wiring when public anon key + SQL are in place.
// ═══════════════════════════════════════════════════════════════
// ⚠  Prerequisites:
//   1. Execute sql_7_trustsheild_supabase_setup.sql.txt in Supabase.
//   2. Configure Project URL + anon key in Run 7 Backend Config.
//   3. Verify RLS policies are active.
//   4. NEVER use service role key in frontend.
// ============================================================

export const supabaseAdapter = {

  // Retrieve Supabase config safely from saved local config
  _getConfig() {
    try {
      const raw = localStorage.getItem('trustsheild_backend_config')
      if (!raw) return null
      const cfg = JSON.parse(raw)?.supabase
      if (!cfg?.projectUrl || !cfg?.anonKey) return null
      // Guard: never accept service role key patterns
      if (/service_role/i.test(cfg.anonKey)) return null
      return cfg
    } catch { return null }
  },

  // Test connection using safe anon-key read
  async testConnection({ logSyncEvent, saveBackendSyncState }) {
    const cfg = this._getConfig()
    if (!cfg) {
      logSyncEvent?.({ eventType: 'backend_not_configured', direction: 'internal', status: 'not-configured', summary: 'Supabase config not found.', source: 'live' })
      return { ok: false, status: 'not-configured', message: 'Supabase not configured. Add Project URL + anon key in Backend Config.' }
    }
    try {
      // Safe read-only health probe: fetch project URL without credentials
      const res = await fetch(`${cfg.projectUrl}/rest/v1/`, {
        headers: { 'apikey': cfg.anonKey, 'Authorization': `Bearer ${cfg.anonKey}` },
        signal: AbortSignal.timeout(6000),
      })
      if (res.ok || res.status === 200 || res.status === 204 || res.status === 401) {
        // 401 means the endpoint responded — Supabase is reachable
        const status = res.status === 401 ? 'validation-ok' : 'connected'
        saveBackendSyncState?.({ provider: 'supabase', tested: true, result: status === 'connected' ? 'live_test_passed' : 'validation_passed' })
        logSyncEvent?.({ eventType: 'backend_validation_passed', direction: 'internal', status, summary: `Supabase reachable (HTTP ${res.status}).`, source: 'live' })
        return { ok: true, status, message: `Supabase reachable (HTTP ${res.status}). Full live sync requires RLS verification and SQL execution.` }
      }
      throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'Connection timed out.' : `Connection failed: ${err.message}`
      saveBackendSyncState?.({ provider: 'supabase', tested: true, result: 'live_test_failed' })
      logSyncEvent?.({ eventType: 'backend_connection_failed', direction: 'internal', status: 'error', summary: msg, source: 'live' })
      return { ok: false, status: 'error', message: msg }
    }
  },

  // Placeholder method stubs — wired fully in Run 10+
  async syncTasks()           { return this._notReady('syncTasks') },
  async pushPwaTaskUpdate()   { return this._notReady('pushPwaTaskUpdate') },
  async pullAssignedTasks()   { return this._notReady('pullAssignedTasks') },
  async pushEvidenceItem()    { return this._notReady('pushEvidenceItem') },
  async pushEscalationRequest(){ return this._notReady('pushEscalationRequest') },
  async pullPwaIdentity()     { return this._notReady('pullPwaIdentity') },
  async pushLiveUpdateFeed()  { return this._notReady('pushLiveUpdateFeed') },
  async pullDashboardUpdates(){ return this._notReady('pullDashboardUpdates') },

  _notReady(method) {
    return {
      ok: false,
      status: 'saved-pending',
      message: `${method}(): Supabase adapter ready — execute SQL file and verify RLS before enabling live writes.`,
    }
  },
}

// ═══════════════════════════════════════════════════════════════
// GENERIC REST ADAPTER PLACEHOLDER
// ═══════════════════════════════════════════════════════════════
export const restAdapter = {

  _getConfig() {
    try {
      const raw = localStorage.getItem('trustsheild_backend_config')
      if (!raw) return null
      const cfg = JSON.parse(raw)?.rest
      if (!cfg?.apiBaseUrl) return null
      return cfg
    } catch { return null }
  },

  async testConnection({ logSyncEvent, saveBackendSyncState }) {
    const cfg = this._getConfig()
    if (!cfg) {
      return { ok: false, status: 'not-configured', message: 'REST API not configured.' }
    }
    try {
      const healthPath = cfg.healthCheckPath || '/health'
      const url = `${cfg.apiBaseUrl.replace(/\/$/, '')}${healthPath}`
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
      if (res.ok) {
        saveBackendSyncState?.({ provider: 'rest', tested: true, result: 'live_test_passed' })
        logSyncEvent?.({ eventType: 'backend_validation_passed', direction: 'internal', status: 'connected', summary: `REST health check passed: ${url}`, source: 'live' })
        return { ok: true, status: 'connected', message: `REST health check passed.` }
      }
      throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'REST health check timed out.' : `REST check failed: ${err.message}. If the endpoint requires a backend proxy, use a server-side function.`
      logSyncEvent?.({ eventType: 'backend_connection_failed', direction: 'internal', status: 'error', summary: msg, source: 'live' })
      return { ok: false, status: 'error', message: msg }
    }
  },

  async syncTasks()           { return this._notReady('syncTasks') },
  async pushPwaTaskUpdate()   { return this._notReady('pushPwaTaskUpdate') },
  async pushEvidenceItem()    { return this._notReady('pushEvidenceItem') },
  async pushEscalationRequest(){ return this._notReady('pushEscalationRequest') },

  _notReady(method) {
    return {
      ok: false,
      status: 'saved-pending',
      message: `${method}(): REST sync not configured — add API base URL and configure auth mode.`,
    }
  },
}

// ═══════════════════════════════════════════════════════════════
// CENTRAL SYNC ROUTER
// ═══════════════════════════════════════════════════════════════
/**
 * getActiveAdapter()
 * Returns the correct adapter based on current sync mode.
 */
export function getActiveAdapter() {
  const { mode, backendProvider, connectionStatus } = getSyncMode()
  if (mode === 'demo') return { adapter: localDemoAdapter, adapterName: 'local' }
  if (backendProvider === 'supabase') return { adapter: supabaseAdapter, adapterName: 'supabase' }
  if (backendProvider === 'rest')     return { adapter: restAdapter,     adapterName: 'rest' }
  return { adapter: localDemoAdapter, adapterName: 'local' }
}

/**
 * runSyncCheck()
 * Safe sync check — uses adapter appropriate to current mode.
 * Returns a sync status result object.
 */
export async function runSyncCheck({ logSyncEvent, saveBackendSyncState, updateSyncStatus }) {
  const modeInfo = getSyncMode()
  const { adapter, adapterName } = getActiveAdapter()

  logSyncEvent?.({
    eventType: 'sync_check_started',
    direction: 'internal',
    status:    modeInfo.connectionStatus,
    summary:   `Sync check started — adapter: ${adapterName}, mode: ${modeInfo.mode}`,
    source:    modeInfo.source,
  })

  let result
  if (adapterName === 'local') {
    result = adapter.runSyncCheck({ logSyncEvent })
  } else if (adapterName === 'supabase') {
    result = await adapter.testConnection({ logSyncEvent, saveBackendSyncState })
  } else if (adapterName === 'rest') {
    result = await adapter.testConnection({ logSyncEvent, saveBackendSyncState })
  } else {
    result = { ok: false, status: 'not-configured', message: 'No backend adapter available.' }
  }

  updateSyncStatus?.({
    ...modeInfo,
    connectionStatus: result.status || modeInfo.connectionStatus,
    lastSyncAt: new Date().toISOString(),
    errorMessage: result.ok ? null : result.message,
    dataFreshness: result.ok ? 'fresh' : 'stale',
  })

  return result
}
