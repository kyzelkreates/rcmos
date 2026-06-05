/**
 * ============================================================
 * TrustSheild OS™ — Sidebar (Burger Drawer)
 * Run 1 — Futuristic Visual Identity
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 * COMPATIBILITY NOTE:
 * useAppStore, sidebarExpanded, closeSidebar — preserved.
 * NAV_ITEMS / NAV_GROUPS now carry TrustSheild OS™ labels.
 * ============================================================
 */

import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from './components_ui_Icon'
import StatusDot from './components_ui_StatusDot'
import { useAppStore } from './core_storage'
import { NAV_ITEMS, NAV_GROUPS } from './config_routes'

// ─── TrustSheild OS™ Logo ─────────────────────────────────────
function TrustSheildLogo({ onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b"
         style={{ borderColor: 'rgba(214,168,79,0.2)' }}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Shield SVG mark — CSS/SVG only, no third-party icons */}
        <div className="relative flex-shrink-0">
          <svg
            width="32" height="32" viewBox="0 0 32 32"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-label="TrustSheild OS shield mark"
          >
            {/* Outer glow ring */}
            <circle cx="16" cy="16" r="15" stroke="rgba(214,168,79,0.2)" strokeWidth="1" />
            {/* Shield body */}
            <path
              d="M16 4 L26 8 L26 16 C26 22 21 27 16 29 C11 27 6 22 6 16 L6 8 Z"
              fill="rgba(214,168,79,0.08)"
              stroke="rgba(214,168,79,0.55)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Inner shield highlight */}
            <path
              d="M16 7 L24 10.5 L24 16.5 C24 21 20 25 16 26.5 C12 25 8 21 8 16.5 L8 10.5 Z"
              fill="rgba(143,92,255,0.06)"
              stroke="rgba(143,92,255,0.3)"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            {/* Centre dot — AI green pulse */}
            <circle cx="16" cy="17" r="2.5" fill="rgba(55,255,139,0.85)" />
            <circle cx="16" cy="17" r="4" fill="rgba(55,255,139,0.12)" />
          </svg>
          {/* Online pulse */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
            style={{
              background: '#37ff8b',
              borderColor: '#050505',
              boxShadow: '0 0 8px rgba(55,255,139,0.8)',
            }}
          />
        </div>

        <div className="min-w-0">
          <div
            className="font-display font-bold text-sm leading-tight truncate"
            style={{ color: '#d6a84f', textShadow: '0 0 12px rgba(214,168,79,0.3)' }}
          >
            TrustSheild OS™
          </div>
          <div
            className="text-2xs tracking-wider truncate"
            style={{ color: '#5a5f6b', fontSize: '0.58rem' }}
          >
            4P3X Intelligent AI™
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1.5 rounded-md transition-colors flex-shrink-0"
        style={{ color: '#5a5f6b' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#d6a84f'; e.currentTarget.style.background = 'rgba(214,168,79,0.08)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#5a5f6b'; e.currentTarget.style.background = 'transparent' }}
        aria-label="Close menu"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  )
}

// ─── Nav Group Label ──────────────────────────────────────────
function NavGroupLabel({ label }) {
  if (!label) return null
  return (
    <div className="px-3 pt-4 pb-1">
      <span
        className="text-2xs font-semibold tracking-widest uppercase"
        style={{ color: 'rgba(214,168,79,0.4)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Nav Item ─────────────────────────────────────────────────
function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group relative',
        active
          ? 'font-semibold'
          : ''
      )}
      style={
        active
          ? {
              background: 'rgba(214,168,79,0.08)',
              color: '#f5f5f2',
              borderLeft: '2px solid #d6a84f',
              boxShadow: 'inset 0 0 16px rgba(214,168,79,0.04)',
            }
          : {
              color: '#a8adb7',
            }
      }
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(214,168,79,0.05)'
          e.currentTarget.style.color = '#f5f5f2'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#a8adb7'
        }
      }}
    >
      {/* Active left bar */}
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
          style={{ background: '#d6a84f', boxShadow: '0 0 8px rgba(214,168,79,0.8)' }}
        />
      )}

      <Icon
        name={item.icon}
        size={15}
        className="flex-shrink-0 transition-colors"
        style={{ color: active ? '#d6a84f' : undefined }}
      />

      <span className="truncate flex-1 text-left">{item.label}</span>

      {/* AI highlight dot */}
      {item.highlight && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: item.group === 'intelligence' ? '#8f5cff' : '#37ff8b',
            boxShadow: item.group === 'intelligence'
              ? '0 0 6px rgba(143,92,255,0.8)'
              : '0 0 6px rgba(55,255,139,0.8)',
          }}
        />
      )}

      {item.badge && (
        <span className="ml-auto bg-red-500 text-white text-2xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
          {item.badge}
        </span>
      )}
    </button>
  )
}

// ─── Sidebar Footer ───────────────────────────────────────────
function SidebarFooter() {
  return (
    <div
      className="px-3 py-3 border-t"
      style={{ borderColor: 'rgba(214,168,79,0.12)' }}
    >
      {/* Demo mode pill */}
      <div className="ts-demo-banner mb-2">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: '#8f5cff', boxShadow: '0 0 6px rgba(143,92,255,0.8)' }}
        />
        Demo Mode
      </div>

      <div className="flex items-center gap-2">
        <StatusDot status="online" />
        <span className="text-2xs" style={{ color: '#5a5f6b' }}>Systems Nominal</span>
        <span className="ml-auto text-2xs font-mono" style={{ color: '#3a3f4b' }}>v1.0.0</span>
      </div>

      {/* Creator brand line */}
      <div
        className="mt-2 text-2xs text-center"
        style={{ color: 'rgba(214,168,79,0.3)', fontSize: '0.55rem', letterSpacing: '0.04em' }}
      >
        Created by Kyzel Kreates™
      </div>
    </div>
  )
}

// ─── Sidebar Root ─────────────────────────────────────────────
export default function Sidebar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const isOpen    = useAppStore(s => s.sidebarExpanded)
  const close     = useAppStore(s => s.closeSidebar)

  const groupOrder = Object.entries(NAV_GROUPS)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key]) => key)

  const grouped = groupOrder.reduce((acc, group) => {
    const items = NAV_ITEMS.filter(i => i.group === group)
    if (items.length) acc[group] = items
    return acc
  }, {})

  const handleNav = (route) => {
    navigate(route)
    close()
  }

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-full z-50',
        'flex flex-col',
        'w-72 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      style={{
        background: 'rgba(8, 8, 12, 0.98)',
        borderRight: '1px solid rgba(214,168,79,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <TrustSheildLogo onClose={close} />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-2 py-2">
        {groupOrder.map(group => {
          const items = grouped[group]
          if (!items) return null
          return (
            <div key={group}>
              <NavGroupLabel label={NAV_GROUPS[group].label} />
              <div className="space-y-0.5">
                {items.map(item => (
                  <NavItem
                    key={item.id}
                    item={item}
                    active={
                      location.pathname === item.route ||
                      location.pathname.startsWith(item.route + '/')
                    }
                    onClick={() => handleNav(item.route)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* PWA Setup shortcut — TrustSheild Response PWA */}
      {/* NOTE: href #/driver-setup preserved for internal route compatibility */}
      <div className="px-3 pb-2">
        <a
          href="#/driver-setup"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors group"
          style={{
            border: '1px solid rgba(143,92,255,0.25)',
            background: 'rgba(143,92,255,0.06)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(143,92,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(143,92,255,0.06)'}
        >
          <Icon name="Smartphone" size={14} style={{ color: '#8f5cff' }} className="flex-shrink-0" />
          <span className="text-xs font-semibold flex-1" style={{ color: '#a87dff' }}>
            Set Up Response PWA
          </span>
          <Icon name="ChevronRight" size={11} style={{ color: '#5a3f8f' }} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <SidebarFooter />
    </aside>
  )
}
