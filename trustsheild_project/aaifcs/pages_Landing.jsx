/**
 * ============================================================
 * TrustSheild OS™ — Landing / Intro Explainer (Run 11)
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 *
 * Route: /welcome  (public — no auth guard)
 * This is the investor/demo-ready intro page.
 * It does NOT replace the dashboard or PWA.
 * It links directly to: Dashboard, Response PWA, Backend Setup, AI Centre.
 *
 * ETHICAL NOTICE:
 *   AI guidance is advisory only.
 *   Human review required before any public, legal, or media action.
 * ============================================================
 */

import { useNavigate } from 'react-router-dom'
import Icon from './components_ui_Icon'
import APP_CONFIG from './config_app'

// ─── Mini primitives ──────────────────────────────────────────
function Card({ children, glow = false, className = '' }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(13,13,18,0.92)',
        border: `1px solid ${glow ? 'rgba(214,168,79,0.22)' : 'rgba(214,168,79,0.08)'}`,
        boxShadow: glow ? '0 0 32px rgba(214,168,79,0.06), 0 4px 24px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </div>
  )
}
function PrimaryBtn({ onClick, children, variant = 'gold', fullWidth = false }) {
  const V = {
    gold:   { c: '#d6a84f', bg: 'rgba(214,168,79,0.1)',  b: 'rgba(214,168,79,0.4)',  shadow: '0 0 20px rgba(214,168,79,0.15)' },
    green:  { c: '#37ff8b', bg: 'rgba(55,255,139,0.08)', b: 'rgba(55,255,139,0.35)', shadow: '0 0 20px rgba(55,255,139,0.12)' },
    purple: { c: '#8f5cff', bg: 'rgba(143,92,255,0.08)', b: 'rgba(143,92,255,0.35)', shadow: '0 0 20px rgba(143,92,255,0.12)' },
    ghost:  { c: '#5a5f6b', bg: 'transparent',           b: 'rgba(90,95,107,0.25)',  shadow: 'none' },
  }
  const v = V[variant] || V.gold
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 hover:opacity-90 ${fullWidth ? 'w-full' : ''}`}
      style={{ color: v.c, background: v.bg, border: `1px solid ${v.b}`, boxShadow: v.shadow, minHeight: 44 }}>
      {children}
    </button>
  )
}
function FeaturePill({ icon, label, color = '#d6a84f' }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
      style={{ background: `${color}0d`, border: `1px solid ${color}22`, color }}>
      <Icon name={icon} size={12} />
      {label}
    </div>
  )
}
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: 'rgba(214,168,79,0.08)' }} />
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(214,168,79,0.35)' }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(214,168,79,0.08)' }} />
    </div>
  )
}

// ─── Shield Logo Mark ─────────────────────────────────────────
function ShieldMark({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="TrustSheild OS shield mark">
      <circle cx="32" cy="32" r="30" stroke="rgba(214,168,79,0.12)" strokeWidth="1"/>
      <path
        d="M32 6 L54 17 L54 34 C54 48 45 57 32 62 C19 57 10 48 10 34 L10 17 Z"
        fill="rgba(214,168,79,0.05)" stroke="rgba(214,168,79,0.7)" strokeWidth="1.8" strokeLinejoin="round"
      />
      <path
        d="M32 12 L50 22 L50 34 C50 45 43 52 32 57 C21 52 14 45 14 34 L14 22 Z"
        fill="rgba(143,92,255,0.05)" stroke="rgba(143,92,255,0.3)" strokeWidth="1" strokeLinejoin="round"
      />
      <line x1="16" y1="29" x2="48" y2="29" stroke="rgba(214,168,79,0.2)" strokeWidth="0.8"/>
      <circle cx="32" cy="35" r="8" fill="rgba(55,255,139,0.08)" stroke="rgba(55,255,139,0.35)" strokeWidth="1"/>
      <circle cx="32" cy="35" r="4" fill="#37ff8b"/>
      <circle cx="32" cy="35" r="1.5" fill="#050505"/>
    </svg>
  )
}

// ─── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color = '#d6a84f', badge }) {
  return (
    <Card>
      <div className="p-5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}0f`, border: `1px solid ${color}22` }}>
            <Icon name={icon} size={18} style={{ color }} />
          </div>
          {badge && (
            <span className="text-[9px] px-2 py-0.5 rounded font-bold flex-shrink-0"
              style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>{badge}</span>
          )}
        </div>
        <div className="text-sm font-bold" style={{ color: '#c8ccd2' }}>{title}</div>
        <p className="text-xs leading-relaxed" style={{ color: '#5a5f6b' }}>{desc}</p>
      </div>
    </Card>
  )
}

// ─── Mode Card ────────────────────────────────────────────────
function ModeCard({ mode, icon, title, desc, bullets, color }) {
  return (
    <Card>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${color}0f`, border: `1px solid ${color}25` }}>
            <Icon name={icon} size={16} style={{ color }} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{mode}</div>
            <div className="text-sm font-semibold" style={{ color: '#c8ccd2' }}>{title}</div>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#5a5f6b' }}>{desc}</p>
        <div className="space-y-1.5">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <Icon name="Check" size={11} style={{ color, flexShrink: 0, marginTop: 2 }} />
              <span className="text-[11px]" style={{ color: '#a8adb7' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════
// ROOT — Landing / Welcome Page
// ═══════════════════════════════════════════════════════════════
export default function Landing() {
  const navigate = useNavigate()
  const isSetup  = localStorage.getItem('apex:setup_complete') === 'true'

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: '#07070A',
        backgroundImage: `
          radial-gradient(ellipse at 20% 10%, rgba(214,168,79,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(143,92,255,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(55,255,139,0.02) 0%, transparent 60%)
        `,
      }}
    >
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3"
        style={{ background: 'rgba(7,7,10,0.95)', borderBottom: '1px solid rgba(214,168,79,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3">
          <ShieldMark size={30} />
          <div>
            <div className="text-sm font-bold font-display" style={{ color: '#d6a84f' }}>TrustSheild OS™</div>
            <div className="text-[9px]" style={{ color: '#5a5f6b' }}>Powered by 4P3X Intelligent AI™</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PrimaryBtn onClick={() => navigate('/driver-app')} variant="ghost">
            <Icon name="Smartphone" size={13} />Response PWA
          </PrimaryBtn>
          <PrimaryBtn onClick={() => isSetup ? navigate('/dashboard') : navigate('/auth/setup')} variant="gold">
            <Icon name="LayoutDashboard" size={13} />Command Dashboard
          </PrimaryBtn>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* ── Hero ── */}
        <section className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <ShieldMark size={88} />
              <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 60px rgba(55,255,139,0.12), 0 0 100px rgba(214,168,79,0.06)' }} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black font-display leading-tight"
              style={{ color: '#d6a84f', textShadow: '0 0 40px rgba(214,168,79,0.25)' }}>
              TrustSheild OS™
            </h1>
            <p className="text-base mt-2 font-medium" style={{ color: '#c8ccd2' }}>AI-Assisted Reputation Protection &amp; Crisis Response Platform</p>
            <p className="text-sm mt-1" style={{ color: '#5a5f6b' }}>Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™</p>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: '#a8adb7' }}>
            TrustSheild OS™ is a dashboard-connected reputation protection and crisis response platform built to help teams organise evidence, assign response actions, coordinate PWA updates, review AI-assisted guidance, and prepare responsible stakeholder communication.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { i: 'ShieldCheck',    l: 'Reputation Protection', c: '#d6a84f' },
              { i: 'Zap',           l: 'Crisis Response',        c: '#f87171' },
              { i: 'Brain',         l: '4P3X AI Advisory',       c: '#8f5cff' },
              { i: 'Smartphone',    l: 'Response PWA',           c: '#37ff8b' },
              { i: 'ArrowLeftRight',l: 'Live Sync',              c: '#38bdf8' },
            ].map(f => <FeaturePill key={f.l} icon={f.i} label={f.l} color={f.c} />)}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <PrimaryBtn onClick={() => isSetup ? navigate('/dashboard') : navigate('/auth/setup')} variant="gold">
              <Icon name="LayoutDashboard" size={15} />Open Command Dashboard
            </PrimaryBtn>
            <PrimaryBtn onClick={() => navigate('/driver-app')} variant="green">
              <Icon name="Smartphone" size={15} />Open Response PWA
            </PrimaryBtn>
          </div>
        </section>

        <SectionDivider label="What it does" />

        {/* ── Features ── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon="LayoutDashboard" color="#d6a84f" title="Command Dashboard" badge="Dashboard"
              desc="Central command interface for monitoring reputation risks, assigning response tasks, reviewing AI advisory guidance, managing evidence, and coordinating stakeholder updates." />
            <FeatureCard icon="Smartphone" color="#37ff8b" title="Response PWA" badge="Mobile"
              desc="Installable PWA for responders in the field. Accepts task assignments from the dashboard, submits updates, logs evidence, requests escalation, and reviews response drafts." />
            <FeatureCard icon="Brain" color="#8f5cff" title="4P3X AI Advisory" badge="Advisory Only"
              desc="Eight advisory AI agents for triage, risk assessment, crisis response planning, draft outlines, evidence review, stakeholder updates, recovery planning, and task guidance." />
            <FeatureCard icon="ArrowLeftRight" color="#38bdf8" title="Sync Engine" badge="Run 9"
              desc="Demo/local sync in Demo Mode. Backend-ready adapters for Supabase, Firebase, or REST APIs in Live Mode. Offline queue with freshness warnings." />
            <FeatureCard icon="Clock" color="#fbbf24" title="Evidence & Timeline"
              desc="Track what happened, when, who submitted it, and what evidence is still needed. Documentation scoring and audit-readiness assessment." />
            <FeatureCard icon="Send" color="#34d399" title="Stakeholder Updates"
              desc="Structured internal and external update templates. Audience-specific wording, approval reminders, and sensitive language warnings." />
          </div>
        </section>

        <SectionDivider label="Demo Mode vs Live Mode" />

        {/* ── Mode Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ModeCard mode="Demo Mode" icon="PlayCircle" color="#8f5cff" title="Shows the product"
            desc="Demo Mode shows the product with realistic sample workflows — no backend or external API required."
            bullets={[
              'Realistic reputation incident scenarios',
              'PWA updates, tasks, sync, and evidence',
              'All 8 AI advisory agents in demo mode',
              'Full dashboard and PWA experience',
              'No backend credentials needed',
            ]} />
          <ModeCard mode="Live Mode" icon="Zap" color="#37ff8b" title="Runs the product"
            desc="With Demo Mode off and a backend provider configured, TrustSheild OS™ is structured to operate with real data."
            bullets={[
              'Real users and persistent records',
              'Authenticated access via Supabase/Firebase/REST',
              'Live sync from PWA to dashboard',
              'Backend-connected AI provider (via proxy)',
              'Full audit trail and evidence storage',
            ]} />
        </section>

        {/* ── AI Advisory notice ── */}
        <section>
          <div className="flex items-start gap-4 p-5 rounded-2xl"
            style={{ background: 'rgba(143,92,255,0.06)', border: '1px solid rgba(143,92,255,0.18)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(143,92,255,0.1)', border: '1px solid rgba(143,92,255,0.25)' }}>
              <Icon name="ShieldCheck" size={18} style={{ color: '#8f5cff' }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#8f5cff' }}>4P3X Intelligent AI™ — Advisory Only</div>
              <p className="text-sm mt-1" style={{ color: '#a8adb7' }}>
                4P3X Intelligent AI™ guidance is advisory only. All crisis, reputation, legal, public, customer, media, or stakeholder actions must be reviewed and approved by a responsible human before action.
              </p>
              <p className="text-xs mt-2" style={{ color: '#5a5f6b' }}>
                Monitoring and sync should only be used for owned brands, authorised clients, or lawful business/reputation purposes.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider label="Quick access" />

        {/* ── Quick links ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Open Command Dashboard',    icon: 'LayoutDashboard', variant: 'gold',   action: () => isSetup ? navigate('/dashboard') : navigate('/auth/setup') },
            { label: 'Open Response PWA',          icon: 'Smartphone',      variant: 'green',  action: () => navigate('/driver-app') },
            { label: 'View AI Agent Centre',       icon: 'Brain',           variant: 'purple', action: () => isSetup ? navigate('/dashboard') : navigate('/auth/setup') },
            { label: 'View Backend Setup',         icon: 'Database',        variant: 'ghost',  action: () => isSetup ? navigate('/dashboard') : navigate('/auth/setup') },
            { label: 'View Sync Centre',           icon: 'ArrowLeftRight',  variant: 'ghost',  action: () => isSetup ? navigate('/dashboard') : navigate('/auth/setup') },
            { label: 'Install Response PWA',       icon: 'Download',        variant: 'ghost',  action: () => navigate('/driver-app') },
          ].map(btn => (
            <PrimaryBtn key={btn.label} onClick={btn.action} variant={btn.variant} fullWidth>
              <Icon name={btn.icon} size={15} />{btn.label}
            </PrimaryBtn>
          ))}
        </section>

        {/* ── Footer ── */}
        <footer className="text-center pb-8 space-y-2 pt-4" style={{ borderTop: '1px solid rgba(214,168,79,0.06)' }}>
          <div className="flex items-center justify-center gap-2">
            <ShieldMark size={22} />
            <span className="text-xs font-bold" style={{ color: 'rgba(214,168,79,0.6)' }}>TrustSheild OS™</span>
          </div>
          <p className="text-[10px]" style={{ color: 'rgba(214,168,79,0.3)' }}>
            {APP_CONFIG.globalBrand}
          </p>
          <p className="text-[10px]" style={{ color: '#3a3f4b' }}>
            TrustSheild OS™ is structured for live deployment when a backend provider is configured. Demo Mode shows the full product experience.
          </p>
        </footer>
      </main>
    </div>
  )
}
