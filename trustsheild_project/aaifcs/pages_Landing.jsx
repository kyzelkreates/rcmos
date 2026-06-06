/**
 * ============================================================
 * TrustSheild OS™ — Homepage / Landing Page
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Route:  /welcome  (public — no auth required)
 * Root /  redirects here first (see app_Router.jsx RootRedirect)
 *
 * This is the main homepage, investor/client explainer, and
 * always-on reputation command positioning page.
 *
 * CTA routes:
 *   /dashboard    → TrustSheild Command Dashboard
 *   /driver-app   → Crisis Response PWA
 *   /settings     → API / Live Mode configuration
 *
 * ETHICAL NOTICE:
 *   All AI outputs are advisory only.
 *   Human review is required before any public, legal,
 *   media, or stakeholder action is taken.
 * ============================================================
 */

import { useNavigate } from 'react-router-dom'
import Icon from './components_ui_Icon'
import APP_CONFIG from './config_app'

// ─── Design tokens (inline — no global side effects) ─────────
const T = {
  gold:   '#d6a84f',
  silver: '#c8ccd2',
  green:  '#37ff8b',
  purple: '#8f5cff',
  red:    '#f87171',
  muted:  '#5a5f6b',
  mid:    '#a8adb7',
  bg:     '#07070A',
  card:   'rgba(13,13,18,0.92)',
}

// ─── Route helpers ────────────────────────────────────────────
const SETUP_KEY   = 'apex:setup_complete'
const setupDone   = () => localStorage.getItem(SETUP_KEY) === 'true'

// ─── Primitives ───────────────────────────────────────────────
function GlassCard({ children, glow = false, goldBorder = false, className = '' }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: T.card,
        border: `1px solid ${goldBorder || glow ? 'rgba(214,168,79,0.2)' : 'rgba(214,168,79,0.07)'}`,
        boxShadow: glow
          ? '0 0 48px rgba(214,168,79,0.06), 0 8px 32px rgba(0,0,0,0.55)'
          : '0 4px 24px rgba(0,0,0,0.45)',
      }}
    >
      {children}
    </div>
  )
}

function Btn({ onClick, children, variant = 'gold', size = 'md', fullWidth = false, className = '' }) {
  const V = {
    gold:   { c: T.gold,   bg: 'rgba(214,168,79,0.1)',  b: 'rgba(214,168,79,0.4)',  glow: '0 0 22px rgba(214,168,79,0.16)' },
    green:  { c: T.green,  bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.35)', glow: '0 0 22px rgba(55,255,139,0.12)' },
    purple: { c: T.purple, bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.35)', glow: '0 0 22px rgba(143,92,255,0.12)' },
    red:    { c: T.red,    bg: 'rgba(248,113,113,0.08)', b: 'rgba(248,113,113,0.3)', glow: '0 0 18px rgba(248,113,113,0.1)' },
    ghost:  { c: T.mid,   bg: 'transparent',            b: 'rgba(90,95,107,0.25)',  glow: 'none' },
  }
  const v  = V[variant] || V.gold
  const sz = size === 'lg' ? 'px-7 py-4 text-sm' : size === 'sm' ? 'px-3 py-2 text-xs' : 'px-5 py-3 text-sm'
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-95 hover:opacity-90 ${sz} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ color: v.c, background: v.bg, border: `1px solid ${v.b}`, boxShadow: v.glow, minHeight: 44 }}
    >
      {children}
    </button>
  )
}

function Pill({ icon, label, color = T.gold }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: `${color}12`, border: `1px solid ${color}28`, color }}
    >
      <Icon name={icon} size={11} />
      {label}
    </div>
  )
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="flex-1 h-px" style={{ background: 'rgba(214,168,79,0.07)' }} />
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(214,168,79,0.3)' }}>
          {label}
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: 'rgba(214,168,79,0.07)' }} />
    </div>
  )
}

function StepRow({ number, title, body }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: 'rgba(214,168,79,0.1)', border: '1px solid rgba(214,168,79,0.3)', color: T.gold }}>
        {number}
      </div>
      <div className="pt-1">
        <div className="text-sm font-bold mb-0.5" style={{ color: T.silver }}>{title}</div>
        <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{body}</p>
      </div>
    </div>
  )
}

function AudienceCard({ icon, title, points, color = T.gold }) {
  return (
    <GlassCard>
      <div className="p-5 h-full space-y-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}0e`, border: `1px solid ${color}22` }}>
          <Icon name={icon} size={18} style={{ color }} />
        </div>
        <div className="text-sm font-bold" style={{ color: T.silver }}>{title}</div>
        <div className="space-y-1.5">
          {points.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <Icon name="ChevronRight" size={10} style={{ color, flexShrink: 0, marginTop: 3 }} />
              <span className="text-[11px] leading-relaxed" style={{ color: T.mid }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

function RiskTag({ label }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.18)', color: '#fca5a5' }}>
      <Icon name="AlertTriangle" size={11} />
      {label}
    </div>
  )
}

function CostTag({ label }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{ background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.18)', color: '#c4b5fd' }}>
      <Icon name="TrendingDown" size={11} />
      {label}
    </div>
  )
}

// ─── Shield SVG Mark ──────────────────────────────────────────
function ShieldMark({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="TrustSheild OS shield mark">
      <circle cx="32" cy="32" r="30" stroke="rgba(214,168,79,0.1)" strokeWidth="1" />
      <path d="M32 5 L55 17 L55 35 C55 49 45.5 58 32 63 C18.5 58 9 49 9 35 L9 17 Z"
        fill="rgba(214,168,79,0.04)" stroke="rgba(214,168,79,0.65)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M32 12 L50 22 L50 35 C50 46 43 53 32 57 C21 53 14 46 14 35 L14 22 Z"
        fill="rgba(143,92,255,0.05)" stroke="rgba(143,92,255,0.25)" strokeWidth="1" strokeLinejoin="round" />
      <line x1="16" y1="30" x2="48" y2="30" stroke="rgba(214,168,79,0.18)" strokeWidth="0.8" />
      <circle cx="32" cy="36" r="9" fill="rgba(55,255,139,0.07)" stroke="rgba(55,255,139,0.32)" strokeWidth="1" />
      <circle cx="32" cy="36" r="4.5" fill="#37ff8b" opacity="0.9" />
      <circle cx="32" cy="36" r="1.8" fill="#050505" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN HOMEPAGE
// ═══════════════════════════════════════════════════════════════
export default function Landing() {
  const navigate  = useNavigate()
  const isSetup   = setupDone()

  const goDashboard = () => isSetup ? navigate('/dashboard') : navigate('/auth/setup')
  const goPWA       = () => navigate('/driver-app')
  const goConfig    = () => isSetup ? navigate('/settings') : navigate('/auth/setup')
  const goDemo      = () => goDashboard()

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: T.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 40% at 15% 5%,  rgba(214,168,79,0.05)  0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 85% 90%, rgba(143,92,255,0.05)  0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 50%, rgba(55,255,139,0.018) 0%, transparent 65%)
        `,
        color: T.silver,
      }}
    >

      {/* ════════════════════════════════
          STICKY TOP NAV
      ════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3"
        style={{
          background: 'rgba(7,7,10,0.97)',
          borderBottom: '1px solid rgba(214,168,79,0.09)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <ShieldMark size={28} />
          <div className="min-w-0">
            <div className="text-sm font-black font-display leading-none truncate" style={{ color: T.gold }}>
              TrustSheild OS™
            </div>
            <div className="text-[9px] mt-0.5 leading-none" style={{ color: T.muted }}>
              Powered by 4P3X Intelligent AI™
            </div>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Btn onClick={goPWA} variant="ghost" size="sm">
            <Icon name="Smartphone" size={12} />
            <span className="hidden sm:inline">Response PWA</span>
          </Btn>
          <Btn onClick={goDashboard} variant="gold" size="sm">
            <Icon name="LayoutDashboard" size={12} />
            <span className="hidden sm:inline">Dashboard</span>
          </Btn>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-5 space-y-20 pb-20">

        {/* ════════════════════════════════
            1. HERO SECTION
        ════════════════════════════════ */}
        <section className="pt-16 sm:pt-20 text-center space-y-8">

          {/* Shield icon with glow */}
          <div className="flex justify-center">
            <div className="relative">
              <ShieldMark size={100} />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: '0 0 80px rgba(55,255,139,0.12), 0 0 120px rgba(214,168,79,0.07)' }} />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
              style={{ background: 'rgba(55,255,139,0.07)', border: '1px solid rgba(55,255,139,0.2)', color: T.green }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.green }} />
              Always-On Reputation Command System
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-none"
              style={{ color: T.gold, textShadow: '0 0 60px rgba(214,168,79,0.28)' }}>
              TrustSheild OS™
            </h1>
            <p className="text-lg sm:text-xl font-semibold" style={{ color: T.silver }}>
              Always-On Reputation Crisis Management Platform
            </p>
            <p className="text-sm" style={{ color: T.muted }}>
              Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™
            </p>
          </div>

          {/* Hero copy */}
          <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#a0a5b0' }}>
            TrustSheild OS™ is an AI-assisted reputation crisis management platform built to detect, assess,
            escalate, document, and respond to reputation threats before they become uncontrolled damage.
            It acts like an always-on reputation command team — helping organisations monitor configured people,
            companies, brands, keywords, social signals, reviews, media sources, and crisis triggers from one
            central control dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <Pill icon="ShieldCheck"     label="Always-On Monitoring"      color={T.gold}   />
            <Pill icon="Zap"             label="Crisis Escalation"          color={T.red}    />
            <Pill icon="Brain"           label="4P3X AI Advisory"           color={T.purple} />
            <Pill icon="Smartphone"      label="Mobile Response PWA"        color={T.green}  />
            <Pill icon="ArrowLeftRight"  label="Dashboard ↔ PWA Sync"      color={T.gold}   />
            <Pill icon="FolderOpen"      label="Evidence & Timeline"        color={T.silver} />
            <Pill icon="Users"           label="Team Coordination"          color={T.green}  />
            <Pill icon="BarChart3"       label="Reputation Analytics"       color={T.purple} />
          </div>

          {/* Primary CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Btn onClick={goDashboard} variant="gold" size="lg">
              <Icon name="LayoutDashboard" size={16} />
              Open Control Dashboard
            </Btn>
            <Btn onClick={goPWA} variant="green" size="lg">
              <Icon name="Smartphone" size={16} />
              Open / Install Crisis Response PWA
            </Btn>
            <Btn onClick={goConfig} variant="purple" size="lg">
              <Icon name="Settings" size={16} />
              Configure Live Monitoring
            </Btn>
            <Btn onClick={goDemo} variant="ghost" size="lg">
              <Icon name="Play" size={16} />
              View Demo Mode
            </Btn>
          </div>
        </section>

        {/* ════════════════════════════════
            2. ALWAYS-ON REPUTATION DEFENCE
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Core Platform Value" />
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              Always-On Reputation Defence
            </h2>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: T.mid }}>
              TrustSheild OS™ is designed to reduce the need for large manual monitoring teams by creating an
              always-active, AI-assisted reputation layer. Instead of relying on people to manually check social
              platforms, reviews, news mentions, complaints, and public sentiment across scattered systems,
              TrustSheild OS™ centralises the entire response workflow.
            </p>
          </div>

          {/* Capability grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: 'Eye',         color: T.gold,   title: 'Configured Monitoring',     desc: 'Track configured people, companies, brands, campaigns, and keywords across approved data sources and provider integrations.' },
              { icon: 'AlertTriangle', color: T.red,   title: 'Early-Warning Signals',     desc: 'Watch for early-warning reputation signals through configured API providers. In Live Mode, connect approved monitoring sources.' },
              { icon: 'ShieldAlert', color: T.purple, title: 'Crisis Scoring & Classification', desc: 'Score and classify potential crisis events by severity, urgency, and likely impact, with AI-assisted advisory triage support.' },
              { icon: 'Zap',         color: T.gold,   title: 'Automatic Escalation',      desc: 'Escalate detected issues directly into the Control Dashboard, updating case status, risk level, and response priority in real time.' },
              { icon: 'Smartphone',  color: T.green,  title: 'PWA Push Updates',          desc: 'Push crisis updates to the mobile Crisis Response PWA where live sync is configured — keeping response teams informed wherever they are.' },
              { icon: 'FolderOpen',  color: T.silver, title: 'Evidence & Timeline',       desc: 'Keep a complete, timestamped timeline of what happened, what was reviewed, what was approved, and what actions were taken.' },
            ].map((c, i) => (
              <GlassCard key={i} goldBorder={i === 0}>
                <div className="p-5 space-y-3 h-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${c.color}0e`, border: `1px solid ${c.color}22` }}>
                    <Icon name={c.icon} size={18} style={{ color: c.color }} />
                  </div>
                  <div className="text-sm font-bold" style={{ color: T.silver }}>{c.title}</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: T.muted }}>{c.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Live mode note */}
          <GlassCard>
            <div className="p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.22)' }}>
                <Icon name="Radio" size={16} style={{ color: T.green }} />
              </div>
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: T.green }}>Live Mode Note</div>
                <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
                  In Live Mode, TrustSheild OS™ can connect to approved API and backend providers to enable
                  live monitoring, alerts, sync, and real-time dashboard and PWA updates. Demo Mode is active
                  by default and shows the full workflow using safe sample data — no backend configuration required.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            3. WHY THIS EXISTS
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Why Reputation Management Matters" />
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              Reputation Damage Moves Fast
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: T.mid }}>
              A slow or poor response to a reputation event rarely stays contained.
              The platforms that amplify damage do not wait for an organisation to get organised.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crisis triggers */}
            <GlassCard>
              <div className="p-5 space-y-4">
                <div className="text-sm font-bold" style={{ color: T.red }}>
                  <Icon name="Flame" size={14} className="inline mr-2" />
                  Common Reputation Triggers
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Negative press','Viral social posts','Review bombing','Public complaints',
                    'Data breach concerns','Product/service failures','Employee incidents',
                    'Legal disputes','Misinformation','Influencer escalation',
                    'Customer service failures','Poor response timing'].map(t => (
                    <RiskTag key={t} label={t} />
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Cost of slow response */}
            <GlassCard>
              <div className="p-5 space-y-4">
                <div className="text-sm font-bold" style={{ color: T.purple }}>
                  <Icon name="TrendingDown" size={14} className="inline mr-2" />
                  Cost of a Slow or Poor Response
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Loss of trust','Lost revenue','Lost contracts','Damaged search footprint',
                    'Legal exposure','PR escalation','Investor concern','Staff confusion',
                    'Customer churn','Higher recovery costs','Long-term brand damage'].map(t => (
                    <CostTag key={t} label={t} />
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ════════════════════════════════
            4. WHO IT IS FOR
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Who It Is For" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              Built for Every Organisation That Has a Reputation to Protect
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AudienceCard
              icon="Building2" color={T.gold} title="Businesses & SMEs"
              points={['Faster issue detection','Centralised case management','Lower manual monitoring workload','Documented response evidence']} />
            <AudienceCard
              icon="User" color={T.silver} title="Founders & Executives"
              points={['Personal reputation monitoring','AI advisory briefing','Mobile PWA access','Crisis timeline visibility']} />
            <AudienceCard
              icon="Star" color={T.purple} title="Public Figures & Creators"
              points={['Keyword and mention monitoring','Platform-agnostic tracking','Fast escalation visibility','Response drafting support']} />
            <AudienceCard
              icon="Megaphone" color={T.gold} title="PR & Communications Teams"
              points={['Consolidated alert queue','Response draft workspace','Stakeholder update management','Evidence and audit trail']} />
            <AudienceCard
              icon="Briefcase" color={T.green} title="Reputation Management Agencies"
              points={['Multi-client case management','Demo-safe client presentations','Modular API provider setup','Scalable dashboard architecture']} />
            <AudienceCard
              icon="Scale" color={T.red} title="Legal & Compliance Teams"
              points={['Evidence collection and logging','Incident timeline documentation','Human-approved response workflow','Compliance-friendly audit records']} />
            <AudienceCard
              icon="HeadphonesIcon" color={T.silver} title="Customer Support Teams"
              points={['Escalation visibility','Review monitoring (Live Mode)','PWA updates from any device','Response task assignment']} />
            <AudienceCard
              icon="Heart" color={T.purple} title="Schools, Charities & Public-Facing Orgs"
              points={['Reputational risk awareness','Stakeholder communication tools','Safe demo mode for review','Incident documentation']} />
            <AudienceCard
              icon="BarChart3" color={T.gold} title="Investors & Board-Level Reviewers"
              points={['Full platform demo without real data','Modular architecture visibility','Scalable sector-agnostic foundation','Crisis readiness assessment']} />
          </div>
        </section>

        {/* ════════════════════════════════
            5. WHAT THE PLATFORM DOES
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Platform Capabilities" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              What TrustSheild OS™ Supports
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: 'Settings',       color: T.gold,   label: 'Reputation monitoring setup',                 note: '' },
              { icon: 'Users',          color: T.silver, label: 'People, company & brand profile tracking',    note: '' },
              { icon: 'Tags',           color: T.purple, label: 'Keyword & crisis trigger configuration',      note: '' },
              { icon: 'Inbox',          color: T.gold,   label: 'Crisis case intake & classification',         note: '' },
              { icon: 'Activity',       color: T.red,    label: 'Risk scoring & severity assessment',          note: '' },
              { icon: 'ArrowUpRight',   color: T.red,    label: 'Escalation tracking & case progression',      note: '' },
              { icon: 'Network',        color: T.silver, label: 'Stakeholder mapping & communication planning',note: '' },
              { icon: 'FileEdit',       color: T.gold,   label: 'AI-assisted public response drafting',        note: 'Advisory — human review required' },
              { icon: 'FolderOpen',     color: T.green,  label: 'Evidence logging & document management',      note: '' },
              { icon: 'Clock',          color: T.silver, label: 'Full incident timeline building',             note: '' },
              { icon: 'CheckSquare',    color: T.green,  label: 'Response task management & assignment',       note: '' },
              { icon: 'Smartphone',     color: T.green,  label: 'Crisis Response PWA for field teams',         note: '' },
              { icon: 'ArrowLeftRight', color: T.gold,   label: 'Real-time dashboard ↔ PWA sync',             note: 'Where backend/API is configured' },
              { icon: 'TrendingUp',     color: T.purple, label: 'Recovery tracking & trust restoration',       note: '' },
              { icon: 'Download',       color: T.silver, label: 'Exportable crisis reports',                   note: '' },
              { icon: 'Play',           color: T.gold,   label: 'Demo Mode and Live Mode operation',           note: '' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(13,13,18,0.7)', border: '1px solid rgba(214,168,79,0.06)' }}>
                <Icon name={item.icon} size={15} style={{ color: item.color, flexShrink: 0 }} />
                <span className="text-[12px] font-medium flex-1" style={{ color: T.mid }}>{item.label}</span>
                {item.note && (
                  <span className="text-[10px] px-2 py-0.5 rounded flex-shrink-0"
                    style={{ background: 'rgba(143,92,255,0.08)', color: '#a78bfa', border: '1px solid rgba(143,92,255,0.2)' }}>
                    {item.note}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs" style={{ color: T.muted }}>
              Live Mode can be configured to connect approved providers where available. Demo Mode runs all workflows safely without a live backend.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════
            6. REAL-TIME RESPONSE FLOW
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Operational Flow" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              Real-Time Crisis Response Flow
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: T.mid }}>
              From signal detection to coordinated response — one controlled workflow.
            </p>
          </div>

          <GlassCard glow>
            <div className="p-6 sm:p-8 space-y-6">
              <StepRow number="1" title="Configure Monitoring Profiles"
                body="A person, company, brand, keyword, review source, social channel, or media signal is configured for monitoring. In Live Mode, approved API providers can be connected." />
              <div className="h-px ml-4" style={{ background: 'rgba(214,168,79,0.08)' }} />
              <StepRow number="2" title="Platform Watches Configured Sources"
                body="TrustSheild OS™ watches configured sources through available demo data or live providers depending on current mode. No claims are made about live monitoring unless a provider is actually connected." />
              <div className="h-px ml-4" style={{ background: 'rgba(214,168,79,0.08)' }} />
              <StepRow number="3" title="Threat Detection & Crisis Event Creation"
                body="When a potential reputation threat appears, the platform creates or updates a crisis event — with risk level, detected signals, and suggested response priority." />
              <div className="h-px ml-4" style={{ background: 'rgba(214,168,79,0.08)' }} />
              <StepRow number="4" title="Control Dashboard Updates"
                body="The Control Dashboard displays the alert, risk level, timeline, AI advisory guidance, evidence, and response status — giving command-level visibility to the crisis." />
              <div className="h-px ml-4" style={{ background: 'rgba(214,168,79,0.08)' }} />
              <StepRow number="5" title="Crisis Response PWA Notified"
                body="The Crisis Response PWA receives the update so mobile users or response teams can act quickly, check task assignments, submit updates, and escalate further if needed." />
              <div className="h-px ml-4" style={{ background: 'rgba(214,168,79,0.08)' }} />
              <StepRow number="6" title="PWA Updates Sync Back to Dashboard"
                body="Updates, evidence notes, and status changes submitted via the PWA sync back to the dashboard where sync is configured — creating a full, auditable response record." />

              <div className="pt-2 rounded-xl p-4 text-center"
                style={{ background: 'rgba(55,255,139,0.05)', border: '1px solid rgba(55,255,139,0.15)' }}>
                <p className="text-xs font-semibold" style={{ color: T.green }}>
                  Demo Mode shows the workflow. Live Mode can run the workflow through configured backend and API providers.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            7. CONTROL DASHBOARD
        ════════════════════════════════ */}
        <section className="space-y-6">
          <Divider label="Control Dashboard" />
          <GlassCard glow>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(214,168,79,0.1)', border: '1px solid rgba(214,168,79,0.3)' }}>
                    <Icon name="LayoutDashboard" size={18} style={{ color: T.gold }} />
                  </div>
                  <h2 className="text-xl font-black font-display" style={{ color: T.gold }}>
                    TrustSheild Command Dashboard
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: T.mid }}>
                  The Command Dashboard is the central reputation command centre — giving operators
                  and decision-makers full visibility across all active cases, alerts, monitored profiles,
                  stakeholder communications, evidence, and AI advisory guidance.
                </p>
                <div className="space-y-2">
                  {['Live crisis case overview and risk tracking',
                    'Monitored people, company, and brand profiles',
                    'Alert queue and escalation management',
                    'AI advisory panels — human approval required',
                    'API and backend provider configuration',
                    'Demo / Live Mode toggle with data separation',
                    'Evidence, timeline, and audit records',
                    'Crisis Response PWA sync visibility',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Icon name="Check" size={11} style={{ color: T.gold, flexShrink: 0, marginTop: 3 }} />
                      <span className="text-xs" style={{ color: T.mid }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Btn onClick={goDashboard} variant="gold">
                  <Icon name="LayoutDashboard" size={14} />
                  Open Control Dashboard
                </Btn>
              </div>

              {/* Dashboard preview card */}
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: 'rgba(7,7,10,0.8)', border: '1px solid rgba(214,168,79,0.1)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(214,168,79,0.4)' }}>
                  Dashboard Tabs
                </div>
                {[
                  { icon: 'ShieldCheck',   label: 'Trust Overview',         active: true },
                  { icon: 'AlertTriangle', label: 'Active Risks',           active: false },
                  { icon: 'Zap',           label: 'Crisis Command',         active: false },
                  { icon: 'Radio',         label: 'Live Feed',              active: false },
                  { icon: 'Brain',         label: 'AI Advisory Agents',     active: false },
                  { icon: 'Database',      label: 'Backend Configuration',  active: false },
                  { icon: 'ArrowLeftRight',label: 'Sync Centre',            active: false },
                ].map((tab, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    style={{
                      background: tab.active ? 'rgba(214,168,79,0.08)' : 'transparent',
                      border: `1px solid ${tab.active ? 'rgba(214,168,79,0.2)' : 'transparent'}`,
                    }}>
                    <Icon name={tab.icon} size={13} style={{ color: tab.active ? T.gold : T.muted }} />
                    <span className="text-xs" style={{ color: tab.active ? T.silver : T.muted }}>{tab.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            8. CRISIS RESPONSE PWA
        ════════════════════════════════ */}
        <section className="space-y-6">
          <Divider label="Crisis Response PWA" />
          <GlassCard>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 order-2 md:order-1">
                {/* PWA preview card */}
                <div className="rounded-2xl overflow-hidden mx-auto max-w-[200px]"
                  style={{ background: 'rgba(7,7,10,0.9)', border: '1px solid rgba(55,255,139,0.15)', boxShadow: '0 0 40px rgba(55,255,139,0.08)' }}>
                  <div className="px-4 py-3 flex items-center gap-2"
                    style={{ borderBottom: '1px solid rgba(55,255,139,0.08)' }}>
                    <ShieldMark size={20} />
                    <div>
                      <div className="text-[10px] font-bold" style={{ color: T.green }}>TrustSheild OS™</div>
                      <div className="text-[8px]" style={{ color: T.muted }}>Crisis Response PWA</div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {['Crisis Brief','AI Guidance','Tasks','Evidence','Sync Status'].map((s, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg text-[10px]"
                        style={{ background: i === 0 ? 'rgba(55,255,139,0.08)' : 'transparent',
                                 border: `1px solid ${i === 0 ? 'rgba(55,255,139,0.2)' : 'rgba(214,168,79,0.06)'}`,
                                 color: i === 0 ? T.green : T.muted }}>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.green }} />
                      <span className="text-[9px]" style={{ color: T.green }}>Installable PWA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 order-1 md:order-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.25)' }}>
                    <Icon name="Smartphone" size={18} style={{ color: T.green }} />
                  </div>
                  <h2 className="text-xl font-black font-display" style={{ color: T.green }}>
                    Crisis Response PWA
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: T.mid }}>
                  The TrustSheild Crisis Response PWA is the mobile layer of the platform — installable on
                  any phone, tablet, or desktop as a standalone app. It gives response teams fast access to
                  their assigned tasks, crisis briefs, AI guidance, and status updates wherever they are.
                </p>
                <div className="space-y-2">
                  {['Fast mobile access on any device','Assigned task review and updates',
                    'Crisis brief and AI advisory guidance','Evidence notes and status submission',
                    'Escalation visibility and response confirmation',
                    'Dashboard sync where backend/API is configured',
                    'Installable to phone, tablet, or desktop',
                    'Works in Demo Mode without backend setup',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Icon name="Check" size={11} style={{ color: T.green, flexShrink: 0, marginTop: 3 }} />
                      <span className="text-xs" style={{ color: T.mid }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Btn onClick={goPWA} variant="green">
                  <Icon name="Smartphone" size={14} />
                  Open / Install Crisis Response PWA
                </Btn>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            9. DEMO / LIVE MODE
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Demo Mode & Live Mode" />
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              "Demo Mode shows the product. Live Mode runs the product."
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Demo Mode */}
            <GlassCard>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(214,168,79,0.1)', border: '1px solid rgba(214,168,79,0.3)' }}>
                    <Icon name="Play" size={16} style={{ color: T.gold }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: T.gold }}>Demo Mode</div>
                    <div className="text-sm font-bold" style={{ color: T.silver }}>Safe Sample Data · No Backend Required</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
                  Uses realistic sample reputation data to show the full platform workflow — monitoring, alerts,
                  dashboard updates, PWA updates, AI advisory outputs, and reports — without connecting to
                  any real accounts or services.
                </p>
                <div className="space-y-2">
                  {['All 8 AI advisory agents fully active',
                    'Sample crisis cases, tasks, and PWA identities',
                    'Full dashboard ↔ PWA sync workflow',
                    'Suitable for investor, client, or team demos',
                    'Safe for presentations and validation',
                    'No backend credentials needed',
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Icon name="Check" size={11} style={{ color: T.gold, flexShrink: 0, marginTop: 3 }} />
                      <span className="text-[11px]" style={{ color: T.mid }}>{b}</span>
                    </div>
                  ))}
                </div>
                <Btn onClick={goDemo} variant="gold">
                  <Icon name="Play" size={13} />View Demo Mode
                </Btn>
              </div>
            </GlassCard>

            {/* Live Mode */}
            <GlassCard>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(55,255,139,0.08)', border: '1px solid rgba(55,255,139,0.3)' }}>
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: T.green }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: T.green }}>Live Mode</div>
                    <div className="text-sm font-bold" style={{ color: T.silver }}>Real Operation · Backend Required</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
                  Demo data is disabled. Real people, company, brand, and keyword profiles can be added.
                  Backend providers can be configured and approved APIs connected to enable real monitoring,
                  alerts, dashboard updates, and PWA sync.
                </p>
                <div className="space-y-2">
                  {['Real case, profile, and keyword records',
                    'Backend provider configuration (Supabase/Firebase/REST)',
                    'Approved API connections for monitoring providers',
                    'Real alerts and crisis events stored securely',
                    'Real-time dashboard and PWA sync where configured',
                    'Full operational crisis response capability',
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Icon name="Check" size={11} style={{ color: T.green, flexShrink: 0, marginTop: 3 }} />
                      <span className="text-[11px]" style={{ color: T.mid }}>{b}</span>
                    </div>
                  ))}
                </div>
                <Btn onClick={goConfig} variant="green">
                  <Icon name="Settings" size={13} />Configure Live Monitoring
                </Btn>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ════════════════════════════════
            10. MODULAR 4P3X ARCHITECTURE
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="4P3X Modular Architecture" />
          <GlassCard glow>
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(143,92,255,0.1)', border: '1px solid rgba(143,92,255,0.3)' }}>
                  <Icon name="Layers" size={18} style={{ color: T.purple }} />
                </div>
                <h2 className="text-xl font-black font-display" style={{ color: T.purple }}>
                  Modular 4P3X Architecture
                </h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: T.mid }}>
                TrustSheild OS™ is not just a static demo. It is part of a reusable modular 4P3X architecture —
                a <strong style={{ color: T.silver }}>dashboard + PWA + AI-agent + demo/live-mode</strong> foundation
                that can be refactored into multiple sector-specific products through controlled build prompts,
                brand configuration, content modules, data models, API providers, and backend settings.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: T.mid }}>
                The same architecture can support:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {['Reputation Crisis Management','Compliance Dashboards','Fleet Safety Systems',
                  'Training Platforms','Health & Wellbeing Systems','Client Response Platforms',
                  'Evidence & Reporting Systems','Emergency Response Tools',
                  'AI-Assisted Business Operations','Portfolio / Project Agents'
                ].map((item, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg text-center text-[10px] font-medium leading-tight"
                    style={{ background: 'rgba(143,92,255,0.07)', border: '1px solid rgba(143,92,255,0.15)', color: '#c4b5fd' }}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="pt-2 text-center text-xs" style={{ color: T.muted }}>
                Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            11. FORCE MULTIPLIER
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Team Force Multiplier" />
          <GlassCard>
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(214,168,79,0.1)', border: '1px solid rgba(214,168,79,0.3)' }}>
                  <Icon name="Zap" size={18} style={{ color: T.gold }} />
                </div>
                <h2 className="text-xl font-black font-display" style={{ color: T.gold }}>
                  Built to Do the Work of a Reputation Response Team
                </h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: T.mid }}>
                TrustSheild OS™ is designed to act as a force multiplier for teams that cannot afford to
                manually monitor every platform, review, article, post, complaint, and escalation point
                all day. It helps combine the functions of monitoring, triage, documentation, response
                planning, team coordination, and mobile updates into one controlled system — reducing
                the manual monitoring load without removing human judgement.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['PR Monitoring','Social Listening','Customer Response',
                  'Legal Review Prep','Executive Reporting','Crisis Coordination',
                  'Evidence Collection','Recovery Tracking','Internal Communication'
                ].map((role, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(214,168,79,0.05)', border: '1px solid rgba(214,168,79,0.1)' }}>
                    <Icon name="CheckCircle" size={12} style={{ color: T.gold, flexShrink: 0 }} />
                    <span className="text-[11px]" style={{ color: T.mid }}>{role}</span>
                  </div>
                ))}
              </div>

              {/* Responsibility notice */}
              <div className="rounded-xl p-4"
                style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" size={14} style={{ color: T.red, flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#fca5a5' }}>
                    <strong>TrustSheild OS™ supports and accelerates human teams.</strong> It does not remove
                    the need for human judgement, legal review, PR approval, or executive decision-making.
                    All AI outputs are advisory only and require human review before any public action is taken.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            12. INVESTOR / CLIENT READINESS
        ════════════════════════════════ */}
        <section className="space-y-8">
          <Divider label="Commercial Proposition" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-display" style={{ color: T.gold }}>
              Commercially Ready Architecture
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: T.mid }}>
              Why TrustSheild OS™ is a credible platform for investment, agency use, and product commercialisation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: 'Target',     color: T.gold,   title: 'High-Value Market',         body: 'Reputation risk is high-value and time-sensitive. Businesses, public figures, and agencies all face ongoing reputation exposure that demands an organised system.' },
              { icon: 'TrendingDown', color: T.red,  title: 'Manual Monitoring Is Broken', body: 'Manual reputation monitoring is expensive, inconsistent, and slow. A structured AI-assisted platform reduces cost and increases response confidence.' },
              { icon: 'Zap',        color: T.purple, title: 'Speed + Evidence + Coordination', body: 'Effective crisis response requires all three: fast detection, documented evidence, and coordinated action — TrustSheild OS™ combines them in one system.' },
              { icon: 'Play',       color: T.gold,   title: 'Demonstrable Immediately',  body: 'The platform can be demonstrated safely with demo data — full workflow visible to investors, clients, and reviewers without connecting any real accounts.' },
              { icon: 'Radio',      color: T.green,  title: 'Operational Without a Rebuild', body: 'Turning off Demo Mode and connecting approved backend/API providers activates live operation — no redevelopment needed to move from demo to production.' },
              { icon: 'Layers',     color: T.purple, title: 'Scalable & Sector-Agnostic', body: 'The modular 4P3X architecture can be refactored into other sectors: compliance, training, emergency response, health — reducing future build costs significantly.' },
            ].map((c, i) => (
              <GlassCard key={i}>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${c.color}0e`, border: `1px solid ${c.color}22` }}>
                      <Icon name={c.icon} size={15} style={{ color: c.color }} />
                    </div>
                    <div className="text-sm font-bold" style={{ color: T.silver }}>{c.title}</div>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: T.muted }}>{c.body}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════
            13. SAFETY / RESPONSIBILITY
        ════════════════════════════════ */}
        <section>
          <GlassCard>
            <div className="p-6 space-y-3"
              style={{ borderLeft: '3px solid rgba(248,113,113,0.4)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="ShieldCheck" size={15} style={{ color: T.red }} />
                <span className="text-sm font-bold" style={{ color: T.red }}>Safety & Responsibility Notice</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: T.mid }}>
                TrustSheild OS™ provides AI-assisted reputation monitoring, crisis organisation, documentation,
                escalation support, and response guidance. It does <strong style={{ color: T.silver }}>not</strong> replace
                legal advice, PR counsel, compliance review, executive judgement, or professional crisis
                communications advice. Human review and approval are required before public statements,
                legal-sensitive responses, or high-risk actions are issued.
              </p>
              <p className="text-xs" style={{ color: T.muted }}>
                Monitoring must only be configured for owned brands, authorised clients, public information
                sources, or lawful business/reputation purposes. TrustSheild OS™ must not be used for
                harassment, private surveillance, impersonation, or unauthorised tracking.
              </p>
              <p className="text-[11px] font-semibold" style={{ color: 'rgba(248,113,113,0.7)' }}>
                Advisory only. Always reviewed by a responsible human before action.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* ════════════════════════════════
            14. SHORTCUT PANEL
        ════════════════════════════════ */}
        <section className="space-y-6">
          <Divider label="Quick Access" />
          <div className="text-center">
            <h2 className="text-xl font-black font-display" style={{ color: T.gold }}>Platform Shortcuts</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: 'LayoutDashboard', label: 'Open Control Dashboard',              variant: 'gold',   fn: goDashboard },
              { icon: 'Smartphone',      label: 'Open / Install Response PWA',         variant: 'green',  fn: goPWA },
              { icon: 'Settings',        label: 'Configure Live Monitoring',           variant: 'purple', fn: goConfig },
              { icon: 'Database',        label: 'Configure API Providers',             variant: 'purple', fn: goConfig },
              { icon: 'Play',            label: 'View Demo Mode',                      variant: 'gold',   fn: goDemo },
              { icon: 'FolderOpen',      label: 'View Reports & Evidence',             variant: 'ghost',  fn: goDashboard },
              { icon: 'Brain',           label: 'Open AI Command Centre',              variant: 'ghost',  fn: () => isSetup ? navigate('/ai') : navigate('/auth/setup') },
              { icon: 'Home',            label: 'Return Home',                         variant: 'ghost',  fn: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            ].map((item, i) => (
              <Btn key={i} onClick={item.fn} variant={item.variant} fullWidth size="md"
                className="!justify-start !text-left">
                <Icon name={item.icon} size={13} />
                <span className="text-xs leading-tight">{item.label}</span>
              </Btn>
            ))}
          </div>
        </section>

      </main>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer
        className="mt-8 px-5 py-8 text-center space-y-3"
        style={{ borderTop: '1px solid rgba(214,168,79,0.07)' }}
      >
        <ShieldMark size={32} />
        <div>
          <div className="text-sm font-bold font-display" style={{ color: T.gold }}>TrustSheild OS™</div>
          <div className="text-xs mt-1" style={{ color: T.muted }}>
            Always-On Reputation Crisis Management Platform
          </div>
        </div>
        <p className="text-[11px]" style={{ color: 'rgba(214,168,79,0.5)' }}>
          {APP_CONFIG.globalBrand}
        </p>
        <p className="text-[10px]" style={{ color: 'rgba(90,95,107,0.6)' }}>
          AI outputs are advisory only. Human review required before any public, legal, or media action.
        </p>
      </footer>
    </div>
  )
}
