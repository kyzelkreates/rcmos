/**
 * ============================================================
 * TrustSheild OS™ — 4P3X Intelligent AI™ Agent Service (Run 10)
 * Central AI Advisory Engine
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * CORE SAFETY CONTRACT:
 *   • ALL AI outputs are advisory only. advisoryOnly: true ALWAYS.
 *   • humanReviewRequired: true ALWAYS.
 *   • No automatic public posting, legal advice, or final decisions.
 *   • No fake reviews, testimonials, astroturfing, or manipulation.
 *   • No private surveillance, doxxing, or unlawful tracking.
 *   • No guaranteed reputation repair.
 *   • Safety filter blocks all unethical reputation actions.
 *   • Demo mode uses rule-based deterministic logic only.
 *   • Provider mode requires safe backend proxy — no private keys
 *     in frontend code.
 *
 * AI MODES:
 *   demo              — Rule-based local logic. No API required.
 *   provider-ready    — Provider config saved, not yet connected.
 *   provider-connected— Safe provider connected (future run).
 *   disabled          — AI advisory support turned off.
 *
 * 4P3X Intelligent AI™ guidance is advisory only. All crisis,
 * reputation, legal, public, customer, media, or stakeholder
 * actions must be reviewed and approved by a responsible human
 * before action.
 * ============================================================
 */

// ═══════════════════════════════════════════════════════════════
// AGENT DEFINITIONS
// Each agent: id, name, purpose, icon, inputs, outputs, safety
// ═══════════════════════════════════════════════════════════════
export const AGENT_DEFINITIONS = {
  trustTriage: {
    id:                  'trustTriage',
    name:                'Trust Triage Agent',
    icon:                'ShieldCheck',
    color:               '#37ff8b',
    purpose:             'Quickly reviews active cases and suggests initial triage priority based on risk signals.',
    allowedInputs:       ['risk_level','case_status','source_channel','update_count','escalation_status','pending_tasks','evidence_count','stakeholder_impact'],
    outputType:          'triage_assessment',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_legal_conclusions','no_guaranteed_outcome','no_final_crisis_decision'],
    forbiddenActions:    ['publish_response','contact_media','legal_action','suppress_evidence'],
  },
  reputationRisk: {
    id:                  'reputationRisk',
    name:                'Reputation Risk Agent',
    icon:                'AlertOctagon',
    color:               '#f87171',
    purpose:             'Assesses reputation risk signals and explains why risk may be rising or falling.',
    allowedInputs:       ['tracked_entity','source_channel','complaint_type','incident_severity','trend_notes','task_status','feed_items'],
    outputType:          'risk_assessment',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_private_surveillance','no_doxxing','no_defamatory_assumptions','no_fake_intelligence'],
    forbiddenActions:    ['monitor_private_communications','purchase_data','fake_social_proof'],
  },
  crisisResponse: {
    id:                  'crisisResponse',
    name:                'Crisis Response Agent',
    icon:                'Zap',
    color:               '#fbbf24',
    purpose:             'Suggests responsible next steps for the dashboard team in an active crisis situation.',
    allowedInputs:       ['active_case','incident_details','current_tasks','escalation_requests','stakeholder_status','draft_status'],
    outputType:          'action_plan',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_automatic_action','no_sending_responses','no_harassment','no_astroturfing'],
    forbiddenActions:    ['auto_post','auto_send_email','contact_journalists','suppress_complaints'],
  },
  responseDrafting: {
    id:                  'responseDrafting',
    name:                'Response Drafting Agent',
    icon:                'FileEdit',
    color:               '#8f5cff',
    purpose:             'Helps create a human-reviewed draft response outline. Draft only — must not be used without review.',
    allowedInputs:       ['case_summary','channel','tone','known_facts','audience','approved_notes'],
    outputType:          'draft_outline',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_lies','no_fake_apology','no_threats','no_deception','no_impersonation','no_fake_reviews'],
    forbiddenActions:    ['auto_publish_draft','send_without_review','claim_unverified_facts'],
  },
  evidenceTimeline: {
    id:                  'evidenceTimeline',
    name:                'Evidence & Timeline Agent',
    icon:                'Clock',
    color:               '#38bdf8',
    purpose:             'Reviews available evidence and timeline completeness. Identifies gaps and suggests collection.',
    allowedInputs:       ['evidence_items','update_feed','task_updates','incident_timestamps','escalation_notes','draft_reviews'],
    outputType:          'timeline_review',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_fabricating_evidence','no_altering_evidence','no_deleting_evidence','no_false_verification'],
    forbiddenActions:    ['destroy_evidence','alter_timestamps','suppress_records'],
  },
  stakeholderUpdate: {
    id:                  'stakeholderUpdate',
    name:                'Stakeholder Update Agent',
    icon:                'Send',
    color:               '#d6a84f',
    purpose:             'Suggests internal/external stakeholder update structures and timing.',
    allowedInputs:       ['case_status','stakeholder_audience','task_progress','escalation_status','approved_facts'],
    outputType:          'update_outline',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_auto_send','no_legal_advice','no_misleading_statements'],
    forbiddenActions:    ['auto_send_update','promise_outcomes','share_unverified_info'],
  },
  recoveryPlan: {
    id:                  'recoveryPlan',
    name:                'Recovery Plan Agent',
    icon:                'TrendingUp',
    color:               '#34d399',
    purpose:             'Suggests reputation recovery steps after crisis response is complete.',
    allowedInputs:       ['case_status','risk_trend','completed_tasks','feedback_notes','evidence_summary'],
    outputType:          'recovery_plan',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_fake_reviews','no_manipulation','no_guaranteed_results','no_astroturfing'],
    forbiddenActions:    ['purchase_fake_reviews','hire_influencers_deceptively','suppress_legitimate_complaints'],
  },
  pwaGuidance: {
    id:                  'pwaGuidance',
    name:                'PWA Guidance Agent',
    icon:                'HelpCircle',
    color:               '#8f5cff',
    purpose:             'Helps PWA responders understand their assigned task and submit better, more useful updates.',
    allowedInputs:       ['task_type','task_instructions','case_brief','user_role','escalation_status'],
    outputType:          'guidance_note',
    advisoryOnly:        true,
    humanReviewRequired: true,
    safetyRules:         ['no_final_approval','no_legal_advice','no_surveillance_guidance'],
    forbiddenActions:    ['approve_public_response','send_legal_notice','access_private_data'],
  },
}

// ═══════════════════════════════════════════════════════════════
// AI SAFETY FILTER
// Blocks unethical / unsafe reputation actions before they
// reach any AI output or user action.
// ═══════════════════════════════════════════════════════════════
const BLOCKED_PATTERNS = [
  { pattern: /fake\s+(review|testimonial|rating|feedback)/i,    category: 'fake_social_proof',        alt: 'Collect genuine customer feedback and document factual service improvements.' },
  { pattern: /astroturf/i,                                       category: 'astroturfing',             alt: 'Use authentic stakeholder communication and factual updates.' },
  { pattern: /impersonat/i,                                      category: 'impersonation',            alt: 'Communicate officially from verified accounts only.' },
  { pattern: /harass/i,                                          category: 'harassment',               alt: 'Escalate legitimate concerns through proper legal or business channels.' },
  { pattern: /blackmail|extort/i,                                category: 'blackmail',                alt: 'Document concerns and escalate to legal counsel if required.' },
  { pattern: /defam/i,                                           category: 'defamation',               alt: 'Document factual corrections and consult legal counsel for review.' },
  { pattern: /misinform|disinform|spread.*false/i,               category: 'misinformation',           alt: 'Prepare factual corrections and share accurate verified information only.' },
  { pattern: /private.*surveil|surveil.*private|spy\s+on/i,      category: 'private_surveillance',     alt: 'Monitor only owned brands, public information, or authorised sources.' },
  { pattern: /doxx/i,                                            category: 'doxxing',                  alt: 'Protect all personal data. Contact data protection/legal if needed.' },
  { pattern: /unlawful.*takedown|DMCA.*abuse|false.*copyright/i, category: 'unlawful_takedown',        alt: 'Consult legal counsel for legitimate content removal options.' },
  { pattern: /guarantee.*reputation|promise.*fixed|remove.*result/i, category: 'guaranteed_repair',   alt: 'Reputation management is a process. Focus on evidence, response, and recovery steps.' },
  { pattern: /auto.*post|automatic.*publish|schedule.*send.*without/i, category: 'auto_publishing',   alt: 'All public posts must be reviewed and approved by a responsible human first.' },
  { pattern: /legal.*conclusion|legal.*advice\b/i,               category: 'legal_advice',             alt: 'Consult a qualified legal professional for legal matters.' },
  { pattern: /suppress.*complaint|hide.*review|delete.*negative/i, category: 'suppression',           alt: 'Address complaints genuinely. Suppression can worsen reputation risk.' },
]

export function runSafetyFilter(inputText, context = '') {
  const combined = `${inputText} ${context}`.toLowerCase()
  for (const rule of BLOCKED_PATTERNS) {
    if (rule.pattern.test(combined)) {
      return {
        blocked:   true,
        category:  rule.category,
        message:   `Safety filter: This action involves "${rule.category.replace(/_/g,' ')}" which is not supported by TrustSheild OS™.`,
        alternative: rule.alt,
      }
    }
  }
  return { blocked: false }
}

// ═══════════════════════════════════════════════════════════════
// DEMO AI LOGIC — Rule-based deterministic outputs
// All outputs are clearly labelled as demo advisory.
// No external API is called in demo mode.
// ═══════════════════════════════════════════════════════════════

function demoTrustTriage(input) {
  const { riskLevel = 'medium', caseStatus = 'open', escalationOpen, pendingTasks = 0, evidenceCount = 0, feedCount = 0 } = input
  const lvl = riskLevel?.toLowerCase()
  const triageLevel = lvl === 'critical' ? 'Critical'
    : (lvl === 'high' || escalationOpen) ? 'High'
    : lvl === 'medium' ? 'Medium' : 'Low'

  const warnings = []
  if (evidenceCount < 2) warnings.push('Low evidence count — collect screenshots, notes, or links before responding.')
  if (pendingTasks > 3) warnings.push('Multiple pending tasks — assign and prioritise before escalating.')
  if (escalationOpen)   warnings.push('Open escalation request — acknowledge and assign urgently.')
  if (feedCount === 0)  warnings.push('No update feed activity — request a situation update from the PWA responder.')

  return {
    triageLevel,
    reason:          `Risk is ${triageLevel.toLowerCase()} based on current risk level (${riskLevel}), case status (${caseStatus}), and ${pendingTasks} pending tasks.`,
    nextAction:      triageLevel === 'Critical' ? 'Convene response team immediately. Acknowledge publicly if appropriate. Document everything.'
      : triageLevel === 'High' ? 'Assign senior responder. Request situation update within 1 hour. Review evidence.'
      : triageLevel === 'Medium' ? 'Assign task to responder. Monitor for 24 hours. Prepare draft response if needed.'
      : 'Monitor situation. No immediate action required. Document for audit trail.',
    missingInfo:     warnings,
    confidence:      'Demo advisory — rule-based estimate, not live analysis.',
  }
}

function demoReputationRisk(input) {
  const { riskLevel = 'medium', sourceChannel = 'Unknown', incidentCount = 1, trend = 'unknown', entityName = 'Entity' } = input
  const lvl = riskLevel?.toLowerCase()
  const riskTrend = trend !== 'unknown' ? trend
    : incidentCount > 3 ? 'worsening' : incidentCount === 0 ? 'improving' : 'stable'

  return {
    riskSummary:    `${entityName} is experiencing ${lvl} reputation risk based on ${incidentCount} active incident(s) via ${sourceChannel}.`,
    riskDrivers:    [
      sourceChannel !== 'Unknown' ? `Primary channel: ${sourceChannel}` : 'Source channel not specified — monitor all channels.',
      lvl === 'critical' || lvl === 'high' ? 'High severity signal detected — response required.' : 'Moderate signal — monitor and document.',
      incidentCount > 2 ? 'Multiple incidents suggest a pattern — investigate root cause.' : 'Isolated incident — contain and document.',
    ],
    riskTrend,
    suggestedEvidence:    ['Screenshot/archive the original source.', 'Document exact timestamp and URL.', 'Note any public engagement (shares, replies, views).', 'Check if similar incidents occurred previously.'],
    suggestedAction:      riskTrend === 'worsening' ? 'Escalate to senior stakeholder. Prepare response draft. Do not ignore.' : 'Monitor closely. Assign a responder. Prepare factual correction if needed.',
    confidence:           'Demo advisory — rule-based estimate. No live monitoring data.',
  }
}

function demoCrisisResponse(input) {
  const { riskLevel = 'medium', openTasks = 0, draftStatus, escalationOpen, stakeholderUpdated } = input
  const lvl = riskLevel?.toLowerCase()
  const actions = []

  if (!stakeholderUpdated) actions.push({ priority: 1, action: 'Send internal stakeholder update', owner: 'Dashboard Lead', warning: 'Do not include unverified facts.' })
  if (draftStatus === 'pending' || !draftStatus) actions.push({ priority: 2, action: 'Review and approve holding statement draft', owner: 'Senior Reviewer', warning: 'Human approval required before any public use.' })
  if (openTasks > 0)       actions.push({ priority: 3, action: `Resolve ${openTasks} pending task(s) assigned to PWA responders`, owner: 'PWA Coordinator', warning: null })
  if (escalationOpen)      actions.push({ priority: 1, action: 'Acknowledge escalation request from PWA', owner: 'Response Lead', warning: 'Escalation needs urgent acknowledgement.' })
  if (actions.length === 0) actions.push({ priority: 1, action: 'Document current situation and confirm all tasks complete', owner: 'Dashboard Lead', warning: null })

  return {
    recommendedActions: actions.sort((a,b) => a.priority - b.priority).slice(0, 3),
    doNotDo: ['Do not post publicly without human review.', 'Do not contact media without senior approval.', 'Do not make unverified factual claims.', 'Do not ignore escalation requests.'],
    confidence: 'Demo advisory — rule-based suggestions, not legal or professional advice.',
  }
}

function demoResponseDrafting(input) {
  const { channel = 'General', tone = 'Calm', audience = 'Public', caseTitle = 'Active Situation' } = input
  return {
    draftLabel:    '⚠ DRAFT ONLY — Must be reviewed and approved before any use.',
    outline: [
      `[Opening] Acknowledge the situation regarding ${caseTitle} clearly and factually.`,
      `[Facts] State only verified, confirmed information. Do not speculate.`,
      `[Action] Describe the steps being taken to address the situation.`,
      `[Contact] Provide a clear point of contact for further questions if appropriate.`,
    ],
    holdingStatement: `"We are aware of the situation regarding [${caseTitle}] and are reviewing it carefully. We are committed to responding thoroughly and will provide an update as soon as we are able. [Contact/Channel]."`,
    toneNote:      `Tone: ${tone} — Keep language calm, factual, and respectful. Avoid emotive or defensive wording.`,
    factualCheck:  ['Verify all facts before including.', 'Remove speculation.', 'Check legal review if required.', 'Confirm approval chain before sending.'],
    reviewChecklist: ['✓ Reviewed by responsible human', '✓ Legal review if required', '✓ Factual accuracy confirmed', '✓ Tone approved', '✓ Authorised for intended channel'],
    channel,
    audience,
    confidence:    'Demo advisory draft — do not use without full human review and approval.',
  }
}

function demoEvidenceTimeline(input) {
  const { evidenceCount = 0, updateCount = 0, taskCount = 0 } = input
  const score = Math.min(100, Math.round((evidenceCount * 20) + (updateCount * 10) + (taskCount * 5)))
  const missing = []
  if (evidenceCount < 2) missing.push('Original source screenshot or archive link')
  if (evidenceCount < 3) missing.push('Timestamp documentation of first occurrence')
  if (updateCount < 1)   missing.push('Initial situation update from responder')
  if (taskCount < 1)     missing.push('At least one assigned response task')
  if (evidenceCount < 4) missing.push('Evidence of any public engagement (shares, replies)')

  return {
    timelineSummary:      `${evidenceCount} evidence item(s), ${updateCount} situation update(s), ${taskCount} task(s) on record.`,
    documentationScore:   score,
    missingEvidence:      missing.slice(0, 4),
    contradictions:       evidenceCount > 0 ? ['Review timestamps for consistency.', 'Cross-reference multiple source references.'] : ['No evidence submitted yet — collection is the priority.'],
    auditReadiness:       score >= 60 ? 'Adequate for initial review.' : 'Documentation needs strengthening before audit.',
    nextEvidenceRequest:  missing[0] || 'Continue documenting. Maintain clear timestamps.',
    confidence:           'Demo advisory — based on local record counts, not verified evidence analysis.',
  }
}

function demoStakeholderUpdate(input) {
  const { audience = 'Internal Team', caseStatus = 'open', taskProgress = 0 } = input
  return {
    updateOutline: [
      `[Audience: ${audience}]`,
      `[Status] Current situation status: ${caseStatus}. ${taskProgress}% of response tasks complete.`,
      `[Actions] Outline the specific steps taken so far (verified facts only).`,
      `[Next Steps] Describe the planned next actions and expected timeline.`,
      `[Contact] Named point of contact for questions.`,
    ],
    audienceNote:   audience.toLowerCase().includes('public') ? '⚠ Public update — requires senior approval and legal review before sending.' : 'Internal update — still requires approval before distribution.',
    timingSuggestion: caseStatus === 'open' ? 'Send initial acknowledgement within 4 hours. Follow-up update within 24 hours.' : 'Send resolved update within 24 hours of resolution confirmation.',
    approvalReminder: 'Human approval required. Do not send automatically.',
    sensitiveNote:    'Remove unverified claims, speculation, and legally sensitive wording before sending.',
    confidence:       'Demo advisory — template suggestion only. Professional review required.',
  }
}

function demoRecoveryPlan(input) {
  const { riskTrend = 'stable', completedTasks = 0, caseStatus = 'open' } = input
  const isResolved = caseStatus === 'resolved' || caseStatus === 'archived'
  return {
    recoveryChecklist: [
      isResolved ? '✓ Crisis response phase complete' : '⏳ Complete active crisis response first',
      '□ Send formal resolution update to all stakeholder groups',
      '□ Document full timeline and evidence for audit record',
      '□ Review what contributed to the risk and document root cause',
      '□ Brief internal team on lessons learned',
    ],
    followUpActions: [
      'Monitor affected channels for 30 days post-resolution.',
      'Publish a factual follow-up statement if appropriate and approved.',
      'Review and update internal response procedures.',
      'Conduct a post-incident review with the response team.',
    ],
    trustRebuildingSteps: [
      'Demonstrate consistent, transparent communication going forward.',
      'Address any legitimate underlying concerns that surfaced.',
      'Engage genuinely with affected customers/stakeholders if appropriate.',
      'Document positive outcomes and service improvements.',
    ],
    monitoringPlan:    `Continue monitoring via configured channels for ${riskTrend === 'worsening' ? '60' : '30'} days. Alert threshold: any new mentions of the original incident.`,
    lessonsLearned:    'Document what worked, what didn\'t, and what to do differently next time.',
    prevention:        'Review existing policies. Strengthen communication protocols. Consider proactive stakeholder engagement.',
    confidence:        'Demo advisory — structured guide only. Professional consultation recommended.',
  }
}

function demoPwaGuidance(input) {
  const { taskType = 'General', taskTitle = 'Assigned Task', instructions = '', caseTitle = 'Active Case' } = input
  const TYPE_HINTS = {
    'Confirm Update Received':       { what: 'Confirm you have received this task and read the instructions.', include: ['Your name/role', 'Time of receipt confirmation', 'Any immediate concerns'] },
    'Submit Situation Update':       { what: 'Describe what is currently happening on your side.', include: ['Current situation facts', 'Relevant timestamps', 'Any changes since last update', 'Who else is involved'] },
    'Upload Evidence or Notes':      { what: 'Upload screenshots, links, notes, or documents relevant to this case.', include: ['Clear description of evidence', 'Source and timestamp', 'Relevance to the case'] },
    'Log Customer or Social Issue':  { what: 'Log the specific complaint, comment, or social mention.', include: ['Exact quote or screenshot', 'Platform/source', 'Timestamp', 'Number of engagements if visible'] },
    'Request Escalation':            { what: 'Describe why this situation needs immediate senior attention.', include: ['Why it is urgent', 'What has already happened', 'Your recommended next step'] },
  }
  const hint = TYPE_HINTS[taskType] || { what: `Complete the task: ${taskTitle}.`, include: ['Relevant facts', 'Timestamps', 'Any concerns'] }

  return {
    taskExplanation:    hint.what,
    suggestedInfo:      hint.include,
    missingChecklist:   ['Did you include timestamps?', 'Did you include sources?', 'Did you describe the situation clearly?', 'Is there anything urgent to escalate?'],
    escalationReminder: 'If you are unsure or the situation is urgent, use the Escalation screen to alert the dashboard team.',
    safetyReminder:     'Do not submit any public, legal, or media responses without approval from the dashboard team.',
    caseContext:        caseTitle,
    confidence:         'Demo advisory guidance — for task support only.',
  }
}

// ── Demo output dispatcher ─────────────────────────────────────
const DEMO_RUNNERS = {
  trustTriage:       demoTrustTriage,
  reputationRisk:    demoReputationRisk,
  crisisResponse:    demoCrisisResponse,
  responseDrafting:  demoResponseDrafting,
  evidenceTimeline:  demoEvidenceTimeline,
  stakeholderUpdate: demoStakeholderUpdate,
  recoveryPlan:      demoRecoveryPlan,
  pwaGuidance:       demoPwaGuidance,
}

// ═══════════════════════════════════════════════════════════════
// PROVIDER ADAPTER PLACEHOLDER
// Ready for safe provider connection in future runs.
// Private API keys must NEVER be placed in frontend code.
// ═══════════════════════════════════════════════════════════════
export const aiProviderAdapter = {

  _getConfig() {
    try {
      const raw = localStorage.getItem('trustsheild_backend_config')
      if (!raw) return null
      const cfg = JSON.parse(raw)
      // Guard: never accept OpenAI/Groq/Anthropic private keys in frontend
      // These must always go through a backend proxy
      return cfg?.aiProvider || null
    } catch { return null }
  },

  validateProviderConfig() {
    const cfg = this._getConfig()
    if (!cfg) return { valid: false, status: 'not-configured', message: 'No AI provider configured.' }
    // Block private key patterns — these belong on a backend server
    if (/sk-|AIzaSy|gsk_|anthropic|private_key/i.test(JSON.stringify(cfg))) {
      return {
        valid: false,
        status: 'blocked',
        message: 'AI provider requires backend proxy/server-side function. Do not place private API keys in frontend code.',
      }
    }
    return { valid: false, status: 'provider-ready', message: 'Provider config detected — requires backend proxy to activate.' }
  },

  getProviderStatus() {
    const result = this.validateProviderConfig()
    return result.status
  },

  async runAgent(agentId, input) {
    const val = this.validateProviderConfig()
    if (!val.valid) return {
      ok: false,
      status: val.status,
      message: val.message,
      fallback: 'demo',
    }
    // Placeholder — future: call backend proxy endpoint
    return {
      ok: false,
      status: 'provider-ready',
      message: 'AI provider is configured but requires a backend proxy/server-side function to call safely. Demo mode active.',
      fallback: 'demo',
    }
  },

  disableAi() {
    return { ok: true, status: 'disabled' }
  },
}

// ═══════════════════════════════════════════════════════════════
// CENTRAL runAgent() — THE MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════
/**
 * runAgent(agentId, input, options)
 * @param {string}  agentId   — one of AGENT_DEFINITIONS keys
 * @param {object}  input     — agent-specific input fields
 * @param {object}  options   — { aiEnabled, aiMode, logAiOutput, logSafetyEvent }
 * @returns {object} result   — { ok, output, agentName, advisoryOnly, humanReviewRequired, confidence, source, blocked }
 */
export async function runAgent(agentId, input, options = {}) {
  const { aiEnabled = true, aiMode = 'demo', logAiOutput, logSafetyEvent } = options
  const agent = AGENT_DEFINITIONS[agentId]

  if (!agent) return { ok: false, output: null, message: `Unknown agent: ${agentId}` }
  if (!aiEnabled) return { ok: false, output: null, message: 'AI advisory support is disabled.', blocked: false }

  // ── Safety filter on raw input ────────────────────────────
  const inputStr = JSON.stringify(input)
  const safety = runSafetyFilter(inputStr, agentId)
  if (safety.blocked) {
    logSafetyEvent?.({
      agentId,
      category:    safety.category,
      message:     safety.message,
      alternative: safety.alternative,
      source:      aiMode === 'demo' ? 'demo' : 'live',
    })
    return {
      ok:       false,
      blocked:  true,
      output:   null,
      category: safety.category,
      message:  safety.message,
      alternative: safety.alternative,
    }
  }

  // ── Demo mode — rule-based output ─────────────────────────
  if (aiMode === 'demo' || aiMode === 'provider-ready') {
    const runner = DEMO_RUNNERS[agentId]
    if (!runner) return { ok: false, message: `No demo runner for agent: ${agentId}` }

    const output = runner(input)
    const logEntry = {
      agentId,
      agentName:           agent.name,
      inputSummary:        buildInputSummary(agentId, input),
      outputSummary:       buildOutputSummary(agentId, output),
      advisoryOnly:        true,
      humanReviewRequired: true,
      source:              'demo',
      confidence:          output.confidence || 'Demo advisory logic.',
    }
    logAiOutput?.(logEntry)

    return {
      ok:                  true,
      output,
      agentId,
      agentName:           agent.name,
      advisoryOnly:        true,
      humanReviewRequired: true,
      source:              'demo',
      confidence:          output.confidence,
      blocked:             false,
      demoMode:            true,
    }
  }

  // ── Provider mode — placeholder ───────────────────────────
  const providerResult = await aiProviderAdapter.runAgent(agentId, input)
  if (providerResult.fallback === 'demo') {
    return runAgent(agentId, input, { ...options, aiMode: 'demo' })
  }
  return { ok: false, output: null, message: providerResult.message }
}

// ─── Helpers for concise log summaries ───────────────────────
function buildInputSummary(agentId, input) {
  const parts = []
  if (input.riskLevel)    parts.push(`risk: ${input.riskLevel}`)
  if (input.caseStatus)   parts.push(`status: ${input.caseStatus}`)
  if (input.taskType)     parts.push(`task: ${input.taskType}`)
  if (input.channel)      parts.push(`channel: ${input.channel}`)
  if (input.entityName)   parts.push(`entity: ${input.entityName}`)
  if (input.audience)     parts.push(`audience: ${input.audience}`)
  return parts.length ? parts.join(', ') : agentId
}
function buildOutputSummary(agentId, output) {
  if (!output) return '(no output)'
  if (output.triageLevel)       return `Triage: ${output.triageLevel} — ${output.nextAction?.slice(0,60)}`
  if (output.riskTrend)         return `Risk trend: ${output.riskTrend} — ${output.riskSummary?.slice(0,60)}`
  if (output.recommendedActions) return `${output.recommendedActions.length} actions — ${output.recommendedActions[0]?.action?.slice(0,50)}`
  if (output.holdingStatement)  return `Draft outline created — review before use`
  if (output.documentationScore !== undefined) return `Doc score: ${output.documentationScore}/100`
  if (output.updateOutline)     return `Update outline for ${output.updateOutline?.[0]}`
  if (output.recoveryChecklist) return `${output.recoveryChecklist.length} recovery steps`
  if (output.taskExplanation)   return output.taskExplanation?.slice(0,80)
  return 'Output generated (demo advisory).'
}

// ─── Build input from current dashboard state ─────────────────
export function buildAgentInput(agentId, storeData = {}) {
  const { cases = [], tasks = [], timeline = [], feedItems = [], drafts = [], updates = [] } = storeData
  const activeCase = cases?.[0] || {}
  const openTasks  = (tasks || []).filter(t => !['Complete','Resolved','Cancelled'].includes(t.status))
  const draftPending = (drafts || []).find(d => d.status === 'In Review' || d.status === 'Awaiting Review')

  switch (agentId) {
    case 'trustTriage':
      return { riskLevel: activeCase.risk || activeCase.riskLevel || 'medium', caseStatus: activeCase.status || 'open', escalationOpen: (tasks||[]).some(t=>t.status==='Escalated'), pendingTasks: openTasks.length, evidenceCount: (timeline||[]).length, feedCount: (feedItems||[]).length }
    case 'reputationRisk':
      return { riskLevel: activeCase.risk || activeCase.riskLevel || 'medium', sourceChannel: activeCase.channel || activeCase.source || 'Unknown', incidentCount: cases.length, trend: 'unknown', entityName: activeCase.entity || activeCase.client || 'Entity' }
    case 'crisisResponse':
      return { riskLevel: activeCase.risk || activeCase.riskLevel || 'medium', openTasks: openTasks.length, draftStatus: draftPending ? 'pending' : 'none', escalationOpen: (tasks||[]).some(t=>t.status==='Escalated'), stakeholderUpdated: (updates||[]).length > 0 }
    case 'responseDrafting':
      return { channel: activeCase.channel || 'General', tone: 'Calm', audience: 'Public', caseTitle: activeCase.title || activeCase.case || 'Active Situation' }
    case 'evidenceTimeline':
      return { evidenceCount: (timeline||[]).length, updateCount: (updates||[]).length || (feedItems||[]).filter(f=>f.event_type==='pwa_situation_update').length, taskCount: (tasks||[]).length }
    case 'stakeholderUpdate':
      return { audience: 'Internal Team', caseStatus: activeCase.status || 'open', taskProgress: tasks.length > 0 ? Math.round(((tasks.length - openTasks.length)/tasks.length)*100) : 0 }
    case 'recoveryPlan':
      return { riskTrend: 'stable', completedTasks: (tasks||[]).filter(t=>t.status==='Complete').length, caseStatus: activeCase.status || 'open' }
    case 'pwaGuidance':
      return { taskType: 'Submit Situation Update', taskTitle: 'Current Task', instructions: '', caseTitle: activeCase.title || 'Active Case' }
    default:
      return {}
  }
}
