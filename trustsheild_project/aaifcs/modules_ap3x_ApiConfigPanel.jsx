/**
 * ============================================================
 * TrustSheild OS™ — Backend/API Configuration Centre
 * Run 7 — Backend + API Config Panel / Save + Test Layer
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Sections:
 *  1. Backend Provider Config   (Supabase / Firebase / AWS / REST / Local)
 *  2. Reputation Monitoring API Slots
 *  3. Tracked Entities (Companies / People / Brands)
 *  4. Entity → Provider Mapping
 *  5. API Status Dashboard
 *  6. 4P3X API Config Guard™ Event Log
 *
 * ⚠️  FRONTEND-SAFE ONLY:
 *  - Public URLs and anon/client keys only
 *  - Service role keys, private keys, secret keys are BLOCKED
 *    by the 4P3X API Config Guard™ before saving
 *  - No SQL in Run 7
 *  - No real backend connections yet
 * ============================================================
 */

import { useState, useCallback } from 'react'
import Icon from './components_ui_Icon'
import { useConfigStore, applyConfigGuard } from './core_storage'
import APP_CONFIG from './config_app'

// ─── Shared Primitives ────────────────────────────────────────
function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: 'rgba(143,92,255,0.1)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' }}>
      <span className="w-1 h-1 rounded-full" style={{ background: '#8f5cff' }} />Demo
    </span>
  )
}
function StatusBadge({ status }) {
  const S = {
    not_configured:         { c: '#5a5f6b', bg: 'rgba(90,95,107,0.12)',    b: 'rgba(90,95,107,0.2)'    },
    saved_locally:          { c: '#d6a84f', bg: 'rgba(214,168,79,0.1)',    b: 'rgba(214,168,79,0.25)'  },
    validation_passed:      { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)',   b: 'rgba(55,255,139,0.2)'   },
    validation_failed:      { c: '#f87171', bg: 'rgba(248,113,113,0.08)',  b: 'rgba(248,113,113,0.2)'  },
    live_test_passed:       { c: '#37ff8b', bg: 'rgba(55,255,139,0.1)',    b: 'rgba(55,255,139,0.3)'   },
    live_test_failed:       { c: '#f87171', bg: 'rgba(248,113,113,0.1)',   b: 'rgba(248,113,113,0.3)'  },
    requires_backend_proxy: { c: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   b: 'rgba(251,191,36,0.2)'   },
    blocked_unsafe_secret:  { c: '#f87171', bg: 'rgba(248,113,113,0.15)',  b: 'rgba(248,113,113,0.4)'  },
    demo:                   { c: '#8f5cff', bg: 'rgba(143,92,255,0.1)',    b: 'rgba(143,92,255,0.25)'  },
    active:                 { c: '#37ff8b', bg: 'rgba(55,255,139,0.1)',    b: 'rgba(55,255,139,0.25)'  },
    disabled:               { c: '#5a5f6b', bg: 'rgba(90,95,107,0.1)',    b: 'rgba(90,95,107,0.2)'    },
  }
  const s = S[status] || S.not_configured
  const LABELS = {
    not_configured: 'Not Configured', saved_locally: 'Saved Locally',
    validation_passed: 'Validation Passed', validation_failed: 'Validation Failed',
    live_test_passed: 'Live Test Passed', live_test_failed: 'Live Test Failed',
    requires_backend_proxy: 'Requires Backend Proxy', blocked_unsafe_secret: 'Blocked — Unsafe Secret',
    demo: 'Demo', active: 'Active', disabled: 'Disabled',
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
      style={{ background: s.bg, borderColor: s.b, color: s.c }}>
      {LABELS[status] || status}
    </span>
  )
}
function GuardWarning({ reason }) {
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-lg mt-1"
      style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)' }}>
      <Icon name="ShieldOff" size={13} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
      <div>
        <div className="text-[10px] font-bold mb-0.5" style={{ color: '#f87171' }}>🔒 4P3X API Config Guard™ — Blocked</div>
        <p className="text-[10px]" style={{ color: '#f87171' }}>{reason}</p>
        <p className="text-[10px] mt-1" style={{ color: '#b95c5c' }}>Only public anon keys / project URLs belong here. Backend-only secrets must stay server-side.</p>
      </div>
    </div>
  )
}
function MaskedValue({ value, label }) {
  const [show, setShow] = useState(false)
  if (!value) return <span style={{ color: '#3a3f4b' }}>—</span>
  return (
    <div className="flex items-center gap-2">
      <code className="text-xs font-mono" style={{ color: '#d6a84f' }}>
        {show ? value : value.slice(0, 6) + '••••••••' + value.slice(-3)}
      </code>
      <button onClick={() => setShow(!show)} className="text-[10px]" style={{ color: '#5a5f6b' }}>
        <Icon name={show ? 'EyeOff' : 'Eye'} size={11} />
      </button>
    </div>
  )
}
function InputField({ label, value, onChange, placeholder, type = 'text', required, hint, guardCheck, onGuardBlock }) {
  const [guardResult, setGuardResult] = useState(null)
  const handleChange = (v) => {
    if (guardCheck && v.length > 8) {
      const result = guardCheck(v)
      setGuardResult(result.safe ? null : result.reason)
      if (!result.safe) { onGuardBlock?.(result.reason); return }
    }
    setGuardResult(null)
    onChange(v)
  }
  const s = { width: '100%', background: 'rgba(13,13,18,0.8)', border: `1px solid ${guardResult ? 'rgba(248,113,113,0.5)' : 'rgba(214,168,79,0.18)'}`, borderRadius: 8, padding: '9px 12px', fontSize: '0.8rem', color: '#f5f5f2', outline: 'none', fontFamily: 'Inter, sans-serif' }
  return (
    <div className="space-y-1">
      {label && <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}{required && <span style={{ color: '#f87171' }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => handleChange(e.target.value)} placeholder={placeholder} style={s}
        onFocus={e => e.target.style.borderColor = guardResult ? 'rgba(248,113,113,0.6)' : 'rgba(214,168,79,0.45)'}
        onBlur={e => e.target.style.borderColor = guardResult ? 'rgba(248,113,113,0.5)' : 'rgba(214,168,79,0.18)'} />
      {hint && !guardResult && <p className="text-[10px]" style={{ color: '#3a3f4b' }}>{hint}</p>}
      {guardResult && <GuardWarning reason={guardResult} />}
    </div>
  )
}
function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: 'rgba(13,13,18,0.6)', border: '1px solid rgba(214,168,79,0.06)' }}>
      <span className="text-xs" style={{ color: '#c8ccd2' }}>{label}</span>
      <button onClick={() => onChange(!value)} className="w-9 h-5 rounded-full relative transition-all flex-shrink-0"
        style={{ background: value ? 'rgba(55,255,139,0.3)' : 'rgba(90,95,107,0.2)', border: `1px solid ${value ? 'rgba(55,255,139,0.5)' : 'rgba(90,95,107,0.35)'}` }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{ background: value ? '#37ff8b' : '#5a5f6b', left: value ? 'calc(100% - 18px)' : 2 }} />
      </button>
    </div>
  )
}
function SmBtn({ onClick, children, variant = 'gold', disabled = false, fullWidth = false, loading = false }) {
  const V = { gold: { c: '#d6a84f', bg: 'rgba(214,168,79,0.08)', b: 'rgba(214,168,79,0.28)' }, green: { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.25)' }, red: { c: '#f87171', bg: 'rgba(248,113,113,0.08)', b: 'rgba(248,113,113,0.25)' }, ghost: { c: '#5a5f6b', bg: 'transparent', b: 'rgba(90,95,107,0.2)' }, purple: { c: '#8f5cff', bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.25)' } }
  const v = V[variant] || V.gold
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${fullWidth ? 'w-full justify-center' : ''}`}
      style={{ color: disabled ? '#5a5f6b' : v.c, background: v.bg, border: `1px solid ${v.b}`, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 34 }}>
      {loading ? <Icon name="Loader2" size={12} className="animate-spin" /> : children}
    </button>
  )
}
function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.18)', borderRadius: 8, padding: '9px 12px', fontSize: '0.8rem', color: '#f5f5f2', outline: 'none', WebkitAppearance: 'none' }}>
        {options.map(o => <option key={o.value || o} value={o.value || o} style={{ background: '#0d0d12' }}>{o.label || o}</option>)}
      </select>
    </div>
  )
}

// ─── 4P3X API Config Guard™ helper ───────────────────────────
function useGuard() {
  const { logGuardEvent } = useConfigStore()
  return useCallback((value) => applyConfigGuard(value, logGuardEvent), [logGuardEvent])
}

// ─── Test result helper ───────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return '—'
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60)    return `${d}s ago`
  if (d < 3600)  return `${Math.floor(d/60)}m ago`
  if (d < 86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — Backend Provider Config
// ═══════════════════════════════════════════════════════════════

// ─── Supabase Config ──────────────────────────────────────────
function SupabaseConfig({ saved, testResult, isDemo }) {
  const { saveBackendConfig, saveTestResult, logGuardEvent } = useConfigStore()
  const guard = useGuard()
  const init = saved?.supabase || {}
  const [projectUrl, setProjectUrl] = useState(init.projectUrl || '')
  const [anonKey,    setAnonKey]    = useState(init.anonKey || '')
  const [realtime,   setRealtime]   = useState(init.realtimeEnabled || false)
  const [bucket,     setBucket]     = useState(init.storageBucket || '')
  const [edgeFn,     setEdgeFn]     = useState(init.edgeFunctionEndpoint || '')
  const [saving, setSaving]         = useState(false)
  const [testing, setTesting]       = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      saveBackendConfig('supabase', { projectUrl, anonKey, realtimeEnabled: realtime, storageBucket: bucket, edgeFunctionEndpoint: edgeFn, status: 'saved_locally' })
      setSaving(false)
    }, 400)
  }
  const handleTest = () => {
    setTesting(true)
    setTimeout(() => {
      let status = 'validation_passed'
      let message = 'Client-side validation passed. Full functional test requires backend proxy/server setup and SQL (Run 8).'
      if (!projectUrl || !anonKey) { status = 'validation_failed'; message = 'Project URL and anon key are required.' }
      else if (!projectUrl.startsWith('https://')) { status = 'validation_failed'; message = 'Project URL must start with https://' }
      else if (anonKey.length < 20) { status = 'validation_failed'; message = 'Anon key appears too short.' }
      saveTestResult('supabase', { status, message })
      setTesting(false)
    }, 700)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.12)' }}>
        <Icon name="Info" size={12} style={{ color: '#37ff8b', flexShrink: 0 }} />
        <p className="text-[10px]" style={{ color: '#37ff8b' }}>Only public Project URL and anon key belong here. <strong>Service role keys must never be entered.</strong> The 4P3X Config Guard™ will block them.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="Project URL" value={projectUrl} onChange={setProjectUrl} placeholder="https://xxxx.supabase.co" required guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
        <InputField label="Anon (Public) Key" value={anonKey} onChange={setAnonKey} placeholder="eyJhb…" required hint="Public anon key only — NOT service role key" guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="Storage Bucket (optional)" value={bucket} onChange={setBucket} placeholder="trustreply-evidence" />
        <InputField label="Edge Function Endpoint (optional)" value={edgeFn} onChange={setEdgeFn} placeholder="https://xxxx.supabase.co/functions/v1/…" />
      </div>
      <Toggle label="Realtime Enabled (placeholder)" value={realtime} onChange={setRealtime} />
      {testResult?.supabase && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={testResult.supabase.status === 'validation_passed' || testResult.supabase.status === 'live_test_passed' ? { background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.2)' } : { background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Icon name={testResult.supabase.status.includes('passed') ? 'CheckCircle' : 'XCircle'} size={13} style={{ color: testResult.supabase.status.includes('passed') ? '#37ff8b' : '#f87171' }} />
          <span className="text-[10px]" style={{ color: '#c8ccd2' }}>{testResult.supabase.message} · {timeAgo(testResult.supabase.testedAt)}</span>
        </div>
      )}
      {saved?.supabase?.anonKey && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
          <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Saved key:</span>
          <MaskedValue value={saved.supabase.anonKey} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <SmBtn onClick={handleSave} variant="gold" loading={saving}><Icon name="Save" size={12} />Save Config</SmBtn>
        <SmBtn onClick={handleTest} variant="green" loading={testing}><Icon name="Zap" size={12} />Test Connection</SmBtn>
      </div>
      <p className="text-[10px]" style={{ color: '#3a3f4b' }}>SQL schema setup and full sync configuration are added in Run 8.</p>
    </div>
  )
}

// ─── Firebase Config ──────────────────────────────────────────
function FirebaseConfig({ saved, testResult }) {
  const { saveBackendConfig, saveTestResult, logGuardEvent } = useConfigStore()
  const guard = useGuard()
  const init = saved?.firebase || {}
  const [apiKey,    setApiKey]    = useState(init.apiKey || '')
  const [authDomain, setAuth]     = useState(init.authDomain || '')
  const [projectId, setProject]   = useState(init.projectId || '')
  const [appId,     setApp]       = useState(init.appId || '')
  const [measureId, setMeasure]   = useState(init.measurementId || '')
  const [firestore, setFirestore] = useState(init.firestoreEnabled || false)
  const [saving, setSaving]       = useState(false)
  const [testing, setTesting]     = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      saveBackendConfig('firebase', { apiKey, authDomain, projectId, appId, measurementId: measureId, firestoreEnabled: firestore, status: 'saved_locally' })
      setSaving(false)
    }, 400)
  }
  const handleTest = () => {
    setTesting(true)
    setTimeout(() => {
      let status = 'validation_passed'
      let message = 'Client-side validation passed. Full Firestore/auth test requires live backend setup.'
      if (!apiKey || !projectId) { status = 'validation_failed'; message = 'API key and Project ID are required.' }
      saveTestResult('firebase', { status, message })
      setTesting(false)
    }, 700)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)' }}>
        <Icon name="AlertTriangle" size={12} style={{ color: '#fb923c', flexShrink: 0 }} />
        <p className="text-[10px]" style={{ color: '#fb923c' }}>Firebase public web config only. Admin SDK keys, service account JSON, and private keys are blocked.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="API Key" value={apiKey} onChange={setApiKey} placeholder="AIzaSy…" required guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
        <InputField label="Auth Domain" value={authDomain} onChange={setAuth} placeholder="your-app.firebaseapp.com" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="Project ID" value={projectId} onChange={setProject} placeholder="your-project-id" required />
        <InputField label="App ID" value={appId} onChange={setApp} placeholder="1:xxx:web:xxx" />
      </div>
      <InputField label="Measurement ID (optional)" value={measureId} onChange={setMeasure} placeholder="G-XXXXXXXXXX" />
      <Toggle label="Firestore Enabled (placeholder)" value={firestore} onChange={setFirestore} />
      {testResult?.firebase && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={testResult.firebase.status.includes('passed') ? { background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.2)' } : { background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Icon name={testResult.firebase.status.includes('passed') ? 'CheckCircle' : 'XCircle'} size={13} style={{ color: testResult.firebase.status.includes('passed') ? '#37ff8b' : '#f87171' }} />
          <span className="text-[10px]" style={{ color: '#c8ccd2' }}>{testResult.firebase.message} · {timeAgo(testResult.firebase.testedAt)}</span>
        </div>
      )}
      {saved?.firebase?.apiKey && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
          <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Saved key:</span>
          <MaskedValue value={saved.firebase.apiKey} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <SmBtn onClick={handleSave} variant="gold" loading={saving}><Icon name="Save" size={12} />Save Config</SmBtn>
        <SmBtn onClick={handleTest} variant="green" loading={testing}><Icon name="Zap" size={12} />Test Config</SmBtn>
      </div>
    </div>
  )
}

// ─── AWS / Custom Backend Config ──────────────────────────────
function AwsConfig({ saved, testResult }) {
  const { saveBackendConfig, saveTestResult, logGuardEvent } = useConfigStore()
  const guard = useGuard()
  const init = saved?.aws || {}
  const [apiBaseUrl, setUrl]    = useState(init.apiBaseUrl || '')
  const [region,     setRegion] = useState(init.region || '')
  const [healthPath, setHealth] = useState(init.healthCheckEndpoint || '/health')
  const [authMode,   setAuth]   = useState(init.authMode || 'none')
  const [saving, setSaving]     = useState(false)
  const [testing, setTesting]   = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      saveBackendConfig('aws', { apiBaseUrl, region, healthCheckEndpoint: healthPath, authMode, status: 'saved_locally' })
      setSaving(false)
    }, 400)
  }
  const handleTest = () => {
    setTesting(true)
    setTimeout(() => {
      let status = 'validation_passed'
      let message = 'Client-side validation passed. Full health endpoint test requires live backend setup.'
      if (!apiBaseUrl) { status = 'validation_failed'; message = 'API base URL is required.' }
      else if (!apiBaseUrl.startsWith('https://') && !apiBaseUrl.startsWith('http://')) { status = 'validation_failed'; message = 'API base URL must start with http:// or https://' }
      saveTestResult('aws', { status, message })
      setTesting(false)
    }, 700)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
        <Icon name="ShieldCheck" size={12} style={{ color: '#38bdf8', flexShrink: 0 }} />
        <p className="text-[10px]" style={{ color: '#38bdf8' }}>AWS secret keys and private credentials must remain server-side. Use a backend proxy or serverless function for protected calls.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="API Base URL" value={apiBaseUrl} onChange={setUrl} placeholder="https://api.yourbackend.com" required guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
        <InputField label="Region (optional)" value={region} onChange={setRegion} placeholder="eu-west-2" />
      </div>
      <InputField label="Health Check Endpoint" value={healthPath} onChange={setHealth} placeholder="/health" hint="Relative path for connection testing" />
      <SelectField label="Auth Mode" value={authMode} onChange={setAuth} options={[
        { value: 'none', label: 'None' },
        { value: 'backend_proxy', label: 'API Key via Backend Proxy' },
        { value: 'oauth', label: 'OAuth (configured on server)' },
        { value: 'custom_token', label: 'Custom Token' },
        { value: 'future', label: 'Future / TBD' },
      ]} />
      {testResult?.aws && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={testResult.aws.status.includes('passed') ? { background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.2)' } : { background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Icon name={testResult.aws.status.includes('passed') ? 'CheckCircle' : 'XCircle'} size={13} style={{ color: testResult.aws.status.includes('passed') ? '#37ff8b' : '#f87171' }} />
          <span className="text-[10px]" style={{ color: '#c8ccd2' }}>{testResult.aws.message} · {timeAgo(testResult.aws.testedAt)}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <SmBtn onClick={handleSave} variant="gold" loading={saving}><Icon name="Save" size={12} />Save Config</SmBtn>
        <SmBtn onClick={handleTest} variant="green" loading={testing}><Icon name="Zap" size={12} />Test Endpoint</SmBtn>
      </div>
    </div>
  )
}

// ─── Generic REST API Config ──────────────────────────────────
function RestApiConfig({ saved, testResult }) {
  const { saveBackendConfig, saveTestResult, logGuardEvent } = useConfigStore()
  const guard = useGuard()
  const init = saved?.rest || {}
  const [apiBaseUrl, setUrl]     = useState(init.apiBaseUrl || '')
  const [healthPath, setHealth]  = useState(init.healthCheckPath || '/health')
  const [clientToken, setToken]  = useState(init.publicClientToken || '')
  const [authMode,    setAuth]   = useState(init.authMode || 'none')
  const [saving,  setSaving]     = useState(false)
  const [testing, setTesting]    = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      saveBackendConfig('rest', { apiBaseUrl, healthCheckPath: healthPath, publicClientToken: clientToken, authMode, status: 'saved_locally' })
      setSaving(false)
    }, 400)
  }
  const handleTest = () => {
    setTesting(true)
    setTimeout(() => {
      let status = 'validation_passed'
      let message = 'Client-side validation passed. Live endpoint test requires backend/CORS setup.'
      if (!apiBaseUrl) { status = 'validation_failed'; message = 'API base URL is required.' }
      saveTestResult('rest', { status, message })
      setTesting(false)
    }, 600)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="API Base URL" value={apiBaseUrl} onChange={setUrl} placeholder="https://api.example.com" required guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
        <InputField label="Health Check Path" value={healthPath} onChange={setHealth} placeholder="/health" />
      </div>
      <InputField label="Public Client Token (optional)" value={clientToken} onChange={setToken} placeholder="pk_…" hint="Public/read-only tokens only. Secret keys are blocked by the API Config Guard." guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
      <SelectField label="Auth Mode" value={authMode} onChange={setAuth} options={[
        { value: 'none', label: 'None' },
        { value: 'api_key_proxy', label: 'API Key via Backend Proxy' },
        { value: 'bearer_token', label: 'Bearer Token (public)' },
        { value: 'oauth', label: 'OAuth' },
        { value: 'custom', label: 'Custom' },
      ]} />
      {testResult?.rest && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={testResult.rest.status.includes('passed') ? { background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.2)' } : { background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <Icon name={testResult.rest.status.includes('passed') ? 'CheckCircle' : 'XCircle'} size={13} style={{ color: testResult.rest.status.includes('passed') ? '#37ff8b' : '#f87171' }} />
          <span className="text-[10px]" style={{ color: '#c8ccd2' }}>{testResult.rest.message} · {timeAgo(testResult.rest.testedAt)}</span>
        </div>
      )}
      {saved?.rest?.publicClientToken && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
          <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Saved token:</span>
          <MaskedValue value={saved.rest.publicClientToken} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <SmBtn onClick={handleSave} variant="gold" loading={saving}><Icon name="Save" size={12} />Save Config</SmBtn>
        <SmBtn onClick={handleTest} variant="green" loading={testing}><Icon name="Zap" size={12} />Test Endpoint</SmBtn>
      </div>
    </div>
  )
}

// ─── Local Fallback Card ──────────────────────────────────────
function LocalFallbackCard({ saved }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.18)' }}>
        <Icon name="CheckCircle" size={16} style={{ color: '#37ff8b', flexShrink: 0 }} />
        <div>
          <div className="text-sm font-semibold" style={{ color: '#37ff8b' }}>Local-only Fallback — Active</div>
          <p className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>TrustSheild OS™ operates fully in local/demo mode without a backend. All data is stored in browser local storage.</p>
        </div>
      </div>
      {[
        { label: 'Local Storage',        value: 'Enabled' },
        { label: 'Offline PWA Support',  value: 'Enabled' },
        { label: 'Export / Import',      value: 'Coming in later run' },
        { label: 'Cloud Sync',           value: 'Not Connected' },
      ].map(r => (
        <div key={r.label} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: 'rgba(13,13,18,0.6)', border: '1px solid rgba(55,255,139,0.06)' }}>
          <span className="text-xs" style={{ color: '#5a5f6b' }}>{r.label}</span>
          <span className="text-xs font-medium" style={{ color: r.value === 'Enabled' ? '#37ff8b' : r.value === 'Not Connected' ? '#f87171' : '#5a5f6b' }}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Backend Provider Config Panel ───────────────────────────
const BACKEND_PROVIDERS = [
  { id: 'supabase', name: 'Supabase',              icon: 'Database', color: '#37ff8b', purpose: 'PostgreSQL DB + Realtime + Auth + Storage',  frontendSafe: true,  note: 'Public URL + anon key only. SQL added in Run 8.' },
  { id: 'firebase', name: 'Firebase',              icon: 'Flame',    color: '#fb923c', purpose: 'Firestore + Auth + Cloud Storage',             frontendSafe: true,  note: 'Public web config only. No admin SDK keys.' },
  { id: 'aws',      name: 'AWS / Custom Backend',  icon: 'Cloud',    color: '#38bdf8', purpose: 'Custom API endpoint / serverless backend',     frontendSafe: false, note: 'Requires backend proxy for auth. No secret keys here.' },
  { id: 'rest',     name: 'Generic REST API',      icon: 'Globe',    color: '#c8ccd2', purpose: 'Custom CRM / monitoring / intelligence API',   frontendSafe: true,  note: 'Public/client tokens only. Secret keys blocked.' },
  { id: 'local',    name: 'Local-only Fallback',   icon: 'HardDrive',color: '#37ff8b', purpose: 'Local storage + offline PWA — no cloud sync',  frontendSafe: true,  note: 'Always available. No backend required.' },
]

function BackendProviderSection({ isDemo }) {
  const { backendConfig, testResults } = useConfigStore()
  const [active, setActive] = useState(null)

  return (
    <div className="space-y-3">
      {/* Provider list */}
      <div className="space-y-2">
        {BACKEND_PROVIDERS.map(p => {
          const saved      = backendConfig?.[p.id]
          const testResult = testResults?.[p.id]
          const status     = saved?.status === 'saved_locally' ? 'saved_locally' : (isDemo ? 'demo' : 'not_configured')
          const isOpen     = active === p.id

          return (
            <div key={p.id} className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.92)', border: `1px solid ${isOpen ? 'rgba(214,168,79,0.25)' : 'rgba(214,168,79,0.07)'}` }}>
              {/* Row header */}
              <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setActive(isOpen ? null : p.id)}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${p.color}0d`, border: `1px solid ${p.color}22` }}>
                  <Icon name={p.icon} size={15} style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{p.name}</span>
                    {isDemo && <DemoBadge />}
                    {!p.frontendSafe && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>Proxy Required</span>
                    )}
                  </div>
                  <div className="text-[10px] mt-0.5 truncate" style={{ color: '#5a5f6b' }}>{p.purpose}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={testResult?.status || status} />
                  <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={14} style={{ color: '#5a5f6b' }} />
                </div>
              </button>
              {/* Config form */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(214,168,79,0.08)' }}>
                  <p className="text-[10px] pt-3" style={{ color: '#5a5f6b' }}>{p.note}</p>
                  {p.id === 'supabase' && <SupabaseConfig saved={backendConfig} testResult={testResults} isDemo={isDemo} />}
                  {p.id === 'firebase' && <FirebaseConfig saved={backendConfig} testResult={testResults} />}
                  {p.id === 'aws'      && <AwsConfig      saved={backendConfig} testResult={testResults} />}
                  {p.id === 'rest'     && <RestApiConfig  saved={backendConfig} testResult={testResults} />}
                  {p.id === 'local'    && <LocalFallbackCard saved={backendConfig} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — Reputation Monitoring API Providers
// ═══════════════════════════════════════════════════════════════
const MONITORING_PROVIDER_DEFS = [
  { id: 'googleSearch',   name: 'Google Custom Search API',       icon: 'Search',    color: '#38bdf8', requiresProxy: true,  entityTypes: ['Company','Brand','Person','Domain']  },
  { id: 'bingSearch',     name: 'Bing Web Search API',            icon: 'Search',    color: '#38bdf8', requiresProxy: true,  entityTypes: ['Company','Brand','Person','Domain']  },
  { id: 'newsApi',        name: 'News API',                       icon: 'Newspaper', color: '#d6a84f', requiresProxy: true,  entityTypes: ['Company','Brand','Person','Project'] },
  { id: 'gdelt',          name: 'GDELT Public News Intelligence', icon: 'Globe',     color: '#c8ccd2', requiresProxy: false, entityTypes: ['Company','Brand','Public Figure']    },
  { id: 'socialMention',  name: 'Social Mention Monitoring',      icon: 'MessageCircle', color: '#8f5cff', requiresProxy: true,  entityTypes: ['Brand','Person','Product']       },
  { id: 'reviews',        name: 'Review Platform Monitoring',     icon: 'Star',      color: '#fbbf24', requiresProxy: true,  entityTypes: ['Company','Brand','Product']          },
  { id: 'companiesHouse', name: 'Companies House / Registry',     icon: 'Building',  color: '#37ff8b', requiresProxy: false, entityTypes: ['Company','Organisation']             },
  { id: 'domainMonitor',  name: 'Domain / Website Monitor',       icon: 'Globe2',    color: '#38bdf8', requiresProxy: false, entityTypes: ['Domain','Project','Brand']           },
  { id: 'rssFeed',        name: 'RSS Feed Monitor',               icon: 'Rss',       color: '#fb923c', requiresProxy: false, entityTypes: ['Brand','Person','Domain','Project']  },
  { id: 'webhookCustom',  name: 'Custom Webhook / Endpoint',      icon: 'Webhook',   color: '#c8ccd2', requiresProxy: false, entityTypes: ['any']                               },
]

function MonitoringProviderCard({ provider, savedConfig, testResult, isDemo }) {
  const { saveMonitoringProvider, saveTestResult, logGuardEvent } = useConfigStore()
  const guard = useGuard()
  const [expanded, setExpanded] = useState(false)
  const init = savedConfig || {}
  const [apiUrl,   setApiUrl]   = useState(init.apiUrl || '')
  const [apiKey,   setApiKey]   = useState(init.apiKey || '')
  const [keywords, setKeywords] = useState(init.monitoredKeywords || '')
  const [saving,   setSaving]   = useState(false)
  const [testing,  setTesting]  = useState(false)

  const status = savedConfig?.status || (isDemo ? 'demo' : 'not_configured')

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      saveMonitoringProvider(provider.id, { apiUrl, apiKey, monitoredKeywords: keywords, requiresProxy: provider.requiresProxy, status: 'saved_locally' })
      setSaving(false)
    }, 400)
  }
  const handleTest = () => {
    setTesting(true)
    setTimeout(() => {
      const result = { status: 'validation_passed', message: 'Client-side validation passed. Live API test requires backend proxy/server setup.' }
      if (provider.requiresProxy) result.message = 'Requires backend proxy — validation passed. Live test available after server setup.'
      if (!apiUrl && !apiKey) { result.status = 'validation_failed'; result.message = 'No configuration saved yet.' }
      saveTestResult(provider.id, result)
      setTesting(false)
    }, 600)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.9)', border: `1px solid ${expanded ? 'rgba(214,168,79,0.2)' : 'rgba(214,168,79,0.06)'}` }}>
      <button className="w-full flex items-center gap-3 p-3.5 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${provider.color}0d`, border: `1px solid ${provider.color}22` }}>
          <Icon name={provider.icon} size={13} style={{ color: provider.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{provider.name}</span>
            {provider.requiresProxy && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.15)' }}>Proxy</span>
            )}
          </div>
          <div className="text-[9px] mt-0.5" style={{ color: '#3a3f4b' }}>{provider.entityTypes.join(' · ')}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={testResult?.status || status} />
          <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={12} style={{ color: '#5a5f6b' }} />
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2.5" style={{ borderTop: '1px solid rgba(214,168,79,0.06)' }}>
          <div className="pt-2 space-y-2">
            <InputField label="API Base URL" value={apiUrl} onChange={setApiUrl} placeholder="https://api.provider.com/v1" guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
            {!provider.requiresProxy && (
              <InputField label="API Key / Token (if public-safe)" value={apiKey} onChange={setApiKey} placeholder="Public/client-side key only" hint="If this provider requires a secret key, use a backend proxy instead." guardCheck={guard} onGuardBlock={(r) => logGuardEvent({ type: 'blocked', reason: r })} />
            )}
            {provider.requiresProxy && (
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <Icon name="Server" size={11} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <p className="text-[10px]" style={{ color: '#fbbf24' }}>This provider requires a backend proxy. API keys for this provider must be stored server-side, not in frontend config.</p>
              </div>
            )}
            <InputField label="Monitored Keywords / Entities (comma-separated)" value={keywords} onChange={setKeywords} placeholder="Brand Name, @handle, competitor, product" hint="Keywords used to scope monitoring for this provider slot." />
          </div>
          {testResult?.[provider.id] && (
            <div className="flex items-center gap-2 p-2 rounded-lg" style={testResult[provider.id].status.includes('passed') ? { background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.15)' } : { background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
              <Icon name={testResult[provider.id].status.includes('passed') ? 'CheckCircle' : 'XCircle'} size={12} style={{ color: testResult[provider.id].status.includes('passed') ? '#37ff8b' : '#f87171' }} />
              <span className="text-[10px]" style={{ color: '#c8ccd2' }}>{testResult[provider.id].message}</span>
            </div>
          )}
          {savedConfig?.apiKey && (
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.08)' }}>
              <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Saved key:</span>
              <MaskedValue value={savedConfig.apiKey} />
            </div>
          )}
          <div className="flex gap-2">
            <SmBtn onClick={handleSave} variant="gold" loading={saving}><Icon name="Save" size={11} />Save</SmBtn>
            <SmBtn onClick={handleTest} variant="green" loading={testing}><Icon name="Zap" size={11} />Test</SmBtn>
          </div>
        </div>
      )}
    </div>
  )
}

function MonitoringSection({ isDemo }) {
  const { monitoringProviders, testResults } = useConfigStore()
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
        <Icon name="ShieldAlert" size={13} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px] leading-relaxed" style={{ color: '#f87171' }}>
          Monitoring should only be configured for <strong>owned brands, authorised clients, public information sources, or lawful business/reputation purposes.</strong> Do not use TrustSheild OS™ for harassment, private surveillance, deception, or unauthorised tracking.
        </p>
      </div>
      <div className="space-y-2">
        {MONITORING_PROVIDER_DEFS.map(p => (
          <MonitoringProviderCard
            key={p.id}
            provider={p}
            savedConfig={monitoringProviders?.[p.id]}
            testResult={testResults}
            isDemo={isDemo}
          />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — Tracked Entities
// ═══════════════════════════════════════════════════════════════
const ENTITY_TYPES    = ['Company','Brand','Person','Project','Product','Domain','Public Figure','Organisation']
const AUTH_SCOPES     = ['owned_brand','client_approved','public_figure_public_info','internal_organisation','do_not_monitor']
const AUTH_SCOPE_LABELS = { owned_brand: 'Owned Brand', client_approved: 'Client Approved', public_figure_public_info: 'Public Figure / Public Info', internal_organisation: 'Internal Organisation', do_not_monitor: 'Do Not Monitor — Auth Missing' }
const SENSITIVITIES   = ['Low','Medium','High','Critical']

const BLANK_ENTITY = { entityType: 'Company', displayName: '', authorisationScope: 'owned_brand', keywords: '', domains: '', publicUrls: '', reviewUrls: '', region: '', enabledProviders: [], alertSensitivity: 'Medium', consentStatus: '', notes: '', status: 'Live Ready' }

function EntityForm({ onCreated, onCancel }) {
  const { createTrackedEntity } = useConfigStore()
  const [form, setForm] = useState(BLANK_ENTITY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const canSubmit = form.displayName.trim().length >= 2 && form.authorisationScope !== 'do_not_monitor'

  const handleCreate = () => {
    setSaving(true)
    setTimeout(() => {
      const entity = createTrackedEntity({
        ...form,
        keywords:   form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        domains:    form.domains.split(',').map(d => d.trim()).filter(Boolean),
        publicUrls: form.publicUrls.split(',').map(u => u.trim()).filter(Boolean),
        reviewUrls: form.reviewUrls.split(',').map(u => u.trim()).filter(Boolean),
        source: 'live',
      })
      setSaving(false)
      onCreated?.(entity)
    }, 450)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.95)', border: '1px solid rgba(214,168,79,0.2)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.1)' }}>
        <div className="flex items-center gap-2">
          <Icon name="Plus" size={14} style={{ color: '#d6a84f' }} />
          <span className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>Add Tracked Entity</span>
        </div>
        <button onClick={onCancel} style={{ color: '#5a5f6b' }}><Icon name="X" size={14} /></button>
      </div>
      <div className="p-4 space-y-3">
        {/* Auth warning */}
        {form.authorisationScope === 'do_not_monitor' && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)' }}>
            <Icon name="AlertOctagon" size={13} style={{ color: '#f87171' }} />
            <span className="text-xs" style={{ color: '#f87171' }}>Authorisation is missing. This entity cannot be marked active for monitoring.</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField label="Display Name" value={form.displayName} onChange={v => set('displayName', v)} placeholder="e.g. Acme Corp" required />
          <SelectField label="Entity Type" value={form.entityType} onChange={v => set('entityType', v)} options={ENTITY_TYPES} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField label="Authorisation Scope *" value={form.authorisationScope} onChange={v => set('authorisationScope', v)} options={AUTH_SCOPES.map(s => ({ value: s, label: AUTH_SCOPE_LABELS[s] }))} />
          <SelectField label="Alert Sensitivity" value={form.alertSensitivity} onChange={v => set('alertSensitivity', v)} options={SENSITIVITIES} />
        </div>
        <InputField label="Keywords / Aliases (comma-separated)" value={form.keywords} onChange={v => set('keywords', v)} placeholder="Brand Name, @handle, product" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField label="Domains (comma-separated)" value={form.domains} onChange={v => set('domains', v)} placeholder="example.com, brand.co.uk" />
          <InputField label="Region (optional)" value={form.region} onChange={v => set('region', v)} placeholder="UK, Global, EU" />
        </div>
        <InputField label="Notes" value={form.notes} onChange={v => set('notes', v)} placeholder="Monitoring context and authorisation notes…" multiline />
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
          <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[10px]" style={{ color: '#8f5cff' }}>Monitoring is for owned brands, authorised clients, public information, or lawful business purposes only. No private surveillance, stalking, or unauthorised tracking.</p>
        </div>
        <div className="flex gap-2">
          <SmBtn onClick={handleCreate} variant="green" disabled={!canSubmit} loading={saving}>
            <Icon name="Plus" size={12} />Add Entity
          </SmBtn>
          <SmBtn onClick={onCancel} variant="ghost"><Icon name="X" size={12} />Cancel</SmBtn>
        </div>
      </div>
    </div>
  )
}

function EntityCard({ entity, isDemo, onMapProviders }) {
  const { updateTrackedEntity } = useConfigStore()
  const scopeColor = entity.authorisationScope === 'do_not_monitor' ? '#f87171' : entity.authorisationScope === 'client_approved' || entity.authorisationScope === 'owned_brand' ? '#37ff8b' : '#fbbf24'
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.9)', border: `1px solid ${entity._demo ? 'rgba(143,92,255,0.15)' : 'rgba(55,255,139,0.12)'}` }}>
      <div className="p-4 space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            style={{ background: 'rgba(214,168,79,0.08)', border: '1px solid rgba(214,168,79,0.2)', color: '#d6a84f' }}>
            {entity.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{entity.displayName}</div>
            <div className="text-xs" style={{ color: '#5a5f6b' }}>{entity.entityType}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {entity._demo && <DemoBadge />}
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ color: scopeColor, background: `${scopeColor}12`, border: `1px solid ${scopeColor}30` }}>
              {AUTH_SCOPE_LABELS[entity.authorisationScope] || entity.authorisationScope}
            </span>
          </div>
        </div>
        <div className="text-[10px] space-y-1">
          <div className="flex justify-between"><span style={{ color: '#5a5f6b' }}>Alert</span><span style={{ color: entity.alertSensitivity === 'Critical' ? '#f87171' : entity.alertSensitivity === 'High' ? '#fb923c' : '#fbbf24' }}>{entity.alertSensitivity}</span></div>
          {entity.keywords?.length > 0 && <div className="flex justify-between"><span style={{ color: '#5a5f6b' }}>Keywords</span><span className="truncate max-w-[160px] text-right" style={{ color: '#a8adb7' }}>{entity.keywords.join(', ')}</span></div>}
          <div className="flex justify-between"><span style={{ color: '#5a5f6b' }}>Providers</span><span style={{ color: entity.enabledProviders?.length > 0 ? '#37ff8b' : '#5a5f6b' }}>{entity.enabledProviders?.length || 0} configured</span></div>
        </div>
        <SmBtn onClick={() => onMapProviders(entity)} variant="purple" fullWidth><Icon name="Link" size={11} />Map API Providers</SmBtn>
      </div>
    </div>
  )
}

function EntityProviderMapper({ entity, onDone }) {
  const { entityProviderMap, saveEntityProviderMap } = useConfigStore()
  const current = entityProviderMap?.[entity.id] || []
  const [selected, setSelected] = useState(current)
  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(8,8,14,0.97)', border: '1px solid rgba(143,92,255,0.2)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(143,92,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <Icon name="Link" size={14} style={{ color: '#8f5cff' }} />
          <span className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>Map Providers — {entity.displayName}</span>
        </div>
        <button onClick={onDone} style={{ color: '#5a5f6b' }}><Icon name="X" size={14} /></button>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-[10px]" style={{ color: '#5a5f6b' }}>Select which monitoring API providers should be applied to this entity.</p>
        <div className="space-y-1.5">
          {MONITORING_PROVIDER_DEFS.map(p => {
            const on = selected.includes(p.id)
            return (
              <button key={p.id} onClick={() => toggle(p.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all"
                style={{ background: on ? 'rgba(143,92,255,0.1)' : 'rgba(13,13,18,0.6)', border: `1px solid ${on ? 'rgba(143,92,255,0.3)' : 'rgba(214,168,79,0.06)'}` }}>
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: on ? 'rgba(143,92,255,0.2)' : 'transparent', border: `1px solid ${on ? 'rgba(143,92,255,0.4)' : 'rgba(90,95,107,0.25)'}` }}>
                  {on && <Icon name="Check" size={11} style={{ color: '#8f5cff' }} />}
                </div>
                <span className="text-xs flex-1" style={{ color: on ? '#f5f5f2' : '#5a5f6b' }}>{p.name}</span>
                {p.requiresProxy && <span className="text-[9px]" style={{ color: '#fbbf24' }}>Proxy</span>}
              </button>
            )
          })}
        </div>
        <SmBtn onClick={() => { saveEntityProviderMap(entity.id, selected); onDone() }} variant="purple" fullWidth>
          <Icon name="Save" size={12} />Save Mapping
        </SmBtn>
      </div>
    </div>
  )
}

function TrackedEntitiesSection({ isDemo }) {
  const { trackedEntities } = useConfigStore()
  const [showForm,  setShowForm]  = useState(false)
  const [mapper,    setMapper]    = useState(null)
  const [toast,     setToast]     = useState(null)

  const viewEntities = isDemo ? (trackedEntities || []) : (trackedEntities || []).filter(e => e.source === 'live' || !e._demo)

  const handleCreated = (e) => {
    setShowForm(false)
    setToast(`Entity added: ${e.displayName}`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-3">
      {/* Ethical notice */}
      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
        <Icon name="ShieldAlert" size={13} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px]" style={{ color: '#f87171' }}>Only add entities you are authorised to monitor: owned brands, client-approved organisations, or public information sources. No private surveillance, doxxing, or unauthorised tracking.</p>
      </div>
      {toast && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(55,255,139,0.07)', border: '1px solid rgba(55,255,139,0.2)' }}>
          <Icon name="CheckCircle" size={12} style={{ color: '#37ff8b' }} />
          <span className="text-xs" style={{ color: '#f5f5f2' }}>{toast}</span>
        </div>
      )}
      {/* Mapper modal */}
      {mapper && <EntityProviderMapper entity={mapper} onDone={() => setMapper(null)} />}
      {/* Create form */}
      {showForm && <EntityForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />}
      {/* Entity grid */}
      {!showForm && !mapper && (
        <>
          <SmBtn onClick={() => setShowForm(true)} variant="gold"><Icon name="Plus" size={12} />Add Entity</SmBtn>
          {viewEntities.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(214,168,79,0.06)', border: '1px solid rgba(214,168,79,0.1)' }}>
                <Icon name="Building" size={20} style={{ color: 'rgba(214,168,79,0.2)' }} />
              </div>
              <div className="text-sm font-medium text-center" style={{ color: '#5a5f6b' }}>{isDemo ? 'No entities loaded.' : 'No live tracked entities yet.'}</div>
              <div className="text-xs text-center" style={{ color: '#3a3f4b' }}>Add companies, brands, or public figures to configure reputation monitoring.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {viewEntities.map(e => <EntityCard key={e.id} entity={e} isDemo={isDemo} onMapProviders={setMapper} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4 — API Status Dashboard
// ═══════════════════════════════════════════════════════════════
function ApiStatusDashboard() {
  const { backendConfig, monitoringProviders, testResults } = useConfigStore()

  const ALL_PROVIDERS = [
    ...BACKEND_PROVIDERS.map(p => ({ ...p, category: 'Backend' })),
    ...MONITORING_PROVIDER_DEFS.map(p => ({ ...p, category: 'Monitoring' })),
  ]

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="space-y-1.5 min-w-0">
          {/* Header */}
          <div className="grid grid-cols-4 gap-2 px-3 py-1">
            {['Provider', 'Type', 'Status', 'Last Tested'].map(h => (
              <div key={h} className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(214,168,79,0.4)' }}>{h}</div>
            ))}
          </div>
          {ALL_PROVIDERS.map(p => {
            const saved   = p.category === 'Backend' ? backendConfig?.[p.id] : monitoringProviders?.[p.id]
            const test    = testResults?.[p.id]
            const status  = test?.status || saved?.status || 'not_configured'
            return (
              <div key={p.id} className="grid grid-cols-4 gap-2 items-center px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(13,13,18,0.7)', border: '1px solid rgba(214,168,79,0.05)' }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon name={p.icon} size={11} style={{ color: p.color, flexShrink: 0 }} />
                  <span className="text-[10px] truncate" style={{ color: '#c8ccd2' }}>{p.name}</span>
                </div>
                <span className="text-[9px]" style={{ color: '#5a5f6b' }}>{p.category}</span>
                <StatusBadge status={status} />
                <span className="text-[10px]" style={{ color: '#3a3f4b' }}>{test?.testedAt ? timeAgo(test.testedAt) : '—'}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5 — 4P3X API Config Guard™ Event Log
// ═══════════════════════════════════════════════════════════════
function ConfigGuardLog() {
  const { guardEvents } = useConfigStore()
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <Icon name="ShieldOff" size={14} style={{ color: '#f87171', flexShrink: 0 }} />
        <div>
          <div className="text-sm font-semibold" style={{ color: '#f87171' }}>4P3X API Config Guard™</div>
          <p className="text-[10px] mt-0.5" style={{ color: '#b95c5c' }}>Prevents backend-only secrets (service role keys, private keys, secret API keys) from being saved in frontend configuration.</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {(!guardEvents || guardEvents.length === 0) ? (
          <div className="flex items-center gap-2 px-3 py-4 rounded-xl" style={{ background: 'rgba(55,255,139,0.04)', border: '1px solid rgba(55,255,139,0.1)' }}>
            <Icon name="CheckCircle" size={13} style={{ color: '#37ff8b' }} />
            <span className="text-xs" style={{ color: '#5a5f6b' }}>No guard events — no unsafe secrets have been attempted.</span>
          </div>
        ) : guardEvents.map(e => (
          <div key={e.id} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <Icon name="ShieldOff" size={12} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold" style={{ color: '#f87171' }}>Blocked — {e.reason}</div>
              <div className="text-[9px] mt-0.5" style={{ color: '#5a5f6b' }}>{timeAgo(e.ts)}{e.preview ? ` · Preview: ${e.preview}` : ''}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] px-1" style={{ color: '#3a3f4b' }}>
        This is a frontend safety guard, not a complete security system. Production secrets require backend/server-side storage.
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — API Config Panel
// ═══════════════════════════════════════════════════════════════
const CONFIG_TABS = [
  { key: 'backend',    label: 'Backend Providers', icon: 'Database'  },
  { key: 'monitoring', label: 'Monitoring APIs',   icon: 'Search'    },
  { key: 'entities',   label: 'Tracked Entities',  icon: 'Building'  },
  { key: 'status',     label: 'API Status',         icon: 'Activity'  },
  { key: 'guard',      label: '4P3X Guard™',        icon: 'ShieldOff' },
]

export default function ApiConfigPanel({ isDemo }) {
  const [activeTab, setActiveTab] = useState('backend')
  const { seedConfigData } = useConfigStore()

  // Seed demo config examples on first load if needed
  // Import happens in Dashboard root, not here
  // seedConfigData is called from Dashboard root useEffect

  return (
    <div className="space-y-4">
      {/* Mode banner */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl flex-wrap gap-3"
        style={isDemo ? { background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.18)' } : { background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.18)' }}>
        <div className="flex items-center gap-2">
          <Icon name={isDemo ? 'FlaskConical' : 'Radio'} size={14} style={{ color: isDemo ? '#8f5cff' : '#37ff8b' }} />
          <span className="text-sm font-semibold" style={{ color: isDemo ? '#8f5cff' : '#37ff8b' }}>
            {isDemo ? 'Demo Mode — Configuration examples visible' : 'Live Mode — Backend configuration required'}
          </span>
        </div>
        {isDemo
          ? <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(143,92,255,0.12)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' }}>Demo Config Preview</span>
          : <span className="text-[10px] px-2 py-0.5 rounded animate-pulse" style={{ background: 'rgba(55,255,139,0.1)', color: '#37ff8b', border: '1px solid rgba(55,255,139,0.3)' }}>Backend Required</span>
        }
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CONFIG_TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={activeTab === t.key
              ? { background: 'rgba(214,168,79,0.12)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.3)' }
              : { color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }}>
            <Icon name={t.icon} size={11} />{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'backend'    && <BackendProviderSection isDemo={isDemo} />}
      {activeTab === 'monitoring' && <MonitoringSection isDemo={isDemo} />}
      {activeTab === 'entities'   && <TrackedEntitiesSection isDemo={isDemo} />}
      {activeTab === 'status'     && <ApiStatusDashboard />}
      {activeTab === 'guard'      && <ConfigGuardLog />}

      {/* Footer advisory */}
      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px]" style={{ color: '#8f5cff' }}>{APP_CONFIG.aiAdvisory}</p>
      </div>
    </div>
  )
}
