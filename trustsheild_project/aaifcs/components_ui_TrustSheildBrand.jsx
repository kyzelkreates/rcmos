/**
 * ============================================================
 * TrustSheild OS™ — Brand Component
 * Run 1 — Futuristic Visual Identity
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 * Reusable branding elements for use across dashboard and PWA.
 * Fallback text renders if SVG fails to load.
 * ============================================================
 */

import APP_CONFIG from './config_app'

// ─── Shield Mark ─────────────────────────────────────────────
export function ShieldMark({ size = 32, className = '' }) {
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="TrustSheild OS™ shield mark"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="15" stroke="rgba(214,168,79,0.2)" strokeWidth="1" />
        <path
          d="M16 4 L26 8 L26 16 C26 22 21 27 16 29 C11 27 6 22 6 16 L6 8 Z"
          fill="rgba(214,168,79,0.08)"
          stroke="rgba(214,168,79,0.55)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M16 7 L24 10.5 L24 16.5 C24 21 20 25 16 26.5 C12 25 8 21 8 16.5 L8 10.5 Z"
          fill="rgba(143,92,255,0.06)"
          stroke="rgba(143,92,255,0.3)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="17" r="2.5" fill="rgba(55,255,139,0.85)" />
        <circle cx="16" cy="17" r="4"   fill="rgba(55,255,139,0.12)" />
      </svg>
    </div>
  )
}

// ─── Logo + Wordmark ──────────────────────────────────────────
export function TrustSheildWordmark({ size = 'md', showCreator = false }) {
  const sizes = {
    sm:  { mark: 24, name: '0.8rem', tag: '0.55rem' },
    md:  { mark: 32, name: '0.9rem', tag: '0.6rem'  },
    lg:  { mark: 44, name: '1.1rem', tag: '0.65rem' },
    xl:  { mark: 56, name: '1.4rem', tag: '0.7rem'  },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-3">
      <ShieldMark size={s.mark} />
      <div className="min-w-0">
        <div
          className="font-display font-bold leading-tight"
          style={{
            fontSize: s.name,
            color: '#d6a84f',
            textShadow: '0 0 12px rgba(214,168,79,0.3)',
          }}
        >
          TrustSheild OS™
        </div>
        <div
          className="tracking-wider mt-0.5"
          style={{ fontSize: s.tag, color: '#5a5f6b', letterSpacing: '0.06em' }}
        >
          {APP_CONFIG.brandLine}
        </div>
        {showCreator && (
          <div
            className="tracking-wider"
            style={{ fontSize: s.tag, color: 'rgba(214,168,79,0.35)' }}
          >
            {APP_CONFIG.creatorLine}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Global Brand Footer Line ──────────────────────────────────
export function GlobalBrandLine({ className = '' }) {
  return (
    <div
      className={`text-center ${className}`}
      style={{ fontSize: '0.6rem', color: 'rgba(214,168,79,0.3)', letterSpacing: '0.05em' }}
    >
      {APP_CONFIG.globalBrand}
    </div>
  )
}

// ─── Demo Mode Badge ──────────────────────────────────────────
export function DemoModeBadge() {
  return (
    <div className="ts-demo-banner">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: '#8f5cff', boxShadow: '0 0 6px rgba(143,92,255,0.8)' }}
      />
      Demo Mode
    </div>
  )
}

// ─── AI Advisory Notice ───────────────────────────────────────
export function AIAdvisoryNotice() {
  return (
    <div className="ts-ai-advisory">
      <span style={{ color: '#8f5cff', fontSize: '0.75rem', marginTop: '1px' }}>⚠</span>
      <span>{APP_CONFIG.aiAdvisory}</span>
    </div>
  )
}

export default TrustSheildWordmark
