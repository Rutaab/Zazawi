import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppShell() {
  const [fabOpen, setFabOpen] = useState(false)

  useEffect(() => {
    if (!fabOpen) return
    function onPointerDown(e) {
      if (!e.target.closest?.('[data-fab-zone]')) setFabOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setFabOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [fabOpen])

  return (
    <div className="app-layout">
      <Sidebar fabOpen={fabOpen} setFabOpen={setFabOpen} />
      <main className="main-area">
        <Outlet />
      </main>
      <BottomNav fabOpen={fabOpen} setFabOpen={setFabOpen} />
    </div>
  )
}
