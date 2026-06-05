/**
 * ============================================================
 * TrustSheild OS™ — PWA Identity Manager
 * Run 5 — Unique PWA ID + Pairing/Sync-Code System
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Dashboard panel for creating and managing PWA identities.
 * Used in pages_Dashboard.jsx on the 'responders' tab.
 * Replaces the legacy RespondersSection display logic.
 * Reads/writes through useIdentityStore (Run 5 SSOT).
 *
 * ⚠️  DEMO/LOCAL ONLY — Pairing codes are local simulation
 *     identifiers only. Secure auth added in later runs.
 * ============================================================
 */

import { useState, useCallback } from 'react'
import Icon from './components_ui_Icon'
import { useIdentityStore, useTaskStore } from './core_storage'
import APP_CONFIG from './config_app'

// ─── Constants ────────────────────────────────────────────────
const ROLE_TYPES = [
  'Client Contact',
  'PR Responder',
  'Legal Contact',
  'Staff Member',
  'Agency Lead',
  'Customer Support Lead',
  'Community Manager',
  'Founder / Business Owner',
  'Internal Communications Contact',
  'Reputation Response Team Member',
]
const SYNC_STATUS_COLORS = {
  'Demo Local': { text: '#37ff8b', bg: 'rgba(55,255,139,0.08)',  border: 'rgba(55,255,139,0.2)'  },
  'Synced Preview': { text: '#37ff8b', bg: 'rgba(55,255,139,0.08)', border: 'rgba(55,255,139,0.2)' },
  'Pending':    { text: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)'  },
  'Offline':    { text: '#5a5f6b', bg: 'rgba(90,95,107,0.1)',    border: 'rgba(90,95,107,0.2)'   },
  'Archived':   { text: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
}

function timeAgo(iso) {
  if (!iso) return '—'
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60)    return `${d}s ago`
  if (d < 3600)  return `${Math.floor(d/60)}m ago`
  if (d < 86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

// ─── Primitives ───────────────────────────────────────────────
function SyncPill({ status }) {
  const s = SYNC_STATUS_COLORS[status] || SYNC_STATUS_COLORS['Offline']
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {status}
    </span>
  )
}
function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: 'rgba(143,92,255,0.1)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' }}>
      <span className="w-1 h-1 rounded-full" style={{ background: '#8f5cff' }} />Demo
    </span>
  )
}
function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })
    } else {
      const el = document.createElement('textarea')
      el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
      setCopied(true); setTimeout(() => setCopied(false), 1800)
    }
  }
  return (
    <button onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all"
      style={{ background: copied ? 'rgba(55,255,139,0.1)' : 'rgba(214,168,79,0.08)', color: copied ? '#37ff8b' : '#d6a84f', border: `1px solid ${copied ? 'rgba(55,255,139,0.25)' : 'rgba(214,168,79,0.25)'}` }}>
      <Icon name={copied ? 'Check' : 'Copy'} size={10} />
      {copied ? 'Copied!' : label}
    </button>
  )
}
function InputField({ label, value, onChange, placeholder, multiline, required }) {
  const s = { width: '100%', background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.18)', borderRadius: 8, padding: '9px 12px', fontSize: '0.8rem', color: '#f5f5f2', outline: 'none', fontFamily: 'Inter, sans-serif', resize: multiline ? 'vertical' : 'none', minHeight: multiline ? 64 : undefined }
  return (
    <div className="space-y-1">
      {label && <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}{required && <span style={{ color: '#f87171' }}> *</span>}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={s} onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.45)'} onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.18)'} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.45)'} onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.18)'} />
      }
    </div>
  )
}
function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.18)', borderRadius: 8, padding: '9px 12px', fontSize: '0.8rem', color: '#f5f5f2', outline: 'none', fontFamily: 'Inter, sans-serif', WebkitAppearance: 'none' }} onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.45)'} onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.18)'}>
        {options.map(o => <option key={o.value || o} value={o.value || o} style={{ background: '#0d0d12', color: '#f5f5f2' }}>{o.label || o}</option>)}
      </select>
    </div>
  )
}
function SmBtn({ onClick, children, variant = 'gold', disabled = false, fullWidth = false }) {
  const V = { gold: { c: '#d6a84f', bg: 'rgba(214,168,79,0.08)', b: 'rgba(214,168,79,0.28)' }, green: { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.25)' }, red: { c: '#f87171', bg: 'rgba(248,113,113,0.08)', b: 'rgba(248,113,113,0.25)' }, ghost: { c: '#5a5f6b', bg: 'transparent', b: 'rgba(90,95,107,0.2)' }, purple: { c: '#8f5cff', bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.25)' } }
  const v = V[variant] || V.gold
  return (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${fullWidth ? 'w-full justify-center' : ''}`} style={{ color: disabled ? '#5a5f6b' : v.c, background: v.bg, border: `1px solid ${v.b}`, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 36 }}>
      {children}
    </button>
  )
}

// ─── Create Identity Form ─────────────────────────────────────
const BLANK = { displayName: '', organisationName: '', roleType: 'Client Contact', contactLabel: '', linkedCaseIds: [], dashboardInstruction: '', notes: '' }

function CreateIdentityForm({ cases, onCreated, onCancel }) {
  const { createIdentity } = useIdentityStore()
  const { addActivity } = useTaskStore()
  const [form, setForm] = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const canSubmit = form.displayName.trim().length >= 2

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = () => {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => {
      const identity = createIdentity(form)
      addActivity?.({
        type: 'identity_created', icon: 'UserPlus', color: 'green',
        text: `PWA identity created: ${identity.displayName} (${identity.id})`,
        sub: `${identity.roleType} · Code: ${identity.pairingCode}`,
        taskId: null,
      })
      setLoading(false)
      onCreated?.(identity)
    }, 450)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.95)', border: '1px solid rgba(214,168,79,0.2)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.1)' }}>
        <div className="flex items-center gap-2">
          <Icon name="UserPlus" size={14} style={{ color: '#37ff8b' }} />
          <span className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>Create PWA Identity</span>
          <DemoBadge />
        </div>
        <button onClick={onCancel} style={{ color: '#5a5f6b' }}><Icon name="X" size={14} /></button>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField label="Display Name" value={form.displayName} onChange={v => set('displayName', v)} placeholder="e.g. Alex M." required />
          <InputField label="Organisation / Client" value={form.organisationName} onChange={v => set('organisationName', v)} placeholder="e.g. Acme Corp" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField label="Role / Type" value={form.roleType} onChange={v => set('roleType', v)} options={ROLE_TYPES.map(r => ({ value: r, label: r }))} />
          <InputField label="Contact Label" value={form.contactLabel} onChange={v => set('contactLabel', v)} placeholder="e.g. Primary Approval Contact" />
        </div>
        <InputField label="Dashboard Instruction" value={form.dashboardInstruction} onChange={v => set('dashboardInstruction', v)} placeholder="What should this responder focus on?" multiline />
        <InputField label="Notes" value={form.notes} onChange={v => set('notes', v)} placeholder="Internal notes about this PWA contact…" multiline />

        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.15)' }}>
          <Icon name="Zap" size={12} style={{ color: '#37ff8b', flexShrink: 0 }} />
          <p className="text-[10px]" style={{ color: '#37ff8b' }}>A unique PWA ID and pairing code will be auto-generated on creation.</p>
        </div>
        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
          <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[10px]" style={{ color: '#8f5cff' }}>Demo pairing codes are for local simulation only. Real secure user access requires backend live mode.</p>
        </div>

        <div className="flex items-center gap-2">
          <SmBtn onClick={handleSubmit} variant="green" disabled={!canSubmit || loading}>
            <Icon name={loading ? 'Loader2' : 'UserPlus'} size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Creating…' : 'Create PWA Identity'}
          </SmBtn>
          <SmBtn onClick={onCancel} variant="ghost"><Icon name="X" size={12} />Cancel</SmBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Identity Config Panel (per identity) ─────────────────────
function IdentityConfigPanel({ identity, pwaConfig, cases, onClose }) {
  const { savePwaConfig, updateIdentityRecord } = useIdentityStore()
  const [instruction, setInstruction] = useState(identity.dashboardInstruction || '')
  const cfg = pwaConfig?.[identity.id] || {}
  const [canApprove, setCanApprove] = useState(cfg.draftApprovalPermission ?? identity.permissions?.canApproveDrafts ?? false)
  const [canEscalate, setCanEscalate] = useState(cfg.escalationPermission ?? identity.permissions?.canRequestEscalation ?? true)
  const [canEvidence, setCanEvidence] = useState(cfg.evidencePermission ?? identity.permissions?.canAddEvidence ?? true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    savePwaConfig(identity.id, { allowedTaskTypes: 'all', status: 'Active', escalationPermission: canEscalate, draftApprovalPermission: canApprove, evidencePermission: canEvidence })
    updateIdentityRecord(identity.id, { dashboardInstruction: instruction, permissions: { canSubmitUpdates: true, canAddEvidence: canEvidence, canApproveDrafts: canApprove, canRequestEscalation: canEscalate } })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const assignedCases = (cases || []).filter(c => identity.linkedCaseIds?.includes(c.id))

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(8,8,14,0.97)', border: '1px solid rgba(214,168,79,0.2)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.1)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: 'rgba(55,255,139,0.1)', border: '1px solid rgba(55,255,139,0.2)', color: '#37ff8b' }}>{identity.avatar}</div>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{identity.displayName}</div>
            <div className="text-[10px]" style={{ color: '#5a5f6b' }}>{identity.id} · {identity.roleType}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: '#5a5f6b' }}><Icon name="X" size={14} /></button>
      </div>
      <div className="p-4 space-y-4">
        {/* Pairing code */}
        <div className="p-3 rounded-xl" style={{ background: 'rgba(214,168,79,0.05)', border: '1px solid rgba(214,168,79,0.15)' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a5f6b' }}>Demo Pairing Code</div>
          <div className="flex items-center justify-between gap-3">
            <code className="text-base font-mono font-bold tracking-wider" style={{ color: '#d6a84f' }}>{identity.pairingCode}</code>
            <CopyButton text={identity.pairingCode} label="Copy Code" />
          </div>
          <p className="text-[10px] mt-2" style={{ color: '#5a5f6b' }}>Demo pairing code — backend live sync is added in later runs.</p>
        </div>

        {/* Launch instructions placeholder */}
        <div className="p-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#8f5cff' }}>Share Instructions</div>
          <p className="text-xs" style={{ color: '#a87dff' }}>
            Install TrustSheild Response PWA and enter this demo pairing code: <strong>{identity.pairingCode}</strong>
          </p>
          <p className="text-[10px] mt-1.5" style={{ color: '#5a3f8f' }}>PWA launch link: Available after backend setup (later run).</p>
          <div className="mt-2"><CopyButton text={`Install TrustSheild Response PWA and enter demo pairing code: ${identity.pairingCode}`} label="Copy Instructions" /></div>
        </div>

        {/* Permissions */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a5f6b' }}>Permissions</div>
          <div className="space-y-2">
            {[
              { label: 'Can Submit Updates',    state: true,        disabled: true  },
              { label: 'Can Add Evidence',       state: canEvidence, setter: setCanEvidence },
              { label: 'Can Approve Drafts',     state: canApprove,  setter: setCanApprove  },
              { label: 'Can Request Escalation', state: canEscalate, setter: setCanEscalate },
            ].map(p => (
              <div key={p.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(13,13,18,0.6)', border: '1px solid rgba(214,168,79,0.06)' }}>
                <span className="text-xs" style={{ color: '#c8ccd2' }}>{p.label}</span>
                <button onClick={() => !p.disabled && p.setter?.(!p.state)} className="w-9 h-5 rounded-full transition-all relative flex-shrink-0" style={{ background: p.state ? 'rgba(55,255,139,0.3)' : 'rgba(90,95,107,0.2)', border: `1px solid ${p.state ? 'rgba(55,255,139,0.5)' : 'rgba(90,95,107,0.35)'}`, cursor: p.disabled ? 'not-allowed' : 'pointer' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: p.state ? '#37ff8b' : '#5a5f6b', left: p.state ? 'calc(100% - 18px)' : 2 }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard instruction */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>Dashboard Instruction</label>
          <textarea value={instruction} onChange={e => setInstruction(e.target.value)} rows={3} placeholder="Instructions for this responder…"
            style={{ width: '100%', background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.18)', borderRadius: 8, padding: '9px 12px', fontSize: '0.8rem', color: '#f5f5f2', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
        </div>

        {/* Assigned cases */}
        {assignedCases.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a5f6b' }}>Assigned Cases</div>
            <div className="space-y-1.5">
              {assignedCases.map(c => (
                <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(13,13,18,0.6)', border: '1px solid rgba(214,168,79,0.08)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.riskLevel === 'Critical' ? '#f87171' : c.riskLevel === 'High' ? '#fb923c' : '#fbbf24' }} />
                  <span className="text-xs truncate" style={{ color: '#a8adb7' }}>{c.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <SmBtn onClick={handleSave} variant="gold" fullWidth>
          <Icon name={saved ? 'Check' : 'Save'} size={13} />
          {saved ? 'Saved ✓' : 'Save Configuration'}
        </SmBtn>
      </div>
    </div>
  )
}

// ─── Identity Card ────────────────────────────────────────────
function IdentityCard({ identity, cases, tasks, onConfigure, onAssignTask }) {
  const { deactivateIdentity } = useIdentityStore()
  const [confirming, setConfirming] = useState(false)
  const assignedTasks = (tasks || []).filter(t => t.assignedPwaId === identity.id)
  const pending = assignedTasks.filter(t => !['Complete','Approved','Submitted (Demo)'].includes(t.status)).length
  const assignedCases = (cases || []).filter(c => identity.linkedCaseIds?.includes(c.id))
  const isArchived = identity.status === 'Archived'

  return (
    <div className="rounded-xl overflow-hidden transition-all" style={{ background: 'rgba(13,13,18,0.92)', border: `1px solid ${isArchived ? 'rgba(90,95,107,0.2)' : 'rgba(55,255,139,0.12)'}`, opacity: isArchived ? 0.6 : 1 }}>
      {/* Card header */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.2)', color: '#37ff8b' }}>{identity.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>{identity.displayName}</div>
            <div className="text-xs" style={{ color: '#5a5f6b' }}>{identity.roleType}</div>
            <div className="text-[10px] mt-0.5 truncate" style={{ color: '#3a3f4b' }}>{identity.organisationName}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <SyncPill status={isArchived ? 'Archived' : identity.syncStatus} />
            <DemoBadge />
          </div>
        </div>

        {/* PWA ID + pairing code */}
        <div className="space-y-1.5 p-3 rounded-xl" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px]" style={{ color: '#5a5f6b' }}>PWA ID</div>
              <code className="text-xs font-mono font-bold" style={{ color: '#d6a84f' }}>{identity.id}</code>
            </div>
            <div className="text-right">
              <div className="text-[10px]" style={{ color: '#5a5f6b' }}>Pairing Code</div>
              <code className="text-xs font-mono font-bold" style={{ color: '#d6a84f' }}>{identity.pairingCode}</code>
            </div>
            <CopyButton text={identity.pairingCode} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg py-2" style={{ background: 'rgba(13,13,20,0.6)', border: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-base font-bold font-mono" style={{ color: pending > 0 ? '#fb923c' : '#37ff8b' }}>{pending}</div>
            <div className="text-[9px]" style={{ color: '#5a5f6b' }}>Pending</div>
          </div>
          <div className="rounded-lg py-2" style={{ background: 'rgba(13,13,20,0.6)', border: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-base font-bold font-mono" style={{ color: '#c8ccd2' }}>{assignedTasks.length}</div>
            <div className="text-[9px]" style={{ color: '#5a5f6b' }}>Tasks</div>
          </div>
          <div className="rounded-lg py-2" style={{ background: 'rgba(13,13,20,0.6)', border: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-base font-bold font-mono" style={{ color: '#c8ccd2' }}>{assignedCases.length}</div>
            <div className="text-[9px]" style={{ color: '#5a5f6b' }}>Cases</div>
          </div>
        </div>

        {/* Cases */}
        {assignedCases.length > 0 && (
          <div className="space-y-1">
            {assignedCases.slice(0, 2).map(c => (
              <div key={c.id} className="flex items-center gap-2 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.riskLevel === 'Critical' ? '#f87171' : c.riskLevel === 'High' ? '#fb923c' : '#fbbf24' }} />
                <span className="truncate" style={{ color: '#a8adb7' }}>{c.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer meta */}
        <div className="flex items-center justify-between text-[10px] pt-1" style={{ borderTop: '1px solid rgba(214,168,79,0.06)' }}>
          <span style={{ color: '#5a5f6b' }}>Updated {timeAgo(identity.updatedAt)}</span>
          <span style={{ color: '#5a5f6b' }}>{identity.configurationStatus}</span>
        </div>

        {/* Action buttons */}
        {!isArchived && (
          <div className="grid grid-cols-2 gap-2">
            <SmBtn onClick={() => onConfigure(identity)} variant="gold" fullWidth>
              <Icon name="Settings" size={11} />Configure
            </SmBtn>
            <SmBtn onClick={() => onAssignTask(identity)} variant="purple" fullWidth>
              <Icon name="Plus" size={11} />Assign Task
            </SmBtn>
          </div>
        )}
        {!isArchived && (
          confirming
            ? (
              <div className="flex items-center gap-2">
                <SmBtn onClick={() => { deactivateIdentity(identity.id); setConfirming(false) }} variant="red">
                  <Icon name="Archive" size={11} />Confirm Archive
                </SmBtn>
                <SmBtn onClick={() => setConfirming(false)} variant="ghost"><Icon name="X" size={11} />Cancel</SmBtn>
              </div>
            )
            : <SmBtn onClick={() => setConfirming(true)} variant="ghost" fullWidth><Icon name="Archive" size={11} />Deactivate Demo PWA</SmBtn>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — PWA Identity Manager Panel
// ═══════════════════════════════════════════════════════════════
export default function PwaIdentityManager({ cases }) {
  const { pwaIdentities, taskActivity } = useIdentityStore()
  const { configTasks } = useTaskStore()
  const [view, setView]           = useState('identities')
  const [configTarget, setConfig] = useState(null)
  const [showCreate, setCreate]   = useState(false)
  const [toast, setToast]         = useState(null)
  const { pwaConfig }             = useIdentityStore()

  const activeIds = pwaIdentities?.filter(i => i.status !== 'Archived') || []

  const handleCreated = (identity) => {
    setCreate(false)
    setToast(`✓ PWA identity created: ${identity.displayName} · ${identity.id} · Code: ${identity.pairingCode}`)
  }

  const handleAssignTask = (identity) => {
    setToast(`Open "PWA Task Config" tab to create a task and assign it to ${identity.displayName} (${identity.id}).`)
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(55,255,139,0.07)', border: '1px solid rgba(55,255,139,0.2)' }}>
          <Icon name="CheckCircle" size={14} style={{ color: '#37ff8b', flexShrink: 0, marginTop: 1 }} />
          <span className="text-xs" style={{ color: '#f5f5f2', flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{ color: '#5a5f6b', flexShrink: 0 }}><Icon name="X" size={12} /></button>
        </div>
      )}

      {/* Sub-nav */}
      <div className="flex gap-1.5 flex-wrap items-center">
        {[
          { key: 'identities', label: `Identities (${pwaIdentities?.length ?? 0})`, icon: 'Users' },
          { key: 'create',     label: 'Create New',                                   icon: 'UserPlus' },
        ].map(t => (
          <button key={t.key} onClick={() => setView(t.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={view === t.key ? { background: 'rgba(214,168,79,0.12)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.3)' } : { color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }}>
            <Icon name={t.icon} size={11} />{t.label}
          </button>
        ))}
        <div className="ml-auto">
          <DemoBadge />
        </div>
      </div>

      {/* Demo sync notice */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.15)', color: '#8f5cff' }}>
        <Icon name="Info" size={12} style={{ flexShrink: 0 }} />
        Demo pairing codes are for local simulation only. Real secure user access, authentication, and multi-device sync require backend live mode.
      </div>

      {/* ── Config panel ── */}
      {configTarget && (
        <IdentityConfigPanel identity={configTarget} pwaConfig={pwaConfig} cases={cases} onClose={() => setConfig(null)} />
      )}

      {/* ── Create form ── */}
      {view === 'create' && (
        <CreateIdentityForm cases={cases} onCreated={handleCreated} onCancel={() => setView('identities')} />
      )}

      {/* ── Identity list ── */}
      {view === 'identities' && (
        <div className="space-y-3">
          {pwaIdentities && pwaIdentities.length > 0
            ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {pwaIdentities.map(i => (
                  <IdentityCard
                    key={i.id}
                    identity={i}
                    cases={cases}
                    tasks={configTasks}
                    onConfigure={(id) => setConfig(configTarget?.id === id.id ? null : id)}
                    onAssignTask={handleAssignTask}
                  />
                ))}
              </div>
            )
            : (
              <div className="flex flex-col items-center py-10 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(55,255,139,0.06)', border: '1px solid rgba(55,255,139,0.1)' }}>
                  <Icon name="Users" size={22} style={{ color: 'rgba(55,255,139,0.2)' }} />
                </div>
                <div className="text-sm font-medium" style={{ color: '#5a5f6b' }}>No PWA identities yet.</div>
                <div className="text-xs" style={{ color: '#3a3f4b' }}>Create a demo identity to simulate individual PWA assignment.</div>
                <SmBtn onClick={() => setView('create')} variant="green"><Icon name="UserPlus" size={12} />Create Identity</SmBtn>
              </div>
            )
          }
        </div>
      )}

      {/* AI advisory footer */}
      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px]" style={{ color: '#8f5cff' }}>{APP_CONFIG.aiAdvisory}</p>
      </div>
    </div>
  )
}
