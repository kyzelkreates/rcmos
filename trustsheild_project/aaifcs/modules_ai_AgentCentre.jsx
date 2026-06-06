/**
 * ============================================================
 * TrustSheild OS™ — 4P3X Intelligent AI™ Agent Centre (Run 10)
 * Dashboard AI Advisory Centre
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Replaces the placeholder AIAgentSection from earlier runs.
 * All AI outputs are advisory only. Human review required.
 * Demo mode works without any external API or private keys.
 * ============================================================
 */

import { useState, useCallback } from 'react'
import Icon from './components_ui_Icon'
import { useAIAgentStore, useTrustStore } from './core_storage'
import { AGENT_DEFINITIONS, runAgent, buildAgentInput, runSafetyFilter, aiProviderAdapter } from './services_trustsheild_ai_agents'
import APP_CONFIG from './config_app'

// ─── Shared mini-primitives ───────────────────────────────────
function Card({ children, glow = false, style = {} }) {
  return (
    <div style={{ background: 'rgba(13,13,18,0.95)', border: `1px solid ${glow ? 'rgba(143,92,255,0.2)' : 'rgba(214,168,79,0.08)'}`, borderRadius: 14, ...style }}>
      {children}
    </div>
  )
}
function SmBtn({ onClick, children, variant = 'purple', disabled = false, loading = false, fullWidth = false }) {
  const V = {
    purple: { c: '#8f5cff', bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.28)' },
    gold:   { c: '#d6a84f', bg: 'rgba(214,168,79,0.08)', b: 'rgba(214,168,79,0.28)' },
    green:  { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.25)' },
    red:    { c: '#f87171', bg: 'rgba(248,113,113,0.08)', b: 'rgba(248,113,113,0.25)' },
    ghost:  { c: '#5a5f6b', bg: 'transparent',            b: 'rgba(90,95,107,0.2)' },
  }
  const v = V[variant] || V.purple
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${fullWidth ? 'w-full justify-center' : ''}`}
      style={{ color: disabled ? '#5a5f6b' : v.c, background: v.bg, border: `1px solid ${v.b}`, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 34 }}>
      {loading ? <Icon name="Loader2" size={12} className="animate-spin" /> : children}
    </button>
  )
}
function ReviewBadge({ status }) {
  const S = {
    'new':            { c: '#8f5cff', bg: 'rgba(143,92,255,0.12)', label: 'New Advisory' },
    'reviewed':       { c: '#37ff8b', bg: 'rgba(55,255,139,0.12)', label: 'Reviewed' },
    'accepted':       { c: '#d6a84f', bg: 'rgba(214,168,79,0.12)', label: 'Accepted as Note' },
    'rejected':       { c: '#f87171', bg: 'rgba(248,113,113,0.12)', label: 'Rejected' },
    'needs_review':   { c: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Needs Human Review' },
  }
  const s = S[status] || S['new']
  return <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ color: s.c, background: s.bg, border: `1px solid ${s.c}25` }}>{s.label}</span>
}

// ─── Safety Blocked Banner ─────────────────────────────────────
function SafetyBlockedBanner({ result, onDismiss }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)' }}>
      <Icon name="ShieldX" size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
      <div className="flex-1">
        <div className="text-sm font-bold" style={{ color: '#f87171' }}>⚠ Safety Filter Activated</div>
        <p className="text-xs mt-1" style={{ color: '#c8ccd2' }}>{result.message}</p>
        <div className="mt-2 p-2.5 rounded-lg" style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.2)' }}>
          <div className="text-[10px] font-bold mb-1" style={{ color: '#37ff8b' }}>Suggested safer alternative:</div>
          <p className="text-[10px]" style={{ color: '#a8adb7' }}>{result.alternative}</p>
        </div>
      </div>
      <button onClick={onDismiss} style={{ color: '#5a5f6b' }}><Icon name="X" size={13} /></button>
    </div>
  )
}

// ─── AI Output Card ────────────────────────────────────────────
function AiOutputCard({ result, agentDef, onReview, onDismiss }) {
  const [expanded, setExpanded] = useState(true)
  const output = result.output
  if (!output) return null

  const renderOutput = () => {
    switch (result.agentId) {
      case 'trustTriage': return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: agentDef.color }}>Triage Level:</span>
            <span className="text-sm font-black px-3 py-0.5 rounded-lg" style={{ background: `${agentDef.color}15`, color: agentDef.color, border: `1px solid ${agentDef.color}30` }}>{output.triageLevel}</span>
          </div>
          <p className="text-xs" style={{ color: '#a8adb7' }}>{output.reason}</p>
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.15)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#37ff8b' }}>Recommended Next Action</div>
            <p className="text-xs" style={{ color: '#c8ccd2' }}>{output.nextAction}</p>
          </div>
          {output.missingInfo?.length > 0 && (
            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <div className="text-[10px] font-bold mb-1" style={{ color: '#fbbf24' }}>Missing Information</div>
              {output.missingInfo.map((w,i) => <div key={i} className="flex items-start gap-1.5 mb-1"><Icon name="AlertCircle" size={10} style={{ color: '#fbbf24', marginTop: 1 }} /><span className="text-[10px]" style={{ color: '#a8adb7' }}>{w}</span></div>)}
            </div>
          )}
        </div>
      )
      case 'reputationRisk': return (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: '#a8adb7' }}>{output.riskSummary}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Risk Trend:</span>
            <span className="text-xs font-bold" style={{ color: output.riskTrend === 'worsening' ? '#f87171' : output.riskTrend === 'improving' ? '#37ff8b' : '#fbbf24' }}>{output.riskTrend}</span>
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#f87171' }}>Risk Drivers</div>
            {output.riskDrivers?.map((d,i) => <div key={i} className="flex items-start gap-1.5 mb-0.5"><Icon name="Circle" size={6} style={{ color: '#f87171', marginTop: 4 }} /><span className="text-[10px]" style={{ color: '#a8adb7' }}>{d}</span></div>)}
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(214,168,79,0.05)', border: '1px solid rgba(214,168,79,0.12)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#d6a84f' }}>Suggested Action</div>
            <p className="text-[10px]" style={{ color: '#a8adb7' }}>{output.suggestedAction}</p>
          </div>
        </div>
      )
      case 'crisisResponse': return (
        <div className="space-y-2">
          {output.recommendedActions?.map((a,i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>{a.priority}</div>
              <div>
                <div className="text-xs font-semibold" style={{ color: '#c8ccd2' }}>{a.action}</div>
                <div className="text-[10px]" style={{ color: '#5a5f6b' }}>Owner: {a.owner}</div>
                {a.warning && <div className="text-[10px] mt-0.5" style={{ color: '#f87171' }}>⚠ {a.warning}</div>}
              </div>
            </div>
          ))}
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#f87171' }}>Do NOT Do</div>
            {output.doNotDo?.map((d,i) => <div key={i} className="text-[10px] mb-0.5" style={{ color: '#f87171' }}>✗ {d}</div>)}
          </div>
        </div>
      )
      case 'responseDrafting': return (
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)' }}>
            <p className="text-xs font-bold" style={{ color: '#f87171' }}>{output.draftLabel}</p>
          </div>
          <div className="p-2.5 rounded-lg space-y-1.5" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
            <div className="text-[10px] font-bold" style={{ color: '#8f5cff' }}>Holding Statement Template</div>
            <p className="text-[10px] italic" style={{ color: '#a8adb7' }}>{output.holdingStatement}</p>
          </div>
          <div>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#d6a84f' }}>Draft Outline</div>
            {output.outline?.map((s,i) => <div key={i} className="flex items-start gap-1.5 mb-1"><Icon name="Circle" size={6} style={{ color: '#d6a84f', marginTop: 3 }} /><span className="text-[10px]" style={{ color: '#a8adb7' }}>{s}</span></div>)}
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.12)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#37ff8b' }}>Review Checklist</div>
            {output.reviewChecklist?.map((r,i) => <div key={i} className="text-[10px] mb-0.5" style={{ color: '#37ff8b' }}>{r}</div>)}
          </div>
        </div>
      )
      case 'evidenceTimeline': return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: output.documentationScore >= 60 ? '#37ff8b' : output.documentationScore >= 30 ? '#fbbf24' : '#f87171' }}>{output.documentationScore}<span className="text-sm">/100</span></div>
              <div className="text-[9px]" style={{ color: '#5a5f6b' }}>Doc Score</div>
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#a8adb7' }}>{output.timelineSummary}</p>
              <p className="text-[10px] mt-1" style={{ color: output.documentationScore >= 60 ? '#37ff8b' : '#fbbf24' }}>{output.auditReadiness}</p>
            </div>
          </div>
          {output.missingEvidence?.length > 0 && (
            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <div className="text-[10px] font-bold mb-1" style={{ color: '#fbbf24' }}>Missing Evidence</div>
              {output.missingEvidence.map((e,i) => <div key={i} className="flex items-start gap-1.5 mb-0.5"><Icon name="AlertCircle" size={10} style={{ color: '#fbbf24', marginTop: 1 }} /><span className="text-[10px]" style={{ color: '#a8adb7' }}>{e}</span></div>)}
            </div>
          )}
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#38bdf8' }}>Next Evidence Request</div>
            <p className="text-[10px]" style={{ color: '#a8adb7' }}>{output.nextEvidenceRequest}</p>
          </div>
        </div>
      )
      case 'stakeholderUpdate': return (
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(214,168,79,0.05)', border: '1px solid rgba(214,168,79,0.12)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#d6a84f' }}>Update Outline</div>
            {output.updateOutline?.map((s,i) => <div key={i} className="text-[10px] mb-0.5" style={{ color: '#a8adb7' }}>{s}</div>)}
          </div>
          {output.audienceNote && <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}><Icon name="AlertCircle" size={12} style={{ color: '#f87171' }} /><p className="text-[10px]" style={{ color: '#f87171' }}>{output.audienceNote}</p></div>}
          <div className="text-[10px]" style={{ color: '#5a5f6b' }}>Timing: {output.timingSuggestion}</div>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: '#fbbf24' }}><Icon name="Clock" size={10} />{output.approvalReminder}</div>
        </div>
      )
      case 'recoveryPlan': return (
        <div className="space-y-2">
          <div>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#34d399' }}>Recovery Checklist</div>
            {output.recoveryChecklist?.map((s,i) => <div key={i} className="text-[10px] mb-0.5" style={{ color: '#a8adb7' }}>{s}</div>)}
          </div>
          <div>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#d6a84f' }}>Trust-Rebuilding Steps</div>
            {output.trustRebuildingSteps?.map((s,i) => <div key={i} className="flex items-start gap-1.5 mb-0.5"><Icon name="Check" size={10} style={{ color: '#34d399', marginTop: 1 }} /><span className="text-[10px]" style={{ color: '#a8adb7' }}>{s}</span></div>)}
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: '#34d399' }}>Monitoring Plan</div>
            <p className="text-[10px]" style={{ color: '#a8adb7' }}>{output.monitoringPlan}</p>
          </div>
        </div>
      )
      default: return <pre className="text-[10px] overflow-auto" style={{ color: '#a8adb7' }}>{JSON.stringify(output, null, 2)}</pre>
    }
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.95)', border: `1px solid ${agentDef.color}25` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: `${agentDef.color}08`, borderBottom: `1px solid ${agentDef.color}15` }}>
        <div className="flex items-center gap-2">
          <Icon name={agentDef.icon} size={14} style={{ color: agentDef.color }} />
          <span className="text-xs font-bold" style={{ color: agentDef.color }}>{agentDef.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(143,92,255,0.12)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' }}>Demo Advisory</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(e => !e)} style={{ color: '#5a5f6b' }}><Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={14} /></button>
          <button onClick={onDismiss} style={{ color: '#5a5f6b' }}><Icon name="X" size={13} /></button>
        </div>
      </div>
      {expanded && (
        <>
          <div className="px-4 py-3 space-y-3">
            {/* Human review warning */}
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <Icon name="AlertTriangle" size={12} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <span className="text-[10px] font-semibold" style={{ color: '#fbbf24' }}>Human Review Required — advisory only, not a final decision</span>
            </div>
            {renderOutput()}
            {/* Confidence note */}
            <p className="text-[9px]" style={{ color: '#3a3f4b' }}>{output.confidence}</p>
          </div>
          {/* Review controls */}
          <div className="flex items-center gap-2 px-4 py-3 flex-wrap" style={{ borderTop: `1px solid ${agentDef.color}10` }}>
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Review status:</span>
            {['reviewed','accepted','rejected','needs_review'].map(s => (
              <button key={s} onClick={() => onReview(s)}
                className="text-[9px] px-2 py-0.5 rounded hover:opacity-80"
                style={{ color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)' }}>
                {s.replace(/_/g,' ')}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Agent Card ────────────────────────────────────────────────
function AgentCard({ agent, aiEnabled, aiMode, onRun, running, lastResult, onReview, onDismissResult }) {
  const [safetyInput, setSafetyInput] = useState('')
  const [safetyResult, setSafetyResult] = useState(null)

  const testSafety = () => {
    if (!safetyInput.trim()) return
    const r = runSafetyFilter(safetyInput, agent.id)
    setSafetyResult(r)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(13,13,18,0.95)', border: `1px solid ${agent.color}18` }}>
      {/* Card header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${agent.color}10`, border: `1px solid ${agent.color}25` }}>
          <Icon name={agent.icon} size={18} style={{ color: agent.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold" style={{ color: '#c8ccd2' }}>{agent.name}</div>
          <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>Powered by 4P3X Intelligent AI™</div>
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: '#a8adb7' }}>{agent.purpose}</p>
        </div>
      </div>
      {/* Status + run button */}
      <div className="flex items-center justify-between px-4 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
            style={aiEnabled ? { background: 'rgba(143,92,255,0.1)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.25)' } : { background: 'rgba(90,95,107,0.1)', color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)' }}>
            {aiEnabled ? (aiMode === 'demo' ? 'Demo Advisory' : 'Provider Ready') : 'AI Disabled'}
          </span>
          <span className="text-[10px]" style={{ color: '#3a3f4b' }}>Advisory Only</span>
        </div>
        <SmBtn onClick={() => onRun(agent.id)} disabled={!aiEnabled || running === agent.id} loading={running === agent.id} variant="purple">
          <Icon name="Play" size={11} />Run Analysis
        </SmBtn>
      </div>
      {/* Result output */}
      {lastResult?.agentId === agent.id && lastResult.blocked && (
        <div className="px-4 pb-4">
          <SafetyBlockedBanner result={lastResult} onDismiss={() => onDismissResult(agent.id)} />
        </div>
      )}
      {lastResult?.agentId === agent.id && !lastResult.blocked && lastResult.ok && (
        <div className="px-4 pb-4">
          <AiOutputCard result={lastResult} agentDef={agent}
            onReview={(status) => onReview(agent.id, status)}
            onDismiss={() => onDismissResult(agent.id)} />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// AI LOG HISTORY
// ═══════════════════════════════════════════════════════════════
function AiLogHistory({ logs, onUpdateReview }) {
  if (!logs?.length) return (
    <div className="flex flex-col items-center py-8 gap-2">
      <Icon name="Brain" size={20} style={{ color: 'rgba(143,92,255,0.2)' }} />
      <p className="text-xs" style={{ color: '#3a3f4b' }}>No AI advisory outputs yet. Run an agent analysis to create entries.</p>
    </div>
  )
  return (
    <div className="space-y-2">
      {logs.slice(0, 20).map(log => (
        <div key={log.id} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.04)', border: '1px solid rgba(143,92,255,0.1)' }}>
          <Icon name="Brain" size={13} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#c8ccd2' }}>{log.agentName}</span>
              <ReviewBadge status={log.reviewStatus} />
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(143,92,255,0.1)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.2)' }}>{log.source}</span>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>{log.outputSummary}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px]" style={{ color: '#3a3f4b' }}>{new Date(log.createdAt).toLocaleString('en-GB',{hour12:false})}</span>
              <span className="text-[9px]" style={{ color: '#3a3f4b' }}>Advisory only · Human review required</span>
            </div>
          </div>
          <div className="flex gap-1">
            {log.reviewStatus === 'new' && (
              <button onClick={() => onUpdateReview(log.id, 'reviewed')}
                className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: '#37ff8b', border: '1px solid rgba(55,255,139,0.2)' }}>
                Mark Reviewed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SAFETY EVENTS LOG
// ═══════════════════════════════════════════════════════════════
function SafetyEventsLog({ events }) {
  if (!events?.length) return (
    <div className="flex flex-col items-center py-8 gap-2">
      <Icon name="ShieldCheck" size={20} style={{ color: 'rgba(55,255,139,0.2)' }} />
      <p className="text-xs" style={{ color: '#3a3f4b' }}>No safety events logged. Safety filter is active.</p>
    </div>
  )
  return (
    <div className="space-y-2">
      {events.slice(0, 20).map(e => (
        <div key={e.id} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.12)' }}>
          <Icon name="ShieldX" size={13} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1">
            <div className="text-xs font-semibold" style={{ color: '#f87171' }}>Safety Block — {e.category?.replace(/_/g,' ')}</div>
            <p className="text-[10px] mt-0.5" style={{ color: '#a8adb7' }}>{e.message}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#37ff8b' }}>Alternative: {e.alternative}</p>
            <span className="text-[9px]" style={{ color: '#3a3f4b' }}>{new Date(e.createdAt).toLocaleString('en-GB',{hour12:false})}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — AI Agent Centre
// ═══════════════════════════════════════════════════════════════
const AI_TABS = [
  { key: 'agents',  label: 'AI Agents',    icon: 'Brain'       },
  { key: 'logs',    label: 'Output Log',   icon: 'List'         },
  { key: 'safety',  label: 'Safety Events',icon: 'Shield'       },
  { key: 'settings',label: 'AI Settings',  icon: 'Settings'    },
]

export default function AgentCentre({ isDemo }) {
  const [activeTab, setActiveTab] = useState('agents')
  const [running, setRunning] = useState(null)
  const [results, setResults] = useState({}) // agentId → last result
  const { aiSettings, aiAgentLogs, aiSafetyEvents, setAiEnabled, logAiOutput, updateLogReview, logSafetyEvent } = useAIAgentStore()
  const { cases, tasks, timeline, feedItems, drafts, updates } = useTrustStore()

  const aiEnabled = aiSettings?.enabled !== false
  const aiMode    = aiSettings?.mode || 'demo'
  const storeData = { cases, tasks, timeline, feedItems, drafts, updates }

  const handleRun = useCallback(async (agentId) => {
    setRunning(agentId)
    const input = buildAgentInput(agentId, storeData)
    const result = await runAgent(agentId, input, { aiEnabled, aiMode, logAiOutput, logSafetyEvent })
    setResults(r => ({ ...r, [agentId]: result }))
    setRunning(null)
  }, [aiEnabled, aiMode, logAiOutput, logSafetyEvent, storeData])

  const handleReview = useCallback((agentId, status) => {
    // Find the most recent log for this agent and update its review status
    const log = (aiAgentLogs || []).find(l => l.agentId === agentId)
    if (log) updateLogReview(log.id, status)
  }, [aiAgentLogs, updateLogReview])

  const handleDismissResult = useCallback((agentId) => {
    setResults(r => { const n = {...r}; delete n[agentId]; return n })
  }, [])

  const providerStatus = aiProviderAdapter.getProviderStatus()
  const allAgents = Object.values(AGENT_DEFINITIONS)

  return (
    <div className="space-y-4">
      {/* Main advisory banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.2)' }}>
        <Icon name="Brain" size={18} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold" style={{ color: '#8f5cff' }}>4P3X Intelligent AI™ Advisory Centre</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(143,92,255,0.15)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.3)' }}>
              {aiEnabled ? (aiMode === 'demo' ? 'Demo Advisory Mode' : 'Provider Ready') : 'AI Disabled'}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: '#a8adb7' }}>
            4P3X Intelligent AI™ guidance is advisory only. All crisis, reputation, legal, public, customer, media, or stakeholder actions must be reviewed and approved by a responsible human before action.
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Provider: {providerStatus === 'not-configured' ? 'Demo / Local rules' : providerStatus}</span>
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Agents: {allAgents.length}</span>
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>Log entries: {(aiAgentLogs||[]).length}</span>
          </div>
        </div>
      </div>

      {/* AI disabled warning */}
      {!aiEnabled && (
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(90,95,107,0.08)', border: '1px solid rgba(90,95,107,0.2)' }}>
          <Icon name="BrainCircuit" size={14} style={{ color: '#5a5f6b' }} />
          <span className="text-xs" style={{ color: '#5a5f6b' }}>AI advisory support is disabled. Enable in AI Settings to run agent analysis.</span>
          <SmBtn onClick={() => setAiEnabled(true)} variant="ghost"><Icon name="Power" size={11} />Enable</SmBtn>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {AI_TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={activeTab === t.key ? { background: 'rgba(143,92,255,0.12)', color: '#8f5cff', border: '1px solid rgba(143,92,255,0.3)' } : { color: '#5a5f6b', border: '1px solid rgba(90,95,107,0.2)', background: 'transparent' }}>
            <Icon name={t.icon} size={11} />{t.label}
          </button>
        ))}
      </div>

      {/* ── AGENTS TAB ── */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {allAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} aiEnabled={aiEnabled} aiMode={aiMode}
              onRun={handleRun} running={running}
              lastResult={results[agent.id]}
              onReview={handleReview}
              onDismissResult={handleDismissResult} />
          ))}
        </div>
      )}

      {/* ── LOGS TAB ── */}
      {activeTab === 'logs' && (
        <Card>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(143,92,255,0.5)' }}>AI Advisory Output Log</div>
            <span className="text-[10px]" style={{ color: '#5a5f6b' }}>{(aiAgentLogs||[]).length} entries · Advisory only · Human review required</span>
          </div>
          <div className="p-4">
            <AiLogHistory logs={aiAgentLogs} onUpdateReview={updateLogReview} />
          </div>
        </Card>
      )}

      {/* ── SAFETY TAB ── */}
      {activeTab === 'safety' && (
        <Card>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.06)' }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(248,113,113,0.5)' }}>Safety Filter Events</div>
            <p className="text-[10px] mt-1" style={{ color: '#5a5f6b' }}>
              Logs actions blocked by the 4P3X AI Safety Filter. Blocked categories include fake reviews, astroturfing, impersonation, harassment, misinformation, and more.
            </p>
          </div>
          <div className="p-4">
            <SafetyEventsLog events={aiSafetyEvents} />
          </div>
        </Card>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && (
        <Card glow>
          <div className="p-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(143,92,255,0.5)' }}>AI Advisory Settings</div>

            {/* Enable/Disable toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.05)', border: '1px solid rgba(143,92,255,0.15)' }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: '#c8ccd2' }}>Enable 4P3X Intelligent AI™ Advisory Support</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#5a5f6b' }}>When OFF: agent run buttons are disabled. Existing logs are preserved.</div>
              </div>
              <button onClick={() => setAiEnabled(!aiEnabled)}
                className="w-11 h-6 rounded-full transition-all flex items-center px-0.5"
                style={{ background: aiEnabled ? 'rgba(143,92,255,0.4)' : 'rgba(90,95,107,0.3)', border: `1px solid ${aiEnabled ? 'rgba(143,92,255,0.6)' : 'rgba(90,95,107,0.4)'}` }}>
                <div className="w-5 h-5 rounded-full transition-all" style={{ background: aiEnabled ? '#8f5cff' : '#5a5f6b', transform: aiEnabled ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>

            {/* AI Mode status */}
            <div className="p-3 rounded-xl space-y-1" style={{ background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(214,168,79,0.08)' }}>
              <div className="text-[10px] font-bold uppercase" style={{ color: 'rgba(214,168,79,0.4)' }}>AI Mode</div>
              {[
                { key: 'demo',             label: 'Demo Advisory Mode',            desc: 'Rule-based local logic. No API required. Always available.',  active: aiMode === 'demo' },
                { key: 'provider-ready',   label: 'Provider Ready (Not Connected)', desc: 'Provider config saved. Requires backend proxy to activate.',   active: aiMode === 'provider-ready' },
                { key: 'provider-connected',label:'Provider Connected',            desc: 'Live AI provider connected via backend proxy (future run).',   active: aiMode === 'provider-connected' },
              ].map(m => (
                <div key={m.key} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(214,168,79,0.04)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: m.active ? '#8f5cff' : '#3a3f4b', boxShadow: m.active ? '0 0 4px rgba(143,92,255,0.6)' : 'none' }} />
                  <div>
                    <div className="text-[10px] font-semibold" style={{ color: m.active ? '#8f5cff' : '#5a5f6b' }}>{m.label}</div>
                    <div className="text-[9px]" style={{ color: '#3a3f4b' }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Provider adapter status */}
            <div className="p-3 rounded-xl" style={{ background: 'rgba(214,168,79,0.04)', border: '1px solid rgba(214,168,79,0.1)' }}>
              <div className="text-[10px] font-bold mb-1" style={{ color: 'rgba(214,168,79,0.5)' }}>Provider Adapter Status</div>
              <p className="text-[10px]" style={{ color: '#5a5f6b' }}>Status: {providerStatus}</p>
              <p className="text-[10px] mt-1" style={{ color: '#3a3f4b' }}>AI providers requiring private API keys (OpenAI, Groq, Anthropic) must be connected via a backend proxy/server-side function. Never place private keys in frontend code.</p>
            </div>

            {/* Safety rules summary */}
            <div className="p-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.12)' }}>
              <div className="text-[10px] font-bold mb-2" style={{ color: '#f87171' }}>Safety Filter — Always Active</div>
              <div className="grid grid-cols-2 gap-1">
                {['Fake reviews', 'Astroturfing', 'Impersonation', 'Harassment', 'Blackmail', 'Defamation', 'Misinformation', 'Private surveillance', 'Doxxing', 'Unlawful takedown', 'Guaranteed results', 'Auto-publishing'].map(r => (
                  <div key={r} className="flex items-center gap-1.5 text-[9px]" style={{ color: '#5a5f6b' }}>
                    <Icon name="X" size={8} style={{ color: '#f87171' }} />{r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Global advisory footer */}
      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(143,92,255,0.04)', border: '1px solid rgba(143,92,255,0.12)' }}>
        <Icon name="ShieldCheck" size={12} style={{ color: '#8f5cff', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[10px]" style={{ color: '#8f5cff' }}>4P3X Intelligent AI™ guidance is advisory only and must be reviewed by a responsible human before action. Monitoring and sync should only be used for owned brands, authorised clients, or lawful business/reputation purposes.</p>
      </div>
    </div>
  )
}
