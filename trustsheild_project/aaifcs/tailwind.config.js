/**
 * ============================================================
 * TrustSheild OS™ — Tailwind Config
 * Run 1 — Futuristic Visual Identity
 * ============================================================
 * New `ts` colour palette added for TrustSheild OS™ tokens.
 * Original `apex` palette preserved for component compatibility.
 * ============================================================
 */
/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  content: ['./*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
        mono:    ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // ── TrustSheild OS™ Design Tokens ─────────────────
        ts: {
          // Backgrounds
          base:    '#050505',
          panel:   '#0f0f14',
          card:    '#0d0d12',
          surface: '#111118',
          // Borders
          border:  '#1a1a28',
          muted:   '#2a2a3c',
          overlay: 'rgba(13,13,18,0.88)',
          // Brand colours
          gold:    '#d6a84f',
          silver:  '#c8ccd2',
          green:   '#37ff8b',
          purple:  '#8f5cff',
          // Text
          text: {
            main:    '#f5f5f2',
            muted:   '#a8adb7',
            dim:     '#5a5f6b',
          },
          // Glow references (used in box-shadow utilities)
          glowGold:   'rgba(214,168,79,0.28)',
          glowGreen:  'rgba(55,255,139,0.18)',
          glowPurple: 'rgba(143,92,255,0.20)',
        },
        // ── Legacy apex palette — preserved for compatibility ──
        apex: {
          base:    '#050810',
          surface: '#0a0f1e',
          card:    '#0d1426',
          border:  '#1a2035',
          muted:   '#2a3a5c',
          overlay: 'rgba(26,32,53,0.85)',
          cyan:    '#22d3ee',
          blue:    '#3b82f6',
          green:   '#34d399',
          amber:   '#fbbf24',
          red:     '#f87171',
          purple:  '#a78bfa',
          text: {
            primary:   '#f1f5f9',
            secondary: '#94a3b8',
            muted:     '#475569',
            dim:       '#334155',
          },
        },
      },
      boxShadow: {
        // TrustSheild OS™ glows
        'glow-gold':   '0 0 20px rgba(214,168,79,0.28)',
        'glow-green':  '0 0 20px rgba(55,255,139,0.18)',
        'glow-purple': '0 0 20px rgba(143,92,255,0.20)',
        'glow-silver': '0 0 16px rgba(200,204,210,0.12)',
        // Legacy
        'glow-cyan':   '0 0 20px rgba(34,211,238,0.15)',
        'glow-red':    '0 0 20px rgba(248,113,113,0.15)',
        'glow-amber':  '0 0 20px rgba(251,191,36,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn:   { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(214,168,79,0.25)' },
          '50%':      { boxShadow: '0 0 24px rgba(214,168,79,0.55)' },
        },
      },
    },
  },
  plugins: [],
}
