/**
 * ============================================================
 * TrustSheild OS™ — Dashboard Task Configuration Panel
 * Run 4 — Dashboard-configurable PWA Tasks/Actions
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Used inside pages_Dashboard.jsx on the 'tasks' tab.
 * Replaces the old TasksSection (legacy demo seed view).
 * Reads/writes through useTaskStore (trustsheild_tasks key).
 * Legacy useTrustStore.tasks (seed demo) preserved untouched.
 * ============================================================
 */

import { useState, useCallback } from 'react'
import Icon from './components_ui_Icon'
import { useTaskStore } from './core_storage'
import { TASK_TEMPLATES } from './data_trustsheild_demo'
import APP_CONFIG from './config_app'

// ─── Constants ────────────────────────────────────────────────
const TASK_TYPES = Object.values(APP_CONFIG.pwaTaskTypes)

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']
const DUE_OPTIONS      = ['No Due Date', 'Due Soon', 'Overdue', 'Urgent']
const STATUS_OPTIONS   = ['Draft', 'Sent to PWA', 'In Progress', 'Received', 'Submitted', 'Complete', 'Escalated', 'Needs Changes', 'Approved']

const HUMAN_REVIEW_TYPES = [
  'Approve Draft Response', 'Review Draft Response', 'Legal/PR Review Request',
  'Confirm Stakeholder Update', APP_CONFIG.pwaTaskTypes?.approveDraft,
]

// ─── Colour maps ──────────────────────────────────────────────
const RISK_COLOR = {
  Critical: { text: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  High:     { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
  Medium:   { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  },
  Low:      { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)'  },
}
const STATUS_COLOR = {
  'Draft':          { text: '#5a5f6b', bg: 'rgba(90,95,107,0.12)',   border: 'rgba(90,95,107,0.2)'   },
  'Sent to PWA':    { text: '#d6a84f', bg: 'rgba(214,168,79,0.1)',   border: 'rgba(214,168,79,0.25)' },
  'In Progress':    { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)' },
  'Received':       { text: '#38bdf8', bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.25)' },
  'Submitted':      { text: '#8f5cff', bg: 'rgba(143,92,255,0.1)',   border: 'rgba(143,92,255,0.25)' },
  'Complete':       { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)' },
  'Escalated':      { text: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  'Needs Changes':  { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
  'Approved':       { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)'  },
}
const FEED_COLORS = {
  green:  '#37ff8b', red: '#f87171', gold: '#d6a84f',
  purple: '#8f5cff', amber: '#fbbf24', silver: '#c8ccd2',
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
function StatusPill({ status }) {
  const s = STATUS_COLOR[status] || { text: '#a8adb7', bg: 'rgba(168,173,183,0.08)', border: 'rgba(168,173,183,0.2)' }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      {status}
    </span>
  )
}
function PriorityPill({ priority }) {
  const s = RISK_COLOR[priority] || RISK_COLOR.Low
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {priority}
    </span>
  )
}
function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: 'rgba(143,92,255,0.1)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' }}>
      <span className="w-1 h-1 rounded-full" style={{ background: '#8f5cff' }} />
      Demo
    </span>
  )
}
function HumanReviewBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
      <Icon name="ShieldAlert" size={10} />
      Human Review Required
    </span>
  )
}

function InputField({ label, value, onChange, placeholder, multiline, rows = 3, required }) {
  const s = {
    width: '100%', background: 'rgba(13,13,18,0.8)',
    border: '1px solid rgba(214,168,79,0.18)', borderRadius: 8,
    padding: '10px 12px', fontSize: '0.8rem', color: '#f5f5f2',
    outline: 'none', fontFamily: 'Inter, sans-serif',
    resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? 72 : undefined,
  }
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>
          {label}{required && <span style={{ color: '#f87171' }}> *</span>}
        </label>
      )}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s}
            onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.45)'}
            onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.18)'}
          />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s}
            onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.45)'}
            onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.18)'}
          />
      }
    </div>
  )
}
function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a5f6b' }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg text-xs"
        style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.18)', padding: '10px 12px', color: '#f5f5f2', outline: 'none', fontFamily: 'Inter, sans-serif', WebkitAppearance: 'none' }}
        onFocus={e => e.target.style.borderColor = 'rgba(214,168,79,0.45)'}
        onBlur={e => e.target.style.borderColor = 'rgba(214,168,79,0.18)'}
      >
        {options.map(o => (
          <option key={o.value || o} value={o.value || o} style={{ background: '#0d0d12', color: '#f5f5f2' }}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  )
}
function SmBtn({ onClick, children, variant = 'gold', disabled = false }) {
  const V = {
    gold:   { c: '#d6a84f', bg: 'rgba(214,168,79,0.08)', b: 'rgba(214,168,79,0.28)' },
    green:  { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.25)' },
    red:    { c: '#f87171', bg: 'rgba(248,113,113,0.08)', b: 'rgba(248,113,113,0.25)' },
    ghost:  { c: '#5a5f6b', bg: 'transparent', b: 'rgba(90,95,107,0.2)' },
    purple: { c: '#8f5cff', bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.25)' },
  }
  const v = V[variant] || V.gold
  return (
    <button onClick={onClick} disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
      style={{ color: disabled ? '#5a5f6b' : v.c, background: v.bg, border: `1px solid ${v.b}`, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  )
}

// ─── Create Task Form ─────────────────────────────────────────
const BLANK_FORM = { title: '', type: 'Submit Situation Update', linkedCaseId: '', linkedCaseTitle: '', assignedPwaId: '', assignedName: '', assignedRole: '', priority: 'Medium', dueStatus: 'Due Soon', instructions: '', requiredAction: '', humanReviewRequired: false }

function CreateTaskForm({ cases, pwaContacts, onCreated, onCancel, prefill = null }) {
  const { createTask } = useTaskStore()
  const [form, setForm] = useState(prefill ? { ...BLANK_FORM, ...prefill } : BLANK_FORM)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCaseChange = (caseId) => {
    const c = cases?.find(c => c.id === caseId)
    set('linkedCaseId', caseId)
    set('linkedCaseTitle', c?.title || '')
  }
  const handleAssigneeChange = (pwaId) => {
    const p = pwaContacts?.find(p => p.id === pwaId)
    set('assignedPwaId', pwaId)
    set('assignedName', p?.displayName || '')
    set('assignedRole', p?.role || '')
  }
  const needsReview = HUMAN_REVIEW_TYPES.includes(form.type)
  const canSubmit = form.title.trim().length >= 3 && form.type && form.assignedPwaId

  const handleSubmit = () => {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => {
      createTask({ ...form, humanReviewRequired: needsReview || form.humanReviewRequired })
      setLoading(false)
      onCreated?.()
    }, 400)
  }

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(13,13,18,0.95)', border: '1px solid rgba(214,168,79,0.2)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(214,168,79,0.1)' }}>
        <div className="flex items-center gap-2">
          <Icon name="Plus" size={14} style={{ color: '#d6a84f' }} />
          <span className="text-sm font-semibold" style={{ color: '#f5f5f2' }}>Configure New PWA Task</span>
          <DemoBadge />
        </div>
        <button onClick={onCancel} style={{ color: '#5a5f6b' }}><Icon name="X" size={14} /></button>
      </div>
      <div className="p-4 space-y-3">
        <InputField label="Task Title" value={form.title} onChange={v => set('title', v)}
          placeholder="e.g. Approve draft response for Vantage Fintech" required />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField label="Task Type" value={form.type} onChange={v => set('type', v)}
            options={TASK_TYPES.map(v => ({ value: v, label: v }))} />
          <SelectField label="Priority" value={form.priority} onChange={v => set('priority', v)}
            options={PRIORITY_OPTIONS.map(v => ({ value: v, label: v }))} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField label="Link to Case" value={form.linkedCaseId} onChange={handleCaseChange}
            options={[{ value: '', label: '— No case —' }, ...(cases || []).map(c => ({ value: c.id, label: c.title.slice(0, 42) }))]} />
          <SelectField label="Due Status" value={form.dueStatus} onChange={v => set('dueStatus', v)}
            options={DUE_OPTIONS.map(v => ({ value: v, label: v }))} />
        </div>

        <SelectField label="Assign to PWA / Contact" value={form.assignedPwaId} onChange={handleAssigneeChange}
          options={[{ value: '', label: '— Select contact —' }, ...(pwaContacts || []).map(p => ({ value: p.id, label: `${p.displayName} (${p.role})` }))]} />

        <InputField label="Instructions" value={form.instructions} onChange={v => set('instructions', v)}
          placeholder="What should the PWA user do?" multiline rows={3} />
        <InputField label="Required Action" value={form.requiredAction} onChange={v => set('requiredAction', v)}
          placeholder="e.g. Approve, escalate, or request changes" />

        {(needsReview || form.humanReviewRequired) && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg"
            style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <Icon name="ShieldAlert" size={13} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <p className="text-[10px]" style={{ color: '#fca5a5' }}>{APP_CONFIG.aiAdvisory}</p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <SmBtn onClick={handleSubmit} variant="gold" disabled={!canSubmit || loading}>
            <Icon name={loading ? 'Loader2' : 'Send'} size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Creating…' : 'Create & Send to PWA'}
          </SmBtn>
          <SmBtn onClick={onCancel} variant="ghost"><Icon name="X" size={12} />Cancel</SmBtn>
        </div>

        <p className="text-[10px]" style={{ color: '#5a5f6b' }}>
          Demo/local sync preview — live multi-device sync is added in later backend runs.
        </p>
      </div>
    </div>
  )
}

// ─── Task Card ────────────────────────────────────────────────
function TaskCard({ task, cases, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const linked = cases?.find(c => c.id === task.linkedCaseId)
  const hasPwaAction = !!task.lastPwaAction

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{ background: 'rgba(13,13,18,0.88)', border: `1px solid ${hasPwaAction ? 'rgba(55,255,139,0.15)' : 'rgba(214,168,79,0.1)'}` }}>
      <div className="flex items-start gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{task.title}</span>
            {task.humanReviewRequired && <HumanReviewBadge />}
            <DemoBadge />
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            <StatusPill status={task.status} />
            <PriorityPill priority={task.priority} />
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{task.dueStatus}</span>
          </div>
          <div className="text-[10px] mt-1.5" style={{ color: '#5a5f6b' }}>
            {task.type} · <span style={{ color: '#c8ccd2' }}>{task.assignedName}</span>
            {linked && <> · <span style={{ color: '#d6a84f' }}>{linked.client}</span></>}
            <span className="ml-2 font-mono">{timeAgo(task.updatedAt)}</span>
          </div>
        </div>
        <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={14} style={{ color: '#5a5f6b', flexShrink: 0, marginTop: 2 }} />
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(214,168,79,0.07)' }}>
          {task.instructions && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: '#5a5f6b' }}>Instructions</div>
              <p className="text-xs leading-relaxed" style={{ color: '#a8adb7' }}>{task.instructions}</p>
            </div>
          )}
          {task.requiredAction && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: '#5a5f6b' }}>Required Action</div>
              <p className="text-xs" style={{ color: '#c8ccd2' }}>{task.requiredAction}</p>
            </div>
          )}
          {hasPwaAction && (
            <div className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.15)' }}>
              <Icon name="Smartphone" size={12} style={{ color: '#37ff8b' }} />
              <span className="text-[10px]" style={{ color: '#37ff8b' }}>
                PWA action: <strong>{task.lastPwaAction}</strong>
              </span>
              <span className="text-[10px] ml-auto" style={{ color: '#5a5f6b' }}>{timeAgo(task.updatedAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>
              Assigned: <span style={{ color: '#c8ccd2' }}>{task.assignedName}</span> ({task.assignedRole})
            </span>
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>
              Created by: <span style={{ color: '#c8ccd2' }}>{task.createdBy}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg text-[10px]"
            style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.12)', color: '#8f5cff' }}>
            <Icon name="Info" size={11} style={{ flexShrink: 0 }} />
            Demo/local sync preview — live multi-device sync is added in later backend runs.
          </div>
          <div className="flex items-center gap-2">
            <SmBtn onClick={() => onDelete(task.id)} variant="red">
              <Icon name="Trash2" size={11} />Delete
            </SmBtn>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Template Card ────────────────────────────────────────────
function TemplateCard({ template, onUse }) {
  return (
    <div className="rounded-xl p-3 space-y-2 transition-all"
      style={{ background: 'rgba(13,13,18,0.85)', border: `1px solid ${template.color}20` }}>
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${template.color}10`, border: `1px solid ${template.color}25` }}>
          <Icon name={template.icon} size={14} style={{ color: template.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold" style={{ color: '#f5f5f2' }}>{template.name}</div>
          <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>{template.type}</div>
        </div>
      </div>
      <p className="text-[10px] leading-relaxed" style={{ color: '#5a5f6b' }}>{template.description}</p>
      <div className="flex items-center gap-2">
        <PriorityPill priority={template.priority} />
        <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{template.dueStatus}</span>
        {template.humanReviewRequired && <HumanReviewBadge />}
      </div>
      <SmBtn onClick={() => onUse(template)} variant="gold">
        <Icon name="Plus" size={11} />
        Create from Template
      </SmBtn>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────
function TaskActivityFeed({ taskActivity }) {
  const sorted = [...(taskActivity || [])].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 20)
  if (!sorted.length) return (
    <div className="flex flex-col items-center py-6 gap-2">
      <Icon name="Radio" size={22} style={{ color: 'rgba(214,168,79,0.15)' }} />
      <span className="text-xs" style={{ color: '#5a5f6b' }}>No task activity yet.</span>
    </div>
  )
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#37ff8b', boxShadow: '0 0 6px rgba(55,255,139,0.8)' }} />
        <span className="text-[10px] font-semibold" style={{ color: '#37ff8b' }}>Task Activity</span>
        <span className="text-[10px] ml-auto" style={{ color: '#5a5f6b' }}>Demo/local</span>
      </div>
      {sorted.map(item => {
        const col = FEED_COLORS[item.color] || '#c8ccd2'
        return (
          <div key={item.id} className="flex items-start gap-2.5 px-3 py-2 rounded-lg"
            style={{ background: `${col}08`, border: `1px solid ${col}15` }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${col}10`, border: `1px solid ${col}20` }}>
              <Icon name={item.icon} size={11} style={{ color: col }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium" style={{ color: '#f5f5f2' }}>{item.text}</div>
              {item.sub && <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>{item.sub}</div>}
            </div>
            <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#5a5f6b' }}>{timeAgo(item.ts)}</span>
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — Task Configuration Panel
// ═══════════════════════════════════════════════════════════════
export default function TaskConfigPanel({ cases }) {
  const { configTasks, taskActivity, pwaContacts, deleteTask } = useTaskStore()
  const [view, setView]       = useState('tasks')   // 'tasks' | 'create' | 'templates' | 'activity'
  const [prefill, setPrefill] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [toast, setToast]     = useState(null)

  const filtered = filterStatus === 'all'
    ? configTasks
    : configTasks?.filter(t => t.status === filterStatus)

  const handleTemplateUse = (tmpl) => {
    setPrefill({
      title: tmpl.name,
      type: tmpl.type,
      priority: tmpl.priority,
      dueStatus: tmpl.dueStatus,
      instructions: tmpl.instructions,
      requiredAction: tmpl.requiredAction,
      humanReviewRequired: tmpl.humanReviewRequired,
    })
    setView('create')
  }

  const handleCreated = () => {
    setView('tasks')
    setPrefill(null)
    setToast('Task created and sent to PWA (demo/local)')
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.25)' }}>
          <Icon name="CheckCircle" size={14} style={{ color: '#37ff8b' }} />
          <span className="text-xs" style={{ color: '#f5f5f2' }}>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-auto" style={{ color: '#5a5f6b' }}><Icon name="X" size={12} /></button>
        </div>
      )}

      {/* Sub-tab bar */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { key: 'tasks',     label: `Tasks (${configTasks?.length ?? 0})`, icon: 'CheckSquare' },
          { key: 'create',    label: 'Create Task',                         icon: 'Plus'        },
          { key: 'templates', label: 'Templates',                           icon: 'BookOpen'    },
          { key: 'activity',  label: 'Activity Feed',                       icon: 'Radio'       },
        ].map(t => (
          <button key={t.key} onClick={() => { setView(t.key); if (t.key !== 'create') setPrefill(null) }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              view === t.key
                ? { background: 'rgba(214,168,79,0.12)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.3)' }
                : { color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }
            }>
            <Icon name={t.icon} size={11} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tasks list ── */}
      {view === 'tasks' && (
        <div className="space-y-3">
          {/* Demo sync notice */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.15)', color: '#8f5cff' }}>
            <Icon name="Info" size={12} style={{ flexShrink: 0 }} />
            Demo/local sync preview — live multi-device sync is added in later backend runs.
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'Sent to PWA', 'In Progress', 'Received', 'Complete', 'Escalated'].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                style={
                  filterStatus === f
                    ? { background: 'rgba(214,168,79,0.15)', color: '#d6a84f', border: '1px solid rgba(214,168,79,0.35)' }
                    : { color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }
                }>
                {f === 'all' ? `All (${configTasks?.length ?? 0})` : f}
              </button>
            ))}
          </div>

          {/* Task cards */}
          {filtered && filtered.length > 0
            ? filtered.map(t => (
                <TaskCard key={t.id} task={t} cases={cases} onDelete={(id) => { deleteTask(id); setToast('Task removed') }} />
              ))
            : (
              <div className="flex flex-col items-center py-10 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(214,168,79,0.06)', border: '1px solid rgba(214,168,79,0.1)' }}>
                  <Icon name="CheckSquare" size={22} style={{ color: 'rgba(214,168,79,0.2)' }} />
                </div>
                <div className="text-sm font-medium" style={{ color: '#5a5f6b' }}>
                  {filterStatus === 'all' ? 'No PWA tasks configured yet.' : `No tasks with status "${filterStatus}".`}
                </div>
                <div className="text-xs" style={{ color: '#3a3f4b' }}>
                  {filterStatus === 'all' ? 'Create a demo task to simulate dashboard-to-PWA action flow.' : 'Try a different filter.'}
                </div>
                {filterStatus === 'all' && (
                  <SmBtn onClick={() => setView('create')} variant="gold">
                    <Icon name="Plus" size={12} />Create Task
                  </SmBtn>
                )}
              </div>
            )
          }
        </div>
      )}

      {/* ── Create task ── */}
      {view === 'create' && (
        <CreateTaskForm
          cases={cases}
          pwaContacts={pwaContacts}
          onCreated={handleCreated}
          onCancel={() => { setView('tasks'); setPrefill(null) }}
          prefill={prefill}
        />
      )}

      {/* ── Templates ── */}
      {view === 'templates' && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#5a5f6b' }}>
            Select a template to pre-fill the Create Task form. All templates focus on ethical reputation protection and crisis response actions only.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TASK_TEMPLATES.map(t => (
              <TemplateCard key={t.id} template={t} onUse={handleTemplateUse} />
            ))}
          </div>
        </div>
      )}

      {/* ── Activity feed ── */}
      {view === 'activity' && (
        <TaskActivityFeed taskActivity={taskActivity} />
      )}

      {/* AI advisory footer */}
      <div className="flex items-start gap-2 p-3 rounded-xl"
        style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
        <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px]" style={{ color: '#8f5cff' }}>{APP_CONFIG.aiAdvisory}</p>
      </div>
    </div>
  )
}
