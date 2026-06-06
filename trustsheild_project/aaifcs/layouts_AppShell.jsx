/**
 * ============================================================
 * TrustSheild OS™ — Application Shell
 * Run 1 — Safe Identity Refactor
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 * COMPATIBILITY NOTE:
 * All store bindings, outlet, and route mechanics preserved.
 * Background updated to TrustSheild OS™ near-black.
 * ============================================================
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Sidebar from './layouts_Sidebar'
import TopNav  from './layouts_TopNav'
import { useAppStore } from './core_storage'
import { BackendWarningBanner } from './components_ui_ConnectionStatus'

export default function AppShell() {
  const sidebarExpanded = useAppStore(s => s.sidebarExpanded)
  const closeSidebar    = useAppStore(s => s.closeSidebar  || (() => s.sidebarExpanded && s.toggleSidebar?.()))
  const location        = useLocation()

  // Close drawer + scroll to top on route change
  useEffect(() => {
    useAppStore.getState().closeSidebar?.()
    // Scroll main content to top on navigation
    const main = document.getElementById('ts-main-content')
    if (main) main.scrollTop = 0
  }, [location.pathname])

  return (
    <div
      className="flex h-[100dvh] w-screen overflow-hidden"
      style={{
        // TrustSheild OS™ command-centre background
        background: '#050505',
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, rgba(214,168,79,0.03) 0%, transparent 45%),
          radial-gradient(ellipse at 85% 85%, rgba(143,92,255,0.03) 0%, transparent 45%)
        `,
      }}
    >
      {/* Drawer overlay */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => useAppStore.getState().closeSidebar?.()}
        />
      )}

      {/* Sidebar drawer */}
      <Sidebar />

      {/* Main content — always full width */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav />
        <BackendWarningBanner />
        <main id="ts-main-content" className="flex-1 overflow-auto scrollbar-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
