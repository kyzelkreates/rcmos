/**
 * ============================================================
 * TrustSheild OS™ — Top Navigation Bar
 * Run 1 — Futuristic Visual Identity
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 * COMPATIBILITY NOTE:
 * useAppStore, useAuth, NAV_ITEMS, ConnectionStatusPill — all preserved.
 * Breadcrumb updated to TrustSheild OS™ labels.
 * ============================================================
 */

import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Icon from './components_ui_Icon'
import StatusDot from './components_ui_StatusDot'
import { useAppStore } from './core_storage'
import { useAuth } from './hooks_useAuth'
import { NAV_ITEMS } from './config_routes'
import { ConnectionStatusPill, BackendWarningBanner } from './components_ui_ConnectionStatus'

// ─── Breadcrumb ───────────────────────────────────────────────
function Breadcrumb({ pathname }) {
  const item = NAV_ITEMS.find(n =>
    pathname === n.route || pathname.startsWith(n.route + '/')
  )
  return (
    <div className="flex items-center gap-2 text-sm">
      <button onClick={() => navigate('/welcome')}
              className="text-2xs font-medium tracking-widest uppercase hidden sm:inline transition-opacity hover:opacity-80"
              style={{ color: 'rgba(214,168,79,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Go to TrustSheild OS™ welcome page">
        TrustSheild OS™
      </button>
      <Icon name="ChevronRight" size={13} className="hidden sm:inline" style={{ color: 'rgba(214,168,79,0.25)' }} />
      <span className="font-medium" style={{ color: '#f5f5f2' }}>
        {item?.label || 'Trust Overview'}
      </span>
    </div>
  )
}

// ─── System Status Pill ───────────────────────────────────────
function SystemStatusPill({ status }) {
  const label = status === 'online' ? 'All Systems Active' : status === 'degraded' ? 'Degraded' : 'Offline'
  const color = status === 'online' ? '#37ff8b' : status === 'degraded' ? '#d6a84f' : '#f87171'
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: 'rgba(13,13,18,0.7)',
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="text-xs font-medium" style={{ color: color }}>{label}</span>
    </div>
  )
}

// ─── Live Clock ───────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = React.useState(() => new Date())
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex flex-col items-end">
      <span
        className="font-mono text-sm tabular-nums"
        style={{ color: '#d6a84f', textShadow: '0 0 8px rgba(214,168,79,0.35)' }}
      >
        {time.toLocaleTimeString('en-GB', { hour12: false })}
      </span>
      <span className="text-2xs tabular-nums" style={{ color: '#5a5f6b' }}>
        {time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </div>
  )
}

// ─── User Menu ────────────────────────────────────────────────
function UserMenu({ user, roleLabel, signOut }) {
  const [open, setOpen] = useState(false)
  const navigate        = useNavigate()
  const initials        = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 p-1 rounded-md transition-colors"
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,168,79,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            background: 'rgba(214,168,79,0.1)',
            border: '1px solid rgba(214,168,79,0.3)',
          }}
        >
          <span className="text-xs font-bold" style={{ color: '#d6a84f' }}>{initials}</span>
        </div>
        <Icon name="ChevronDown" size={12} style={{ color: '#5a5f6b' }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl z-50 overflow-hidden"
            style={{
              background: 'rgba(10,10,16,0.98)',
              border: '1px solid rgba(214,168,79,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(214,168,79,0.12)' }}>
              <p className="text-sm font-medium truncate" style={{ color: '#f5f5f2' }}>
                {user?.user_metadata?.full_name || 'Dashboard Admin'}
              </p>
              <p className="text-xs truncate" style={{ color: '#5a5f6b' }}>{user?.email}</p>
              <span
                className="inline-block mt-1 text-2xs px-2 py-0.5 rounded"
                style={{
                  color: '#d6a84f',
                  background: 'rgba(214,168,79,0.1)',
                  border: '1px solid rgba(214,168,79,0.25)',
                }}
              >
                {roleLabel || 'Command Centre'}
              </span>
            </div>

            <div className="py-1">
              <button
                onClick={() => { navigate('/settings/profile'); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                style={{ color: '#a8adb7' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f2'; e.currentTarget.style.background = 'rgba(214,168,79,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#a8adb7'; e.currentTarget.style.background = 'transparent' }}
              >
                <Icon name="User" size={14} />
                My Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                style={{ color: '#a8adb7' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f2'; e.currentTarget.style.background = 'rgba(214,168,79,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#a8adb7'; e.currentTarget.style.background = 'transparent' }}
              >
                <Icon name="Settings" size={14} />
                Settings
              </button>
            </div>

            <div className="py-1" style={{ borderTop: '1px solid rgba(214,168,79,0.1)' }}>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                style={{ color: '#f87171' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon name="LogOut" size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── TopNav Root ──────────────────────────────────────────────
export default function TopNav() {
  const location        = useLocation()
  const toggleSidebar   = useAppStore(s => s.toggleSidebar)
  const sidebarExpanded = useAppStore(s => s.sidebarExpanded)
  const systemStatus    = useAppStore(s => s.systemStatus)
  const notifications   = useAppStore(s => s.notifications)
  const { user, roleLabel, signOut } = useAuth()

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header
      className="flex items-center justify-between h-13 px-4 flex-shrink-0"
      style={{
        borderBottom: '1px solid rgba(214,168,79,0.15)',
        background: 'rgba(5,5,5,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        // Subtle gold top edge
        boxShadow: 'inset 0 -1px 0 rgba(214,168,79,0.08)',
      }}
    >
      {/* Left: Burger + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md transition-colors"
          style={{ color: '#a8adb7' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#d6a84f'; e.currentTarget.style.background = 'rgba(214,168,79,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#a8adb7'; e.currentTarget.style.background = 'transparent' }}
          aria-label="Open menu"
        >
          <Icon name="Menu" size={20} />
        </button>
        <Breadcrumb pathname={location.pathname} />
      </div>

      {/* Right: Status + Clock + Notifications + User */}
      <div className="flex items-center gap-3">
        {/* System status — md and up */}
        <div className="hidden md:flex">
          <SystemStatusPill status={systemStatus} />
        </div>

        {/* Connection status pill */}
        <div className="hidden sm:flex">
          <ConnectionStatusPill />
        </div>

        {/* AI Ready pill — lg and up */}
        <div
          className="hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{
            background: 'rgba(143,92,255,0.07)',
            border: '1px solid rgba(143,92,255,0.25)',
          }}
        >
          <Icon name="Cpu" size={12} style={{ color: '#8f5cff' }} />
          <span className="text-xs font-medium" style={{ color: '#8f5cff' }}>
            4P3X AI Ready
          </span>
        </div>

        {/* Live clock */}
        <div className="flex">
          <LiveClock />
        </div>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-md transition-colors"
          style={{ color: '#5a5f6b' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#d6a84f'; e.currentTarget.style.background = 'rgba(214,168,79,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#5a5f6b'; e.currentTarget.style.background = 'transparent' }}
          aria-label="Notifications"
        >
          <Icon name="Bell" size={16} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
              style={{ background: '#f87171', boxShadow: '0 0 4px rgba(248,113,113,0.6)' }}
            />
          )}
        </button>

        <UserMenu user={user} roleLabel={roleLabel} signOut={signOut} />
      </div>
    </header>
  )
}
